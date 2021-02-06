console.log('Vaccination Slot Checker initialized!');
chrome.runtime.sendMessage({ type: 'showPageAction' });

chrome.runtime.onMessage.addListener(messageReceiver);

function messageReceiver(message, sender, sendresponse) {
    console.log('Injector: -  Got message:', message);
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    injectData(message);
}

function injectData(data) {
    const dataNode = document.createElement('div');
    dataNode.setAttribute('logindata', JSON.stringify(data));
    dataNode.id = 'dataNode';
    document.body.appendChild(dataNode);
}

function injectJs(link) {
    var scr = document.createElement('script');
    scr.type = "text/javascript";
    scr.src = link;
    document.getElementsByTagName('head')[0].appendChild(scr)
};

injectJs(chrome.extension.getURL('injectedLogger.js'))

