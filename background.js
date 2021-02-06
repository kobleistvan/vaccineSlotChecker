// Set the pageAction to show, when we get the trigger from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (typeof message === 'object' && message.type === 'showPageAction') {
        chrome.pageAction.show(sender.tab.id);
        init();
    }
});

let data;

// Try to retrieve the saved cookie data & send the data to the content script
function init() {
    data = getSavedData() || {
        status: false,
        username: '',
        password: '',
        server: '',
        token: ''
    };

    setTimeout(() => {
        sendMessage(data);
    }, 3000);
}

// Sends a message to the content script
function sendMessage(message) {
    console.log('Background - Sending data...', message);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

// Retrieves & parses the data saved in the cookie
function getSavedData() {
    return JSON.parse(getCookie('vaccineCheckerData'));
}

// Generic cookie setting function
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Generic cookie reading function
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}