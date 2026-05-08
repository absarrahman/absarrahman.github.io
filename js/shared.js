/* ============================
   SHARED UTILITIES
   Used by index.html + blog.html
============================ */

/* ============================
   REVEAL OBSERVER
============================ */
function initRevealObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll('.r').forEach(el => io.observe(el));
}

/* ============================
   NAV: scrolled border + active section highlight
   Only anchors that start with "#" are considered for scroll-spy,
   so cross-page links (blog.html, index.html#section) are ignored.
============================ */
function initNav() {
  const topnav = document.getElementById('topnav');
  if (!topnav) return;

  const sectionIds = [...document.querySelectorAll('main [id]')].map(el => el.id);
  const anchorLinks = [...document.querySelectorAll('nav.top ul a')]
    .filter(a => a.getAttribute('href').startsWith('#'));

  function onScroll() {
    topnav.classList.toggle('scrolled', window.scrollY > 20);
    const y = window.scrollY + window.innerHeight * 0.35;
    let active = null;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= y) active = id;
    }
    anchorLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + active));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================
   HAMBURGER MENU
============================ */
function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    toggle.classList.remove('open');
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* ============================
   CURSOR GLOW (desktop only)
============================ */
function initCursorGlow() {
  const glow = document.getElementById('glow');
  if (!glow) return;
  let glowOn = false;

  window.addEventListener('pointermove', (e) => {
    if (!glowOn) { glow.classList.add('on'); glowOn = true; }
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  window.addEventListener('pointerleave', () => {
    glow.classList.remove('on');
    glowOn = false;
  });
}

/* ============================
   CLOCK
============================ */
function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;

  function tick() {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit'
    });
    el.textContent = fmt.format(new Date()) + ' CT ';
  }
  tick();
  setInterval(tick, 30000);
}
