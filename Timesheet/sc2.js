const activities = ['LINC', 'EAL', 'MATH', 'Science'];
let timeSheetData = []; // Global variable to hold all row data

function addRow() {
    const newRow = {
        id: Date.now(), // Unique identifier for each row
        date: new Date().toISOString().split('T')[0],
        activity: activities[0],
        time: 0.5,
        studentName: '',
        comment: ''
    };
    
    timeSheetData.push(newRow);
    renderRow(newRow);
    updateSummary();
}

function renderRow(rowData) {
    const table = document.getElementById("timeSheet").getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.id = `row-${rowData.id}`;
    
    // Date cell
    const dateCell = newRow.insertCell(0);
    dateCell.innerHTML = `<input type="date" value="${rowData.date}" onchange="updateRowData(${rowData.id}, 'date', this.value)">`;

    // Activity cell
    const activityCell = newRow.insertCell(1);
    activityCell.innerHTML = `<select onchange="updateRowData(${rowData.id}, 'activity', this.value)">${activities.map(activity => `<option value="${activity}" ${activity === rowData.activity ? 'selected' : ''}>${activity}</option>`).join('')}</select>`;

    // Time cell
    const timeCell = newRow.insertCell(2);
    timeCell.innerHTML = `<select onchange="updateRowData(${rowData.id}, 'time', this.value)">${Array.from({length: 17}, (_, i) => `<option value="${(i + 1) / 2}" ${(i + 1) / 2 === rowData.time ? 'selected' : ''}>${(i + 1) / 2}</option>`).join('')}</select>`;

    // Student Name cell
    const studentCell = newRow.insertCell(3);
    studentCell.innerHTML = `<input type="text" value="${rowData.studentName}" placeholder="Enter student name" onchange="updateRowData(${rowData.id}, 'studentName', this.value)">`;

    // Comment cell
    const commentCell = newRow.insertCell(4);
    commentCell.innerHTML = `<input type="text" value="${rowData.comment}" placeholder="Enter comment" onchange="updateRowData(${rowData.id}, 'comment', this.value)">`;

    // Action cell with delete button
    const actionCell = newRow.insertCell(5);
    actionCell.innerHTML = `<button onclick="deleteRow(${rowData.id})">Delete</button>`;
}

function updateRowData(id, field, value) {
    const rowIndex = timeSheetData.findIndex(row => row.id === id);
    if (rowIndex !== -1) {
        timeSheetData[rowIndex][field] = field === 'time' ? parseFloat(value) : value;
        updateSummary();
    }
}

function deleteRow(id) {
    timeSheetData = timeSheetData.filter(row => row.id !== id);
    const rowElement = document.getElementById(`row-${id}`);
    if (rowElement) rowElement.remove();
    updateSummary();
}

function submitForm() {
    console.log("Submitting Data:", timeSheetData);
    alert("Form submitted! Check console for data.");
}

function sortByDate() {
    timeSheetData.sort((a, b) => new Date(a.date) - new Date(b.date));
    renderAllRows();
    updateSummary();
}

function renderAllRows() {
    const tbody = document.getElementById("timeSheet").getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows
    timeSheetData.forEach(rowData => renderRow(rowData));
}

function updateSummary() {
    let totalHours = 0;
    const activityHours = {};

    timeSheetData.forEach(row => {
        totalHours += row.time;
        activityHours[row.activity] = (activityHours[row.activity] || 0) + row.time;
    });

    document.getElementById("totalHours").textContent = totalHours.toFixed(1);

    const activityTotalsDisplay = Object.entries(activityHours)
        .sort(([a], [b]) => activities.indexOf(a) - activities.indexOf(b)) // Sort activities based on original order
        .map(([activity, hours]) => `${activity}: ${hours.toFixed(1)}`)
        .join("<br>");

    document.getElementById("activityTotals").innerHTML = activityTotalsDisplay || "No data";
}// Initial render and summary update
renderAllRows();
updateSummary();
