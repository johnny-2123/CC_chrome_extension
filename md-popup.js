async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab.url);
    return tab;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('extractButton').addEventListener('click', extractData);
    document.getElementById('resetButton').addEventListener('click', resetData)

});

function resetData() {
    chrome.storage.local.set({ 'mdInfoTableData': {} }, function () {
        console.log('Data has been reset')
        document.getElementById("infoTable").innerHTML = "<tr><th>Offense Date</th><th>Case #</th><th>Charge</th><th>Case Type</th><th>Code Section</th><th>Disposition</th><th>Sentence Time</th></tr>";
    })
}

async function extractData() {

    const tab = await getCurrentTab();
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["md-content-script.js"]
    });

    populateMdTable()
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
    var table = document.getElementById("infoTable");
    table.appendChild(newRow);
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "mdSendDataToPopup.js") {
        const { offenseDate, caseNumber, charge, caseType, codeSection, disposition, sentenceTime } = request.result;

        const resultString = `${offenseDate}\t${caseNumber}\t${charge}\t${caseType}\t${codeSection}\t${disposition}\t${sentenceTime}`;

        navigator.clipboard.writeText(resultString);

        chrome.storage.local.get("mdInfoTableData", function (result) {
            console.log("Value currently is ", result);

            let updatedTableObj = result.mdInfoTableData || {};
            console.log(`updatedTable Objecttttt`, updatedTableObj)

            if (!(caseNumber in updatedTableObj)) {
                updatedTableObj[caseNumber] = request.result
                console.log(`data didnt exist yettttt`)
                chrome.storage.local.set({ "mdInfoTableData": updatedTableObj }, function () {
                    console.log("Value is set to ", updatedTableObj);
                });
            } else {
                const extensionMessage = document.getElementById("extensionMessage");
                extensionMessage.innerText = "Case number already in table";
                console.log("Data already exists for case: ", caseNumber);
            }
        });

    }
})

function populateMdTable() {

    chrome.storage.local.get('mdInfoTableData', function (data) {
        if (Object.keys(data.mdInfoTableData).length > 0) {
            const table = document.getElementById("infoTable");
            for (const [caseNumber, rowData] of Object.entries(data.mdInfoTableData)) {
                if (!table.innerHTML.includes(caseNumber)) {
                    addDataToTable(rowData);
                }
            }
            chrome.storage.local.set({ "mdInfoTableData": data.mdInfoTableData }, function () {
                console.log("Updated mdInfoTableData object in chrome.storage.local");
            });
        }
    });

}
