const projects = [
    { title: "AI Vision Autonomous Rover", tags: ["Raspberry Pi", "AI", "Computer Vision", "Autonomous", "Robotics"], description: "A high-performance Raspberry Pi-powered robot utilizing OpenCV and deep learning for real-time lane detection and autonomous navigation.", pricing: "Starting from ₹16,500.", images: ["images/pro11.jpg"] },
    { title: "IoT Battery Manager (ESP32)", tags: ["ESP32", "IoT", "Battery Management", "Dashboard", "Sensors"], description: "A professional-grade battery monitoring system tracking critical parameters like voltage, current, and temperature with a cloud-integrated dashboard.", pricing: "Starting from ₹16,500.", images: ["images/pro21.jpg"] },
    { title: "ML Battery Fault Detector", tags: ["ESP32", "Machine Learning", "ML", "Fault Detection", "AI"], description: "An intelligent diagnostic device leveraging TinyML on ESP32 to predict battery failures and anomalies using pattern recognition.", pricing: "Contact for a detailed quote.", images: ["images/pro31.jpg"] },
    { title: "Real-Time Data Dashboard", tags: ["Raspberry Pi", "Dashboard", "Data Visualization", "IoT", "Web"], description: "A full-stack monitoring solution featuring a low-latency web dashboard utilizing WebSockets for streaming sensor data.", pricing: "Starting from ₹18,000.", images: ["images/pro41.jpg", "images/pro42.jpg"] },
    { title: "Age-GAN Image Generator", tags: ["AI", "Deep Learning", "GAN", "Cybersecurity", "Python"], description: "An advanced deep learning project utilizing Generative Adversarial Networks (GANs) to synthesize realistic human face images for specific age groups.", pricing: "Contact for pricing.", images: ["images/pro51.jpg"] },
    { title: "Smart Railway Dustbin (IoT)", tags: ["ESP32", "Flask", "IoT", "Automation", "Web Dashboard"], description: "An automated waste management system using ESP32 and a Flask backend for automatic wet/dry waste segregation.", pricing: "Starting from ₹15,800.", images: ["images/pro61.jpg", "images/pro62.jpg"] },
    { title: "AI Waste Sorter Robot", tags: ["Raspberry Pi", "AI", "Computer Vision", "Robotics", "Automation"], description: "An industrial-style sorting system combining a Raspberry Pi and a conveyor belt using a CNN to categorize waste materials.", pricing: "Contact for custom hardware pricing.", images: ["images/pro71.jpg", "images/pro72.jpg"] },
    { title: "Autonomous Person-Following Drone", tags: ["Drone", "AI", "Tracking", "GPS", "Autonomous"], description: "A sophisticated UAV project featuring AI-based human tracking using computer vision and PID control loops.", pricing: "High-end project. Contact for quote.", images: ["images/pro81.jpg"] },
    { title: "Agri-Tech IoT Rover", tags: ["ESP32", "IoT", "Agriculture", "ML", "Automation"], description: "A smart agricultural vehicle equipped with NPK and soil moisture sensors using ML to analyze soil health.", pricing: "Starting from ₹17,500.", images: ["images/pro91.jpg"] },
    { title: "AI Robotic Arm (Pick & Place)", tags: ["Raspberry Pi", "Robotic Arm", "AI", "ML", "Pick and Place"], description: "A 4-DOF precision robotic arm powered by Raspberry Pi, using OpenCV for color and shape detection.", pricing: "Contact for a custom quote.", images: ["images/pro101.jpg"] },
    { title: "Lidar Autonomous Wheelchair", tags: ["Lidar", "Autonomous", "Safety", "Healthcare", "Robotics"], description: "A medical-grade navigation system utilizing Lidar for SLAM (Simultaneous Localization and Mapping) to ensure safe movement.", pricing: "High-end project. Contact for quote.", images: ["images/pro111.jpg"] },
    { title: "Lidar Surveillance Bot", tags: ["Lidar", "Surveillance", "Autonomous", "Robotics", "IoT"], description: "An autonomous security robot that uses Lidar for 2D/3D environment mapping and patrolling.", pricing: "Contact for detailed quote.", images: ["images/pro121.jpg"] },
    { title: "Radar Surveillance Rover", tags: ["Radar", "Surveillance", "Manual Control", "Robotics", "IoT"], description: "A specialized surveillance vehicle featuring 360° radar detection for remote spatial awareness.", pricing: "Starting from ₹15,200.", images: ["images/pro131.jpg"] }
];

const pastelColors = ['#FFE5E5', '#E5FFEA', '#E5F0FF', '#FFF3E5', '#F5E5FF', '#E5FFFF', '#FFFFE5'];

function getInitials(title) {
    const words = title.split(' ');
    let initials = '';
    for(let i=0; i<Math.min(2, words.length); i++){
        if(words[i].length > 0 && words[i][0].match(/[A-Za-z0-9]/)) {
            initials += words[i][0].toUpperCase();
        }
    }
    return initials;
}

function renderProjects(filteredProjects) {
    const grid = document.getElementById('projects-grid');
    const counter = document.getElementById('projects-counter');
    const noResults = document.getElementById('no-results');
    
    grid.innerHTML = '';
    counter.textContent = `Showing ${filteredProjects.length} project${filteredProjects.length === 1 ? '' : 's'}`;
    
    if (filteredProjects.length === 0) {
        noResults.classList.remove('hidden');
        grid.style.display = 'none';
        return;
    }
    
    noResults.classList.add('hidden');
    grid.style.display = 'grid';
    
    filteredProjects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card glass-card';
        const color = pastelColors[index % pastelColors.length];
        const initials = getInitials(project.title);
        const tagsHtml = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const phoneNumber = '918590342039';
        const message = `Hi! I'm interested in the ${project.title}. Can you share more details?`;
        const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        let imageHtml = '';
        if (project.images && project.images.length > 0) {
            const imgs = project.images.map(src => `<img src="${src}" alt="${project.title}">`).join('');
            const dots = project.images.map((_, i) => `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`).join('');
            imageHtml = `
                <div class="project-slider" data-current-index="0">
                    <div class="slider-images">${imgs}</div>
                    ${project.images.length > 1 ? `<div class="slider-dots">${dots}</div>` : ''}
                </div>
            `;
        } else {
            imageHtml = `<div class="project-image-placeholder" style="background-color: ${color}">${initials}</div>`;
        }

        card.innerHTML = `
            ${imageHtml}
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tags">${tagsHtml}</div>
                <p class="project-desc">${project.description}</p>
            </div>
            <div class="project-card-footer">
                <p class="project-pricing">${project.pricing}</p>
                <a href="${waUrl}" target="_blank" class="btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> I'm Interested
                </a>
            </div>
        `;
        grid.appendChild(card);
    });

    initSliders();
}

function initSliders() {
    const sliders = document.querySelectorAll('.project-slider');
    sliders.forEach(slider => {
        if(slider.dataset.initialized) return;
        slider.dataset.initialized = 'true';
        
        const imagesContainer = slider.querySelector('.slider-images');
        const dots = slider.querySelectorAll('.dot');
        const totalImages = dots.length;
        if (totalImages <= 1) return;

        let currentIndex = 0;
        let slideInterval;

        const goToSlide = (index) => {
            currentIndex = index;
            imagesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const nextSlide = () => {
            goToSlide((currentIndex + 1) % totalImages);
        };

        const prevSlide = () => {
            goToSlide((currentIndex - 1 + totalImages) % totalImages);
        };

        const startAutoPlay = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                startAutoPlay();
            });
        });

        // Swipe support
        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', e => {
            startX = e.changedTouches[0].screenX;
        }, {passive: true});

        slider.addEventListener('touchend', e => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
        }, {passive: true});

        const handleSwipe = () => {
            if (startX - endX > 50) {
                nextSlide();
                startAutoPlay();
            } else if (endX - startX > 50) {
                prevSlide();
                startAutoPlay();
            }
        };

        startAutoPlay();
    });
}

document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = projects.filter(project => {
        const matchTitle = project.title.toLowerCase().includes(searchTerm);
        const matchDesc = project.description.toLowerCase().includes(searchTerm);
        const matchTags = project.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        return matchTitle || matchDesc || matchTags;
    });
    renderProjects(filtered);
});

document.addEventListener('DOMContentLoaded', () => {
    renderProjects(projects);

    // Expandable search bar
    const searchIconToggle = document.getElementById('search-icon-toggle');
    const searchWrapper = document.getElementById('search-icon-wrapper');
    const searchInput = document.getElementById('search-input');

    if (searchIconToggle && searchWrapper && searchInput) {
        searchIconToggle.addEventListener('click', () => {
            if (!searchWrapper.classList.contains('active')) {
                searchWrapper.classList.add('active');
                searchInput.focus();
            }
        });

        // Close search on click outside
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target) && searchWrapper.classList.contains('active') && searchInput.value.trim() === '') {
                searchWrapper.classList.remove('active');
            }
        });
    }

    // Rotating text in hero
    const words = ["Electronics", "IoT", "Robotics", "Software", "AI", "ML"];
    let wordIndex = 0;
    const rotatingTextEl = document.getElementById('rotating-text');
    const wrapper = document.querySelector('.rotating-text-wrapper');
    
    if (rotatingTextEl && wrapper) {
        // Init width
        wrapper.style.width = `${rotatingTextEl.offsetWidth}px`;
        
        setInterval(() => {
            rotatingTextEl.style.opacity = 0;
            rotatingTextEl.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                wordIndex = (wordIndex + 1) % words.length;
                rotatingTextEl.textContent = words[wordIndex];
                rotatingTextEl.style.transform = 'translateY(-10px)';
                
                // Update wrapper width smoothly
                wrapper.style.width = `${rotatingTextEl.offsetWidth}px`;
                
                requestAnimationFrame(() => {
                    rotatingTextEl.style.opacity = 1;
                    rotatingTextEl.style.transform = 'translateY(0)';
                });
            }, 300);
        }, 2000);
    }

    // Mobile search fab
    const mobileSearchFab = document.getElementById('mobile-search-fab');
    if (mobileSearchFab) {
        mobileSearchFab.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                if (searchIconToggle && !searchWrapper.classList.contains('active')) {
                    searchIconToggle.click();
                }
                if (searchInput) searchInput.focus();
            }, 500);
        });
    }

    // Bubble Cursor
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.15) { 
            const bubble = document.createElement('div');
            bubble.className = 'cursor-bubble';
            bubble.style.left = `${e.clientX}px`;
            bubble.style.top = `${e.clientY}px`;
            document.body.appendChild(bubble);
            
            setTimeout(() => {
                bubble.remove();
            }, 1200);
        }
    });
});