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
        // Create a container for the task
        const item = document.createElement("li");
        item.classList.add("task-item");

        // Task name
        const title = document.createElement("h3");
        title.textContent = task.name;
        if (task.completed) {
            title.style.textDecoration = "line-through";
            title.style.color = "#888";
        }
        item.appendChild(title);

        // Description (if any)
        if (task.description) {
            const desc = document.createElement("p");
            desc.textContent = task.description;
            item.appendChild(desc);
        }

        // Tag (if any)
        if (task.tag_name) {
            const tag = document.createElement("span");
            tag.textContent = task.tag_name;
            tag.classList.add("task-tag");
            item.appendChild(tag);
        }

        // Due date (if any)
        if (task.due_date) {
            const due = document.createElement("span");
            due.textContent = `Due: ${new Date(task.due_date).toLocaleDateString()}`;
            due.classList.add("task-due");
            item.appendChild(due);
        }

        // Completed checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
            try {
                await fetch(`/api/tasks/${task.id}/complete`, { method: "POST" });
                loadTasks(); // reload tasks after marking complete
            } catch (err) {
                console.error("Error marking task complete:", err);
            }
        });
        item.appendChild(checkbox);

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
