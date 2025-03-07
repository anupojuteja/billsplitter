// document.addEventListener("DOMContentLoaded", loadGroups);

// function loadGroups() {
//     let groupList = document.getElementById("groupList");
//     groupList.innerHTML = "";

//     let groups = JSON.parse(localStorage.getItem("groups")) || [];
//     groups.forEach(group => {
//         let li = document.createElement("li");
//         li.classList = "flex justify-between p-2 bg-gray-200 rounded-md";
//         li.innerHTML = `
//             <a href="group.html?name=${encodeURIComponent(group)}" class="text-blue-600">${group}</a>
//             <button onclick="deleteGroup('${group}')" class="text-red-500">Delete</button>
//         `;
//         groupList.appendChild(li);
//     });
// }

// function deleteGroup(groupName) {
//     let groups = JSON.parse(localStorage.getItem("groups")) || [];
//     let updatedGroups = groups.filter(group => group !== groupName);
//     localStorage.setItem("groups", JSON.stringify(updatedGroups));
//     loadGroups();
// }


document.addEventListener("DOMContentLoaded", displayGroups);

// Function to create a new group
function createGroup() {
    const groupName = document.getElementById("groupName").value.trim();
    if (!groupName) return;

    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups.push(groupName);
    localStorage.setItem("groups", JSON.stringify(groups));

    displayGroups();
    document.getElementById("groupName").value = "";
}

// Function to display groups dynamically
function displayGroups() {
    const groupList = document.getElementById("groupList");
    groupList.innerHTML = "";

    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups.forEach((group, index) => {
        const groupItem = document.createElement("div");
        groupItem.className = "flex justify-between items-center bg-gray-200 p-3 rounded-md shadow-md transition-all transform hover:scale-105";

        groupItem.innerHTML = `
            <a href="group.html?group=${group}" class="text-lg font-semibold text-blue-700 hover:underline">
                ${group}
            </a>
            <button onclick="deleteGroup(${index})"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-all transform hover:scale-110">
                ✖
            </button>
        `;

        groupItem.style.animation = "fadeIn 0.5s ease-in-out";
        groupList.appendChild(groupItem);
    });
}

// Function to delete a group
function deleteGroup(index) {
    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups.splice(index, 1);
    localStorage.setItem("groups", JSON.stringify(groups));
    displayGroups();
}

// CSS Animations
const style = document.createElement('style');
style.innerHTML = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
