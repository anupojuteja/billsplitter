document.addEventListener("DOMContentLoaded", function () {
    loadGroupData();
    updatePeopleList();
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
    updateExpenseList(people, splitAmount);

    document.getElementById("expenseAmount").value = "";
}

// Function to update the displayed split expenses
function updateExpenseList(people, splitAmount) {
    const expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    people.forEach(person => {
        const listItem = document.createElement("li");
        listItem.className = "flex justify-between items-center bg-white p-2 rounded shadow-md";

        listItem.innerHTML = `
            <span>${person} owes: $${splitAmount}</span>
            <button class="pay-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 active:bg-blue-700" onclick="payAmount('${person}')">Pay</button>
        `;

        expenseList.appendChild(listItem);
    });
}

// Function to handle payment
function payAmount(person) {
    alert(`${person} has paid their share!`);
    // Future enhancement: Track who has paid
}
