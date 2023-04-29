
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    return tab;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('mdExtractButton').addEventListener('click', extractData);
});

async function extractData() {
    const tab = await getCurrentTab();
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["md-content-script.js"]
    });

}

function addDataToTable(data) {
    // create a new row element
    var newRow = document.createElement("tr");

    // create and append new data cells for each piece of extracted data
    var dateCell = document.createElement("td");
    dateCell.appendChild(document.createTextNode(data.offenseDate));
    newRow.appendChild(dateCell);

    var caseCell = document.createElement("td");
    caseCell.appendChild(document.createTextNode(data.caseNumber));
    newRow.appendChild(caseCell);

    var chargeCell = document.createElement("td");
    chargeCell.appendChild(document.createTextNode(data.charge));
    newRow.appendChild(chargeCell);

    var typeCell = document.createElement("td");
    typeCell.appendChild(document.createTextNode(data.caseType));
    newRow.appendChild(typeCell);

    var codeCell = document.createElement("td");
    codeCell.appendChild(document.createTextNode(data.codeSection));
    newRow.appendChild(codeCell);

    var dispCell = document.createElement("td");
    dispCell.appendChild(document.createTextNode(data.disposition));
    newRow.appendChild(dispCell);

    var sentenceCell = document.createElement("td");
    sentenceCell.appendChild(document.createTextNode(data.sentenceTime));
    newRow.appendChild(sentenceCell);

    // append the row to the table
    var table = document.getElementById("mdInfoTable");
    table.appendChild(newRow);
}



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "mdSendDataToPopup.js") {

        const { offenseDate, caseNumber, charge, caseType, codeSection, disposition, sentenceTime } = request.result;

        const resultString = `${offenseDate}\t${caseNumber}\t${charge}\t${caseType}\t${codeSection}\t${disposition}\t${sentenceTime}`;

        navigator.clipboard.writeText(resultString);

        // const offenseDateElement = document.querySelector('#mdInfoTable td:nth-child(1)');
        // const caseNumberElement = document.querySelector('#mdInfoTable td:nth-child(2)');
        // const chargeElement = document.querySelector('#mdInfoTable td:nth-child(3)');
        // const caseTypeElement = document.querySelector('#mdInfoTable td:nth-child(4)');
        // const codeSectionElement = document.querySelector('#mdInfoTable td:nth-child(5)');
        // const dispositionElement = document.querySelector('#mdInfoTable td:nth-child(6)');
        // const sentenceTimeElement = document.querySelector('#infoTable td:nth-child(7)');


        // offenseDateElement.innerText = offenseDate
        // caseNumberElement.innerText = caseNumber
        // chargeElement.innerText = charge
        // caseTypeElement.innerText = caseType;
        // codeSectionElement.innerText = codeSection
        // dispositionElement.innerText = disposition;
        // sentenceTimeElement.innerText = sentenceTime;

        addDataToTable(request.result)
    }
})
