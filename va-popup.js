async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('extractButton').addEventListener('click', extractData);
    document.getElementById('resetButton').addEventListener('click', resetData)
    document.getElementById('copyButton').addEventListener('click', copyTable)
});

function resetData() {
    chrome.storage.local.set({ 'vaInfoTableData': {} }, function () {
        document.getElementById("infoTable").innerHTML = "<tr><th>Offense Date</th><th>Case #</th><th>Charge</th><th>Case Type</th><th>Code Section</th><th>Disposition</th><th>Sentence Time</th></tr>";
    })

    const extensionMessage = document.getElementById("extensionMessage");
    extensionMessage.innerText = `Data Reset`;
}

// call the content script to extract data from the current page
async function extractData() {
    const tab = await getCurrentTab();
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["va-content-script.js"]
    });

    populateVaTable()
}

// Add a new row to the chrome extension table with the extracted data
function addDataToTable(data) {
    var newRow = document.createElement("tr");

    newRow.id = data.caseNumber;

    // create and append new data cells with a user input field for each piece of extracted data from the content-script
    var dateCell = document.createElement("td");
    var dateInput = document.createElement("input");
    dateInput.type = "text";
    dateInput.value = data.offenseDate;
    dateInput.classList.add("inputField");
    dateInput.addEventListener('change', function () {
        updateStorage(newRow.id, 'offenseDate', this.value);
    });
    dateCell.appendChild(dateInput);
    newRow.appendChild(dateCell);

    // case number is not editable
    var caseCell = document.createElement("td");
    caseCell.appendChild(document.createTextNode(data.caseNumber));
    newRow.appendChild(caseCell);

    var chargeCell = document.createElement("td");
    var chargeInput = document.createElement("input");
    chargeInput.type = "text";
    chargeInput.value = data.charge;
    chargeInput.classList.add("inputField");
    chargeInput.addEventListener('change', function () {
        updateStorage(newRow.id, 'charge', this.value);
    });
    chargeCell.appendChild(chargeInput);
    newRow.appendChild(chargeCell);

    var typeCell = document.createElement("td");
    var typeInput = document.createElement("input");
    typeInput.type = "text";
    typeInput.value = data.caseType;
    typeInput.classList.add("inputField");
    typeInput.addEventListener('change', function () {
        updateStorage(newRow.id, 'caseType', this.value);
    });
    typeCell.appendChild(typeInput);
    newRow.appendChild(typeCell);

    var codeCell = document.createElement("td");
    var codeInput = document.createElement("input");
    codeInput.type = "text";
    codeInput.value = data.codeSection;
    codeInput.classList.add("inputField");
    codeInput.addEventListener('change', function () {
        updateStorage(newRow.id, 'codeSection', this.value);
    });
    codeCell.appendChild(codeInput);
    newRow.appendChild(codeCell);

    var dispCell = document.createElement("td");
    var dispInput = document.createElement("input");
    dispInput.type = "text";
    dispInput.value = data.disposition;
    dispInput.classList.add("inputField");
    dispInput.addEventListener('change', function () {
        updateStorage(newRow.id, 'disposition', this.value);
    });
    dispCell.appendChild(dispInput);
    newRow.appendChild(dispCell);

    var sentenceCell = document.createElement("td");
    var sentenceInput = document.createElement("input");
    sentenceInput.type = "text";
    sentenceInput.value = data.sentenceTime;
    sentenceInput.classList.add("inputField");
    sentenceInput.addEventListener('change', function () {
        updateStorage(newRow.id, 'sentenceTime', this.value);
    });
    sentenceCell.appendChild(sentenceInput);
    newRow.appendChild(sentenceCell);

    // append the row to the table
    var table = document.getElementById("infoTable");
    table.appendChild(newRow);
}

// Update the chrome.storage.local object with the new value for the given key
function updateStorage(rowId, key, newValue) {
    chrome.storage.local.get('vaInfoTableData', function (data) {
        if (data.vaInfoTableData && data.vaInfoTableData[rowId]) {
            data.vaInfoTableData[rowId][key] = newValue;
            chrome.storage.local.set({ 'vaInfoTableData': data.vaInfoTableData }, function () {
                console.log('Data updated successfully');
            });
        }
    });
}

// Copy the table to the clipboard
function copyTable() {
    chrome.storage.local.get('vaInfoTableData', function (data) {
        let tableData = data.vaInfoTableData;
        let output = '';
        const headerString = `Date of Offense\tState/Federal Case Number\tOffense Name\tAbout Charge\tStatute\tDisposition\tSentence\tState/Department\tContact`;
        const stateDepartment = 'VA';
        output += `${headerString}\n`;
        // Iterate through all objects in the tableData object and create a string for each row
        for (let key in tableData) {
            let row = tableData[key];
            console.log('row', row)
            const { offenseDate, caseNumber, charge, caseType, codeSection, disposition, sentenceTime } = row;
            const rowOutput = `${offenseDate}\t${caseNumber}\t${charge}\t${caseType}\t${codeSection}\t${disposition}\t${sentenceTime}\t${stateDepartment}`;
            console.log(`result string`, rowOutput);
            output += `${rowOutput}\n`;
        }
        navigator.clipboard.writeText(output).then(function () {
            console.log('Table copied to clipboard.');
        }, function () {
            console.error('Unable to write to clipboard. Please try again');
        });
    });

    const extensionMessage = document.getElementById("extensionMessage");
    extensionMessage.innerText = `Data copied to clipboard`;
}

// Listen for messages from the content-script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "vaSendDataToPopup.js") {
        const { offenseDate, caseNumber, charge, caseType, codeSection, disposition, sentenceTime } = request.result;

        const resultString = `${offenseDate}\t${caseNumber}\t${charge}\t${caseType}\t${codeSection}\t${disposition}\t${sentenceTime}`;

        // navigator.clipboard.writeText(resultString);

        chrome.storage.local.get("vaInfoTableData", function (result) {
            let updatedTableObj = result.vaInfoTableData || {};
            if (!(caseNumber in updatedTableObj)) {
                updatedTableObj[caseNumber] = request.result
                chrome.storage.local.set({ "vaInfoTableData": updatedTableObj }, function () {
                    // console.log("Value is set to ", updatedTableObj);
                    const extensionMessage = document.getElementById("extensionMessage");
                    extensionMessage.innerText = `Case number ${caseNumber} copied to table`;
                });
            } else {
                const extensionMessage = document.getElementById("extensionMessage");
                extensionMessage.innerText = `Case number ${caseNumber} already in table`;
            }
        });

    }
})

// Populate the table with data from chrome.storage.local
function populateVaTable() {
    chrome.storage.local.get('vaInfoTableData', function (data) {
        if (Object.keys(data.vaInfoTableData).length > 0) {
            const table = document.getElementById("infoTable");
            for (const [caseNumber, rowData] of Object.entries(data.vaInfoTableData)) {
                if (!table.innerHTML.includes(caseNumber)) {
                    addDataToTable(rowData);
                }
            }
            chrome.storage.local.set({ "vaInfoTableData": data.vaInfoTableData }, function () {
                // console.log("Updated vaInfoTableData object in chrome.storage.local");
            });
        }
    });

}
