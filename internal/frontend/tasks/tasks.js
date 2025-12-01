// Track current filter state
let currentShowCompleted = false;
let currentTagFilter = "";

// Fetch tasks from the API
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        let tasks = await response.json();

        if (currentTagFilter) {
            tasks = tasks.filter(task => String(task.tag_id) == currentTagFilter);
        }

        renderTasks(tasks, currentShowCompleted);
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

async function loadTagsForFilter() {
    const select = document.getElementById("tagFilter");
    select.innerHTML = '<option value="">All Tags</option>';

    try {
        const response = await fetch("/api/tags");
        const tags = await response.json();
        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.id;
            option.textContent = tag.name;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading tags:", err);
    }
}

function setupFilters() {
    const tagSelect = document.getElementById("tagFilter");
    const completedCheckbox = document.getElementById("completedFilter");

    tagSelect.addEventListener("change", () => {
        currentTagFilter = tagSelect.value;
        loadTasks();
    });

    completedCheckbox.addEventListener("change", () => {
        currentShowCompleted = completedCheckbox.checked;
        loadTasks();
    });
}

function getContrastYIQ(hexcolor){
    // Convert hex to RGB
    hexcolor = hexcolor.replace("#",""); 
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    // YIQ formula
    const yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? "#000000" : "#ffffff"; // dark text for light bg, white for dark bg
}

// Fetch tags for the form select
async function loadTags() {
    const tagSelect = document.getElementById("tagSelect");
    tagSelect.innerHTML = '<option value="">--Select a Tag--</option>'; // reset

    try {
        const response = await fetch("/api/tags");
        const tags = await response.json();

        tags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag.id;
            option.textContent = tag.name;
            tagSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error loading tags:", err);
    }
}

// Render tasks
function renderTasks(tasks, showCompleted = false) {
    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        if (!showCompleted && task.completed) return;

        const item = document.createElement("li");
        item.addEventListener("dblclick", () => openEditModal(task));
        item.classList.add("task-item");

        // Tag label with color
        if (task.tag_name && task.tag_id) {
            const tag = document.createElement("span");
            tag.textContent = task.tag_name;
            tag.style.backgroundColor = task.tag_color;
            tag.style.color = getContrastYIQ(task.tag_color || "#888");
            tag.classList.add("task-tag", `tag-${task.tag_id}`);
            item.appendChild(tag);
        }

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

                // Highlight the task if overdue
                const now = new Date();
                if (dueDate < now && !task.completed) {
                    due.classList.add("overdue");
                }

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
                loadTasks(currentShowCompleted);
            } catch (err) {
                console.error("Error toggling task completion:", err);
            }
        });
        item.appendChild(checkbox);

        list.appendChild(item);
    });
}

// Setup modal and buttons
function setupButtons() {
    const addBtn = document.getElementById("addHabitBtn");
    const modal = document.getElementById("addHabitModal");
    const closeModal = document.getElementById("closeModal");
    const form = document.getElementById("addHabitForm");

    addBtn.addEventListener("click", async () => {
        modal.style.display = "block";
        await loadTags();
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            description: formData.get("description") || null,
            completed: false
        };

        const tagId = formData.get("tag_id");
        if (tagId) data.tag_id = parseInt(tagId, 10);

        const dueDate = formData.get("due_date");
        if (dueDate) data.due_date = dueDate;

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
}

async function loadEditModalHTML() {
    const resp = await fetch("/static/modals/editTaskModal.html");
    const html = await resp.text();

    // Insert modal HTML at the end of the body
    document.body.insertAdjacentHTML("beforeend", html);
}

async function openEditModal(task) {
    const modal = document.getElementById("editHabitModal");

    // Load tag options
    const tagSelect = document.getElementById("editTagSelect");
    tagSelect.innerHTML = '<option value="">--Select a Tag--</option>';

    const tagResp = await fetch("/api/tags");
    const tags = await tagResp.json();
    tags.forEach(tag => {
        const opt = document.createElement("option");
        opt.value = tag.id;
        opt.textContent = tag.name;
        tagSelect.appendChild(opt);
    });

    // Fill fields
    document.getElementById("editTaskId").value = task.id;
    document.getElementById("editName").value = task.name;
    document.getElementById("editDescription").value = task.description || "";
    document.getElementById("editTagSelect").value = task.tag_id || "";
    document.getElementById("editDueDate").value = task.due_date || "";

    modal.style.display = "block";
}

function setupEditModal() {
    const modal = document.getElementById("editHabitModal");
    const closeBtn = document.getElementById("closeEditModal");
    const form = document.getElementById("editHabitForm");

    closeBtn.addEventListener("click", () => modal.style.display = "none");

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const id = formData.get("id");

        const data = {
            name: formData.get("name"),
            description: formData.get("description") || null,
            tag_id: formData.get("tag_id") ? parseInt(formData.get("tag_id")) : null,
            due_date: formData.get("due_date") || null
        };

        try {
            const resp = await fetch(`/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!resp.ok) {
                console.error(await resp.text());
                return;
            }

            modal.style.display = "none";
            loadTasks();

        } catch (err) {
            console.error("Failed to update task:", err);
        }
    });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", async() => {
    loadTagsForFilter();
    setupFilters();
    setupButtons();
    await loadEditModalHTML();
    setupEditModal();
    loadTasks();
});
