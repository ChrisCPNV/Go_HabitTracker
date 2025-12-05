async function loadHeader() {
    const container = document.getElementById("headerContainer");
    try {
        const response = await fetch("/static/navbar/header.html");
        const html = await response.text();
        container.innerHTML = html;

        // Now the header exists, attach the theme toggle listener
        const themeContainer = document.getElementById("themeContainer");
        themeContainer.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            applyTheme(current === "dark" ? "light" : "dark");
        });

        // Apply the saved or system theme after header is loaded
        initTheme();
    } catch (err) {
        console.error("Failed to load header:", err);
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
}

// Load saved theme OR follow system preference
function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) {
        applyTheme(saved);
    } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark ? "dark" : "light");
    }
}

// Initialize header and theme toggle
document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
});