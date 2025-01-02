document.getElementById("discountForm").addEventListener("submit", function (event) {
    const bankInfo = document.getElementById("bankInfo").value;
    const negotiationDate = document.getElementById("negotiationDate").value;
    const discountRate = document.getElementById("discountRate").value;
    const bankDays = document.getElementById("bankDays").value;
    const commissionDomiciled = document.getElementById("commissionDomiciled").value;
    const commissionNonDomiciled = document.getElementById("commissionNonDomiciled").value;
    const commissionMovedDomiciled = document.getElementById("commissionMovedDomiciled").value;
    const commissionMovedNonDomiciled = document.getElementById("commissionMovedNonDomiciled").value;

    const tableRows = document.getElementById("discountTable").getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    let totalNominal = 0;
    let totalDiscount = 0;
    let totalCommission = 0;
    let totalTVA = 0;

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const place = row.cells[0].getElementsByTagName("input")[0].value;
        const nominalValue = row.cells[1].getElementsByTagName("input")[0].value;
        const dueDate = row.cells[2].getElementsByTagName("input")[0].value;

        const agiosDays = parseInt(bankDays) + daysDifference(negotiationDate, dueDate);
        const discount = (nominalValue * discountRate * agiosDays) / 36000;
        const commission = calculateCommission(bankInfo, place);
        const tva = commission * 0.18;

        totalNominal += parseFloat(nominalValue);
        totalDiscount += discount;
        totalCommission += commission;
        totalTVA += tva;

        updateOutputCells(row, agiosDays, discount, commission, tva);
    }

    document.getElementById("totalAgios").textContent = (totalDiscount + totalCommission + totalTVA).toFixed(2);
    document.getElementById("totalAmount").textContent = totalNominal.toFixed(2);
    document.getElementById("netTotal").textContent = (totalNominal - (totalDiscount + totalCommission + totalTVA)).toFixed(2);

    event.preventDefault();
});

document.getElementById("addRow").addEventListener("click", function () {
    const tableBody = document.getElementById("discountTable").getElementsByTagName("tbody")[0];
    const newRow = tableBody.insertRow(tableBody.rows.length);

    newRow.innerHTML = `
        <td><input type="text" name="place[]" required></td>
        <td><input type="number" name="nominalValue[]" required></td>
        <td><input type="date" name="dueDate[]" required></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    `;
});

function daysDifference(date1, date2) {
    const diffTime = Math.abs(new Date(date2) - new Date(date1));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateCommission(bankInfo, place) {
    const [bankName, location] = bankInfo.split('-');
    const [placeBankName, placeLocation] = place.split('-');

    const commissionMovedNonDomiciled = parseFloat(document.getElementById("commissionMovedNonDomiciled").value);
    const commissionNonDomiciled = parseFloat(document.getElementById("commissionNonDomiciled").value);
    const commissionMovedDomiciled = parseFloat(document.getElementById("commissionMovedDomiciled").value);
    const commissionDomiciled = parseFloat(document.getElementById("commissionDomiciled").value);

    if (bankName !== placeBankName && location !== placeLocation) {
        return commissionMovedNonDomiciled;
    } else if (bankName !== placeBankName && location === placeLocation) {
        return commissionNonDomiciled;
    } else if (bankName === placeBankName && location !== placeLocation) {
        return commissionMovedDomiciled;
    } else {
        return commissionDomiciled;
    }
}

function updateOutputCells(row, agiosDays, discount, commission, tva) {
    row.cells[3].textContent = agiosDays;
    row.cells[4].textContent = discount.toFixed(2);
    row.cells[5].textContent = commission.toFixed(2);
    row.cells[6].textContent = tva.toFixed(2);
}
