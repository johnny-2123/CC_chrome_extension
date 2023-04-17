// // Add an event listener to the extractButton
// document.addEventListener("DOMContentLoaded", async function () {
//     document.getElementById("extractButton").addEventListener("click", async function () {

//         const results = await new Promise((resolve, reject) => {
//             chrome.runtime.sendMessage('get-page-data', (response) => {
//                 resolve(response);
//             });
//         });

//         console.log('received user data in popup.js', results);
//         console.log(`event button clicked`);
//     });
// });



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('extractButton').addEventListener('click', extractData);

    const copyButton = document.querySelector('#copyButton');

    copyButton.addEventListener('click', () => {
        // Get the text content of the table
        const infoTable = document.querySelector('#infoTable');
        const tableText = infoTable.innerText;

        // Copy the table text to the clipboard
        navigator.clipboard.writeText(tableText);
    });

});

async function extractData() {
    const tab = await getCurrentTab();
    const extractedData = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content-script.js"]
    });
    console.log(`message from content received to popup.js`)
    console.log(extractedData);
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "sendDataToPopup.js") {
        console.log(`!!!!!!!!!!!message from content received to popup.js`)
        console.log(request.result)

        const caseTypeElement = document.querySelector('#infoTable th:nth-child(1)');
        const dispositionElement = document.querySelector('#infoTable th:nth-child(2)');

        const [offenseDate, caseNumber, charge, caseType, codeSection, disposition, sentenceTime] = request.result.split('\t');
        caseTypeElement.innerText = caseType;
        dispositionElement.innerText = disposition;

    }
})
