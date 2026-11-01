/* Deception Lab figure-pattern helpers. Vanilla JS + SVG, no build step.
   Each pNN.js calls DL.pattern({...}) with its metadata and a render(fig) function.
   Colours come only from CSS variables in ../tokens.css (see docs/BRAND.md). */
(function(){
const DL = window.DL = {list: []};
const NS = 'http://www.w3.org/2000/svg';

/* ---------- registry and page rendering ---------- */
DL.pattern = p => DL.list.push(p);
DL.renderAll = (indexEl, listEl) => {
  DL.list.sort((a, b) => a.n - b.n);
  for (const p of DL.list) {
    const a = document.createElement('a'); a.href = '#p' + p.n; a.textContent = `P${p.n} ${p.short}`; indexEl.appendChild(a);
    const s = document.createElement('section'); s.id = 'p' + p.n;
    s.innerHTML = `<h2>P${p.n} · ${p.title}</h2>
      <div class="meta"><div><b>Job</b>${p.job}</div><div><b>Use when</b>${p.use}</div><div><b>Data</b>${p.data}</div><div><b>Interaction</b>${p.interaction}</div>
      <div class="file">app/patterns/p${String(p.n).padStart(2, '0')}.js · docs/viz-patterns.md#p${p.n}</div></div>
      <figure></figure>`;
    listEl.appendChild(s);
    const fig = s.querySelector('figure');
    try { p.render(fig); } catch (e) { fig.innerHTML = `<p class="empty">This demo failed to render: ${e.message}</p>`; console.error(e); }
    if (p.caption) { const c = document.createElement('figcaption'); c.innerHTML = p.caption; fig.appendChild(c); }
    if (p.after) { const d = document.createElement('p'); d.className = 'prose'; d.innerHTML = p.after; s.appendChild(d); }
  }
  DL.postHeight();
  if (window.ResizeObserver) new ResizeObserver(DL.postHeight).observe(document.body);
};
/* the Deception Lab shell hosts this page in an iframe and sizes it from this message */
DL.postHeight = () => { try { parent.postMessage({patternsh: document.documentElement.scrollHeight}, '*'); } catch (e) {} };

/* ---------- numbers ---------- */
DL.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
DL.normal = (R, m = 0, s = 1) => { let u = 0, v = 0; while (!u) u = R(); while (!v) v = R(); return m + s * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
DL.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
DL.pick = (R, a) => a[Math.floor(R() * a.length)];
DL.range = n => [...Array(n).keys()];
DL.mean = a => a.reduce((s, x) => s + x, 0) / a.length;
DL.sd = a => { const m = DL.mean(a); return Math.sqrt(DL.mean(a.map(x => (x - m) ** 2))); };
DL.pdf = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
DL.Phi = x => { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; };
/* linear scale with .inv */
DL.scale = (d0, d1, r0, r1) => { const f = v => r0 + (v - d0) / (d1 - d0) * (r1 - r0); f.inv = p => d0 + (p - r0) / (r1 - r0) * (d1 - d0); f.d = [d0, d1]; f.r = [r0, r1]; return f; };
DL.f2 = v => (+v).toFixed(2);

/* ---------- DOM and SVG ---------- */
DL.svg = (parent, w, h, title) => {
  const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', `0 0 ${w} ${h}`); s.setAttribute('class', 'fig'); s.setAttribute('role', 'img');
  const t = document.createElementNS(NS, 'title'); t.textContent = title; s.appendChild(t); parent.appendChild(s); return s;
};
DL.el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
/* a fill passed here wins over the class colour (CSS would otherwise beat the attribute) */
DL.text = (parent, x, y, str, attrs = {}) => { const t = DL.el('text', Object.assign({x, y}, attrs), parent); if (attrs.fill) t.style.fill = attrs.fill; t.textContent = str; return t; };
DL.html = (parent, tag, attrs = {}, inner = '') => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); e.innerHTML = inner; if (parent) parent.appendChild(e); return e; };
DL.path = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
DL.area = (top, bottom) => DL.path(top) + bottom.slice().reverse().map(p => 'L' + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('') + 'Z';
let hid = 0;
/* hatched fill for frame / role-play content; returns url(#id) */
DL.hatch = svg => { const id = 'hatch' + (++hid); const d = DL.el('defs', {}, svg); const p = DL.el('pattern', {id, patternUnits: 'userSpaceOnUse', width: 4, height: 4, patternTransform: 'rotate(45)'}, d);
  DL.el('rect', {width: 4, height: 4, fill: 'var(--bg)'}, p); DL.el('line', {x1: 0, y1: 0, x2: 0, y2: 4, stroke: 'var(--ink)', 'stroke-width': 1.4}, p); return `url(#${id})`; };
DL.arrow = svg => { const id = 'arr' + (++hid); const d = DL.el('defs', {}, svg); const m = DL.el('marker', {id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse'}, d);
  DL.el('path', {d: 'M0,0L10,5L0,10Z', fill: 'var(--ink-2)'}, m); return `url(#${id})`; };

/* axes: x along the bottom at y, y along the left at x */
DL.axisX = (g, sx, y, ticks, fmt = DL.f2, label) => {
  DL.el('line', {class: 'ax', x1: sx.r[0], x2: sx.r[1], y1: y, y2: y}, g);
  for (const t of ticks) { DL.el('line', {class: 'ax', x1: sx(t), x2: sx(t), y1: y, y2: y + 4}, g); DL.text(g, sx(t), y + 17, fmt(t), {class: 'm', 'text-anchor': 'middle'}); }
  if (label) DL.text(g, sx.r[1], y + 34, label, {class: 'm', 'text-anchor': 'end'});
};
DL.axisY = (g, sy, x, ticks, fmt = DL.f2, label, gridTo) => {
  for (const t of ticks) { if (gridTo) DL.el('line', {class: 'grid', x1: x, x2: gridTo, y1: sy(t), y2: sy(t)}, g); DL.text(g, x - 6, sy(t) + 4, fmt(t), {class: 'm', 'text-anchor': 'end'}); }
  if (label) DL.text(g, x - 6, sy.r[1] - 10, label, {class: 'm', 'text-anchor': 'start'});
};

/* one shared hover card per figure */
DL.tip = fig => {
  const t = DL.html(fig, 'div', {class: 'tip', role: 'status'});
  return {
    show(html, evt) { t.innerHTML = html; t.classList.add('on'); const r = fig.getBoundingClientRect(); let x = evt.clientX - r.left + 14, y = evt.clientY - r.top + 14;
      if (x + 270 > r.width) x = Math.max(0, evt.clientX - r.left - 270); t.style.left = x + 'px'; t.style.top = y + 'px'; },
    hide() { t.classList.remove('on'); }
  };
};

/* ---------- vocabulary and toy data shared across demos ---------- */
DL.C = {honest: 'var(--honest)', deceptive: 'var(--deceptive)', mistaken: 'var(--mistaken)', subject: 'var(--subject)', interact: 'var(--interact)', context: 'var(--context)', ink: 'var(--ink)'};
DL.LABEL = {honest: 'honest', deceptive: 'deceptive', mistaken: 'mistaken', frame: 'role-play'};
DL.CITIES = {Italy: ['Turin', 'Milan', 'Naples', 'Bologna', 'Florence', 'Genoa'], France: ['Lyon', 'Nice', 'Lille', 'Nantes', 'Bordeaux', 'Toulouse'], Spain: ['Seville', 'Bilbao', 'Valencia', 'Malaga', 'Zaragoza', 'Granada'], Germany: ['Bremen', 'Leipzig', 'Dresden', 'Cologne', 'Hanover', 'Essen']};
DL.MODELS = ['Gemma-3-27B', 'Qwen2.5-72B', 'Llama-3.3-70B', 'Mistral-Small'];
/* toy probe quality by relative depth (0..1): a bump peaking mid-network, different per model */
DL.aurocCurve = (peak, height, width, floor = .55) => d => floor + (height - floor) * Math.exp(-((d - peak) ** 2) / (2 * width * width));
/* diverging honest<->deceptive colour for a score in [0,1] (0.5 neutral), from the 11-step ramp */
DL.divColor = s => `var(--div-${DL.clamp(Math.round(s * 10) + 1, 1, 11)})`;
/* text colour that stays readable on a diverging cell (ramp hues are mode-stable; the neutral middle flips with the theme) */
DL.onDiv = s => { const i = DL.clamp(Math.round(s * 10) + 1, 1, 11); return i <= 2 || i >= 10 ? 'var(--on-ramp-dark)' : i === 6 ? 'var(--ink)' : 'var(--on-ramp-light)'; };
DL.onSeq = v => DL.clamp(Math.round(v * 8) + 1, 1, 9) >= 7 ? 'var(--on-ramp-dark)' : 'var(--on-ramp-light)';
DL.rdpu = v => `var(--rdpu-${DL.clamp(Math.round(v * 8) + 1, 1, 9)})`;
DL.gnbu = v => `var(--gnbu-${DL.clamp(Math.round(v * 8) + 1, 1, 9)})`;
})();
