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

            if (target === 'registrations') fetchRegistrations();
            if (target === 'manage-projects') renderAdminProjects();
            if (target === 'manage-courses') renderAdminCourses();
        });
    });

    // Initial Load
    fetchRegistrations();

    // Refresh Registrations
    document.getElementById('refresh-registrations').addEventListener('click', fetchRegistrations);

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

async function fetchRegistrations() {
    const tableBody = document.getElementById('registrations-table-body');
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;"><i class="fas fa-spinner fa-spin"></i> Fetching records...</td></tr>';

    try {
        const snapshot = await db.collection("course_registrations").orderBy("createdAt", "desc").get();
        if (snapshot.empty) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">No registrations found.</td></tr>';
            return;
        }

        tableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString() : 'N/A';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td><strong>${data.name}</strong></td>
                <td>${data.email}<br><small>${data.phone}</small></td>
                <td>${data.college}</td>
                <td><span class="tag">${data.courseName}</span></td>
                <td><span class="status-pill ${['verified', 'paid', 'completed_by_user'].includes(data.paymentStatus) ? 'status-verified' : 'status-pending'}">${data.paymentStatus || 'pending'}</span></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching registrations:", error);
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red; padding: 40px;">Error loading data. Make sure Firebase rules allow reading.</td></tr>';
    }
}

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

function renderAdminCourses() {
    const grid = document.getElementById('admin-courses-grid');
    grid.innerHTML = '';

    courses.forEach((course, index) => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        card.style.padding = '16px';
        card.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
                <div style="width: 50px; height: 50px; background: var(--primary-color); color: white; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
                    <i class="fas fa-book"></i>
                </div>
                <div>
                    <h4 style="margin: 0;">${course.title}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary); margin: 0;">₹${course.price}</p>
                </div>
            </div>
            <div class="admin-actions">
                <button class="btn-danger" onclick="deleteItem('courses', '${course.id || index}')"><i class="fas fa-trash"></i> Delete</button>
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
