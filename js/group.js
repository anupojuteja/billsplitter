document.addEventListener("DOMContentLoaded", () => {
    let params = new URLSearchParams(window.location.search);
    let groupName = params.get("name");
    document.getElementById("groupTitle").innerText = `${groupName} Expenses`;

    loadPeople(groupName);
    loadExpenses(groupName);
});

function addPerson() {
    let personName = document.getElementById("personName").value.trim();
    if (!personName) return alert("Enter a valid name");

    let groupName = new URLSearchParams(window.location.search).get("name");
    let groups = JSON.parse(localStorage.getItem("groupsData")) || {};

    if (!groups[groupName]) groups[groupName] = { people: [], expenses: [] };

    if (!groups[groupName].people.includes(personName)) {
        groups[groupName].people.push(personName);
        localStorage.setItem("groupsData", JSON.stringify(groups));
        loadPeople(groupName);
    }
    document.getElementById("personName").value = "";
}

function loadPeople(groupName) {
    let peopleList = document.getElementById("peopleList");
    peopleList.innerHTML = "";

    let groups = JSON.parse(localStorage.getItem("groupsData")) || {};
    let people = groups[groupName]?.people || [];

    people.forEach(person => {
        let li = document.createElement("li");
        li.classList = "flex justify-between bg-white p-2 rounded-md shadow-sm";
        li.innerHTML = `
            <span>${person}</span>
            <button onclick="removePerson('${groupName}', '${person}')" class="bg-red-500 text-white px-3 py-1 rounded-md">❌</button>
        `;
        peopleList.appendChild(li);
    });
}

function removePerson(groupName, personName) {
    let groups = JSON.parse(localStorage.getItem("groupsData")) || {};

    if (groups[groupName]) {
        groups[groupName].people = groups[groupName].people.filter(person => person !== personName);
        localStorage.setItem("groupsData", JSON.stringify(groups));
        loadPeople(groupName);
    }
}

function addExpense() {
    let amount = parseFloat(document.getElementById("expenseAmount").value);
    if (isNaN(amount) || amount <= 0) return alert("Enter a valid expense amount");

    let groupName = new URLSearchParams(window.location.search).get("name");
    let groups = JSON.parse(localStorage.getItem("groupsData")) || {};

    if (!groups[groupName] || !groups[groupName].people.length) {
        return alert("Add at least one person to split the expense.");
    }

    groups[groupName].expenses.push(amount);
    localStorage.setItem("groupsData", JSON.stringify(groups));
    loadExpenses(groupName);
    document.getElementById("expenseAmount").value = "";
}

function loadExpenses(groupName) {
    let expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    let groups = JSON.parse(localStorage.getItem("groupsData")) || {};
    let expenses = groups[groupName]?.expenses || [];
    let people = groups[groupName]?.people || [];

    let totalExpense = expenses.reduce((sum, val) => sum + val, 0);
    let perPersonShare = people.length ? (totalExpense / people.length).toFixed(2) : 0;

    let li = document.createElement("li");
    li.classList = "bg-white p-2 rounded-md shadow-sm";
    li.innerHTML = `<strong>Total Expense:</strong> $${totalExpense} <br> <strong>Each Person Pays:</strong> $${perPersonShare}`;
    expenseList.appendChild(li);
}


//   adding names before pay