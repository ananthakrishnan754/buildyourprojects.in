# BuildYourProjects — Project Context

## Site
- URL: https://www.buildyourprojects.xyz
- Repo: github.com/ananthakrishnan754/buildyourprojects.in
- Hosting: Vercel (auto-deploys from main branch)
- Stack: Static HTML/CSS/JS, Firebase Firestore, UroPay payments

## Pages
- `/` — Home page with featured projects and courses
- `/courses` — 4 courses (Python, AI Prompting, Gen AI, ESP32/Robotics)
- `/projects` — 13 engineering projects with search
- `/blog` — Blog for SEO content
- `/admin` — Admin dashboard (registrations, manage projects/courses)
- `/free-guide` — Lead magnet page (5 Python projects, email capture)

## Contact
- WhatsApp: +91 9447452039
- Email: buildyourprojects754@gmail.com
- LinkedIn: /in/ananthakrishnan754

## Tech Notes
- Firebase config is in script.js (apiKey, projectId, etc.)
- UroPay config is in script.js (API key, button IDs per course)
- Courses and projects data is in script.js (fallback) and Firestore
- When running opencode here, use the `marketing` or `blog-writer` agents for content tasks

## What's Been Done (as of May 18-19, 2026)

### Lead Magnet & Email Capture
- `/free-guide.html` — "5 Python Mini Projects" lead magnet page
- Email capture saves to Firebase `leads` collection
- EmailJS auto-responder configured (service_27794ep, template_0rkumub, public key: M8uQkZmmPT_DGSrzh)
- CTAs for free guide added to index.html, blog.html, courses.html

### Blog Posts (4 total)
1. Top 10 IoT Final Year Projects for ECE Students in 2026
2. Python for Placements: What Engineering Students Need to Know
3. ESP32 vs Raspberry Pi: Which is Better for Your Project?
4. Top 5 AI Projects for Final Year Engineering Students in 2026

### SEO
- Meta tags, OG/Twitter cards, canonical URLs on all pages
- JSON-LD structured data for Organization, Courses, Products
- sitemap.xml, robots.txt (with GPTBot, Claude-Web, Google-Extended allowed)
- llms.txt for AI search engines
- SEO-friendly image filenames

### Other
- GA4 tracking (G-YHKKFYEKRP) on all pages
- Logo (logo.svg + favicon), OG image (og-image.png)
- LinkedIn post draft for ESP-NAVIGATION-DEVICE
- opencode agents: marketing.md, blog-writer.md

## Pending / Next Steps
1. GA4 conversion events (track enrollment clicks, lead captures)
2. Student testimonials on site
3. Daily blog posts (1/day)
4. LinkedIn outreach to Kochi companies for freelance work

## Personal Brand (Freelance Work)
- Portfolio: ananthakrishnans.me
- GitHub: github.com/ananthakrishnan754
- LinkedIn: /in/ananthakrishnan754
- Skills: ESP32, STM32, ROS2, Computer Vision, Embedded C/C++, IoT, Web Dev
- Current roles: CTO at Nuke Labs, IEEE SB Secretary, ATL Lab Instructor
- Fiverr: Embedded Systems Freelancer
- Freelance targets: Maker Village/Kinfra Park startups, KELTRON Controls Aroor, EyeROV, RUNTIME Robotics, Astrek Innovations
- KELTRON Controls Aroor: headkca@keltron.org, ka.rajeev@gmail.com, 0478-2830701, kelkca@keltron.org

## Known Bugs (Fixed)
- Double `{{` in blog.html (fixed)
- Missing Firebase CDN in blog.html (fixed)
- `const firebaseConfig` / `const app` / `const db` redeclaration in free-guide.html (fixed — renamed to leadFirebaseConfig, leadApp, leadDb)
- Firestore security rules set to allow reads + authenticated writes
