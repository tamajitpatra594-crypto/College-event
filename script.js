/* =====================================================================
   EVENTRIX — Department of CSE (AIML), IEM Kolkata
   JavaScript Core Engine:
     1. Event Data Management & Dynamic Card Rendering
     2. Category Filter & Instant Real-Time Search
     3. Quick Event Selection & Form Auto-fill
     4. Next Upcoming Event Countdown & Studio IST Clock
     5. Light / Dark Theme Switcher with LocalStorage Memory
     6. Strict Form Validations (Regex, Live Feedback, Accessible Status)
     7. Image Gallery Interactive Lightbox
     8. Mobile Navigation & Scroll-Spy Active Highlighting
     9. Smooth Floating Scroll-to-Top
   ===================================================================== */

'use strict';

/* ---------------------------------------------------------------------
   1. Event Data & Dynamic Card Rendering
   --------------------------------------------------------------------- */
const EVENTS = [
  {
    id: 'hackiem',
    name: 'HackIEM 2026',
    date: '2026-09-26T09:00:00+05:30',
    venue: 'AIML Laboratory, Gurukul Campus',
    category: 'technical',
    description: '24-hour flagship hackathon focused on applied AI, computer vision, and generative agents. Teams of 2–4 with 24/7 mentor guidance and industry judges.'
  },
  {
    id: 'dl-workshop',
    name: 'Hands-on Deep Learning with PyTorch',
    date: '2026-10-03T10:00:00+05:30',
    venue: 'Computing Lab 4, Ashram Building',
    category: 'workshop',
    description: 'Two-day intensive workshop covering tensor operations, autograd mechanics, CNN architectures, and deploying an audio emotion classifier.'
  },
  {
    id: 'guest-lecture',
    name: 'Distinguished Lecture: LLMs for Indic Languages',
    date: '2026-10-10T14:30:00+05:30',
    venue: 'Main Seminar Hall, 2nd Floor',
    category: 'lecture',
    description: 'AI Research Scientist delivers an exclusive keynote on tokenization challenges and fine-tuning open models for low-resource Indian languages.'
  },
  {
    id: 'cultural-night',
    name: 'Sharod Sandhya — Grand Cultural Evening',
    date: '2026-10-16T17:00:00+05:30',
    venue: 'Main University Auditorium',
    category: 'cultural',
    description: 'Pre-festive cultural evening showcasing classical and contemporary music, dance performances, student drama, and traditional folk showcases.'
  },
  {
    id: 'robotics',
    name: 'Autonomous Line-Follower & Obstacle Arena',
    date: '2026-11-07T10:00:00+05:30',
    venue: 'IoT & Embedded Systems Lab',
    category: 'technical',
    description: 'Design, code, and race high-speed autonomous robots over challenging tracks. Open to all semester students with hardware development kits.'
  },
  {
    id: 'innovacion',
    name: 'Innovacion 2026 — Annual Tech Fest',
    date: '2026-11-20T09:00:00+05:30',
    venue: 'Gurukul Campus, All Blocks',
    category: 'technical',
    description: 'Eastern India\'s grandest college tech fest: 3 full days of competitive coding, project displays, robotics arenas, tech gaming, and grand prizes.'
  }
];

const CATEGORY_LABELS = {
  technical: 'Technical',
  workshop: 'Workshop',
  cultural: 'Cultural',
  lecture: 'Lecture'
};

const eventList = document.getElementById('eventList');
const eventEmpty = document.getElementById('eventEmpty');
const eventSelect = document.getElementById('eventSelect');
const eventSearch = document.getElementById('eventSearch');

function formatDateParts(iso) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString('en-IN', { day: '2-digit' }),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
    year: d.toLocaleDateString('en-IN', { year: 'numeric' }),
    full: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }),
    time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  };
}

function renderEvents() {
  const sorted = [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Render cards
  eventList.innerHTML = sorted.map(ev => {
    const dt = formatDateParts(ev.date);
    const tagClass = `tag-${ev.category}`;
    return `
      <li class="event-card" data-category="${ev.category}" data-name="${ev.name.toLowerCase()}" data-venue="${ev.venue.toLowerCase()}" data-desc="${ev.description.toLowerCase()}">
        <div class="event-card-header">
          <div class="event-date-badge">
            <span class="day">${dt.day}</span>
            <span class="month">${dt.month}</span>
          </div>
          <span class="event-tag ${tagClass}">${CATEGORY_LABELS[ev.category]}</span>
        </div>

        <div class="event-body">
          <h3>${ev.name}</h3>
          <div class="event-meta">
            <span>📅 ${dt.full}</span>
            <span>🕒 ${dt.time}</span>
            <span>📍 ${ev.venue}</span>
          </div>
          <p class="event-desc">${ev.description}</p>
        </div>

        <div class="event-footer">
          <span style="font-size: 0.8rem; color: var(--ink-muted); font-family: var(--font-mono);">Open Registration</span>
          <button type="button" class="event-quick-btn" data-event-id="${ev.id}">
            Register for this <span>→</span>
          </button>
        </div>
      </li>
    `;
  }).join('');

  // Populate registration dropdown
  eventSelect.innerHTML = '<option value="">Choose an event to attend</option>';
  sorted.forEach(ev => {
    const dt = formatDateParts(ev.date);
    const opt = document.createElement('option');
    opt.value = ev.id;
    opt.textContent = `${ev.name} — ${dt.day} ${dt.month} (${CATEGORY_LABELS[ev.category]})`;
    eventSelect.appendChild(opt);
  });

  // Attach quick register click handlers
  document.querySelectorAll('.event-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.eventId;
      eventSelect.value = targetId;
      setError('eventSelect', '');

      // Smooth scroll to register section
      const regSection = document.getElementById('register');
      if (regSection) {
        regSection.scrollIntoView({ behavior: 'smooth' });
        // Highlight form briefly
        const formEl = document.getElementById('regForm');
        formEl.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.6)';
        setTimeout(() => { formEl.style.boxShadow = ''; }, 1200);
      }
    });
  });
}

/* ---------------------------------------------------------------------
   2. Event Filtering & Live Search
   --------------------------------------------------------------------- */
let currentCategory = 'all';

function applyFilters() {
  const query = (eventSearch ? eventSearch.value : '').trim().toLowerCase();
  let visibleCount = 0;

  document.querySelectorAll('.event-card').forEach(card => {
    const matchCat = (currentCategory === 'all' || card.dataset.category === currentCategory);
    const nameText = card.dataset.name || '';
    const venueText = card.dataset.venue || '';
    const descText = card.dataset.desc || '';
    const matchQuery = !query || nameText.includes(query) || venueText.includes(query) || descText.includes(query);

    const shouldShow = matchCat && matchQuery;
    card.classList.toggle('is-hidden', !shouldShow);
    if (shouldShow) visibleCount++;
  });

  if (eventEmpty) {
    eventEmpty.hidden = visibleCount > 0;
  }
}

document.getElementById('eventFilters').addEventListener('click', e => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  currentCategory = btn.dataset.filter;
  applyFilters();
});

if (eventSearch) {
  eventSearch.addEventListener('input', applyFilters);
}

renderEvents();

/* ---------------------------------------------------------------------
   3. Next Event Countdown & Digital Studio Clock
   --------------------------------------------------------------------- */
const cd = {
  title: document.getElementById('cdTitle'),
  meta: document.getElementById('cdMeta'),
  days: document.getElementById('cdDays'),
  hours: document.getElementById('cdHours'),
  mins: document.getElementById('cdMins'),
  secs: document.getElementById('cdSecs')
};

function getNextEvent() {
  const now = Date.now();
  return [...EVENTS]
    .filter(ev => new Date(ev.date).getTime() > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
}

const pad = n => String(n).padStart(2, '0');

function updateCountdown() {
  const next = getNextEvent();
  if (!next) {
    cd.title.textContent = 'All Semester Events Completed';
    cd.meta.textContent = 'Stay tuned for next semester announcements.';
    cd.days.textContent = cd.hours.textContent = cd.mins.textContent = cd.secs.textContent = '00';
    return;
  }

  const dt = formatDateParts(next.date);
  cd.title.textContent = next.name;
  cd.meta.textContent = `📍 ${next.venue} · ${dt.full}`;

  let diff = Math.max(0, new Date(next.date).getTime() - Date.now());
  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000);  diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  cd.days.textContent = pad(days);
  cd.hours.textContent = pad(hours);
  cd.mins.textContent = pad(mins);
  cd.secs.textContent = pad(secs);
}

const clockEl = document.getElementById('clock');
function updateClock() {
  if (!clockEl) return;
  clockEl.textContent = new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

updateCountdown();
updateClock();
setInterval(() => {
  updateCountdown();
  updateClock();
}, 1000);

/* ---------------------------------------------------------------------
   4. Theme Switcher (Dark / Light)
   --------------------------------------------------------------------- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

function applyTheme(mode) {
  const isLight = mode === 'light';
  document.body.classList.toggle('light-theme', isLight);
  if (themeIcon) {
    themeIcon.textContent = isLight ? '☾' : '☀';
  }
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }
  try {
    localStorage.setItem('eventrix-theme', mode);
  } catch (_) { /* storage safe guard */ }
}

(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem('eventrix-theme'); } catch (_) {}
  if (saved) {
    applyTheme(saved);
  } else {
    // Default to modern dark aesthetic
    applyTheme('dark');
  }
})();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-theme');
    applyTheme(isCurrentlyLight ? 'dark' : 'light');
  });
}

/* ---------------------------------------------------------------------
   5. Form Validation & Submission
   --------------------------------------------------------------------- */
const RULES = {
  name:  { re: /^[A-Za-z][A-Za-z .'-]{1,59}$/, msg: 'Enter your full name (letters, spaces, dots only).' },
  roll:  { re: /^\d{10}$/, msg: 'Roll number must be exactly 10 digits (e.g. 1234567890).' },
  email: { re: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/, msg: 'Enter a valid email address (e.g. student@iem.edu.in).' },
  phone: { re: /^[6-9]\d{9}$/, msg: 'Enter a valid 10-digit Indian mobile number.' }
};

function setError(id, message) {
  const field = document.getElementById(id);
  const err = document.getElementById('err-' + id);
  if (field) field.classList.toggle('is-invalid', Boolean(message));
  if (err) err.textContent = message || '';
  return !message;
}

function validateText(id, rule) {
  const el = document.getElementById(id);
  if (!el) return true;
  const value = el.value.trim();
  if (!value) return setError(id, 'This field is required.');
  if (rule && !rule.re.test(value)) return setError(id, rule.msg);
  return setError(id, '');
}

function validateSelect(id, message) {
  const el = document.getElementById(id);
  if (!el) return true;
  return setError(id, el.value ? '' : message);
}

/* --- Registration Form --- */
const regForm = document.getElementById('regForm');
const regStatus = document.getElementById('regStatus');

if (regForm) {
  regForm.addEventListener('submit', e => {
    e.preventDefault();

    const checks = [
      validateText('studentName', RULES.name),
      validateText('rollNo', RULES.roll),
      validateSelect('department', 'Please select your department.'),
      validateText('email', RULES.email),
      validateText('phone', RULES.phone),
      (() => {
        const chosen = regForm.querySelector('input[name="gender"]:checked');
        return setError('gender', chosen ? '' : 'Please select a gender option.');
      })(),
      validateSelect('eventSelect', 'Please select an event to register for.')
    ];

    if (checks.every(Boolean)) {
      const name = document.getElementById('studentName').value.trim();
      const eventName = eventSelect.options[eventSelect.selectedIndex].text;
      regStatus.className = 'form-status ok';
      regStatus.innerHTML = `🎉 <strong>Registration Successful!</strong> Thank you <strong>${name}</strong>, you have been successfully enrolled for <em>${eventName}</em>. Confirmation and details have been dispatched to your email.`;
      regForm.reset();
      regForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    } else {
      regStatus.className = 'form-status bad';
      regStatus.innerHTML = `⚠️ <strong>Attention Needed:</strong> Please correct the highlighted fields above before submitting.`;
      const firstBad = regForm.querySelector('.is-invalid');
      if (firstBad) firstBad.focus();
    }
  });

  // Real-time clearance of errors
  regForm.addEventListener('input', e => {
    const id = e.target.id;
    if (!id || !document.getElementById('err-' + id)) return;
    if (e.target.classList.contains('is-invalid')) {
      const map = { studentName: RULES.name, rollNo: RULES.roll, email: RULES.email, phone: RULES.phone };
      if (map[id]) validateText(id, map[id]);
      else if (e.target.tagName === 'SELECT') validateSelect(id, 'Please select an option.');
    }
  });
}

/* --- Feedback Form --- */
const fbForm = document.getElementById('feedbackForm');
const fbStatus = document.getElementById('fbStatus');

if (fbForm) {
  fbForm.addEventListener('submit', e => {
    e.preventDefault();

    const checks = [
      validateText('fbName', RULES.name),
      validateText('fbEmail', RULES.email),
      (() => {
        const msg = document.getElementById('fbMessage').value.trim();
        if (!msg) return setError('fbMessage', 'Please provide a message or feedback.');
        if (msg.length < 15) return setError('fbMessage', 'Message is too brief — please provide at least 15 characters.');
        return setError('fbMessage', '');
      })()
    ];

    if (checks.every(Boolean)) {
      fbStatus.className = 'form-status ok';
      fbStatus.innerHTML = `✓ <strong>Thank you for your feedback!</strong> Your suggestion has been forwarded to the CSE (AIML) event committee.`;
      fbForm.reset();
      fbForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    } else {
      fbStatus.className = 'form-status bad';
      fbStatus.innerHTML = `⚠️ Please fix the errors highlighted above before transmitting.`;
    }
  });
}

/* ---------------------------------------------------------------------
   6. Gallery Lightbox Modal
   --------------------------------------------------------------------- */
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt, caption) {
  if (!lightboxModal) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCaption.textContent = caption;
  lightboxModal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('is-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.querySelector('figcaption');
    if (img) {
      openLightbox(img.src, img.alt, cap ? cap.textContent : '');
    }
  });
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxModal) {
  lightboxModal.addEventListener('click', e => {
    if (e.target === lightboxModal) closeLightbox();
  });
}

window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('is-open')) {
    closeLightbox();
  }
});

/* ---------------------------------------------------------------------
   7. Mobile Navigation & Scroll-Spy
   --------------------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  siteNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav on outside tap
  document.addEventListener('click', e => {
    if (!siteNav.contains(e.target) && !navToggle.contains(e.target) && siteNav.classList.contains('is-open')) {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Scroll-spy active link
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ---------------------------------------------------------------------
   8. Floating Back-to-Top Button
   --------------------------------------------------------------------- */
const floatTop = document.getElementById('floatTop');
if (floatTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      floatTop.classList.add('is-visible');
    } else {
      floatTop.classList.remove('is-visible');
    }
  });

  floatTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
