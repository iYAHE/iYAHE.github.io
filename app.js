(() => {
  const D = window.PORTFOLIO;
  const U = 80;
  const NS = 'http://www.w3.org/2000/svg';
  const LINE_ORDER = ['W', 'M', 'D', 'C', 'A', 'J'];
  const $ = (id) => document.getElementById(id);
  const px = (v) => +(v * U).toFixed(1);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const el = (name, attrs = {}, parent) => {
    const node = document.createElementNS(NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  };

  /* Polyline with rounded corners. Points are in grid units. */
  const roundedPath = (pts, r = 0.22) => {
    let d = '';
    pts.forEach(([x, y], i) => {
      if (i === 0) { d += `M${px(x)} ${px(y)}`; return; }
      if (i === pts.length - 1) { d += ` L${px(x)} ${px(y)}`; return; }
      const [ax, ay] = pts[i - 1];
      const [bx, by] = pts[i + 1];
      const la = Math.hypot(ax - x, ay - y);
      const lb = Math.hypot(bx - x, by - y);
      const ra = Math.min(r, la / 2);
      const rb = Math.min(r, lb / 2);
      const sx = x + ((ax - x) / la) * ra;
      const sy = y + ((ay - y) / la) * ra;
      const ex = x + ((bx - x) / lb) * rb;
      const ey = y + ((by - y) / lb) * rb;
      d += ` L${px(sx)} ${px(sy)} Q${px(x)} ${px(y)} ${px(ex)} ${px(ey)}`;
    });
    return d;
  };

  const roundels = (lines) =>
    lines.map((l) => `<span class="rd rd-${l}" title="${esc(D.lines[l].name)} line">${l}</span>`).join('');

  const isBuilding = (s) => s.status === 'Pre-launch' || s.status === 'Prototype';

  /* ---------- Map ---------- */
  const svg = $('map');

  // The Nile, as every Cairo map has it.
  el('path', {
    class: 'nile',
    d: `M${px(9.95)} ${px(7.8)} C${px(9.2)} ${px(6.3)}, ${px(9.9)} ${px(5.0)}, ${px(9.35)} ${px(3.8)} S${px(9.7)} ${px(1.4)}, ${px(8.9)} 0`,
  }, svg);
  const nileLabel = el('text', { class: 'nile-label', x: px(10.25), y: px(7.5) }, svg);
  nileLabel.textContent = 'Nile · النيل';

  const gLines = el('g', { class: 'lines-g' }, svg);
  ['J', 'A', 'C', 'D', 'M', 'W'].forEach((id, i) => {
    const d = roundedPath(D.lines[id].path);
    el('path', { class: `ln ln-${id}`, d, pathLength: 1, style: `--i:${i}` }, gLines);
    if (id === 'J') el('path', { class: 'ln ln-J ln-J-core', d, pathLength: 1, style: `--i:${i}` }, gLines);
  });

  const gStations = el('g', { class: 'stations-g' }, svg);
  const stationNodes = {};

  D.stations.forEach((s) => {
    const cx = px(s.cx ?? s.x);
    const cy = px(s.cy ?? s.y);
    const g = el('g', {
      class: `st st-${s.marker} ${s.lines.map((l) => 'l-' + l).join(' ')}${isBuilding(s) ? ' building' : ''}`,
      tabindex: 0,
      role: 'button',
      'aria-pressed': 'false',
      'aria-label': `${s.full}. ${s.kind}. ${s.status}. Lines: ${s.lines.map((l) => D.lines[l].name).join(', ')}.`,
      'data-id': s.id,
      style: `--line: var(--${s.lines[0].toLowerCase()})`,
    }, gStations);

    const ringR = s.marker === 'hub' ? 42 : s.marker === 'joint' ? 19 : 27;
    el('circle', { class: 'ring', cx, cy, r: ringR }, g);
    el('circle', { class: 'hit', cx, cy, r: 30 }, g);

    if (s.marker === 'hub') {
      el('rect', { class: 'mk', x: cx - 26, y: cy - 24, width: 52, height: 52, rx: 15 }, g);
      el('circle', { class: 'mk-dot', cx, cy: cy + 2, r: 7 }, g);
    } else if (s.marker === 'cap') {
      el('rect', { class: 'mk', x: cx - 13, y: cy - s.h / 2, width: 26, height: s.h, rx: 13 }, g);
    } else {
      const r = s.r ?? (s.marker === 'x' ? 13 : s.marker === 'joint' ? 8 : 10);
      el('circle', { class: 'mk', cx, cy, r }, g);
    }

    const name = el('text', { class: 'st-name', x: px(s.label.x), y: px(s.label.y), 'text-anchor': s.label.anchor }, g);
    name.textContent = s.name;
    if (s.ar && s.arLabel) {
      const ar = el('text', { class: 'st-ar', x: px(s.arLabel.x), y: px(s.arLabel.y), 'text-anchor': s.arLabel.anchor, lang: 'ar', direction: 'rtl' }, g);
      // In RTL text, "start" is the right edge. Flip so the label stays where the map expects it.
      if (s.arLabel.anchor === 'start') ar.setAttribute('text-anchor', 'end');
      ar.textContent = s.ar;
    }

    g.addEventListener('click', () => select(s.id, true));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(s.id, true); }
    });
    stationNodes[s.id] = g;
  });

  /* ---------- Line keys (filter) ---------- */
  const keys = $('keys');
  let focusLine = '';
  const setFocus = (id) => {
    focusLine = focusLine === id ? '' : id;
    if (focusLine) svg.dataset.focus = focusLine; else delete svg.dataset.focus;
    document.querySelectorAll('[data-line-key]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lineKey === focusLine));
    });
  };
  keys.innerHTML = LINE_ORDER.map((id) =>
    `<button type="button" class="key" data-line-key="${id}" aria-pressed="false">` +
    `<span class="rd rd-${id}" aria-hidden="true">${id}</span>${esc(D.lines[id].name)}</button>`).join('');
  keys.addEventListener('click', (e) => {
    const b = e.target.closest('[data-line-key]');
    if (b) setFocus(b.dataset.lineKey);
  });

  /* ---------- Station board ---------- */
  const board = $('board');
  let current = '';

  const renderBoard = (s) => {
    const idx = D.stations.indexOf(s);
    const stats = s.stats.length
      ? `<ul class="stats">${s.stats.map(([v, l]) => `<li><b>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>`
      : '';
    const visit = s.url
      ? `<a class="btn board-visit" href="${esc(s.url)}" rel="noopener">Visit ${esc(s.url.replace('https://', ''))}</a>`
      : '';
    board.innerHTML = `
      <div class="board-top">
        <span class="board-kicker">This station</span>
        <span class="board-count">${idx + 1} / ${D.stations.length}</span>
      </div>
      <h3 class="board-name">${esc(s.full)}${s.ar ? ` <span class="ar" lang="ar" dir="rtl">${esc(s.ar)}</span>` : ''}</h3>
      <p class="board-kind">${esc(s.kind)}</p>
      <div class="board-lines">${roundels(s.lines)}</div>
      <dl class="meta">
        <div><dt>Role</dt><dd>${esc(s.role)}</dd></div>
        <div><dt>When</dt><dd>${esc(s.when)}</dd></div>
        <div><dt>Status</dt><dd>${esc(s.status)}</dd></div>
      </dl>
      <p class="board-sum">${esc(s.summary)}</p>
      <ul class="pts">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
      ${stats}
      <p class="chips">${s.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
      ${visit}
      <div class="board-nav">
        <button type="button" data-step="-1">Previous</button>
        <button type="button" data-step="1">Next station</button>
      </div>`;
  };

  function select(id, fromUser) {
    const s = D.stations.find((x) => x.id === id);
    if (!s) return;
    if (current && stationNodes[current]) {
      stationNodes[current].classList.remove('on');
      stationNodes[current].setAttribute('aria-pressed', 'false');
    }
    current = id;
    stationNodes[id].classList.add('on');
    stationNodes[id].setAttribute('aria-pressed', 'true');
    renderBoard(s);
    document.querySelectorAll('[data-show]').forEach((b) => {
      b.closest('li').classList.toggle('is-current', b.dataset.show === id);
    });
    if (fromUser && window.matchMedia('(max-width: 1079px)').matches) {
      board.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  board.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]');
    if (!b) return;
    const i = D.stations.findIndex((x) => x.id === current);
    const next = D.stations[(i + Number(b.dataset.step) + D.stations.length) % D.stations.length];
    select(next.id, false);
  });

  /* ---------- Lines section ---------- */
  $('line-rows').innerHTML = LINE_ORDER.map((id) => {
    const served = D.stations.filter((s) => s.lines.includes(id)).map((s) => esc(s.name)).join(' · ');
    const L = D.lines[id];
    return `<article class="line-row line-${id}">
      <span class="rd rd-${id} rd-lg" aria-hidden="true">${id}</span>
      <div class="line-body">
        <h3>${esc(L.name)} line <span class="ar" lang="ar" dir="rtl">${esc(L.ar)}</span></h3>
        <p>${esc(L.tech)}</p>
        <p class="serves"><span>Calls at</span> ${served}</p>
      </div>
      <span class="line-swatch" aria-hidden="true"></span>
    </article>`;
  }).join('');

  $('depot-rows').innerHTML = D.depot.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

  /* ---------- Timetable ---------- */
  const tt = $('timetable');
  tt.innerHTML = D.stations.map((s) => `
    <li>
      <div class="tt-lines">${roundels(s.lines)}</div>
      <div class="tt-main">
        <h3>${esc(s.full)}${s.ar ? ` <span class="ar" lang="ar" dir="rtl">${esc(s.ar)}</span>` : ''}</h3>
        <p class="tt-kind">${esc(s.kind)}</p>
        <p class="tt-sum">${esc(s.summary)}</p>
        <p class="tt-stack">${s.stack.map(esc).join(' · ')}</p>
      </div>
      <div class="tt-side">
        <span class="pill${isBuilding(s) ? ' pill-build' : ''}">${esc(s.status)}</span>
        <span class="tt-when">${esc(s.when)}</span>
        <span class="tt-role">${esc(s.role)}</span>
        <span class="tt-actions">
          <button type="button" class="link" data-show="${s.id}">Show on map</button>
          ${s.url ? `<a class="link" href="${esc(s.url)}" rel="noopener">Visit site</a>` : ''}
        </span>
      </div>
    </li>`).join('');
  tt.addEventListener('click', (e) => {
    const b = e.target.closest('[data-show]');
    if (!b) return;
    select(b.dataset.show, false);
    $('network').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------- Service record ---------- */
  $('record-rows').innerHTML = D.record.map(([when, what]) =>
    `<li><time>${esc(when)}</time><p>${esc(what)}</p></li>`).join('');

  /* ---------- Copy address ---------- */
  const copy = $('copy');
  copy.addEventListener('click', async () => {
    const addr = $('mail-addr');
    try {
      await navigator.clipboard.writeText(addr.textContent.trim());
      copy.textContent = 'Copied';
    } catch (err) {
      const range = document.createRange();
      range.selectNodeContents(addr);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copy.textContent = 'Selected, press Ctrl+C';
    }
    setTimeout(() => { copy.textContent = 'Copy address'; }, 2200);
  });

  /* ---------- Theme ---------- */
  const themeBtn = $('theme');
  const root = document.documentElement;
  const isDark = () => root.dataset.theme
    ? root.dataset.theme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const paintTheme = () => {
    themeBtn.textContent = isDark() ? 'Day service' : 'Night service';
    themeBtn.setAttribute('aria-pressed', String(isDark()));
  };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (err) { /* private mode */ }
    paintTheme();
  });
  paintTheme();

  select('khashab', false);

  // On narrow screens the map scrolls sideways: start with the hub in view.
  const scroller = svg.parentElement;
  if (scroller.scrollWidth > scroller.clientWidth) {
    const hub = D.stations.find((s) => s.id === 'khashab');
    scroller.scrollLeft = (hub.x * U / 1064) * scroller.scrollWidth - scroller.clientWidth / 2;
  }
})();
