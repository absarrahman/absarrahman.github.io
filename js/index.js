/* ============================
   TWEAKS CONFIG
============================ */
const TWEAKS = /*EDITMODE-BEGIN*/{
  "accentHue": 1,
  "density": "comfortable",
  "showGrain": true
}/*EDITMODE-END*/;

/* ============================
   INIT ON DOM READY
============================ */
document.addEventListener('DOMContentLoaded', () => {
  renderExperience();
  renderSkills();
  initRevealObserver();
  initNav();
  initHamburger();
  initCursorGlow();
  initClock();
  initTweaks();
});

/* ============================
   REVEAL OBSERVER
============================ */
function initRevealObserver() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll('.r').forEach(el => io.observe(el));
}

/* ============================
   NAV: scrolled + active
============================ */
function initNav() {
  const topnav = document.getElementById('topnav');
  const sections = ['about', 'work', 'skills', 'contact'].map(id => document.getElementById(id));
  const links = [...document.querySelectorAll('nav.top ul a')];

  function onScroll() {
    topnav.classList.toggle('scrolled', window.scrollY > 20);
    const y = window.scrollY + window.innerHeight * 0.35;
    let active = null;
    for (const s of sections) { if (s.offsetTop <= y) active = s.id; }
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + active));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================
   HAMBURGER MENU
============================ */
function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
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

  // Close on link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}
function initCursorGlow() {
  const glow = document.getElementById('glow');
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
  function tick() {
    const now = new Date();
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago',
      hour: '2-digit',
      minute: '2-digit',
    });
    document.getElementById('clock').textContent = fmt.format(now) + ' CT ';
  }
  tick();
  setInterval(tick, 30000);
}

/* ============================
   TWEAKS
============================ */
function initTweaks() {
  applyTweaks(TWEAKS);

  const tweakPanel = document.getElementById('tweaks');

  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (d.type === '__activate_edit_mode') tweakPanel.classList.add('on');
    if (d.type === '__deactivate_edit_mode') tweakPanel.classList.remove('on');
  });

  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) { }

  document.getElementById('hue').addEventListener('input', (e) => persist({ accentHue: Number(e.target.value) }));
  document.getElementById('grainT').addEventListener('change', (e) => persist({ showGrain: e.target.checked }));
  document.querySelectorAll('.sw').forEach(sw => sw.addEventListener('click', () => persist({ accentHue: Number(sw.dataset.h) })));
}

function applyTweaks(t) {
  document.documentElement.style.setProperty('--hue', t.accentHue);
  document.getElementById('grain').style.display = t.showGrain ? '' : 'none';
  const sws = document.querySelectorAll('.sw');
  sws.forEach(s => s.classList.toggle('on', Number(s.dataset.h) === Number(t.accentHue)));
  const hueInput = document.getElementById('hue');
  if (hueInput) hueInput.value = t.accentHue;
  const grainInput = document.getElementById('grainT');
  if (grainInput) grainInput.checked = !!t.showGrain;
}

function persist(edits) {
  Object.assign(TWEAKS, edits);
  applyTweaks(TWEAKS);
  try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch (e) { }
}
