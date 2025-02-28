// let group = {
//     name: "",
//     members: [],
//     expenses: []
// };

// // Create Group
// function createGroup() {
//     const groupName = document.getElementById("groupName").value;
//     if (groupName) {
//         group.name = groupName;
//         alert(`Group "${groupName}" created!`);
//     }
// }

// // Add Member
// function addMember() {
//     const memberName = document.getElementById("memberName").value;
//     if (memberName && !group.members.includes(memberName)) {
//         group.members.push(memberName);
//         updatePayerDropdown();
//         alert(`${memberName} added to the group.`);
//     }
// }

// // Remove Member
// function removeMember() {
//     const memberName = document.getElementById("memberName").value;
//     const index = group.members.indexOf(memberName);
//     if (index > -1) {
//         group.members.splice(index, 1);
//         updatePayerDropdown();
//         alert(`${memberName} removed from the group.`);
//     }
// }

// // Update Payer Dropdown
// function updatePayerDropdown() {
//     const payerSelect = document.getElementById("payer");
//     payerSelect.innerHTML = "";
//     group.members.forEach(member => {
//         let option = document.createElement("option");
//         option.value = member;
//         option.textContent = member;
//         payerSelect.appendChild(option);
//     });
// }

// // Add Expense
// function addExpense() {
//     const amount = parseFloat(document.getElementById("expenseAmount").value);
//     const payer = document.getElementById("payer").value;

//     if (amount > 0 && payer) {
//         group.expenses.push({ amount, payer });
//         calculateBalances();
//     }
// }

// // Calculate Balances
// function calculateBalances() {
//     let balances = {};
    
//     group.members.forEach(member => {
//         balances[member] = 0;
//     });

//     group.expenses.forEach(expense => {
//         let splitAmount = expense.amount / group.members.length;
//         group.members.forEach(member => {
//             if (member === expense.payer) {
//                 balances[member] += expense.amount - splitAmount;
//             } else {
//                 balances[member] -= splitAmount;
//             }
//         });
//     });

//     displayBalances(balances);
// }

// // Display Balances
// function displayBalances(balances) {
//     const balanceList = document.getElementById("balanceList");
//     balanceList.innerHTML = "";

//     Object.keys(balances).forEach(member => {
//         let li = document.createElement("li");
//         li.textContent = `${member}: ${balances[member].toFixed(2)}`;
//         balanceList.appendChild(li);
//     });
// }
