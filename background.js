
let activeTabId, lastUrl, lastTitle;

function getTabInfo(tabId) {
    chrome.tabs.get(tabId, function (tab) {
        if (lastUrl != tab.url || lastTitle != tab.title) {

            if (tab.url.includes('casesearch.courts.state.md.us')) {
                chrome.action.setPopup({ tabId: tabId, popup: "md-case-search.html" });
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["md-content-script.js"]
                });
            } else if (tab.url.includes('eapps.courts.state.va.us')) {
                chrome.action.setPopup({ tabId: tabId, popup: "va-case-search.html" });
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["va-content-script.js"]
                });
            }
        }
    });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
    getTabInfo(activeTabId = activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (activeTabId == tabId) {
        getTabInfo(tabId);
    }
});
