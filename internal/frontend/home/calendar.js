let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

const dayContainer = document.querySelector(".calendar-dates");
const currDate = document.querySelector(".calendar-current-date");
const navIcons = document.querySelectorAll(".calendar-navigation span");

let tasksByDate = {}; // { "yyyy-mm-dd": [...] }
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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
    } catch (e) { console.error(e); }
}

function normalizeDate(d) {
    // ISO date (2025-11-08 or 2025-11-8)
    if (d.includes("T")) d = d.split("T")[0];

    // Convert DD.MM.YYYY → YYYY-MM-DD
    if (d.includes(".")) {
        const [day, month, year] = d.split(".");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    // Convert YYYY-M-D → YYYY-MM-DD
    const [y, m, day] = d.split("-");
    return `${y}-${m.padStart(2, "0")}-${day.padStart(2, "0")}`;
}


// ---------------- Render calendar ----------------
async function updateCalendar() {
    await loadTasks();

    let firstDay = new Date(currentYear, currentMonth, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    let html = "";

    for (let i = 0; i < firstDay; i++) {
        const day = prevMonthDays - (firstDay - 1) + i;
        html += `<li class="inactive">${day}</li>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        let classes = "";

        if (tasksByDate[dateStr]) classes += " highlight";

        const today = new Date();
        if (
            today.getFullYear() === currentYear &&
            today.getMonth() === currentMonth &&
            today.getDate() === d
        ) {
            classes += " active";
        }

        html += `<li class="${classes.trim()}" data-date="${dateStr}">${d}</li>`;
    }

    const totalCells = html.split("<li").length - 1;
    const nextFill = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let i = 1; i <= nextFill; i++) {
        html += `<li class="inactive">${i}</li>`;
    }

    currDate.textContent = `${months[currentMonth]} ${currentYear}`;
    dayContainer.innerHTML = html;

    addDayClickListeners();
}


// ---------------- Day click ----------------
function addDayClickListeners(){
    const days = dayContainer.querySelectorAll("li[data-date]");
    days.forEach(li=>{
        li.addEventListener("click", ()=>{
            const dateStr = li.getAttribute("data-date");
            showTasksForDay(dateStr);
        });
    });
}

// ---------------- Show tasks ----------------
function showTasksForDay(dateStr){
    const tasksTitle = document.getElementById("tasksTitle");
    const tasksList = document.getElementById("tasksList");
    tasksTitle.textContent = `Tasks for ${dateStr}`;
    tasksList.innerHTML = "";
    const tasks = tasksByDate[dateStr] || [];
    if(tasks.length===0){ tasksList.innerHTML="<li>No tasks for this day.</li>"; return; }

    tasks.forEach(t=>{
        const li=document.createElement("li");
        const name=document.createElement("strong");
        name.textContent=t.name;
        li.appendChild(name);

        if(t.tag_name && t.tag_color){
            const tag=document.createElement("span");
            tag.textContent=t.tag_name;
            tag.style.backgroundColor=t.tag_color;
            tag.style.color=getContrastYIQ(t.tag_color||"#888");
            tag.style.padding="2px 6px";
            tag.style.borderRadius="4px";
            tag.style.fontSize="0.85em";
            tag.style.marginLeft="8px";
            li.appendChild(tag);
        }

        if(t.description){
            const desc=document.createElement("p");
            desc.textContent=t.description;
            desc.style.margin="2px 0 0 0";
            desc.style.fontSize="0.9em";
            desc.style.color="#555";
            li.appendChild(desc);
        }
        tasksList.appendChild(li);
    });
}

// ---------------- Utility ----------------
function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#","");
    const r=parseInt(hexcolor.substr(0,2),16);
    const g=parseInt(hexcolor.substr(2,2),16);
    const b=parseInt(hexcolor.substr(4,2),16);
    const yiq=((r*299)+(g*587)+(b*114))/1000;
    return (yiq>=128)?"#000":"#fff";
}

// ---------------- Navigation ----------------
navIcons.forEach(icon=>{
    icon.addEventListener("click", ()=>{
        currentMonth = icon.id==="calendar-prev"?currentMonth-1:currentMonth+1;
        if(currentMonth<0){currentMonth=11; currentYear--;}
        else if(currentMonth>11){currentMonth=0; currentYear++;}
        updateCalendar();
    });
});

// ---------------- Init ----------------
document.addEventListener("DOMContentLoaded", updateCalendar);