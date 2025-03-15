function createGroup() {
    let groupName = document.getElementById("groupName").value.trim();
    if (!groupName) return alert("Enter a valid group name");

    let groups = JSON.parse(localStorage.getItem("groups")) || [];
    if (!groups.includes(groupName)) {
        groups.push(groupName);
        localStorage.setItem("groups", JSON.stringify(groups));
        window.location.href = "groups.html"; // Redirect to groups page
    }
}

// adding extra functionality to the createGroup function
// function createGroup() {
//     let groupName = document.getElementById("groupName").value.trim();
//     if (!groupName) return alert("Enter a valid group name");
//     let groups = JSON.parse(localStorage.getItem("groups")) || [];
//     if (!groups.includes(groupName))