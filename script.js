// Firebase is loaded via compat CDN scripts in HTML

// Firebase Configuration (Replace with actual config)
const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY", // Will be automatically inferred or securely supplied by client SDK
    authDomain: "buildyourprojects-f3983.firebaseapp.com",
    projectId: "buildyourprojects-f3983",
    storageBucket: "buildyourprojects-f3983.appspot.com",
    messagingSenderId: "702758316685",
    appId: "1:702758316685:web:placeholder_app_id"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// UroPay Configuration
const uropayConfig = {
    apiKey: "QG9VLZUVG367GRANJTYN2LERQ1UC44ZP", // Replace with your Live API Key from UroPay dashboard
    environment: "LIVE", // LIVE or TEST
    // Map course titles to specific UroPay Button IDs
    buttons: {
        "Python-to-Placement: The 30-Day Logic Sprint": "TANGO666629",
        "AI-Powered Developer: 10x Productivity with Advanced Prompting": "PAPA633452",
        "Build-a-Bot: Practical Generative AI for Engineers": "ECHO694626",
        "Smart-Systems Masterclass: From ESP32 to Robotics": "YANKEE726483"
    },
    // Fallback/Universal payment link if button ID is not set
    defaultPaymentLink: "https://app.uropay.me/pay/your-payment-link"
};

// Data
let projects = [
    { title: "AI Vision Autonomous Rover", tags: ["Raspberry Pi", "AI", "Computer Vision", "Autonomous", "Robotics"], description: "A high-performance Raspberry Pi-powered robot utilizing OpenCV and deep learning for real-time lane detection and autonomous navigation.", price: "Starting from ₹16,500.", images: ["images/pro11.jpg"], isFeatured: true },
    { title: "IoT Battery Manager (ESP32)", tags: ["ESP32", "IoT", "Battery Management", "Dashboard", "Sensors"], description: "A professional-grade battery monitoring system tracking critical parameters like voltage, current, and temperature with a cloud-integrated dashboard.", price: "Starting from ₹16,500.", images: ["images/pro21.jpg"], isFeatured: true },
    { title: "ML Battery Fault Detector", tags: ["ESP32", "Machine Learning", "ML", "Fault Detection", "AI"], description: "An intelligent diagnostic device leveraging TinyML on ESP32 to predict battery failures and anomalies using pattern recognition.", price: "Contact for a detailed quote.", images: ["images/pro31.jpg"], isFeatured: false },
    { title: "Real-Time Data Dashboard", tags: ["Raspberry Pi", "Dashboard", "Data Visualization", "IoT", "Web"], description: "A full-stack monitoring solution featuring a low-latency web dashboard utilizing WebSockets for streaming sensor data.", price: "Starting from ₹18,000.", images: ["images/pro41.jpg", "images/pro42.jpg"], isFeatured: true },
    { title: "Age-GAN Image Generator", tags: ["AI", "Deep Learning", "GAN", "Cybersecurity", "Python"], description: "An advanced deep learning project utilizing Generative Adversarial Networks (GANs) to synthesize realistic human face images for specific age groups.", price: "Contact for pricing.", images: ["images/pro51.jpg"], isFeatured: false },
    { title: "Smart Railway Dustbin (IoT)", tags: ["ESP32", "Flask", "IoT", "Automation", "Web Dashboard"], description: "An automated waste management system using ESP32 and a Flask backend for automatic wet/dry waste segregation.", price: "Starting from ₹15,800.", images: ["images/pro61.jpg", "images/pro62.jpg"], isFeatured: true },
    { title: "AI Waste Sorter Robot", tags: ["Raspberry Pi", "AI", "Computer Vision", "Robotics", "Automation"], description: "An industrial-style sorting system combining a Raspberry Pi and a conveyor belt using a CNN to categorize waste materials.", price: "Contact for custom hardware pricing.", images: ["images/pro71.jpg", "images/pro72.jpg"], isFeatured: false },
    { title: "Autonomous Person-Following Drone", tags: ["Drone", "AI", "Tracking", "GPS", "Autonomous"], description: "A sophisticated UAV project featuring AI-based human tracking using computer vision and PID control loops.", price: "High-end project. Contact for quote.", images: ["images/pro81.jpg"], isFeatured: false },
    { title: "Agri-Tech IoT Rover", tags: ["ESP32", "IoT", "Agriculture", "ML", "Automation"], description: "A smart agricultural vehicle equipped with NPK and soil moisture sensors using ML to analyze soil health.", price: "Starting from ₹17,500.", images: ["images/pro91.jpg"], isFeatured: false },
    { title: "AI Robotic Arm (Pick & Place)", tags: ["Raspberry Pi", "Robotic Arm", "AI", "ML", "Pick and Place"], description: "A 4-DOF precision robotic arm powered by Raspberry Pi, using OpenCV for color and shape detection.", price: "Contact for a custom quote.", images: ["images/pro101.jpg"], isFeatured: false },
    { title: "Lidar Autonomous Wheelchair", tags: ["Lidar", "Autonomous", "Safety", "Healthcare", "Robotics"], description: "A medical-grade navigation system utilizing Lidar for SLAM (Simultaneous Localization and Mapping) to ensure safe movement.", price: "High-end project. Contact for quote.", images: ["images/pro111.jpg"], isFeatured: false },
    { title: "Lidar Surveillance Bot", tags: ["Lidar", "Surveillance", "Autonomous", "Robotics", "IoT"], description: "An autonomous security robot that uses Lidar for 2D/3D environment mapping and patrolling.", price: "Contact for detailed quote.", images: ["images/pro121.jpg"], isFeatured: false },
    { title: "Radar Surveillance Rover", tags: ["Radar", "Surveillance", "Manual Control", "Robotics", "IoT"], description: "A specialized surveillance vehicle featuring 360° radar detection for remote spatial awareness.", price: "Starting from ₹15,200.", images: ["images/pro131.jpg"], isFeatured: false }
];

let courses = [
    {
        title: "Python-to-Placement: The 30-Day Logic Sprint",
        tags: ["Placement", "Python", "Logic Building"],
        description: "Master the language of the AI era by focusing on career-critical skills. This track skips abstract theory to focus on solving high-frequency coding rounds. You will build logic for placement exams and automate real-world engineering tasks through daily hands-on practice.",
        price: 899,
        startDate: "Immediate",
        images: ["images/course 1.png"],
        syllabus: `<div class="course-track-details" style="padding: 12px 0; text-align: left;">
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-clock"></i> Duration</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">7–12 Hours of Training + Daily Logic Challenges.</p>
            </div>
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-laptop-code"></i> The Practice Portal</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">Daily problems focused on Data Structures, Algorithms, and Logic Building specifically curated from past TCS NQT, Infosys, and Zoho technical rounds.</p>
            </div>
            <div class="capstone-box" style="margin-top: 16px; background-color: var(--bg-white); border-left: 4px solid var(--primary-color); padding: 12px;">
                <strong>Outcome:</strong> Build solid placement logic and automate real-world engineering tasks.
            </div>
        </div>`,
        isFeatured: true
    },
    {
        title: "AI-Powered Developer: 10x Productivity with Advanced Prompting",
        tags: ["AI", "Prompting", "Productivity"],
        description: "Stop \"chatting\" and start \"engineering\". This course teaches you to leverage advanced prompting and context engineering to code, debug, and document complex projects with professional speed. Transform from a standard student into a high-efficiency developer using AI as a professional multiplier.",
        price: 499,
        startDate: "Immediate",
        images: ["images/course 2.png"],
        syllabus: `<div class="course-track-details" style="padding: 12px 0; text-align: left;">
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-clock"></i> Duration</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">7–12 Hours of Training + Daily Workflow Tasks.</p>
            </div>
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-laptop-code"></i> The Practice Portal</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">Daily \"Refactor this Code\" or \"Debug this Script\" challenges using AI tools like GitHub Copilot or Cursor to prove students can work 10x faster.</p>
            </div>
            <div class="capstone-box" style="margin-top: 16px; background-color: var(--bg-white); border-left: 4px solid var(--primary-color); padding: 12px;">
                <strong>Outcome:</strong> Code, debug, and ship applications at 10x professional developer speed.
            </div>
        </div>`,
        isFeatured: true
    },
    {
        title: "Build-a-Bot: Practical Generative AI for Engineers",
        tags: ["Generative AI", "LLM APIs", "Agents"],
        description: "A hands-on dive into Gen-AI without intimidating math. Focus on building functional tools, from AI-powered PDF readers to autonomous digital agents. Learn to integrate LLM APIs into applications, moving from simple prompting to full-scale AI orchestration.",
        price: 999,
        startDate: "Immediate",
        images: ["images/course 3.png"],
        syllabus: `<div class="course-track-details" style="padding: 12px 0; text-align: left;">
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-clock"></i> Duration</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">7–12 Hours of Training + Daily API Integration Tasks.</p>
            </div>
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-laptop-code"></i> The Practice Portal</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">Daily mini-tasks to build specific \"micro-tools,\" such as an automated email drafter or a local document searcher using LLM APIs.</p>
            </div>
            <div class="capstone-box" style="margin-top: 16px; background-color: var(--bg-white); border-left: 4px solid var(--primary-color); padding: 12px;">
                <strong>Outcome:</strong> Build and integrate autonomous AI agents and intelligent micro-tools.
            </div>
        </div>`,
        isFeatured: true
    },
    {
        title: "Smart-Systems Masterclass: From ESP32 to Robotics",
        tags: ["ESP32", "Robotics", "ROS 2", "IoT"],
        description: "Master the bridge between the digital and physical worlds. This course takes you from basic ESP32 sensor integration to building autonomous mobile robots. Gain practical experience in hardware-to-cloud communication, BLE/Wi-Fi integration, and ROS 2 fundamentals for India's surging robotics sector.",
        price: 1299,
        startDate: "Immediate",
        images: ["images/course 4.png"],
        syllabus: `<div class="course-track-details" style="padding: 12px 0; text-align: left;">
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-clock"></i> Duration</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">7–12 Hours of Training + Daily Simulation/Hardware Coding.</p>
            </div>
            <div style="margin-bottom: 16px;">
                <h4 style="color: var(--primary-color); margin-bottom: 4px; font-size: 1.05rem;"><i class="fas fa-laptop-code"></i> The Practice Portal</h4>
                <p style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">Daily coding challenges for ESP32 peripheral control (e.g., \"Write a non-blocking code to read NPK sensors\") or ROS 2 command-line tasks.</p>
            </div>
            <div class="capstone-box" style="margin-top: 16px; background-color: var(--bg-white); border-left: 4px solid var(--primary-color); padding: 12px;">
                <strong>Outcome:</strong> Master sensor integration, wireless IoT bridging, and autonomous ROS 2 robotics.
            </div>
        </div>`,
        isFeatured: true
    }
];

async function loadDataFromFirestore() {
    try {
        const projSnapshot = await db.collection("projects").get();
        if (!projSnapshot.empty) {
            projects = projSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        const courseSnapshot = await db.collection("courses").get();
        if (!courseSnapshot.empty) {
            courses = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    } catch (e) {
        console.warn("Firestore data load failed, using hardcoded data.", e);
    }
}

// Utility functions
const pastelColors = ['#FFE5E5', '#E5FFEA', '#E5F0FF', '#FFF3E5', '#F5E5FF', '#E5FFFF', '#FFFFE5'];

function getInitials(title) {
    const words = title.split(' ');
    let initials = '';
    for (let i = 0; i < Math.min(2, words.length); i++) {
        if (words[i].length > 0 && words[i][0].match(/[A-Za-z0-9]/)) {
            initials += words[i][0].toUpperCase();
        }
    }
    return initials;
}

// Rendering components
function renderCards(data, containerId, type = "project") {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = '';

    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'project-card glass-card';
        const color = pastelColors[index % pastelColors.length];
        const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        let imageHtml = '';
        if (type === "project") {
            const initials = getInitials(item.title);
            if (item.images && item.images.length > 0) {
                imageHtml = `<div class="project-slider"><img src="${item.images[0]}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;"></div>`;
            } else {
                imageHtml = `<div class="project-image-placeholder" style="background-color: ${color}">${initials}</div>`;
            }
        } else {
            // For courses
            const iconMap = {
                "Python-to-Placement: The 30-Day Logic Sprint": "fab fa-python",
                "AI-Powered Developer: 10x Productivity with Advanced Prompting": "fas fa-bolt",
                "Build-a-Bot: Practical Generative AI for Engineers": "fas fa-robot",
                "Smart-Systems Masterclass: From ESP32 to Robotics": "fas fa-microchip"
            };
            const icon = iconMap[item.title] || "fas fa-laptop-code";
            if (item.images && item.images.length > 0) {
                const fallbackHtml = `<div class="project-image-placeholder" style="background-color: ${color}; color: var(--primary-color);"><i class="${icon}"></i></div>`;
                imageHtml = `<div class="project-slider"><img src="${item.images[0]}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.parentElement.outerHTML=\`${fallbackHtml}\`"></div>`;
            } else {
                imageHtml = `<div class="project-image-placeholder" style="background-color: ${color}; color: var(--primary-color);"><i class="${icon}"></i></div>`;
            }
        }

        let actionHtml = '';
        if (type === "project") {
            const phoneNumber = '919447452039';
            const message = `Hi! I'm interested in the ${item.title}. Can you share more details?`;
            const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            actionHtml = `
                <p class="project-pricing">${typeof item.price === 'number' ? `₹${item.price}` : item.price}</p>
                <a href="${waUrl}" target="_blank" class="btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> I'm Interested
                </a>
            `;
        } else if (type === "course") {
            actionHtml = `
                <p class="project-pricing">₹${item.price}</p>
                <button class="btn-primary enroll-btn" data-title="${item.title}" data-price="${item.price}" style="width: 100%; margin-top: 16px;">
                    Enroll Now
                </button>
            `;
        }

        card.innerHTML = `
            ${imageHtml}
            <div class="project-content">
                <h3 class="project-title">${item.title}</h3>
                <div class="project-tags">${tagsHtml}</div>
                <p class="project-desc">${item.description}</p>
            </div>
            <div class="project-card-footer">
                ${actionHtml}
            </div>
        `;
        grid.appendChild(card);
    });

    if (type === "course") {
        document.querySelectorAll('.enroll-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.getAttribute('data-title');
                const price = e.target.getAttribute('data-price');
                openEnrollmentModal(title, price);
            });
        });
    }
}

// Page Specific Logic
document.addEventListener('DOMContentLoaded', async () => {
    const pageId = document.body.id;

    // Always try to load data from Firestore first
    await loadDataFromFirestore();

    if (pageId === 'landing-page') {
        const featuredProjects = projects.filter(p => p.isFeatured).slice(0, 4);
        renderCards(featuredProjects, 'featured-projects-grid', 'project');

        const featuredCourses = courses.filter(c => c.isFeatured).slice(0, 4);
        renderCards(featuredCourses, 'featured-courses-grid', 'course');

        initRotatingText();
    }
    else if (pageId === 'projects-page') {
        renderCards(projects, 'projects-grid', 'project');
        document.getElementById('projects-counter').textContent = `Showing ${projects.length} projects`;

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = projects.filter(p =>
                    p.title.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term) ||
                    p.tags.some(t => t.toLowerCase().includes(term))
                );
                renderCards(filtered, 'projects-grid', 'project');
                document.getElementById('projects-counter').textContent = `Showing ${filtered.length} projects`;

                const noResults = document.getElementById('no-results');
                if (filtered.length === 0) {
                    noResults.classList.remove('hidden');
                    document.getElementById('projects-grid').style.display = 'none';
                } else {
                    noResults.classList.add('hidden');
                    document.getElementById('projects-grid').style.display = 'grid';
                }
            });
        }
    }
    else if (pageId === 'courses-page') {
        renderCards(courses, 'courses-grid', 'course');
        initEnrollmentModal();

        // Check if redirected to open enrollment modal
        const urlParams = new URLSearchParams(window.location.search);
        const enrollTitle = urlParams.get('enroll');
        if (enrollTitle) {
            const targetCourse = courses.find(c => c.title === enrollTitle);
            if (targetCourse) {
                openEnrollmentModal(targetCourse.title, targetCourse.price);
            }
        }
    }

    // Check for UroPay success redirect URL globally
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' || urlParams.get('status') === 'success' || window.location.href.includes('thank-you')) {
        const successScreen = document.getElementById('success-screen');
        const modal = document.getElementById('enrollment-modal');
        if (successScreen && modal) {
            modal.classList.remove('hidden');
            document.getElementById('course-details-section')?.classList.add('hidden');
            document.getElementById('enrollment-form-container')?.classList.add('hidden');
            successScreen.classList.remove('hidden');
        }
    }

    // Bubble cursor effect
    initBubbleCursor();
});

// Modal Logic
function openEnrollmentModal(title, price) {
    const modal = document.getElementById('enrollment-modal');
    if (!modal) {
        // Redirect to courses page if clicked from homepage
        window.location.href = `courses.html?enroll=${encodeURIComponent(title)}`;
        return;
    }
    const course = courses.find(c => c.title === title);

    document.getElementById('modal-course-title').textContent = title;

    if (course) {
        document.getElementById('modal-course-date').textContent = `Starts on: ${course.startDate}`;
        document.getElementById('course-syllabus-container').innerHTML = course.syllabus;
        document.getElementById('course-details-section').classList.remove('hidden');
        document.getElementById('modal-course-date').style.display = 'block';
        document.getElementById('modal-subtitle-text').style.display = 'block';
    } else {
        document.getElementById('course-details-section').classList.add('hidden');
        document.getElementById('modal-course-date').style.display = 'none';
        document.getElementById('modal-subtitle-text').style.display = 'none';
    }

    document.getElementById('pay-amount').textContent = `- ₹${price}`;
    document.getElementById('selected-course-name').value = title;
    document.getElementById('selected-course-price').value = price;

    document.getElementById('success-screen').classList.add('hidden');
    document.getElementById('enrollment-form-container').classList.add('hidden');

    document.getElementById('enrollment-modal').classList.remove('hidden');
}

function initEnrollmentModal() {
    const modal = document.getElementById('enrollment-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('enrollment-form');
    const showFormBtn = document.getElementById('show-form-btn');

    showFormBtn.addEventListener('click', () => {
        document.getElementById('course-details-section').classList.add('hidden');
        document.getElementById('enrollment-form-container').classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const college = document.getElementById('college').value;
        const branch = document.getElementById('branch').value;
        const courseName = document.getElementById('selected-course-name').value;
        const amount = parseInt(document.getElementById('selected-course-price').value);

        const payBtn = document.getElementById('pay-btn');
        const originalBtnText = payBtn.innerHTML;
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        payBtn.disabled = true;

        // Ensure success screen is strictly hidden until actual payment confirmation redirect occurs
        document.getElementById('success-screen')?.classList.add('hidden');

        try {
            // Render the Secure UPI Checkout interface instantly for optimal UI responsiveness
            const formContainer = document.getElementById('enrollment-form-container');
            const uropayBtnId = uropayConfig.buttons[courseName] || "default_button_id";

            // Execute Firestore Record creation asynchronously in the background without blocking the UI
            db.collection("course_registrations").add({
                name, email, phone, college, branch, courseName,
                paymentStatus: "pending",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => console.warn("Firestore logging deferred:", err));

            // Display Secure UPI Payment via UroPay immediately
            formContainer.innerHTML = `
                <div style="text-align: center; padding: 24px 16px; background: #ffffff; border-radius: 18px; border: 1px solid #eaeaea; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
                    <i class="fas fa-shield-check" style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 16px; display: block;"></i>
                    <h3 style="margin-bottom: 6px; font-size: 1.3rem; font-weight: 700; color: var(--text-primary);">Secure UPI Checkout</h3>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.5;">
                        Complete your payment of <strong style="color: var(--text-primary);">₹${amount}</strong> seamlessly via any supported UPI application.
                    </p>
                    
                    <!-- UroPay Embedded Button / Link -->
                    <div style="margin-bottom: 24px;">
                        <a href="${uropayConfig.defaultPaymentLink}" target="_blank" class="uropay-btn btn-primary btn-large" 
                           data-uropay-api-key="${uropayConfig.apiKey}" 
                           data-uropay-button-id="${uropayBtnId}" 
                           data-uropay-environment="${uropayConfig.environment}" 
                           data-uropay-amount="${amount}"
                           style="display: block; width: 100%; text-decoration: none; font-weight: 600; font-family: 'Inter', sans-serif; letter-spacing: -0.3px; border-radius: 14px; box-shadow: 0 4px 12px rgba(37,99,235,0.15);">
                           Pay Now (₹${amount})
                        </a>
                    </div>

                    <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                        <i class="fas fa-circle-notch fa-spin" style="color: var(--primary-color); font-size: 0.9rem;"></i>
                        <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">Awaiting authorization...</span>
                    </div>
                    <p style="font-size: 0.8rem; color: #9CA3AF; line-height: 1.4; margin: 0;">
                        Securely redirected automatically upon successful completion.
                    </p>
                </div>
            `;

            // Trigger UroPay embed script scan if present on page
            if (window.uropayEmbed && typeof window.uropayEmbed.init === 'function') {
                window.uropayEmbed.init();
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
            payBtn.innerHTML = originalBtnText;
            payBtn.disabled = false;
        }
    });
}

// Visual Effects
function initRotatingText() {
    const words = ["Electronics", "IoT", "Software", "AI", "ML"];
    let wordIndex = 0;
    const rotatingTextEl = document.getElementById('rotating-text');
    const wrapper = document.querySelector('.rotating-text-wrapper');

    if (rotatingTextEl && wrapper) {
        wrapper.style.width = `${rotatingTextEl.offsetWidth}px`;
        setInterval(() => {
            rotatingTextEl.style.opacity = 0;
            rotatingTextEl.style.transform = 'translateY(10px)';
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                rotatingTextEl.textContent = words[wordIndex];
                rotatingTextEl.style.transform = 'translateY(-10px)';
                wrapper.style.width = `${rotatingTextEl.offsetWidth}px`;
                requestAnimationFrame(() => {
                    rotatingTextEl.style.opacity = 1;
                    rotatingTextEl.style.transform = 'translateY(0)';
                });
            }, 300);
        }, 2500);
    }
}

function initBubbleCursor() {
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) {
            const bubble = document.createElement('div');
            bubble.className = 'cursor-bubble';
            bubble.style.left = `${e.clientX}px`;
            bubble.style.top = `${e.clientY}px`;
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 1200);
        }
    });
}