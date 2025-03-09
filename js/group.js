document.addEventListener("DOMContentLoaded", () => {
    loadGroupData();
});

// Get the group name from storage
const currentGroup = localStorage.getItem("currentGroup");
document.getElementById("groupTitle").textContent = currentGroup || "Group Expenses";

// Retrieve stored people list or initialize an empty array
let people = JSON.parse(localStorage.getItem(currentGroup)) || [];
let expenses = JSON.parse(localStorage.getItem(`${currentGroup}_expenses`)) || [];
let history = JSON.parse(localStorage.getItem(`${currentGroup}_history`)) || [];

const peopleList = document.getElementById("peopleList");
const expenseList = document.getElementById("expenseList");
const historyList = document.getElementById("historyList");

// Function to render people list
function renderPeopleList() {
    peopleList.innerHTML = "";
    people.forEach(person => {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between bg-white px-4 py-2 rounded-md shadow";

        listItem.innerHTML = `
            <span>${person}</span>
            <button class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition text-sm" 
                onclick="removePerson('${person}')">X</button>
        `;
        peopleList.appendChild(listItem);
    });
    updatePayerDropdown();
}

// Function to update the payer dropdown
function updatePayerDropdown() {
    const payerSelect = document.getElementById("payerSelect");
    payerSelect.innerHTML = `<option value="" disabled selected>Select who paid</option>`;
    
    people.forEach(person => {
        const option = document.createElement("option");
        option.value = person;
        option.textContent = person;
        payerSelect.appendChild(option);
    });
}

// Function to add a person to the group
function addPerson() {
    const personNameInput = document.getElementById("personName");
    const personName = personNameInput.value.trim();

    if (personName === "") {
        alert("Please enter a valid name.");
        return;
    }

    if (!people.includes(personName)) {
        people.push(personName);
        localStorage.setItem(currentGroup, JSON.stringify(people));
        renderPeopleList();
    } else {
        alert("Person already exists in the group.");
    }

    personNameInput.value = "";
}

// Function to remove a person from the group
function removePerson(person) {
    people = people.filter(p => p !== person);
    localStorage.setItem(currentGroup, JSON.stringify(people));
    renderPeopleList();
}

// Function to add an expense
function addExpense() {
    const expenseAmount = document.getElementById("expenseAmount").value;
    const payer = document.getElementById("payerSelect").value;

    if (!expenseAmount || expenseAmount <= 0 || !payer) {
        alert("Enter a valid amount and select who paid.");
        return;
    }

    const splitAmount = (expenseAmount / people.length).toFixed(2);
    const expense = { amount: expenseAmount, payer: payer, splits: {} };

    people.forEach(person => {
        if (person !== payer) {
            expense.splits[person] = splitAmount;
        }
    });

    expenses.push(expense);
    localStorage.setItem(`${currentGroup}_expenses`, JSON.stringify(expenses));
    renderExpenses();
}

// Function to render expenses
function renderExpenses() {
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
        Object.entries(expense.splits).forEach(([person, amount]) => {
            const listItem = document.createElement("li");
            listItem.className = "flex justify-between bg-white px-4 py-2 rounded-md shadow";

            listItem.innerHTML = `
                <span>${person} owes ₹${amount}</span>
                <button class="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition text-sm" 
                    onclick="markAsPaid(${index}, '${person}')">Pay</button>
            `;
            expenseList.appendChild(listItem);
        });
    });
}

// Function to mark an expense as paid
function markAsPaid(expenseIndex, person) {
    const expense = expenses[expenseIndex];

    if (expense.splits[person]) {
        delete expense.splits[person];

        if (Object.keys(expense.splits).length === 0) {
            expenses.splice(expenseIndex, 1);
            alert("All people paid. Expenses reset!");
        }

        localStorage.setItem(`${currentGroup}_expenses`, JSON.stringify(expenses));
        renderExpenses();
        saveToHistory(person);
    }
}

// Function to save payments to history
function saveToHistory(person) {
    const record = `${person} has completed their payment.`;
    history.push(record);
    localStorage.setItem(`${currentGroup}_history`, JSON.stringify(history));
}

// Function to toggle payment history
function toggleHistory() {
    const historyContainer = document.getElementById("historyContainer");
    if (historyContainer.classList.contains("hidden")) {
        historyContainer.classList.remove("hidden");
        renderHistory();
    } else {
        historyContainer.classList.add("hidden");
    }
}

// Function to render payment history
function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(record => {
        const historyItem = document.createElement("p");
        historyItem.className = "bg-gray-200 p-2 rounded-md";
        historyItem.textContent = record;
        historyList.appendChild(historyItem);
    });
}

// Load data when page is ready
function loadGroupData() {
    renderPeopleList();
    renderExpenses();
}
