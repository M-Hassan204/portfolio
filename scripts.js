/* ── scripts.js ──────────────────────────────── */

const EMAIL = 'm.hassan.dev@icloud.com';
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {

  /* ── Footer year ─────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Nav stagger entrance ────────────────────── */
  if (!prefersReduced) {
    document.querySelectorAll('#nav a').forEach((a, i) => {
      a.style.animationDelay = (60 + i * 80) + 'ms';
      a.classList.add('nav-in');
    });
  } else {
    // Skip animation — make links immediately visible
    document.querySelectorAll('#nav a').forEach(a => {
      a.style.opacity = 1;
      a.style.transform = 'none';
    });
  }

  /* ── Scroll reveal + skill bar animation ──────── */
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('visible');

      // Trigger animated skill bars inside revealed card
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const w = bar.style.getPropertyValue('--w') || '1';
        bar.style.transform = `scaleX(${w})`;
        bar.classList.add('animated');
      });

      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    if (!prefersReduced) el.style.transitionDelay = (i * 70) + 'ms';
    io.observe(el);
  });

  /* ── 3D tilt on project cards ────────────────── */
  if (!prefersReduced) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 6}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── "Get in touch" → prefilled mailto ──────── */
  const getInTouch = document.getElementById('get-in-touch');
  if (getInTouch) {
    getInTouch.addEventListener('click', e => {
      e.preventDefault();
      const sub  = encodeURIComponent("Let's work together");
      const body = encodeURIComponent(
        "Hi Mohamed,\n\nI visited your portfolio and would like to discuss a potential collaboration.\n\nRegards,\n"
      );
      window.location.href = `mailto:${EMAIL}?subject=${sub}&body=${body}`;
    });
  }

  /* ── Contact form send button → mailto ───────── */
  const sendBtn = document.getElementById('send-btn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name  = document.getElementById('fname').value.trim();
      const email = document.getElementById('femail').value.trim();
      const msg   = document.getElementById('fmsg').value.trim();

      if (!name && !msg) return; // nothing to send

      const sub  = encodeURIComponent("Portfolio inquiry");
      const body = encodeURIComponent(
        `Name: ${name || '(not provided)'}\nEmail: ${email || '(not provided)'}\n\n${msg}`
      );
      window.location.href = `mailto:${EMAIL}?subject=${sub}&body=${body}`;
    });
  }

});

// Defensive export for test environments
if (typeof module !== 'undefined') module.exports = {};
