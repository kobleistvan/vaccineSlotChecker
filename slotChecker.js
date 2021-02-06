console.log('Vaccination Slot Checker active! Logged in.');

// Send a showPageAction message, so the extension icon isn't greyed out anymore
chrome.runtime.sendMessage({ type: 'showPageAction' });

let data;
let checkerIntervalId;
let logoutIntervalId;

// Listen to messages & register handler
chrome.runtime.onMessage.addListener(messageReceiver);

/**
 * When we get a message from either the popup script, either the background script, with the data,
 * we save it & clear the interval functions.
 * We only (re)start them, if data.status (which represents the Start/Pause button's state) is true.
 */
function messageReceiver(message, sender, sendresponse) {
    console.log('LoggedIn - Got message:', message);
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    if (message) {
        data = message;
    }

    if (checkerIntervalId) {
        clearInterval(checkerIntervalId);
        console.log('Cleared checkerIntervalId');
    }

    if (logoutIntervalId) {
        clearInterval(logoutIntervalId);
        console.log('Cleared logoutIntervalId');
    }

    if (data && data.status) {
        // Check for slots every 10 minutes, so the session cookie doesn't expire
        checkerIntervalId = setInterval(checkForSlots, 1000 * 60 * 10);

        /**
         * Log out every 6 hours, so we can clear the session cookie from the client side, but also from
         * the server side, which by default expires after 12 hours. We set here an interval for 6 hours
         * to log out, after which we log in again with the other content script.
         */
        logoutIntervalId = setInterval(logOut, 1000 * 60 * 60 * 6);
    }
}

/**
 * Checks for empty vaccination slots via the authentication-protected API call.
 * We search for a specific vaccination center.
 * We parse the response, after which, we update 2 Virtual Pins on our blynk server with the
 * time we checked & the number of available slots.
 */
function checkForSlots() {
    if (!data || !data.status || !data.username || !data.password || !data.server || !data.token) {
        console.warn('Missing data.', data);
        return;
    }

    const blynkUrlBase = data.server + '/' + data.token;
    const checkTime = new Date();
    const timeShort = checkTime.toLocaleDateString() + ' ' + checkTime.toLocaleTimeString();
    console.log('Check time: ' + timeShort);

    fetch("https://programare.vaccinare-covid.gov.ro/scheduling/api/centres?page=0&size=10&sort=,", {
        method: 'post',
        body: JSON.stringify({ "countyID": 1, "localityID": 8, "name": "SALĂ DE SPORT", "masterPersonnelCategoryID": -2 }),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' }
    }).then(response => {
        response.json().then(data => {
            if (data && data.content) {
                const slots = data.content[0].availableSlots;
                fetch(blynkUrlBase + "/update/V50?value=" + timeShort);
                fetch(blynkUrlBase + "/update/V51?value=" + slots);
                console.log('>>> ' + slots + ' slots available!');
            } else {
                console.warn('NO CONTENT.');
            }
        })
    }).catch(err => console.log('Error: ', err))
}

/**
 * Logs out. Opens the top-right menu & clicks on the logOut button, which will take us to the login page again.
 */
function logOut() {
    setTimeout(() => {
        document.querySelectorAll('button.user-button')[1].click();
    }, 3000);
    setTimeout(() => {
        document.querySelector('form').querySelector('button').click();
    }, 4000);
}
