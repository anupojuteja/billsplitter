document.addEventListener("DOMContentLoaded", loadGroups);

function loadGroups() {
    let groupList = document.getElementById("groupList");
    groupList.innerHTML = "";

    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    groups.forEach(group => {
        let li = document.createElement("li");
        li.classList = "flex justify-between p-2 bg-gray-200 rounded-md";
        li.innerHTML = `
            <a href="group.html?name=${encodeURIComponent(group)}" class="text-blue-600">${group}</a>
            <button onclick="deleteGroup('${group}')" class="text-red-500">Delete</button>
        `;
        groupList.appendChild(li);
    });
}

function deleteGroup(groupName) {
    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    let updatedGroups = groups.filter(group => group !== groupName);
    localStorage.setItem("groups", JSON.stringify(updatedGroups));
    loadGroups();
}


