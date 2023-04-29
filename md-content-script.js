function getData() {
    // Define the regex patterns for each field
    const caseRegex = /Case Number:\s*([^\n]+)/;
    const caseTypeRegex = /Case Type:\s*([^\n]+)/;
    const offenseDateRegex = /Offense Date From:\s([\d/]+)/;
    const chargeRegex = /Charge Description:\s*([^\n]+)/;
    const codeSectionRegex = /Statute Code:\s*([^\n]+)/;
    const dispositionRegex = /Disposition:\s*([^\n]+)/;
    const sentenceTimeRegex = /Sentence Time:\s*([^\n]+)/;

    // Get the text content of the current page
    const pageText = document.body.innerText;

    // Match each regex pattern against the page text and extract the captured group
    const caseMatch = pageText.match(caseRegex);
    const caseNumber = caseMatch ? caseMatch[1] : 'N/A';

    const caseTypeMatch = pageText.match(caseTypeRegex);
    const caseType = caseTypeMatch && caseTypeMatch[1].trim() !== '' ? caseTypeMatch[1].trim() : 'N/A';

    const offenseDateMatch = pageText.match(offenseDateRegex);
    const offenseDate = offenseDateMatch && offenseDateMatch[1] !== '' ? offenseDateMatch[1] : 'N/A';

    const chargeMatch = pageText.match(chargeRegex);
    const charge = chargeMatch && chargeMatch[1].trim() !== '' ? chargeMatch[1].replace(/\n/g, '').trim() : 'N/A';

    const codeSectionMatch = pageText.match(codeSectionRegex);
    const codeSection = codeSectionMatch && codeSectionMatch[1] !== '' ? codeSectionMatch[1] : 'N/A';

    const dispositionMatch = pageText.match(dispositionRegex);
    const disposition = dispositionMatch && dispositionMatch[1].trim() !== '' ? dispositionMatch[1].trim() : 'N/A';

    const sentenceTimeMatch = pageText.match(sentenceTimeRegex);
    const sentenceTime = sentenceTimeMatch && sentenceTimeMatch[1].trim() !== 'Sentence Suspended:' && sentenceTimeMatch[1].trim() !== '' ? sentenceTimeMatch[1].trim() : 'N/A';

    // Create a string that can be copied into separate Excel table columns
    // const resultString = `${offenseDate}\t${caseNumber}\t${charge}\t${caseType}\t${codeSection}\t${disposition}`;

    const extractedDataObject = {
        offenseDate: offenseDate,
        caseNumber: caseNumber,
        charge: charge,
        caseType: caseType,
        codeSection: codeSection,
        disposition: disposition,
        sentenceTime: sentenceTime
    }

    // console.log(resultString)

    return extractedDataObject
}

chrome.runtime.sendMessage({
    "action": "mdSendDataToPopup.js",
    "result": getData()
});
