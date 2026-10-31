// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.id !== 'admin-page') return;

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = document.querySelectorAll('.admin-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            contents.forEach(content => {
                if (content.id === `tab-${target}`) {
                    content.classList.remove('hidden');
                } else {
                    content.classList.add('hidden');
                }
            });

            if (target === 'manage-projects') renderAdminProjects();
        });
    });

    // Initial Load
    renderAdminProjects();

    // Modal Logic
    const projectModal = document.getElementById('project-modal');
    const addProjectBtn = document.getElementById('add-project-btn');
    const closeModals = document.querySelectorAll('.modal-close');

    addProjectBtn.addEventListener('click', () => projectModal.classList.remove('hidden'));
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.add('hidden');
        });
    });

    // Add Project Form
    document.getElementById('add-project-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('proj-title').value;
        const tags = document.getElementById('proj-tags').value.split(',').map(t => t.trim());
        const description = document.getElementById('proj-desc').value;
        const price = document.getElementById('proj-price').value;
        const image = document.getElementById('proj-image').value;

        try {
            await db.collection("projects").add({
                title, tags, description, price, images: [image],
                isFeatured: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert("Project added successfully!");
            projectModal.classList.add('hidden');
            location.reload(); // Refresh to show new data
        } catch (error) {
            console.error("Error adding project:", error);
            alert("Failed to add project. Check console.");
        }
    });
});

function renderAdminProjects() {
    const grid = document.getElementById('admin-projects-grid');
    grid.innerHTML = '';

    projects.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.padding = '16px';
        card.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
                <img src="${proj.images[0]}" onerror="this.src='https://via.placeholder.com/50'" style="width: 50px; height: 50px; border-radius: 4px; object-fit: cover;">
                <div>
                    <h4 style="margin: 0;">${proj.title}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">${proj.price}</p>
                </div>
            </div>
            <div class="admin-actions">
                <button class="btn-danger" onclick="deleteItem('projects', '${proj.id || index}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function deleteItem(collection, id) {
    if (!confirm("Are you sure you want to delete this?")) return;

    try {
        if (id.length > 5) { // Likely a Firestore ID
            await db.collection(collection).doc(id).delete();
            alert("Deleted successfully!");
            location.reload();
        } else {
            alert("This item is hardcoded in script.js and cannot be deleted via this panel. Please remove it from script.js manually.");
        }
    } catch (error) {
        console.error("Delete failed:", error);
        alert("Delete failed. Check console.");
    }
}

// Global scope for onclick
window.deleteItem = deleteItem;
