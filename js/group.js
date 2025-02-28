document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const groupName = urlParams.get("name");
    document.getElementById("groupTitle").innerText = `Group: ${groupName}`;
    loadExpenses(groupName);
});

function addParticipant() {
    let groupName = document.getElementById("groupTitle").innerText.split(": ")[1];
    let participant = document.getElementById("participantName").value.trim();
    
    if (!participant) return alert("Enter a valid name");
    
    let participants = JSON.parse(localStorage.getItem(`${groupName}_participants`)) || [];
    if (!participants.includes(participant)) {
        participants.push(participant);
        localStorage.setItem(`${groupName}_participants`, JSON.stringify(participants));
    }
}

function addExpense() {
    let groupName = document.getElementById("groupTitle").innerText.split(": ")[1];
    let amount = parseFloat(document.getElementById("expenseAmount").value);
    
    if (amount <= 0) return alert("Enter a valid expense amount");

    let expenses = JSON.parse(localStorage.getItem(`${groupName}_expenses`)) || [];
    expenses.push(amount);
    localStorage.setItem(`${groupName}_expenses`, JSON.stringify(expenses));

    loadExpenses(groupName);
}

function loadExpenses(groupName) {
    let expenseList = document.getElementById("expenseList");
    expenseList.innerHTML = "";

    let expenses = JSON.parse(localStorage.getItem(`${groupName}_expenses`)) || [];
    let participants = JSON.parse(localStorage.getItem(`${groupName}_participants`)) || [];

    if (expenses.length === 0 || participants.length === 0) return;

    let total = expenses.reduce((acc, val) => acc + val, 0);
    let perPerson = total / participants.length;

    participants.forEach(person => {
        let li = document.createElement("li");
        li.classList = "p-2 bg-gray-200 rounded-md";
        li.innerText = `${person} owes ${perPerson.toFixed(2)}`;
        expenseList.appendChild(li);
    });
}
