console.log(`backgrounnnnnnnnddd`)

let activeTabId, lastUrl, lastTitle;

function getTabInfo(tabId) {
    chrome.tabs.get(tabId, function (tab) {
        if (lastUrl != tab.url || lastTitle != tab.title) {
            // console.log(lastUrl = tab.url, lastTitle = tab.title)
            // console.log(`taburl`, tab.url)
            if (tab.url.includes('casesearch.courts.state.md.us')) {
                console.log(`detected MDMDMD case page`)
                chrome.action.setPopup({ tabId: tabId, popup: "md-case-search.html" });
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["md-content-script.js"]
                });
            } else if (tab.url.includes('eapps.courts.state.va.us')) {
                console.log(`detected VAVAVA case page`)
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
// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     console.log(tab)
//     if (changeInfo.url) {
//         console.log(`urllllll`, tab.url)
//         if (tab.url.includes('eapps.courts.state.va.us')) {
//             console.log(`VAVAVAVA page detected in background script`)
            // chrome.action.setPopup({ tabId: tabId, popup: "va-case-search.html" });
            // chrome.scripting.executeScript({
            //     target: { tabId: tabId },
            //     files: ["va-content-script.js"]
            // });
//         } else if (tab.url.includes("casesearch.courts.state.md.us")) {

//             console.log(`MDMDMDMDMD page detected in background script`)
            // chrome.action.setPopup({ tabId: tabId, popup: "md-case-search.html" });
            // chrome.scripting.executeScript({
            //     target: { tabId: tabId },
            //     files: ["md-content-script.js"]
            // });
//         } else {
//             chrome.action.setPopup({ tabId: tabId, popup: "default.html" });
//         }
//     }
// });
