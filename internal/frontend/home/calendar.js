let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const dayContainer = document.querySelector(".calendar-dates");
const currDate = document.querySelector(".calendar-current-date");
const navIcons = document.querySelectorAll(".calendar-navigation span");

let tasksByDate = {}; // Store tasks grouped by yyyy-mm-dd

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Load tasks from API
async function loadTasks() {
    try {
        const res = await fetch("/api/tasks");
        const tasks = await res.json();

        tasksByDate = {}; // reset

        tasks.forEach(t => {
            if (!t.due_date) return;

            const key = normalizeDate(t.due_date);
            if (!tasksByDate[key]) tasksByDate[key] = [];
            tasksByDate[key].push(t);
        });

    } catch (e) {
        console.error("Error loading tasks:", e);
    }
}

function normalizeDate(d) {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(d)) {
        const [day, month, year] = d.split(".");
        return `${year}-${month}-${day}`;
    }
    return d.split("T")[0];
}

// Render calendar
async function updateCalendar() {
    await loadTasks();

    let firstDay = new Date(year, month, 1).getDay();
    let lastDate = new Date(year, month + 1, 0).getDate();
    let lastDayOfWeek = new Date(year, month, lastDate).getDay();
    let prevMonthLastDate = new Date(year, month, 0).getDate();

    let html = "";

    // Previous month days
    for (let i = firstDay; i > 0; i--) {
        html += `<li class="inactive">${prevMonthLastDate - i + 1}</li>`;
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
        const hasTasks = tasksByDate[dateStr] ? "highlight" : "";

        const isToday = (i === new Date().getDate() &&
                         month === new Date().getMonth() &&
                         year === new Date().getFullYear()) ? "active" : "";

        html += `<li class="${isToday} ${hasTasks}" data-date="${dateStr}">${i}</li>`;
    }

    // Next month days
    for (let i = lastDayOfWeek; i < 6; i++) {
        html += `<li class="inactive">${i - lastDayOfWeek + 1}</li>`;
    }

    currDate.textContent = `${months[month]} ${year}`;
    dayContainer.innerHTML = html;

    addDayClickListeners();
}

function addDayClickListeners() {
    const dayElements = dayContainer.querySelectorAll("li:not(.inactive)");

    dayElements.forEach(li => {
        li.addEventListener("click", () => {
            const dateStr = li.getAttribute("data-date");
            showTasksForDay(dateStr);
        });
    });
}

// Show tasks in the side panel
function showTasksForDay(dateStr) {
    const tasksTitle = document.getElementById("tasksTitle");
    const tasksList = document.getElementById("tasksList");

    tasksTitle.textContent = `Tasks for ${dateStr}`;
    tasksList.innerHTML = "";

    const tasks = tasksByDate[dateStr] || [];

    if (tasks.length === 0) {
        tasksList.innerHTML = "<li>No tasks for this day.</li>";
    } else {
        tasks.forEach(t => {
            const li = document.createElement("li");

            const name = document.createElement("strong");
            name.textContent = t.name;
            li.appendChild(name);

            if (t.description) {
                const desc = document.createElement("p");
                desc.textContent = t.description;
                desc.style.margin = "2px 0 0 0";
                desc.style.fontSize = "0.9em";
                desc.style.color = "#ddd"; // light color for description
                li.appendChild(desc);
            }

            tasksList.appendChild(li);
        });
    }
}

// Month navigation
navIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        if (month < 0) {
            month = 11;
            year -= 1;
        } else if (month > 11) {
            month = 0;
            year += 1;
        }

        updateCalendar();
    });
});

// Initial load
document.addEventListener("DOMContentLoaded", updateCalendar);