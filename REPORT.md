# Project Report — Eventrix: College Event Management Portal

**Title:** Eventrix  
**Course:** PCCCS382 — IT Workshop  
**Department:** CSE (AIML), Institute of Engineering & Management, Kolkata  
**Technologies:** HTML5, CSS3 (Modern Glassmorphism & Micro-animations), Vanilla JavaScript (ES6+)

---

## 1. Objective
To design a state-of-the-art, responsive, single-page web portal named **Eventrix** for the Department of CSE (AIML), IEM Kolkata. The portal enables students to browse semester events, perform live keyword searches and category filtering, register for events with immediate roll-number validation, interact with a live event countdown and studio IST clock, inspect event moments in an image lightbox, and transmit direct coordinator feedback.

---

## 2. Directory Structure
```
college-event-site/
├── index.html          # Semantic HTML5 architecture & accessible ARIA markup
├── css/style.css       # Design tokens, typography, glassmorphism, responsive breakpoints & animations
├── js/script.js        # Dynamic rendering, filtering, search, countdown, clock, lightbox & validations
├── images/             # logo.png + event photography assets
├── screenshots/        # Captured desktop, tablet, and mobile views
├── README.md           # Quickstart and overview
└── REPORT.md           # Comprehensive project report
```

---

## 3. Implemented Sections
| Section | Key Features & Design |
|---|---|
| **Header & Navbar** | Frosted glass sticky bar (`backdrop-filter: blur(20px)`), Eventrix glowing brand emblem, responsive navigation links, theme toggle (Dark/Light), and mobile drawer toggle. |
| **Home (Hero)** | Ambient floating gradient orbs, status pulse badge, high-impact headline, stats ribbon (6+ events, 1.2K+ participants, 24h hackathon, ₹75K+ prizes), and live glass countdown card. |
| **Events** | Dynamic cards rendered from JavaScript data, multi-criteria category filter chips, instantaneous keyword search box, date badges, venue metadata, and "Register for this" auto-fill shortcut. |
| **Registration** | Two-column layout with student perks guide, 10-digit IEM roll number validation, department picker, email & phone validation, radio buttons, and accessible status notification. |
| **Gallery** | Responsive grid with smooth zoom and scrim transitions on hover, plus full-screen interactive Lightbox modal with caption and keyboard (Esc) navigation. |
| **About Us** | Department profile with AIML & IoT lab highlights, paired with faculty and student coordinator contact cards featuring avatar badges. |
| **Contact & Feedback** | Interactive contact cards (physical campus address, email, phone desk, working hours) and dedicated suggestion form with character length validation. |
| **Footer & Floating Action** | Eventrix branding, quick navigation shortcuts, course metadata, back-to-top links, and smooth floating scroll-to-top button. |

---

## 4. JavaScript Core Engine
1. **Dynamic Event Cards & Auto-fill Routing**: Events are maintained in a central data array, sorted chronologically, and rendered into modern cards. Clicking "Register for this" on an event card auto-selects that event in the registration form dropdown and smoothly scrolls the student directly to the form.
2. **Instant Search & Category Filtering**: Combines category chips (`all`, `technical`, `workshop`, `cultural`, `lecture`) with real-time text search across event titles, venues, and descriptions.
3. **Live Second-by-Second Countdown**: Calculates exact remaining days, hours, minutes, and seconds until the next upcoming event.
4. **Studio Digital Clock (Asia/Kolkata)**: Displays real-time 24-hour Kolkata standard time with seconds precision.
5. **Theme Engine (Dark / Light)**: Remembers user preference in `localStorage`, smoothly transitions background mesh and card elevations, and rotates the sun/moon toggle.
6. **Form Validation Engine**: Strict regex testing for full names, 10-digit roll numbers, valid email patterns, and 10-digit Indian mobile numbers (`^[6-9]\d{9}$`). Includes live re-validation as users edit invalid fields.
7. **Interactive Image Lightbox**: Accessible modal dialog allowing users to inspect full-resolution photos with captions and backdrop dismiss.
8. **Scroll-Spy & Mobile Drawer**: Uses `IntersectionObserver` to highlight the current section in the navbar, and provides an animated mobile menu with auto-close on selection.

---

## 5. Visual Makeover & Typography Upgrades
- **Branding**: Elevated title to **EVENTRIX** with an electric tech aura.
- **Typography**:
  - Headings: **Outfit** (modern, geometric, high-impact display font).
  - Body: **Plus Jakarta Sans** (clean, crisp, readable sans-serif).
  - Numbers & Badges: **JetBrains Mono** (tabular digits for timers and dates).
- **Color Palette & Glassmorphism**:
  - Dark Theme: Deep Obsidian (`#070913`), Frosted Indigo Cards (`rgba(15, 20, 36, 0.72)`), Electric Indigo (`#6366F1`), Cyber Cyan (`#06B6D4`), and Neon Pink accents (`#EC4899`).
  - Light Theme: Pearlescent Slate (`#F8FAFC`), crisp white elevated surfaces, and royal indigo accents.
- **Animations**: Ambient background orb drift, staggered card elevations, live pulse indicators, shake animation on form errors, and smooth hover micro-interactions.

---

## 6. Accessibility & Responsiveness
- Semantic HTML5 landmark elements (`<header>`, `<main>`, `<section>`, `<aside>`, `<nav>`, `<footer>`).
- Full ARIA compliance with `aria-live`, `aria-label`, `role="status"`, `role="dialog"`, and `role="group"`.
- Responsive across all viewports (Mobile `<480px`, Tablet `<768px` / `<1024px`, Desktop `>1024px`).
