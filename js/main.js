/* =========================================================
   Ravzen Ventures — interactions & animation
   Libraries (CDN, loaded per page):
     - GSAP + ScrollTrigger  (available; reveals use IO for reliability)
     - Lenis                 (smooth scrolling)
   Features: smooth scroll · staggered entrance reveals · scroll-shrink
   nav · magnetic buttons · custom cursor. All degrade gracefully and
   respect prefers-reduced-motion and coarse (touch) pointers.
   ========================================================= */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Lenis smooth scroll ---------- */
function initLenis() {
  if (prefersReduced || typeof Lenis === 'undefined') return null;
  const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
  lenis.on('scroll', () => requestAnimationFrame(checkReveals)); // reveals during smooth scroll

  // In-page anchor links scroll smoothly through Lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;                 // "#" handled by the global guard
      const t = document.querySelector(id);
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); }
    });
  });
  return lenis;
}

/* ---------- Staggered entrance reveals ----------
   Scroll-position based (getBoundingClientRect), not IntersectionObserver:
   this fires reliably regardless of how the page is scrolled AND regardless
   of whether the browser considers the tab "visible", so content can never
   get stuck invisible. A safety timeout reveals everything as a last resort. */
let revealItems = [];
function checkReveals() {
  if (!revealItems.length) return;
  const vh = window.innerHeight;
  revealItems = revealItems.filter(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > 0) { el.classList.add('in'); return false; }
    return true;
  });
}
function initReveals() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;

  // Stagger consecutive siblings so grids/lists cascade in.
  const seen = new Map();
  items.forEach(el => {
    const p = el.parentElement;
    const idx = seen.get(p) || 0;
    seen.set(p, idx + 1);
    el.style.setProperty('--reveal-delay', Math.min(idx, 10) * 70 + 'ms');
  });

  if (prefersReduced) { items.forEach(el => el.classList.add('in')); return; }

  revealItems = items.slice();
  const onScroll = () => requestAnimationFrame(checkReveals);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  checkReveals();                       // reveal above-the-fold immediately
  setTimeout(checkReveals, 200);        // catch late layout/fonts
  // Absolute safety net: never leave content hidden.
  setTimeout(() => items.forEach(el => el.classList.add('in')), 2600);
}

/* ---------- Scroll-shrink nav ---------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  if (!finePointer || prefersReduced) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ---------- Custom cursor (dot + trailing ring) ---------- */
function initCursor() {
  if (!finePointer || prefersReduced) return;

  const dot = document.createElement('div');
  dot.className = 'rv-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'rv-cursor-ring';
  document.body.append(dot, ring);
  document.documentElement.classList.add('has-custom-cursor');

  let mx = -100, my = -100;   // mouse target (off-screen until first move)
  let rx = mx, ry = my;      // ring (eased)

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Grow over interactive elements
  const interactive = 'a, button, .btn, input, textarea, select, .card, .svc, .bignum .row, .faq-q, .sector-chip, .logo-chip, .brandmark';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactive)) document.documentElement.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactive)) document.documentElement.classList.remove('cursor-hover');
  });
  document.addEventListener('mousedown', () => document.documentElement.classList.add('cursor-down'));
  document.addEventListener('mouseup', () => document.documentElement.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => document.documentElement.classList.add('cursor-out'));
  document.addEventListener('mouseenter', () => document.documentElement.classList.remove('cursor-out'));
}

/* ---------- Placeholder links: stop "#" from jumping to top ---------- */
function initPlaceholderLinks() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });
}

/* ---------- Boot ---------- */
function boot() {
  initLenis();
  initReveals();
  initNavScroll();
  initMagnetic();
  initCursor();
  initPlaceholderLinks();
}
document.addEventListener('components:ready', boot);

/* Fallback if components.js is absent */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { if (!document.querySelector('[data-reveal].in')) initReveals(); }, 300);
});
