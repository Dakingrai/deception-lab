/* P10 Overview with drill-down: everything at once, a summary on hover, details on click, filters that dim rather than remove. */
DL.pattern({n: 10, short: 'overview', title: 'Overview with drill-down',
  job: 'Give a map of a space too large to show in full detail.',
  use: 'Dozens to thousands of items, and the reader needs the big picture and single items.',
  data: 'Items with a position (embedding, category, score) and details.',
  interaction: 'Level 1–3: hover for a summary, click for the detail panel, filter chips dim the rest.',
  caption: '<b>Role-play activations sit between honest and deceptive ones.</b> Toy data. A 2-D projection of 160 items’ activations at one layer, coloured by true label. Click a point to read the item.',
  render(fig) {
    const R = DL.rng(10), NAMES = Object.keys(DL.CITIES);
    const centers = {honest: [-1.4, .2], deceptive: [1.5, .1], frame: [.3, 1.2], mistaken: [-.4, -1.1]}, ns = {honest: 50, deceptive: 50, frame: 35, mistaken: 25};
    const items = [];
    for (const lab in ns) DL.range(ns[lab]).forEach(() => { const c = DL.pick(R, NAMES), city = DL.pick(R, DL.CITIES[DL.pick(R, NAMES)]);
      items.push({lab, x: DL.clamp(DL.normal(R, centers[lab][0], .55), -3, 3.2), y: DL.clamp(DL.normal(R, centers[lab][1], .5), -2.4, 2.6), text: `Which of these cities is in ${c}? → ${city}`, score: DL.clamp(DL.normal(R, {honest: .2, deceptive: .78, frame: .6, mistaken: .4}[lab], .12), 0, 1)}); });
    const active = new Set(Object.keys(ns)); const t = DL.tip(fig);
    const chips = DL.html(fig, 'div', {class: 'row'}, `<span style="font-size:13px">Show</span>${Object.keys(ns).map(l => `<button class="btn" aria-pressed="true" data-l="${l}" style="font-weight:400"><span class="chip ${l}">${DL.LABEL[l]}</span></button>`).join('')}<span class="hint">(click a point)</span>`);
    const wrap = DL.html(fig, 'div', {class: 'split'});
    const s = DL.svg(DL.html(wrap, 'div'), 640, 400, 'Scatter of item activations projected to two dimensions, coloured by label'), hatch = DL.hatch(s);
    const x = DL.scale(-3.2, 3.4, 20, 620), y = DL.scale(-2.6, 2.8, 380, 20);
    DL.el('rect', {x: 20, y: 20, width: 600, height: 360, fill: 'none', stroke: 'var(--hairline)'}, s);
    DL.text(s, 26, 372, 'projection axis 1 →', {class: 'm'});
    const fill = {honest: 'var(--honest)', deceptive: 'var(--deceptive)', mistaken: 'var(--mistaken)', frame: hatch};
    let sel = null;
    items.forEach(d => { d.el = DL.el('circle', {cx: x(d.x), cy: y(d.y), r: 5.5, fill: fill[d.lab], stroke: d.lab === 'frame' ? 'var(--ink)' : 'var(--bg)', 'stroke-width': 1, style: 'cursor:pointer'}, s);
      d.el.addEventListener('pointermove', e => t.show(`<span class="chip ${d.lab}">${DL.LABEL[d.lab]}</span> <span class="m">score ${DL.f2(d.score)}</span>`, e));
      d.el.addEventListener('pointerleave', t.hide); d.el.addEventListener('click', () => { sel = d; draw(); }); });
    const panel = DL.html(wrap, 'div', {style: 'border-left:var(--border);padding-left:var(--s-4);font-size:13.5px;align-self:stretch'});
    function draw() {
      items.forEach(d => { d.el.setAttribute('opacity', active.has(d.lab) ? 1 : .12); d.el.setAttribute('stroke-width', d === sel ? 3 : 1); if (d === sel) d.el.setAttribute('stroke', 'var(--ink)'); });
      const n = items.filter(d => active.has(d.lab)).length;
      panel.innerHTML = sel ? `<div class="panel-sub">SELECTED ITEM</div><p style="margin:6px 0"><span class="chip ${sel.lab}">${DL.LABEL[sel.lab]}</span></p><p style="margin:0 0 8px;font-size:var(--fs-body);line-height:1.5">${sel.text}</p><div class="count">probe score <b>${DL.f2(sel.score)}</b></div><div class="count">position <b>${sel.x.toFixed(2)}, ${sel.y.toFixed(2)}</b></div>`
        : `<div class="panel-sub">DETAILS</div><p style="color:var(--ink-2);margin:6px 0">Click any point to read its item here.</p><div class="count"><b>${n}</b> of ${items.length} items shown</div>`;
    }
    chips.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const l = b.dataset.l; active.has(l) ? active.delete(l) : active.add(l); b.setAttribute('aria-pressed', active.has(l)); b.style.opacity = active.has(l) ? 1 : .45; draw(); });
    draw();
  }
});
