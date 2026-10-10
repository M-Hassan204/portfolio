// Separated runtime touches + reveal animations
document.addEventListener('DOMContentLoaded', () => {
  const contactEmail = 'm.hassan.dev@icloud.com';

  // set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // "Get in touch" button opens mail client with a prefilled message
  const getInTouch = document.getElementById('get-in-touch');
  if (getInTouch) {
    getInTouch.addEventListener('click', (e) => {
      e.preventDefault(); // keep link behavior controlled
      const subject = encodeURIComponent("Let's work together");
      const body = encodeURIComponent("Hi Mohamed,\n\nI visited your portfolio and would like to discuss a potential collaboration.\n\nRegards,\n");
      // using window.location to open the user's default mail client
      window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    });
  }

  // animations: respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return; // don't run animations if user prefers reduced motion
  }

  // nav entrance stagger
  document.querySelectorAll('nav a').forEach((el, i) => {
    el.style.animationDelay = (i * 80) + 'ms';
    el.classList.add('nav-animate');
  });

  // reveal-on-scroll for sections/cards
  const reveals = document.querySelectorAll('main .card, main article, aside .card, .hero-left, #contact form');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = (i * 60) + 'ms';
    io.observe(el);
  });

  // slight hover tilt for project cards
  document.querySelectorAll('.project').forEach(p => {
    p.addEventListener('mousemove', (e) => {
      const r = p.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) / r.width;
      const y = (e.clientY - r.top - r.height/2) / r.height;
      p.style.transform = `translateZ(0) rotateX(${ -y * 4 }deg) rotateY(${ x * 6 }deg)`;
    });
    p.addEventListener('mouseleave', () => p.style.transform = '');
  });
});

// small defensive export for testing environments (not required in browser)
if (typeof module !== 'undefined') module.exports = {};
