console.log('Vaccination Slot Checker initialized!');

// Send a showPageAction message, so the extension icon isn't greyed out anymore
chrome.runtime.sendMessage({ type: 'showPageAction' });

// Listen to messages & register handler
chrome.runtime.onMessage.addListener(messageReceiver);

// Attempt to inject the data into the webpage when we get it from the background script
function messageReceiver(message, sender, sendresponse) {
    console.log('Injector: -  Got message:', message);
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    injectData(message);
}

/**
 * Injects the data which is needed by the injectedLogger.js script, via a workaround.
 * We create at the end of the body an empty div with a specific ID and stringify the data containing the login credentials onto an attribute.
 */
function injectData(data) {
    const dataNode = document.createElement('div');
    dataNode.setAttribute('logindata', JSON.stringify(data));
    dataNode.id = 'dataNode';
    document.body.appendChild(dataNode);
}

/**
 * Inject a script tag into the head of the page. With this workaround, we make the page fetch our injectedLogger.js which attempts to log into the page.
 * This is needed, because the page is captcha protected & extension scripts do not have access from the outside to JS objects and variables that have been defined
 * in the webpage's scope.
 * For example, the login form is made with Angular's form builder & uses pristine, dirty, status, etc. flags to actually call the login action. Just by simply targetig the DOM
 * from the external script & setting the values of the input fields with the correct credentials will not trigger the validation methods to log in.
 * We bypass this safety mechanism through the injected script in which we can target directly the flags within __ngContext__.
 */
function injectJs(link) {
    var scr = document.createElement('script');
    scr.type = "text/javascript";
    scr.src = link;
    document.getElementsByTagName('head')[0].appendChild(scr)
};

setTimeout(() => {
    // Inject our script which allows us to log in
    injectJs(chrome.extension.getURL('injectedLogger.js'))
}, 5000);
