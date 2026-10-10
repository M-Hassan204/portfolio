/* ── main.js ─────────────────────────────────────────────── */
'use strict';

// ════════════════════════════════════════════
// THEME TOGGLE
// ════════════════════════════════════════════
(function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');
  const prefer = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme = stored || prefer;

  applyTheme(theme);

  btn && btn.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(t) {
    root.dataset.theme = t;
    btn && btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  }
})();

// ════════════════════════════════════════════
// MOBILE MENU
// ════════════════════════════════════════════
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
    document.body.style.overflow = open ? '' : 'hidden';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      document.body.style.overflow = '';
    });
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
})();

// ════════════════════════════════════════════
// ACTIVE NAV LINK (scroll spy)
// ════════════════════════════════════════════
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('nav__link--active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        active && active.classList.add('nav__link--active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

// ════════════════════════════════════════════
// SMOOTH SCROLL (fallback for older browsers)
// ════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ════════════════════════════════════════════
// SCROLL ANIMATIONS (fade-up)
// ════════════════════════════════════════════
(function initFadeUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = [
    '.case-study', '.stat-card', '.stack-group',
    '.cap-card', '.process-step', '.repo-card',
    '.about__principles .principle', '.val-layer'
  ].join(', ');

  const els = document.querySelectorAll(targets);
  els.forEach(el => el.classList.add('fade-up'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => io.observe(el));
})();

// ════════════════════════════════════════════
// FOOTER YEAR
// ════════════════════════════════════════════
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ════════════════════════════════════════════
// CONTACT FORM (mailto fallback)
// ════════════════════════════════════════════
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const notice = document.getElementById('form-notice');
  const noticeT = document.getElementById('form-notice-text');
  const btnText = document.getElementById('btn-text');
  const btnLoad = document.getElementById('btn-loading');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    const name = form.querySelector('#c-name').value.trim();
    const email = form.querySelector('#c-email').value.trim();
    const type = form.querySelector('#c-type').value;
    const message = form.querySelector('#c-msg').value.trim();

    // Show loading state
    btnText.hidden = true;
    btnLoad.hidden = false;

    // Build mailto
    const subject = encodeURIComponent(`Portfolio Inquiry${type ? ' — ' + type : ''}`);
    const body = encodeURIComponent(
      `Hi Mohamed,\n\nMy name is ${name}.\n\n${message}\n\nBest regards,\n${name}\n${email}`
    );
    const mailto = `mailto:m.hassan.dev@icloud.com?subject=${subject}&body=${body}`;

    // Slight delay for UX
    setTimeout(() => {
      window.location.href = mailto;
      btnText.hidden = false;
      btnLoad.hidden = true;
      showNotice('Your email client has opened. Looking forward to hearing from you!', false);
      form.reset();
    }, 600);
  });

  function validateForm() {
    let valid = true;

    const name = form.querySelector('#c-name');
    const email = form.querySelector('#c-email');
    const msg = form.querySelector('#c-msg');

    clearError('name-error');
    clearError('email-error');
    clearError('msg-error');

    if (!name.value.trim()) {
      showError('name-error', 'Please enter your name.');
      valid = false;
    }

    if (!email.value.trim()) {
      showError('email-error', 'Please enter your email address.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError('email-error', 'Please enter a valid email address.');
      valid = false;
    }

    if (!msg.value.trim()) {
      showError('msg-error', 'Please tell me about your project.');
      valid = false;
    }

    return valid;
  }

  function showError(id, text) {
    const el = document.getElementById(id);
    if (el) { el.textContent = text; el.hidden = false; }
  }

  function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.hidden = true; }
  }

  function showNotice(text, isError) {
    if (!notice || !noticeT) return;
    noticeT.textContent = text;
    notice.hidden = false;
    notice.classList.toggle('form-notice--error', isError);
    setTimeout(() => { notice.hidden = true; }, 6000);
  }
})();

// ════════════════════════════════════════════
// HEADER SHRINK ON SCROLL
// ════════════════════════════════════════════
(function initHeaderShrink() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 60);
  }, { passive: true });
})();
