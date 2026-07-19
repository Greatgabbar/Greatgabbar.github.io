/* ============================================================
   ✨ CUSTOMIZE ME — edit the roles below for the hero typing effect
   ============================================================ */
const ROLES = [
  'high-performance systems.',
  'GenAI-powered products.',
  'things 40M people use.',
  'delightful web apps.',
];

/* ============ Typing effect ============ */
const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const word = ROLES[roleIdx];
  typedEl.textContent = word.slice(0, charIdx);
  let delay = deleting ? 40 : 75;

  if (!deleting && charIdx === word.length) {
    delay = 1800; // pause at full word
    deleting = true;
  } else if (deleting && charIdx === 0) {
    deleting = false;
    roleIdx = (roleIdx + 1) % ROLES.length;
    delay = 400;
  } else {
    charIdx += deleting ? -1 : 1;
  }
  setTimeout(typeLoop, delay);
}
typeLoop();

/* ============ Scroll reveal ============ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ============ Animated stat counters ============ */
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-num').forEach((el) => statObserver.observe(el));

/* ============ Navbar shadow on scroll ============ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ============ Mobile menu ============ */
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);
