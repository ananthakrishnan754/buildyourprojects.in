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

## Contact
- WhatsApp: +91 9447452039
- Email: buildyourprojects754@gmail.com
- LinkedIn: /in/ananthakrishnan754

## Tech Notes
- Firebase config is in script.js (apiKey, projectId, etc.)
- UroPay config is in script.js (API key, button IDs per course)
- Courses and projects data is in script.js (fallback) and Firestore
- When running opencode here, use the `marketing` or `blog-writer` agents for content tasks
