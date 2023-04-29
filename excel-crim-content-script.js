console.log(`excel page found`)

// Find the Excel table on the page
let table = document.querySelector("table.ms-listviewtable");

// Find the first empty row in the table
let emptyRow = table.querySelector("tr.ms-itmhover:not(.ms-alternating)");

// Fill the cells in the empty row with the extracted data
let cells = emptyRow.querySelectorAll("td");
cells[0].textContent = "<offense-date>";
cells[1].textContent = "<case-number>";
