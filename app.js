(() => {
  const D = window.PORTFOLIO;
  const LINE_ORDER = ['W', 'M', 'D', 'C', 'A', 'J'];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  const byId = Object.fromEntries(D.stations.map((s) => [s.id, s]));
  const ride = D.ride.map((id) => byId[id]);
  const joint = D.joint.map((id) => byId[id]);

  const pill = (s) => {
    const cls = s.status === 'Live' || s.status === 'In use' ? ' pill-live'
      : s.status === 'Pre-launch' || s.status === 'Prototype' ? ' pill-build' : '';
    return `<span class="pill${cls}">${esc(s.status)}</span>`;
  };
  const host = (url) => url.replace('https://', '');
  const rd = (l) => `<span class="rd rd-${l}" aria-hidden="true">${l}</span>`;

  /* ---------- First screen: line key and route index ---------- */
  $('legend').innerHTML = LINE_ORDER.slice(0, 5).map((l) => `<li>${rd(l)}${esc(D.lines[l].name)}</li>`).join('');

  $('route-list').innerHTML = ride.map((s, i) => `
    <li style="--i:${i}"><a href="#stop-${s.id}">
      <span class="r-dot" aria-hidden="true"></span>
      <span class="r-n">${pad(i + 1)}</span>
      <span class="r-name"><b>${esc(s.full)}</b><small>${esc(s.kind)}</small></span>
      ${pill(s)}
    </a></li>`).join('') + `
    <li class="j" style="--i:${ride.length}"><a href="#joint">
      <span class="r-dot" aria-hidden="true"></span>
      <span class="r-n">J</span>
      <span class="r-name"><b>Joint service line</b><small>${joint.length} team projects for agency clients</small></span>
      <span class="pill">Team</span>
    </a></li>`;

  /* ---------- Strip map in the carriage bar ---------- */
  const strip = $('strip');
  strip.innerHTML = ride.map((s, i) => `
    <li><a href="#stop-${s.id}" aria-label="Stop ${i + 1}: ${esc(s.full)}">
      <span class="s-dot" aria-hidden="true"></span><span class="s-name" aria-hidden="true">${esc(s.name)}</span>
    </a></li>`).join('') + `
    <li class="j"><a href="#joint" aria-label="Joint service line: team projects">
      <span class="s-dot" aria-hidden="true"></span><span class="s-name" aria-hidden="true">Team</span>
    </a></li>`;
  const stripNodes = [...strip.children];

  /* ---------- Stops: one screen each ---------- */
  // A stop shows the live site, or the steps of how it works when there is nothing public to show.
  const visual = (s) => {
    if (s.shot) {
      return `
        <a class="shot" href="${esc(s.url)}" target="_blank" rel="noopener">
          <span class="shot-bar" aria-hidden="true"><i></i><i></i><i></i><span class="shot-url">${esc(host(s.url))}</span><span class="shot-go">Open ↗</span></span>
          <img src="${esc(s.shot)}" width="1200" height="750" alt="${esc(s.full)} home page" loading="lazy" decoding="async">
        </a>`;
    }
    if (s.flow) {
      return `
        <div class="flow">
          <p class="flow-k">How it works</p>
          <ol style="--n:${s.flow.length}">${s.flow.map((f) => `<li><span>${esc(f)}</span></li>`).join('')}</ol>
        </div>`;
    }
    return '';
  };

  $('stops').innerHTML = ride.map((s, i) => {
    const nums = s.stats.length
      ? `<ul class="nums rv" style="--i:4">${s.stats.map(([v, l]) =>
        `<li><b${/^\d+$/.test(v) ? ` data-n="${v}"` : ''}>${esc(v)}</b><span>${esc(l)}</span></li>`).join('')}</ul>`
      : '';
    const visit = s.url
      ? `<p class="stop-cta rv" style="--i:5"><a class="btn" href="${esc(s.url)}" target="_blank" rel="noopener">Visit ${esc(host(s.url))} <span aria-hidden="true">↗</span></a></p>`
      : '';
    return `
    <section class="stop" id="stop-${s.id}" aria-labelledby="h-${s.id}">
      <div class="stop-in">
        <div class="stop-text">
          <p class="stop-eyebrow rv">
            <span class="plat">${pad(i + 1)}</span>
            <span>Stop ${i + 1} of ${ride.length}</span>
            ${pill(s)}
            <span>${esc(s.when)}</span>
            <span>${esc(s.role)}</span>
          </p>
          <div class="sign rv" style="--i:1">
            <span class="mk" aria-hidden="true"></span>
            <h2 id="h-${s.id}">${esc(s.full)}</h2>
          </div>
          <p class="stop-kind rv" style="--i:2">${esc(s.kind)}</p>
          <ul class="xchg rv" style="--i:2" aria-label="Skills used">${s.lines.map((l) =>
            `<li>${rd(l)}${esc(D.lines[l].name)}</li>`).join('')}</ul>
          <p class="stop-sum rv" style="--i:3">${esc(s.summary)}</p>
          ${nums}
          ${visit}
        </div>
        <div class="stop-show rv" style="--i:3">
          ${visual(s)}
          <div class="stop-card">
            <h3>What I built</h3>
            <ul class="pts">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
            <p class="chips">${s.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
          </div>
        </div>
      </div>
    </section>`;
  }).join('');

  /* ---------- Joint service: team projects ---------- */
  $('jstops').innerHTML = joint.map((s) => `
    <li class="jstop" id="stop-${s.id}">
      <span class="mk mk-j" aria-hidden="true"></span>
      <div class="j-id rv">
        <h3>${esc(s.full)}</h3>
        <p class="j-kind">${esc(s.kind)}</p>
        <p class="j-meta">${pill(s)}<span>${esc(s.when)}</span><span>${esc(s.role)}</span></p>
      </div>
      <div class="j-body rv" style="--i:1">
        <p>${esc(s.summary)}</p>
        <ul class="pts">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <p class="j-stack">${s.stack.map(esc).join(' · ')}${s.url
          ? ` · <a class="link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(host(s.url))} ↗</a>` : ''}</p>
      </div>
    </li>`).join('');

  /* ---------- Skills, depot, record ---------- */
  // Split a tech list on commas, but not on the commas inside brackets.
  const items = (tech) => tech.split(/,\s*(?![^()]*\))/).map((t) => t.trim());
  $('line-rows').innerHTML = LINE_ORDER.map((id) => {
    const L = D.lines[id];
    const served = [...ride, ...joint].filter((s) => s.lines.includes(id)).map((s) => esc(s.name)).join(' · ');
    const body = id === 'J'
      ? `<p class="line-text">${esc(L.tech)}</p>`
      : `<ul class="line-chips">${items(L.tech).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
    return `<article class="line-card line-${id}">
      <header><span class="rd rd-${id} rd-lg" aria-hidden="true">${id}</span><h3>${esc(L.name)} line</h3></header>
      ${body}
      <p class="serves"><span>Calls at</span> ${served}</p>
    </article>`;
  }).join('');
  $('depot-rows').innerHTML = D.depot.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  $('record-rows').innerHTML = D.record.map(([when, what]) =>
    `<li><time>${esc(when)}</time><p>${esc(what)}</p></li>`).join('');

  /* ---------- The ride: train position drives the display, the strip map and the address ---------- */
  const car = $('car');
  const train = $('train');
  const ledK = $('led-k');
  const ledV = $('led-v');
  const led = ledK.parentElement;
  const dockN = $('dock-n');

  // Every marker the train passes. `node` is its dot on the strip map.
  const points = [];
  ride.forEach((s, i) => {
    const sec = $('stop-' + s.id);
    points.push({ mk: sec.querySelector('.mk'), sec, label: s.name, node: i });
  });
  points.push({ mk: document.querySelector('.joint-head .mk'), sec: $('joint'), label: 'Joint service', node: ride.length });
  joint.forEach((s) => {
    const li = $('stop-' + s.id);
    points.push({ mk: li.querySelector('.mk'), sec: li, label: s.name, node: ride.length });
  });
  const firstOfNode = stripNodes.map((_, n) => points.findIndex((p) => p.node === n));

  // Places the step controls and the arrow keys move between, top to bottom.
  const steps = [{ el: $('hall'), label: 'Go' }];
  ride.forEach((s, i) => steps.push({ el: $('stop-' + s.id), label: pad(i + 1) }));
  steps.push({ el: $('joint'), label: 'J' });
  ['skills', 'record', 'ticket'].forEach((id) => steps.push({ el: $(id), label: 'End' }));
  const stepIndex = () => {
    const limit = car.offsetHeight + 28;
    let i = 0;
    steps.forEach((s, k) => { if (s.el.getBoundingClientRect().top <= limit) i = k; });
    return i;
  };

  // How far down the screen the train rides, as a share of its height (--ride in the stylesheet).
  let rideLine = 0.26;
  const readRide = () => { rideLine = (parseFloat(getComputedStyle(root).getPropertyValue('--ride')) || 26) / 100; };
  readRide();

  let lastY = window.scrollY;
  let lastKey = '';
  let nowSec = null;
  let nowNode = -2;
  let lastStep = -1;
  let queued = false;

  // Phone-width labels for the display.
  const SHORT = { 'This stop': 'Now', 'Next stop': 'Next', 'Now boarding': 'Boarding', Terminus: 'End' };
  const setLed = (k, v) => {
    const key = k + '|' + v;
    if (key === lastKey) return;
    lastKey = key;
    ledK.textContent = k;
    ledK.dataset.short = SHORT[k];
    ledV.textContent = v;
    if (!calm) {
      led.classList.remove('flip');
      void led.offsetWidth;
      led.classList.add('flip');
    }
  };

  // Keep the address in step with the section on screen, so a copied link opens there.
  const setHash = (id) => {
    const mine = /^#(stop-|joint$|skills$|record$|ticket$)/.test(location.hash);
    if (!id && !mine) return;
    if (id && location.hash === '#' + id) return;
    try {
      history.replaceState(null, '', id ? '#' + id : location.pathname + location.search);
    } catch (err) { /* some browsers limit how often this may be called */ }
  };

  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    // The line the train holds while it rides.
    const ty = vh * rideLine + train.offsetHeight / 2;
    const ys = points.map((p) => {
      const r = p.mk.getBoundingClientRect();
      return r.top + r.height / 2;
    });

    let near = 0;
    ys.forEach((y, i) => { if (Math.abs(y - ty) < Math.abs(ys[near] - ty)) near = i; });
    const at = Math.abs(ys[near] - ty) < Math.min(vh * 0.24, 190) ? near : -1;
    const ahead = ys.findIndex((y) => y > ty);

    if (at >= 0) setLed('This stop', points[at].label);
    else if (ahead === 0 && window.scrollY < 80) setLed('Now boarding', 'Scroll to ride');
    else if (ahead >= 0) setLed('Next stop', points[ahead].label);
    else setLed('Terminus', 'All change');

    const sec = at >= 0 ? points[at].sec : null;
    if (sec !== nowSec) {
      if (nowSec) nowSec.classList.remove('now');
      if (sec) sec.classList.add('now');
      nowSec = sec;
    }

    // Progress along the strip map, in node units.
    const ny = firstOfNode.map((i) => ys[i]);
    const last = ny.length - 1;
    let p = 0;
    if (ty >= ny[last]) p = last;
    else if (ty > ny[0]) {
      const i = ny.findIndex((y, k) => k < last && ty >= y && ty < ny[k + 1]);
      p = i + (ty - ny[i]) / (ny[i + 1] - ny[i]);
    }
    strip.style.setProperty('--p', (p / last).toFixed(4));
    const node = at >= 0 ? points[at].node : -1;
    stripNodes.forEach((li, i) => li.classList.toggle('passed', ty >= ny[i] - 1));
    if (node !== nowNode) {
      stripNodes.forEach((li, i) => {
        li.classList.toggle('now', i === node);
        if (i === node) li.firstElementChild.setAttribute('aria-current', 'true');
        else li.firstElementChild.removeAttribute('aria-current');
      });
      nowNode = node;
    }

    const step = stepIndex();
    if (step !== lastStep) {
      dockN.textContent = steps[step].label;
      setHash(step > 0 ? steps[step].el.id : '');
      lastStep = step;
    }

    const y = window.scrollY;
    if (Math.abs(y - lastY) > 4) {
      train.classList.toggle('up', y < lastY);
      lastY = y;
    }
  };
  const request = () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { readRide(); request(); });

  /* ---------- Stepping: the controls on the track and the arrow keys ---------- */
  let aim = -1;
  let aimAt = 0;
  const go = (dir) => {
    const t = performance.now();
    const moving = aim >= 0 && t - aimAt < 900;
    const cur = moving ? aim : stepIndex();
    let next = cur + dir;
    // Going back from deep inside a stop returns to its start first.
    if (dir < 0 && !moving && steps[cur].el.getBoundingClientRect().top < car.offsetHeight - 160) next = cur;
    next = Math.max(0, Math.min(steps.length - 1, next));
    aim = next;
    aimAt = t;
    const top = next === 0 ? 0 : steps[next].el.getBoundingClientRect().top + window.scrollY - car.offsetHeight - 4;
    window.scrollTo({ top, behavior: calm ? 'auto' : 'smooth' });
  };
  $('dock-prev').addEventListener('click', () => go(-1));
  $('dock-next').addEventListener('click', () => go(1));
  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const el = e.target;
    if (el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  // A link that names a stop opens at that stop (the stops are drawn after the page loads).
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  update();

  /* ---------- Arrivals: reveal each stop once, count its numbers up ---------- */
  const countUp = (b) => {
    const n = Number(b.dataset.n);
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      b.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const arrive = (node) => {
    if (node.classList.contains('in')) return;
    node.classList.add('in');
    if (!calm) node.querySelectorAll('[data-n]').forEach(countUp);
  };
  const targets = document.querySelectorAll('.stop, .joint-head, .jstop');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { arrive(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach(arrive);
  }

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
  const themeText = $('theme-t');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
  const paintTheme = () => {
    const dark = isDark();
    themeBtn.dataset.mode = dark ? 'dark' : 'light';
    themeText.textContent = dark ? 'Day service' : 'Night service';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to the light theme' : 'Switch to the dark theme');
  };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (err) { /* private mode */ }
    paintTheme();
  });
  if (systemDark.addEventListener) systemDark.addEventListener('change', paintTheme);
  paintTheme();
})();
