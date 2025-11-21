// Fetch tasks from the API
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

// Display tasks in the page
function renderTasks(tasks) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const item = document.createElement("li");
        item.textContent = task.name;
        list.appendChild(item);
    });
}

// Setup buttons
function setupButtons() {
    document.getElementById("addHabitBtn")
        .addEventListener("click", () => {
            alert("Add Habit clicked! (Implement form here)");
        });

    document.getElementById("viewCompletedBtn")
        .addEventListener("click", () => {
            alert("Completed habits clicked!");
        });
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
    setupButtons();
    loadTasks();
});
