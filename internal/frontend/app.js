// internal/frontend/app.js

//var to track current filter state
let currentShowCompleted = false;

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

async function loadTags() {
    const tagSelect = document.getElementById("tagSelect");
    tagSelect.innerHTML = '<option value="">--Select a Tag--</option>'; // reset

    try {
        const response = await fetch("/api/tags");
        const tags = await response.json();

        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.id;      // send id to API
            option.textContent = tag.name;
            tagSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading tags:", err);
    }
}

// Display tasks in the page
function renderTasks(tasks, showCompleted = false) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        if (!showCompleted && task.completed) return; // skip completed unless requested

        // Create task item (same as before)
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

        // Description
        if (task.description) {
            const desc = document.createElement("p");
            desc.textContent = task.description;
            item.appendChild(desc);
        }

        // Tag
        if (task.tag_name) {
            const tag = document.createElement("span");
            tag.textContent = task.tag_name;
            tag.classList.add("task-tag");
            item.appendChild(tag);
        }

        // Due date
        if (task.due_date) {
            let dueDate;
            if (/^\d{2}\.\d{2}\.\d{4}$/.test(task.due_date)) {
                const [day, month, year] = task.due_date.split(".");
                dueDate = new Date(`${year}-${month}-${day}`);
            } else {
                dueDate = new Date(task.due_date);
            }

            if (!isNaN(dueDate)) {
                const due = document.createElement("span");
                due.textContent = `Due: ${dueDate.toLocaleDateString()}`;
                due.classList.add("task-due");
                item.appendChild(due);
            }
        }

        // Completed checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
            try {
                await fetch(`/api/tasks/${task.id}/complete`, { method: "POST" });
                loadTasks(currentShowCompleted); // reload tasks with current filter
            } catch (err) {
                console.error("Error toggling task completion:", err);
            }
        });
        item.appendChild(checkbox);

        list.appendChild(item);
    });
}


function setupButtons() {
    const addBtn = document.getElementById("addHabitBtn");
    const modal = document.getElementById("addHabitModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("addHabitForm");

    // Show modal and load tags
    addBtn.addEventListener("click", async () => {
        modal.style.display = "block";
        await loadTags();
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });

    // Form submission
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            description: formData.get("description") || null,
            completed: false
        };

        const tagId = formData.get("tag_id");
        if (tagId) data.tag_id = parseInt(tagId, 10); // only add if selected

        const dueDate = formData.get("due_date");
        if (dueDate) data.due_date = dueDate; // only add if provided

        try {
            const response = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                modal.style.display = "none";
                form.reset();
                loadTasks();
            } else {
                console.error("Failed to add habit:", await response.text());
            }
        } catch (err) {
            console.error("Error adding habit:", err);
        }
    });

    // View Completed button
    document.getElementById("viewCompletedBtn").addEventListener("click", async () => {
        currentShowCompleted = !currentShowCompleted; // toggle filter
        const response = await fetch("/api/tasks");
        const tasks = await response.json();
        renderTasks(tasks, currentShowCompleted);
        document.getElementById("viewCompletedBtn").textContent = 
            currentShowCompleted ? "Hide Completed" : "View Completed";
    });

}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
    setupButtons();
    loadTasks();
});
