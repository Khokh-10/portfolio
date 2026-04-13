/* ═══════════════════════════════════════════════════════════════
   Ahmed Emad Khokh — Portfolio JavaScript
   main.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── THEME TOGGLE ─────────────────────────────────────────── */
const body        = document.body;
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');
const themeIcon   = document.getElementById('themeIcon');

let isDark = true;

function applyTheme() {
  if (isDark) {
    body.classList.remove('light');
    body.classList.add('dark');
    themeLabel.textContent = 'Light';
    themeIcon.textContent  = '☀';
  } else {
    body.classList.remove('dark');
    body.classList.add('light');
    themeLabel.textContent = 'Dark';
    themeIcon.textContent  = '🌙';
  }
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Restore saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') { isDark = false; applyTheme(); }

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  applyTheme();
});

/* ─── MOBILE NAV ───────────────────────────────────────────── */
const hamburger     = document.getElementById('hamburger');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose   = document.getElementById('mobileClose');
const mobileLinks   = document.querySelectorAll('.mobile-link');

function openMobileNav() {
  mobileOverlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  mobileOverlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileNav);
mobileClose.addEventListener('click', closeMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileNav();
});

/* ─── SCROLL REVEAL ────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.10,
  rootMargin: '0px 0px -36px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// Trigger above-the-fold elements immediately
setTimeout(() => {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add('visible');
  });
}, 80);

/* ─── SCROLL TO TOP ────────────────────────────────────────── */
const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 480);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── ACTIVE NAV LINK ──────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── SKILL BAR ANIMATION ──────────────────────────────────── */
// Bars start at 0 and animate to their value when scrolled into view
const skillBars = document.querySelectorAll('.skill-bar-fill');

skillBars.forEach(bar => {
  const targetW = bar.style.getPropertyValue('--w');
  bar.style.setProperty('--w', '0%');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => bar.style.setProperty('--w', targetW), 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  barObserver.observe(bar);
});

/* ─── PROJECT FILTER ───────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const tags = card.dataset.tags || '';
      const show = filter === 'all' || tags.split(' ').includes(filter);

      if (show) {
        card.style.display = 'flex';
        // Re-trigger reveal if needed
        requestAnimationFrame(() => card.classList.add('visible'));
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ─── CONTACT FORM ─────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Simple client-side validation
    const required = contactForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#F87171';
        valid = false;
      }
    });

    if (!valid) return;

    // Simulate submit (replace with your backend/Formspree endpoint)
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#059669,#10B981)';
      contactForm.reset();

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* ─── SMOOTH NAV SCROLL OFFSET ─────────────────────────────── */
// Account for fixed navbar height when jumping to sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
