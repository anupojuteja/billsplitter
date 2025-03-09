let people = JSON.parse(localStorage.getItem("groupPeople")) || [];

// Function to update the "Paid By" dropdown
function updatePaidByDropdown() {
    const dropdown = document.getElementById("paidBy");
    dropdown.innerHTML = '<option value="">Select who paid</option>';

    people.forEach(person => {
        const option = document.createElement("option");
        option.value = person;
        option.textContent = person;
        dropdown.appendChild(option);
    });
}

// Function to add a person and update the dropdown
function addPerson() {
    const name = document.getElementById("personName").value.trim();
    if (!name) return;

    people.push(name);
    localStorage.setItem("groupPeople", JSON.stringify(people));
    
    displayPeople();
    updatePaidByDropdown();

    document.getElementById("personName").value = "";
}

// Function to display the added people with remove buttons
people.forEach(person => {
    const listItem = document.createElement("li");
    listItem.className = "bg-white flex justify-between items-center px-4 py-2 rounded-md shadow";

    listItem.innerHTML = `
        <span class="text-gray-700 flex-grow">${person}</span>
        <button class="bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition ml-3"
            onclick="removePerson('${person}')">✖</button>
    `;

    peopleList.appendChild(listItem);
});


// Function to remove a person
function removePerson(name) {
    people = people.filter(person => person !== name);
    localStorage.setItem("groupPeople", JSON.stringify(people));
    displayPeople();
    updatePaidByDropdown();
}

// Function to add an expense
function addExpense() {
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const paidBy = document.getElementById("paidBy").value;

    if (!amount || !paidBy) {
        alert("Enter a valid amount and select who paid.");
        return;
    }

    const eachShare = amount / people.length;
    let balances = JSON.parse(localStorage.getItem("balances")) || {};
    
    // Update balances
    people.forEach(person => {
        if (person === paidBy) {
            balances[person] = (balances[person] || 0) - amount + eachShare;
        } else {
            balances[person] = (balances[person] || 0) + eachShare;
        }
    });

    localStorage.setItem("balances", JSON.stringify(balances));
    saveToHistory(paidBy, amount);
    displayExpenseSplit();
}

// Function to display how much each person has to pay
function displayExpenseSplit() {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    const balances = JSON.parse(localStorage.getItem("balances")) || {};

    Object.keys(balances).forEach(person => {
        if (balances[person] > 0) {
            const listItem = document.createElement("li");
            listItem.className = "flex justify-between bg-gray-100 p-2 rounded-md";
            listItem.innerHTML = `
                <span>${person} needs to pay: $${balances[person].toFixed(2)}</span>
                <button class="bg-blue-500 text-white px-3 py-1 rounded-md" onclick="markAsPaid('${person}')">Pay</button>
            `;
            expenseList.appendChild(listItem);
        }
    });
}

// Function to mark a person as paid
function markAsPaid(person) {
    let balances = JSON.parse(localStorage.getItem("balances")) || {};

    if (balances[person]) {
        balances[person] = 0;
    }

    localStorage.setItem("balances", JSON.stringify(balances));
    displayExpenseSplit();
    checkAllPaid();
}

// Function to check if all have paid and reset expenses
function checkAllPaid() {
    const balances = JSON.parse(localStorage.getItem("balances")) || {};
    if (Object.values(balances).every(balance => balance === 0)) {
        alert("All people have paid!");
        localStorage.removeItem("balances");
        displayExpenseSplit();
    }
}

// Function to save expenses to history
function saveToHistory(paidBy, amount) {
    let history = JSON.parse(localStorage.getItem("paymentHistory")) || [];
    history.push({ paidBy, amount, date: new Date().toLocaleString() });
    localStorage.setItem("paymentHistory", JSON.stringify(history));
}

// Function to toggle history visibility
function toggleHistory() {
    const historySection = document.getElementById("historySection");
    historySection.classList.toggle("hidden");

    document.querySelector("button[onclick='toggleHistory()']").textContent =
        historySection.classList.contains("hidden") ? "View History" : "Hide History";

    if (!historySection.classList.contains("hidden")) loadExpenseHistory();
}

// Function to load and display payment history
function loadExpenseHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("paymentHistory")) || [];
    history.forEach(entry => {
        historyList.innerHTML += `<li>${entry.paidBy} paid $${entry.amount} on ${entry.date}</li>`;
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    displayPeople();
    updatePaidByDropdown();
    displayExpenseSplit();
});
