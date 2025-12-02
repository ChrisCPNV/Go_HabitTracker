let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

const dayContainer = document.querySelector(".calendar-dates");
const currDate = document.querySelector(".calendar-current-date");
const navIcons = document.querySelectorAll(".calendar-navigation span");

let tasksByDate = {}; // { "yyyy-mm-dd": [...] }
let selectedDate = null; // Currently selected day in calendar
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ---------------- Utility ----------------
function normalizeDate(d) {
    if (d.includes("T")) d = d.split("T")[0];
    if (d.includes(".")) {
        const [day, month, year] = d.split(".");
        return `${year}-${month.padStart(2,"0")}-${day.padStart(2,"0")}`;
    }
    const [y,m,day] = d.split("-");
    return `${y}-${m.padStart(2,"0")}-${day.padStart(2,"0")}`;
}

function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#","");
    const r=parseInt(hexcolor.substr(0,2),16);
    const g=parseInt(hexcolor.substr(2,2),16);
    const b=parseInt(hexcolor.substr(4,2),16);
    const yiq=((r*299)+(g*587)+(b*114))/1000;
    return (yiq>=128)?"#000":"#fff";
}

// ---------------- Load tasks ----------------
async function loadTasks() {
    try {
        const res = await fetch("/api/tasks");
        const tasks = await res.json();
        tasksByDate = {};
        tasks.forEach(t => {
            if (!t.due_date) return;
            const key = normalizeDate(t.due_date);
            if (!tasksByDate[key]) tasksByDate[key] = [];
            tasksByDate[key].push(t);
        });
    } catch (e) {
        console.error("Failed to load tasks:", e);
    }
}

// ---------------- Render calendar ----------------
function renderCalendar() {
    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    let html = "";

    // Previous month
    for (let i = 0; i < firstDay; i++) {
        const day = prevMonthDays - (firstDay - 1) + i;
        html += `<li class="inactive">${day}</li>`;
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        let classes = tasksByDate[dateStr] ? "highlight" : "";
        const now = new Date();
        if (now.getFullYear() === currentYear && now.getMonth() === currentMonth && now.getDate() === d) classes += " active";
        html += `<li class="${classes.trim()}" data-date="${dateStr}">${d}</li>`;
    }

    // Next month filler
    const totalCells = html.split("<li").length - 1;
    const nextFill = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= nextFill; i++) html += `<li class="inactive">${i}</li>`;

    currDate.textContent = `${months[currentMonth]} ${currentYear}`;
    dayContainer.innerHTML = html;

    addDayClickListeners();
}

// ---------------- Day click ----------------
function addDayClickListeners() {
    const days = dayContainer.querySelectorAll("li[data-date]");
    days.forEach(li => {
        li.addEventListener("click", () => {
            selectedDate = li.getAttribute("data-date");
            showTasksForDay(selectedDate);
            generateDayView(selectedDate);
        });
    });
}

// ---------------- Show tasks for a day ----------------
function showTasksForDay(dateStr) {
    const tasksTitle = document.getElementById("tasksTitle");
    const tasksList = document.getElementById("tasksList");
    tasksTitle.textContent = `Tasks for ${dateStr}`;
    tasksList.innerHTML = "";

    const tasks = tasksByDate[dateStr] || [];
    if (tasks.length === 0) {
        tasksList.innerHTML = "<li>No tasks for this day.</li>";
        return;
    }

    tasks.forEach(t => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";

        const name = document.createElement("strong");
        name.textContent = t.name;
        li.appendChild(name);

        if (t.tag_name && t.tag_color) {
            const tag = document.createElement("span");
            tag.textContent = t.tag_name;
            tag.style.backgroundColor = t.tag_color;
            tag.style.color = getContrastYIQ(t.tag_color||"#888");
            tag.style.padding = "2px 6px";
            tag.style.borderRadius = "4px";
            tag.style.fontSize = "0.85em";
            tag.style.marginLeft = "8px";
            li.appendChild(tag);
        }

        if (t.description) {
            const desc = document.createElement("p");
            desc.classList.add("task-desc");
            desc.textContent = t.description;
            li.appendChild(desc);
        }

        li.addEventListener("dblclick", () => openEditModal(t));
        tasksList.appendChild(li);
    });
}

// ---------------- Day View ----------------
function generateDayView(dateStr = null, hoursBefore = 3, hoursAfter = 3) {
    const dayView = document.getElementById("dayView");
    const dayViewTitle = document.getElementById("dayViewTitle");

    // Default to today
    const date = dateStr ? new Date(dateStr) : new Date();
    const displayDate = date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

    // Update title
    dayViewTitle.textContent = displayDate;

    // Clear previous content
    dayView.innerHTML = "";
    dayView.appendChild(dayViewTitle);

    // Determine current hour
    const now = new Date();
    const currentHour = date.toDateString() === now.toDateString() ? now.getHours() : 12; // default to midday for other days

    // Compute hour range
    const startHour = Math.max(0, currentHour - hoursBefore);
    const endHour = Math.min(23, currentHour + hoursAfter);

    // Get tasks for the day, grouped by hour
    const normalizedDate = normalizeDate(date.toISOString());
    const dayTasks = tasksByDate[normalizedDate] || [];
    const tasksByHour = {};
    dayTasks.forEach(t => {
        if (!t.due_time) return;
        const hour = parseInt(t.due_time.split(":")[0], 10);
        if (!tasksByHour[hour]) tasksByHour[hour] = [];
        tasksByHour[hour].push(t.name);
    });

    let currentHourElement = null;

    // Generate only the selected range of hours
    for (let h = startHour; h <= endHour; h++) {
        const hourDiv = document.createElement("div");
        hourDiv.className = "hour";

        const timeSpan = document.createElement("span");
        timeSpan.className = "time";
        timeSpan.textContent = `${String(h).padStart(2, "0")}:00`;

        const eventSpan = document.createElement("span");
        eventSpan.className = "event";
        eventSpan.textContent = tasksByHour[h] ? tasksByHour[h].join(", ") : "";

        // Highlight current hour
        if (h === now.getHours() && date.toDateString() === now.toDateString()) {
            hourDiv.style.background = "rgba(74,144,226,0.2)";
            hourDiv.style.fontWeight = "bold";
            currentHourElement = hourDiv;
        }

        hourDiv.appendChild(timeSpan);
        hourDiv.appendChild(eventSpan);
        dayView.appendChild(hourDiv);
    }

    // Smooth scroll so current hour is visible in the center
    if (currentHourElement) {
        const containerHeight = dayView.clientHeight;
        const hourTop = currentHourElement.offsetTop;
        const hourHeight = currentHourElement.offsetHeight;
        dayView.scrollTo({
            top: hourTop - containerHeight / 2 + hourHeight / 2,
            behavior: "smooth"
        });
    }
}
// ---------------- Edit modal ----------------
async function loadEditModalHTML() {
    const resp = await fetch("/static/modals/editTaskModal.html");
    const html = await resp.text();
    document.body.insertAdjacentHTML("beforeend", html);
}

async function openEditModal(task) {
    const modal = document.getElementById("editHabitModal");

    // Load tags
    const tagSelect = document.getElementById("editTagSelect");
    tagSelect.innerHTML = '<option value="">--Select a Tag--</option>';
    const tags = await (await fetch("/api/tags")).json();
    tags.forEach(tag => {
        const opt = document.createElement("option");
        opt.value = tag.id;
        opt.textContent = tag.name;
        tagSelect.appendChild(opt);
    });

    // Fill modal fields
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
    window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

    form.addEventListener("submit", async e => {
        e.preventDefault();
        const formData = new FormData(form);
        const id = formData.get("id");

        const data = {
            name: formData.get("name"),
            description: formData.get("description") || null,
            tag_id: formData.get("tag_id") ? parseInt(formData.get("tag_id")) : null,
            due_date: formData.get("due_date") || null,
            time: formData.get("time") || null
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

            // Update tasksByDate dynamically
            for (let date in tasksByDate) {
                tasksByDate[date] = tasksByDate[date].filter(t => t.id != id);
            }
            const newKey = normalizeDate(data.due_date);
            if (!tasksByDate[newKey]) tasksByDate[newKey] = [];
            tasksByDate[newKey].push({ id: parseInt(id), ...data });

            // Refresh calendar highlights
            updateCalendarHighlights();

            // Refresh task list and day view for selected date if applicable
            if (selectedDate === newKey || selectedDate === normalizeDate(data.due_date)) {
                showTasksForDay(selectedDate);
                generateDayView(selectedDate);
            }

            modal.style.display = "none";

        } catch (err) {
            console.error("Failed to update task:", err);
        }
    });
}

// ---------------- Calendar highlights ----------------
function updateCalendarHighlights() {
    const days = dayContainer.querySelectorAll("li[data-date]");
    days.forEach(li => {
        const dateStr = li.getAttribute("data-date");
        if (tasksByDate[dateStr] && tasksByDate[dateStr].length > 0) li.classList.add("highlight");
        else li.classList.remove("highlight");
    });
}

// ---------------- Navigation ----------------
navIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        currentMonth = icon.id === "calendar-prev" ? currentMonth - 1 : currentMonth + 1;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        else if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar();
    });
});

// ---------------- Init ----------------
document.addEventListener("DOMContentLoaded", async () => {
    await loadEditModalHTML();
    setupEditModal();
    await loadTasks();
    renderCalendar();
    generateDayView(); // Show today by default
});