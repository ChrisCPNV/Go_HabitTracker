async function loadHeader() {
    const container = document.getElementById("headerContainer");
    try {
        const response = await fetch("/static/header.html");
        const html = await response.text();
        container.innerHTML = html;
    } catch (err) {
        console.error("Failed to load header:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
});
