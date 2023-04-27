
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    return tab;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('extractButton').addEventListener('click', extractData);
});

async function extractData() {
    const tab = await getCurrentTab();
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["va-content-script.js"]
    });

}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "vaSendDataToPopup.js") {
        console.log(`!!!!!!!!!!!message from VAVAVAV content received to VAVAV popup.js`)
        console.log(request.result)

        navigator.clipboard.writeText(request.result);

        const offenseDateElement = document.querySelector('#infoTable td:nth-child(1)');
        const caseNumberElement = document.querySelector('#infoTable td:nth-child(2)');
        const chargeElement = document.querySelector('#infoTable td:nth-child(3)');
        const caseTypeElement = document.querySelector('#infoTable td:nth-child(4)');
        const codeSectionElement = document.querySelector('#infoTable td:nth-child(5)');
        const dispositionElement = document.querySelector('#infoTable td:nth-child(6)');
        const sentenceTimeElement = document.querySelector('#infoTable td:nth-child(7)');

        const [offenseDate, caseNumber, charge, caseType, codeSection, disposition, sentenceTime] = request.result.split('\t');
        offenseDateElement.innerText = offenseDate
        caseNumberElement.innerText = caseNumber
        chargeElement.innerText = charge
        caseTypeElement.innerText = caseType;
        codeSectionElement.innerText = codeSection
        dispositionElement.innerText = disposition;
        sentenceTimeElement.innerText = sentenceTime;
    }
})
