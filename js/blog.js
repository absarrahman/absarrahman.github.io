/* ============================
   BLOG — render, search, tweaks, init
   Depends on: shared.js
   Data:       fetched from BLOG_DATA_URL
============================ */

/* ============================
   CONFIG
============================ */
const BASE_URL = 'https://absarrahman.github.io/'
const BLOG_DATA_URL = `${BASE_URL}writing/api/posts.json`;

/* ============================
   TWEAKS  (mirrors index.js)
============================ */
const TWEAKS = { accentHue: 1, showGrain: true };

function applyTweaks(t) {
  document.documentElement.style.setProperty('--hue', t.accentHue);
  document.documentElement.style.setProperty(
    '--accent',
    `oklch(0.59 0.24 ${t.accentHue})`
  );
  const grain = document.getElementById('grain');
  if (grain) grain.style.display = t.showGrain ? '' : 'none';
  document.querySelectorAll('.sw').forEach(s =>
    s.classList.toggle('on', Number(s.dataset.h) === Number(t.accentHue))
  );
  const hueInput = document.getElementById('hue');
  if (hueInput) hueInput.value = t.accentHue;
  const grainInput = document.getElementById('grainT');
  if (grainInput) grainInput.checked = !!t.showGrain;
}

function persistTweak(edits) {
  Object.assign(TWEAKS, edits);
  applyTweaks(TWEAKS);
  try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch (e) { }
}

function initTweaks() {
  applyTweaks(TWEAKS);
  const panel = document.getElementById('tweaks');
  if (!panel) return;
  window.addEventListener('message', (ev) => {
    const d = ev.data || {};
    if (d.type === '__activate_edit_mode') panel.classList.add('on');
    if (d.type === '__deactivate_edit_mode') panel.classList.remove('on');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) { }
  document.getElementById('hue').addEventListener('input', e =>
    persistTweak({ accentHue: Number(e.target.value) })
  );
  document.getElementById('grainT').addEventListener('change', e =>
    persistTweak({ showGrain: e.target.checked })
  );
  document.querySelectorAll('.sw').forEach(sw =>
    sw.addEventListener('click', () => persistTweak({ accentHue: Number(sw.dataset.h) }))
  );
}

/* ============================
   SKELETON
============================ */
function showSkeleton() {
  const body = document.getElementById('indexBody');
  // Render 2 fake year blocks, 3 rows each
  const years = [['20', '26', 3], ['20', '25', 3]];
  body.innerHTML = years.map(([a, b, n]) => `
        <div class="skeleton-block">
            <div class="skeleton-year">
                <div class="sk-yr"></div>
            </div>
            ${Array.from({ length: n }, () => `
            <div class="skeleton-row">
                <div class="sk-date"></div>
                <div>
                    <div class="sk-title"></div>
                    <div class="sk-dek"></div>
                    <div class="sk-dek2"></div>
                    <span class="sk-tag"></span>
                    <span class="sk-tag"></span>
                </div>
                <div class="sk-read"></div>
            </div>`).join('')}
        </div>
    `).join('');
}

function clearSkeleton() {
  document.getElementById('indexBody').innerHTML = '';
}

/* ============================
   ERROR STATE
============================ */
function showError(message) {
  clearSkeleton();
  const el = document.getElementById('fetchError');
  el.querySelector('.err-msg').textContent = message || 'Could not load posts.';
  el.classList.add('on');
}

function hideError() {
  document.getElementById('fetchError').classList.remove('on');
}

/* ============================
   FETCH
============================ */
async function fetchPosts() {
  showSkeleton();
  hideError();

  try {
    const res = await fetch(BLOG_DATA_URL);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();

    // Accept either an array directly or { posts: [...] }
    const posts = Array.isArray(data) ? data : data.posts;
    if (!Array.isArray(posts)) throw new Error('Unexpected data format');

    clearSkeleton();
    renderPosts(posts);
    updatePostCount(posts.length);
    initSearch(posts);
    initRevealObserver(); // shared.js — re-run after DOM update
  } catch (err) {
    console.error('[blog] fetch failed:', err);
    showError(err.message);
  }
}

/* ============================
   RENDER
============================ */
function fmtShort(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
}

function renderPosts(posts) {
  const body = document.getElementById('indexBody');
  body.innerHTML = '';

  const groups = {};
  posts.forEach(p => {
    const yr = p.date.slice(0, 4);
    (groups[yr] = groups[yr] || []).push(p);
  });
  const years = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  years.forEach((yr, gi) => {
    const block = document.createElement('div');
    block.className = 'year-block r';
    block.style.transitionDelay = (gi * 60) + 'ms';
    const items = groups[yr];
    block.innerHTML = `
            <div class="year-head">
                <div class="yr">${yr.slice(0, 2)}<em>${yr.slice(2)}</em></div>
                <div class="meta">${items.length} ${items.length === 1 ? 'post' : 'posts'}</div>
            </div>
            <div class="rows" data-year="${yr}"></div>
        `;
    body.appendChild(block);

    const rows = block.querySelector('.rows');
    items.forEach(p => {
      const a = document.createElement('a');
      a.className = 'post-row';
      a.href = `#/${p.slug}`;
      a.dataset.title = p.title.toLowerCase();
      a.dataset.dek = p.dek.toLowerCase();
      a.dataset.tags = p.tags.join(',').toLowerCase();
      a.innerHTML = `
                <div class="date">${fmtShort(p.date)} · ${p.date.slice(0, 4)}</div>
                <div class="body">
                    <h2>${p.title}</h2>
                    <p class="dek">${p.dek}</p>
                    <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
                </div>
                <div class="meta-right">
                    <span class="read">${p.read} min read</span>
                    <span class="arrow">→</span>
                </div>
            `;
      rows.appendChild(a);
    });
  });
}

function updatePostCount(n) {
  const el = document.getElementById('total-bytes');
  if (el) el.textContent = n;
  // Update eyebrow text if it follows the "Writing · N posts" pattern
  const eyebrow = document.querySelector('.hero .eyebrow');
  if (eyebrow) {
    eyebrow.textContent = `Writing · ${n} ${n === 1 ? 'post' : 'posts'} · est. 2023`;
  }
}

/* ============================
   SEARCH
============================ */
function escapeReg(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function highlight(text, term) {
  if (!term) return text;
  return text.replace(new RegExp('(' + escapeReg(term) + ')', 'ig'), '<mark class="hl">$1</mark>');
}

function initSearch(posts) {
  const q = document.getElementById('q');
  const empty = document.getElementById('empty');
  const resultN = document.getElementById('result-n');
  const cursor = document.getElementById('cursor');
  if (!q) return;

  if (resultN) resultN.textContent = posts.length;

  function applyFilter() {
    const term = q.value.trim().toLowerCase();
    let visible = 0;

    document.querySelectorAll('.post-row').forEach(row => {
      const match = !term
        || row.dataset.title.includes(term)
        || row.dataset.dek.includes(term)
        || row.dataset.tags.includes(term);
      row.classList.toggle('hidden', !match);
      if (match) visible++;

      const h2 = row.querySelector('h2');
      const dek = row.querySelector('.dek');
      h2.dataset.orig = h2.dataset.orig || h2.textContent;
      dek.dataset.orig = dek.dataset.orig || dek.textContent;
      h2.innerHTML = highlight(h2.dataset.orig, term);
      dek.innerHTML = highlight(dek.dataset.orig, term);
      row.querySelectorAll('.tags span').forEach(s => {
        s.dataset.orig = s.dataset.orig || s.textContent;
        s.innerHTML = highlight(s.dataset.orig, term);
      });
    });

    document.querySelectorAll('.year-block').forEach(b => {
      b.style.display = b.querySelectorAll('.post-row:not(.hidden)').length ? '' : 'none';
    });

    if (empty) empty.classList.toggle('on', visible === 0);
    if (resultN) resultN.textContent = visible;
  }

  q.addEventListener('input', applyFilter);

  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== q) {
      e.preventDefault();
      q.focus();
    } else if (e.key === 'Escape' && document.activeElement === q) {
      q.value = '';
      applyFilter();
      q.blur();
    }
  });

  if (cursor) {
    q.addEventListener('focus', () => { cursor.style.display = 'inline-block'; });
    q.addEventListener('blur', () => { cursor.style.display = q.value ? 'none' : 'inline-block'; });
    q.addEventListener('input', () => { cursor.style.display = q.value ? 'none' : 'inline-block'; });
  }
}

/* ============================
   LAST LOGIN  (terminal flavour text)
============================ */
function initLastLogin() {
  const el = document.getElementById('lastlogin');
  if (!el) return;
  const d = new Date();
  el.textContent =
    d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    + ' '
    + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/* ============================
   BOOT
============================ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  initCursorGlow();
  initClock();
  initLastLogin();
  initTweaks();

  // Retry button in error state
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) retryBtn.addEventListener('click', fetchPosts);

  fetchPosts();
});
