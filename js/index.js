/* ============================
   INDEX PAGE — tweaks + init
   Shared utilities live in shared.js
============================ */

/* ============================
   TWEAKS CONFIG
============================ */
const TWEAKS = /*EDITMODE-BEGIN*/{
  "accentHue": 1,
  "density": "comfortable",
  "showGrain": true
}/*EDITMODE-END*/;

/* ============================
   INIT
============================ */
document.addEventListener('DOMContentLoaded', () => {
  renderExperience();   // experience.js
  renderSkills();       // skills.js
  initRevealObserver(); // shared.js
  initNav();            // shared.js
  initHamburger();      // shared.js
  initCursorGlow();     // shared.js
  initClock();          // shared.js
  initTweaks();
});

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
  document.querySelectorAll('.sw').forEach(sw =>
    sw.addEventListener('click', () => persist({ accentHue: Number(sw.dataset.h) }))
  );
}

function applyTweaks(t) {
  document.documentElement.style.setProperty('--hue', t.accentHue);
  document.getElementById('grain').style.display = t.showGrain ? '' : 'none';
  document.querySelectorAll('.sw').forEach(s =>
    s.classList.toggle('on', Number(s.dataset.h) === Number(t.accentHue))
  );
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
