document.addEventListener("DOMContentLoaded", function () {
    loadGroupData();
    updatePeopleList();
    loadExpenseHistory();
});

// Function to load group title from local storage
function loadGroupData() {
    const groupName = localStorage.getItem("selectedGroup") || "Group Expenses";
    document.getElementById("groupTitle").innerText = groupName;
}

// Function to add a person to the group
function addPerson() {
    const personName = document.getElementById("personName").value.trim();
    if (personName === "") {
        alert("Please enter a name.");
        return;
    }

    let people = JSON.parse(localStorage.getItem("groupMembers")) || [];
    people.push(personName);
    localStorage.setItem("groupMembers", JSON.stringify(people));

    document.getElementById("personName").value = "";
    updatePeopleList();
}

// Function to update the displayed list of people
function updatePeopleList() {
    const people = JSON.parse(localStorage.getItem("groupMembers")) || [];
    const peopleList = document.getElementById("peopleList");

    peopleList.innerHTML = ""; // Clear the list

    people.forEach((person, index) => {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center bg-white p-2 rounded shadow-md";

        listItem.innerHTML = `
            <span>${person}</span>
            <button class="delete-btn text-red-500 hover:text-red-700 font-bold" onclick="removePerson(${index})">❌</button>
        `;

        peopleList.appendChild(listItem);
    });
}

// Function to remove a person from the group
function removePerson(index) {
    let people = JSON.parse(localStorage.getItem("groupMembers")) || [];
    people.splice(index, 1);
    localStorage.setItem("groupMembers", JSON.stringify(people));
    updatePeopleList();
}

// Function to add an expense and split it
function addExpense() {
    const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
        alert("Please enter a valid expense amount.");
        return;
    }

    const people = JSON.parse(localStorage.getItem("groupMembers")) || [];
    if (people.length === 0) {
        alert("Add people to split the expense.");
        return;
    }

    const splitAmount = (expenseAmount / people.length).toFixed(2);
    localStorage.setItem("totalExpense", expenseAmount);
    localStorage.setItem("payments", JSON.stringify(people.map(person => ({ person, paid: false }))));
    updateExpenseList();
    document.getElementById("expenseAmount").value = "";
}

// Function to update the displayed split expenses
function updateExpenseList() {
    const expenseList = document.getElementById("expenseList");
    const payments = JSON.parse(localStorage.getItem("payments")) || [];

    expenseList.innerHTML = "";

    payments.forEach((entry, index) => {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center bg-white p-2 rounded shadow-md";

        listItem.innerHTML = `
            <span>${entry.person} owes: $${(localStorage.getItem("totalExpense") / payments.length).toFixed(2)}</span>
            <button id="pay-btn-${index}" class="pay-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 active:bg-blue-700" 
                onclick="payAmount(${index})">${entry.paid ? "Paid" : "Pay"}</button>
        `;

        expenseList.appendChild(listItem);
    });

    checkAllPaid();
}

// Function to handle payment
function payAmount(index) {
    let payments = JSON.parse(localStorage.getItem("payments")) || [];
    payments[index].paid = true;
    localStorage.setItem("payments", JSON.stringify(payments));
    document.getElementById(`pay-btn-${index}`).innerText = "Paid";
    checkAllPaid();
}

// Function to check if all people have paid
function checkAllPaid() {
    let payments = JSON.parse(localStorage.getItem("payments")) || [];
    if (payments.length > 0 && payments.every(entry => entry.paid)) {
        alert("All people have paid!");
        saveToHistory();
        resetExpenses();
    }
}

// Function to reset expenses after payment
function resetExpenses() {
    localStorage.removeItem("totalExpense");
    localStorage.removeItem("payments");
    document.getElementById("expenseList").innerHTML = "<p class='text-center text-gray-600'>No pending expenses.</p>";
}

// Function to save payment history
function saveToHistory() {
    let payments = JSON.parse(localStorage.getItem("payments")) || [];
    let history = JSON.parse(localStorage.getItem("expenseHistory")) || [];
    let date = new Date().toLocaleString();

    history.push({
        date,
        payments
    });

    localStorage.setItem("expenseHistory", JSON.stringify(history));
    loadExpenseHistory();
}

// Function to load and display history
function loadExpenseHistory() {
    let history = JSON.parse(localStorage.getItem("expenseHistory")) || [];
    const historyContainer = document.getElementById("historyList");
    historyContainer.innerHTML = "";

    if (history.length === 0) {
        historyContainer.innerHTML = "<p class='text-gray-600 text-center'>No payment history available.</p>";
        return;
    }

    history.forEach((entry, index) => {
        const historyItem = document.createElement("div");
        historyItem.className = "bg-gray-100 p-2 rounded shadow-md mb-2";

        let paymentDetails = entry.payments.map(p => `${p.person} - ${p.paid ? 'Paid' : 'Unpaid'}`).join(", ");

        historyItem.innerHTML = `
            <p class="text-sm font-semibold">Date: ${entry.date}</p>
            <p class="text-sm">${paymentDetails}</p>
        `;

        historyContainer.appendChild(historyItem);
    });
}
