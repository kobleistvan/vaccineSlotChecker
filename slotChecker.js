console.log('Vaccination Slot Checker active! Logged in.');
chrome.runtime.sendMessage({ type: 'showPageAction' });

let data;
let checkerIntervalId;
let logoutIntervalId;
let firstRunFlag = true;

chrome.runtime.onMessage.addListener(messageReceiver);

function messageReceiver(message, sender, sendresponse) {
    console.log('LoggedIn - Got message:', message);
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

    if (message) {
        data = message;
    }

    if (checkerIntervalId) {
        clearInterval(checkerIntervalId);
    }

    if (logoutIntervalId) {
        clearInterval(logoutIntervalId);
    }

    if (data && data.status) {
        // Check for slots every 10 minutes
        checkerIntervalId = setInterval(checkForSlots(), 1000 * 60 * 10);

        // Log out every 6 hours
        firstRunFlag = true;
        logoutIntervalId = setInterval(logOut(), 1000 * 60 * 60 * 6);
    }
}

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
                if (slots > 0) {
                    fetch(blynkUrlBase + "/update/V50?value=" + timeShort)
                    fetch(blynkUrlBase + "/update/V51?value=" + slots)
                } else {
                    fetch(blynkUrlBase + "/update/V50?value=" + timeShort)
                    fetch(blynkUrlBase + "/update/V51?value=" + slots)
                }
                console.log('>>> ' + slots + ' slots available!');
            } else {
                console.warn('NO CONTENT.');
            }
        })
    }).catch(err => console.log('Error: ', err))
}

function logOut() {
    if (firstRunFlag) {
        firstRunFlag = false;
    } else {
        setTimeout(() => {
            document.querySelectorAll('button.user-button')[1].click();
        }, 3000);
        setTimeout(() => {
            document.querySelector('form').querySelector('button').click();
        }, 4000);
    }
}
