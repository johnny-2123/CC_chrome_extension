
// async function getCurrentTab() {
//     let queryOptions = { active: true, lastFocusedWindow: true };
//     let [tab] = await chrome.tabs.query(queryOptions);
//     return tab;
// }

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//     if (message === 'get-page-data') {
//         const tab = await getCurrentTab();
//         const extractedData = await chrome.scripting.executeScript({
//             target: { tabId: tab.id },
//             files: ['content-script.js']
//         });
//         const results = extractedData[0].result;
//         sendResponse(results); // send the extracted data back to the popup
//     }
// });
