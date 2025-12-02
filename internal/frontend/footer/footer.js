async function loadFooter() {
    const container = document.getElementById("footerContainer");
    try {
        const response = await fetch("/static/footer/footer.html");
        const html = await response.text();
        container.innerHTML = html;
    } catch (err) {
        console.error("Failed to load footer:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadFooter();
});