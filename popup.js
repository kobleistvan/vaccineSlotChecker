console.log("Background script running...");

let data = getSavedData() || {
    status: false,
    username: '',
    password: '',
    server: '',
    token: ''
};

function init() {
    registerEventHandlers();
    populateFields();
    sendMessage(data);
}

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

function getSavedData() {
    return JSON.parse(getCookie('vaccineCheckerData'));
}

function saveData() {
    setCookie('vaccineCheckerData', JSON.stringify(data));
    sendMessage(data);
}

function populateFields() {
    document.querySelector('#control').innerHTML = data.status ? 'Pause' : 'Start';
    document.querySelector('#username').value = data.username || '';
    document.querySelector('#password').value = data.password || '';
    document.querySelector('#server').value = data.server || '';
    document.querySelector('#token').value = data.token || '';
}

function sendMessage(message) {
    console.log('Sending data...');
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    })
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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
