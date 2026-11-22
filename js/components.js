/* =========================================================
   Shared components — nav + footer injected on every page.
   Edit once here; all pages update.
   Each page sets <body data-page="..."> to mark the active link.
   ========================================================= */

const NAV_LINKS = [
  { label: 'For Founders',   href: 'for-founders.html',  key: 'for-founders' },
  { label: 'For Investors',  href: 'for-investors.html', key: 'for-investors' },
  { label: 'What We Do',     href: 'what-we-do.html',    key: 'what-we-do' },
  { label: 'Our Approach',   href: 'our-approach.html',  key: 'our-approach' },
  { label: 'About',          href: 'about.html',         key: 'about' },
  { label: 'Contact',        href: 'contact.html',       key: 'contact' },
];

const CONTACT_EMAIL = 'contact@ravzenventures.com';

function renderNav(activeKey) {
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}"${l.key === activeKey ? ' class="active"' : ''}>${l.label}</a>`
  ).join('');

  return `
  <nav class="nav">
    <div class="wrap">
      <a class="brandmark" href="index.html" aria-label="Ravzen Ventures — home">
        <img class="brand-logo" src="assets/ravzen-logo-dark.jpg" alt="Ravzen Ventures">
      </a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <div class="navlinks">${links}</div>
    </div>
  </nav>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  const navCol = [`<a href="index.html">Home</a>`]
    .concat(NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`)).join('');
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div>
          <a href="index.html" class="footer-brand" aria-label="Ravzen Ventures — home"><img class="brand-logo" src="assets/ravzen-logo-dark.jpg" alt="Ravzen Ventures LLP"></a>
          <p style="margin-top:14px;max-width:34ch;font-family:var(--font-serif);font-size:1.05rem;font-style:italic;color:var(--text-on-ink);">Think Clearly. Build Boldly. Act with Integrity.</p>
          <p style="margin-top:10px;max-width:34ch;">Michael Raj, Mumbai, India</p>
        </div>
        <div class="footer-cols">
          <div class="footer-col">
            <h4>Navigate</h4>
            ${navCol}
          </div>
          <div class="footer-col">
            <h4>For clients</h4>
            <a href="submit-a-project.html">Submit a Project</a>
            <a href="investor-enquiry.html">Investor Enquiry</a>
            <a href="faq.html">FAQ</a>
            <a href="careers.html">Careers</a>
          </div>
          <div class="footer-col">
            <h4>Legal</h4>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms-and-conditions.html">Terms &amp; Conditions</a>
            <a href="disclaimer.html">Disclaimer</a>
            <a href="cookie-policy.html">Cookie Policy</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; ${year} Ravzen Ventures LLP. All rights reserved.</div>
        <div>India · UAE · Singapore · USA</div>
      </div>
      <div class="footer-legal">
        This website is for information only. It is not an offer or solicitation to buy or sell any security or investment, and does not guarantee funding. Ravzen does not accept public deposits or promise fixed returns. Legal, tax, regulatory and structuring matters must be confirmed with qualified professional advisors. Foreign investment is subject to FEMA and applicable FDI conditions.
      </div>
    </div>
  </footer>`;
}

document.addEventListener('DOMContentLoaded', () => {
  // Favicon
  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = 'assets/ravzen-logo-dark.jpg';
    document.head.appendChild(icon);
  }

  // Theme colour — mobile browser chrome matches the brand ink
  if (!document.querySelector('meta[name="theme-color"]')) {
    const tc = document.createElement('meta');
    tc.name = 'theme-color'; tc.content = '#0b1220';
    document.head.appendChild(tc);
  }

  // Canonical URL — prevents duplicate-content penalties when hosting
  // serves the same page on http/https or www/non-www variants.
  const BASE = 'https://www.ravzenventures.com';
  if (!document.querySelector('link[rel="canonical"]')) {
    const canon = document.createElement('link');
    canon.rel = 'canonical';
    const path = window.location.pathname.replace(/\/index(\.html)?$/, '/');
    canon.href = BASE + path;
    document.head.appendChild(canon);
  }

  // og:url — fills in the missing Open Graph URL for social sharing
  if (!document.querySelector('meta[property="og:url"]')) {
    const ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    const path = window.location.pathname.replace(/\/index(\.html)?$/, '/');
    ogUrl.content = BASE + path;
    document.head.appendChild(ogUrl);
  }

  const activeKey = document.body.getAttribute('data-page') || '';

  const navMount = document.getElementById('nav-mount');
  if (navMount) navMount.innerHTML = renderNav(activeKey);

  // Breadcrumbs for pages that aren't in the primary nav, so users can
  // always step back. Injected into the page hero — no per-page markup needed.
  const CRUMBS = {
    'submit':     'Submit a Project',
    'investor':   'Investor Enquiry',
    'careers':    'Careers',
    'faq':        'FAQ',
    'privacy':    'Privacy Policy',
    'terms':      'Terms & Conditions',
    'disclaimer': 'Disclaimer',
    'cookie':     'Cookie Policy',
  };
  const crumbLabel = CRUMBS[activeKey];
  if (crumbLabel) {
    const heroWrap = document.querySelector('.page-hero .wrap');
    if (heroWrap) {
      heroWrap.insertAdjacentHTML('afterbegin',
        `<nav class="crumbs" aria-label="Breadcrumb">
           <a href="index.html">Home</a><span class="sep">›</span><span class="cur">${crumbLabel}</span>
         </nav>`);
    }
  }

  const footerMount = document.getElementById('footer-mount');
  if (footerMount) footerMount.innerHTML = renderFooter();

  // Mobile sticky bottom nav (5 key links)
  const bottomNav = document.createElement('nav');
  bottomNav.className = 'mobile-bottom-nav';
  bottomNav.setAttribute('aria-label', 'Mobile navigation');
  const mobileLinks = [
    { href: 'index.html',       key: 'home',         label: 'Home',     icon: '<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/>' },
    { href: 'for-founders.html',key: 'for-founders', label: 'Founders', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
    { href: 'for-investors.html',key:'for-investors', label: 'Investors',icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
    { href: 'what-we-do.html',  key: 'what-we-do',  label: 'Services', icon: '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>' },
    { href: 'contact.html',     key: 'contact',     label: 'Contact',  icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
  ];
  bottomNav.innerHTML = `<ul>${mobileLinks.map(l =>
    `<li><a href="${l.href}"${l.key === activeKey ? ' class="active"' : ''}>
      <svg viewBox="0 0 24 24" aria-hidden="true">${l.icon}</svg>
      ${l.label}
    </a></li>`
  ).join('')}</ul>`;
  document.body.appendChild(bottomNav);

  // Cookie-consent banner (per-viewer, remembered in localStorage)
  let consent = null;
  try { consent = localStorage.getItem('rv-cookie-consent'); } catch (e) {}
  if (!consent) {
    const bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.innerHTML = `
      <p>We use essential cookies to run this site, and optional ones to understand usage.
      See our <a href="cookie-policy.html">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button class="btn btn-ghost on-ivory" data-consent="declined">Decline</button>
        <button class="btn btn-primary" data-consent="accepted">Accept</button>
      </div>`;
    document.body.appendChild(bar);
    bar.querySelectorAll('[data-consent]').forEach(b =>
      b.addEventListener('click', () => {
        try { localStorage.setItem('rv-cookie-consent', b.getAttribute('data-consent')); } catch (e) {}
        bar.remove();
      })
    );
  }

  // Mobile menu toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Wire mailto forms — any <form data-mailto="Subject"> submits via email client
  initMailtoForms();

  // Signal to main.js that layout is mounted
  document.dispatchEvent(new CustomEvent('components:ready'));
});

function initMailtoForms() {
  document.querySelectorAll('form[data-mailto]').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate required text/email/textarea fields
      var missing = Array.from(form.elements).filter(function(el) {
        return el.required && el.type !== 'checkbox' && !el.value.trim();
      });
      if (missing.length) { missing[0].focus(); return; }

      // Validate required checkboxes
      var unchecked = Array.from(form.querySelectorAll('input[type="checkbox"][required]')).filter(function(cb) {
        return !cb.checked;
      });
      if (unchecked.length) { unchecked[0].focus(); return; }

      // Build body lines from all labelled fields (skip file inputs)
      var lines = [];
      Array.from(form.elements).forEach(function(el) {
        if (!el.name || el.type === 'file' || el.type === 'submit' || el.type === 'checkbox') return;
        var labelEl = form.querySelector('label[for="' + el.id + '"]');
        var labelText = labelEl ? labelEl.textContent.trim() : el.name;
        lines.push(labelText + ': ' + (el.value.trim() || '(not provided)'));
      });

      var subject = encodeURIComponent(form.getAttribute('data-mailto'));
      var body = encodeURIComponent(lines.join('\n\n'));
      var mailtoUrl = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;

      // Fire via hidden link click — more reliable than window.location.href
      var a = document.createElement('a');
      a.href = mailtoUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); }, 500);

      // Show confirmation with direct fallback link
      var btn = form.querySelector('[type="submit"]');
      var existing = form.querySelector('.mailto-confirm');
      if (existing) existing.remove();
      var confirm = document.createElement('p');
      confirm.className = 'mailto-confirm form-note';
      confirm.innerHTML = 'Your email client should open now. If it didn’t, <a href="' + mailtoUrl + '" style="color:var(--brass)">click here to send manually</a> or email us at <a href="mailto:' + CONTACT_EMAIL + '" style="color:var(--brass)">' + CONTACT_EMAIL + '</a>.';
      if (btn) btn.insertAdjacentElement('afterend', confirm);

      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Opening your email client…';
        btn.disabled = true;
        setTimeout(function() { btn.textContent = orig; btn.disabled = false; }, 4000);
      }
    });
  });
}
