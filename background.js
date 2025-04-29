// Listener for opening a tab and closing it after it loads
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openTab" && message.url) {
        chrome.tabs.create({ url: message.url, active: false }, (tab) => {
            if (chrome.runtime.lastError) {
                console.error("Error creating tab:", chrome.runtime.lastError.message);
                sendResponse({ status: "error", message: chrome.runtime.lastError.message });
                return;
            }

            sendResponse({ status: "tabOpened" });

            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.remove(tabId, () => {
                        chrome.runtime.sendMessage({ action: "tabClosed" });
                    });
                    chrome.tabs.onUpdated.removeListener(listener);
                }
            });
        });

        // Keep the message channel open for asynchronous response
        return true;
    }
});


