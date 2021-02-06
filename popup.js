console.log("Popup script running...");

let data = getSavedData() || {
    status: false,
    username: '',
    password: '',
    server: '',
    token: ''
};

// Init method. This sums up what's happening.
function init() {
    registerEventHandlers();
    populateFields();
    sendMessage(data);
}

// Register 2 event handlers. One for the 'control' (Start/Pause) button, the other for the 'save' button.
function registerEventHandlers() {
    document.querySelector('#control').addEventListener('click', () => {
        data.status = !data.status;
        document.querySelector('#control').innerHTML = data.status ? 'Pause' : 'Start';
        saveData();
    })

    document.querySelector('#save').addEventListener('click', () => {
        console.log('Saving data...');
        data = {
            status: true,
            username: document.querySelector('#username').value,
            password: document.querySelector('#password').value,
            server: document.querySelector('#server').value,
            token: document.querySelector('#token').value
        };

        saveData();
    })
}

// Retrieves & parses the data saved in the cookie
function getSavedData() {
    return JSON.parse(getCookie('vaccineCheckerData'));
}

// Save the data into a cookie & send a message with the data to the content scripts
function saveData() {
    setCookie('vaccineCheckerData', JSON.stringify(data));
    sendMessage(data);
}

// Populates the input fields with the data previously saved on the cookie
function populateFields() {
    document.querySelector('#control').innerHTML = data.status ? 'Pause' : 'Start';
    document.querySelector('#username').value = data.username || '';
    document.querySelector('#password').value = data.password || '';
    document.querySelector('#server').value = data.server || '';
    document.querySelector('#token').value = data.token || '';
}

// Sends a message to the content script
function sendMessage(message) {
    console.log('Popup - Sending data...');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    })
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

init();
