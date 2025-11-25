async function loadTags() {
    try {
        const response = await fetch("/api/tags");
        const tags = await response.json();
        renderTags(tags);
    } catch (error) {
        console.error("Error loading tags:", error);
    }
}

// Load all tags and render them
function renderTags(tags) {
    const list = document.getElementById("tagList");
    list.innerHTML = "";

    tags.forEach(tag => {
    const item = document.createElement("li");
    item.classList.add("tag-item"); 
    // Tag name
    const name = document.createElement("span");
    name.classList.add("tag-name");
    name.textContent = tag.name;
    item.appendChild(name);
    // Delete button
    const del = document.createElement("button");
    del.classList.add("delete-tag-btn");
    del.textContent = "Delete";
    del.addEventListener("click", async () => {
        if (!confirm("Delete this tag?")) return;
        try {
            await fetch(`/api/tags/${tag.id}`, { method: "DELETE" });
            loadTags();
        } catch (err) {
            console.error("Error deleting tag:", err);
        }
    });        item.appendChild(del);        list.appendChild(item);
    });
}

// Modal logic for creating a tag
function setupTagButtons() {
    const addBtn = document.getElementById("addTagBtn");
    const modal = document.getElementById("addTagModal");
    const closeModal = document.getElementById("closeTagModal");
    const form = document.getElementById("addTagForm");

    addBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        const data = {
            name: formData.get("name")
        };

        try {
            const res = await fetch("/api/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                modal.style.display = "none";
                form.reset();
                loadTags();
            } else {
                console.error("Failed to create tag:", await res.text());
            }
        } catch (err) {
            console.error("Error creating tag:", err);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadTags();
    setupTagButtons();
});