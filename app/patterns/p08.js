/* P8 Sorted example quilt: every item sorted by score, tinted by true label, read through a draggable window. */
DL.pattern({n: 8, short: 'sorted quilt', title: 'Sorted example quilt',
  job: 'Let the reader check a probe or direction across its whole score range, failures included.',
  use: 'You claim a direction means something. It is the main defence against cherry-picking.',
  data: 'Many items, each with a score and a ground-truth label.',
  interaction: 'Level 3: drag a score window; the quilt shows the items inside it, sorted by score.',
  caption: '<b>Role-play items are where this probe fails.</b> Toy data. Each dot is one item placed by its probe score; the dashed line is the 0.5 decision threshold. The window opens on the boundary, where the errors are. Items on the wrong side of the threshold are outlined and say why.',
  render(fig) {
    const R = DL.rng(7), T = .5, NAMES = Object.keys(DL.CITIES);
    const mk = label => { const c = DL.pick(R, NAMES), right = DL.pick(R, DL.CITIES[c]), wrong = DL.pick(R, DL.CITIES[DL.pick(R, NAMES.filter(x => x !== c))]);
      const S = {honest: [.22, .13], deceptive: [.74, .13], frame: [.6, .15], mistaken: [.38, .14]}[label];
      return {label, score: DL.clamp(DL.normal(R, S[0], S[1]), .01, .99), q: `Which of these cities is in ${c}?`, ans: label === 'honest' ? right : wrong,
        note: {honest: 'answers normally', deceptive: 'told to lie', frame: `plays a character who thinks ${wrong} is in ${c}`, mistaken: 'answers normally, but wrong'}[label]}; };
    const items = [...DL.range(40).map(() => mk('honest')), ...DL.range(40).map(() => mk('deceptive')), ...DL.range(25).map(() => mk('frame')), ...DL.range(15).map(() => mk('mistaken'))];
    items.forEach((d, i) => d.id = i);
    const bad = d => (d.score >= T) !== (d.label === 'deceptive');

    DL.html(fig, 'div', {class: 'row'}, `<div class="legend"><span><i style="background:var(--honest)"></i>honest</span><span><i style="background:var(--deceptive)"></i>deceptive</span><span><i style="background:var(--mistaken)"></i>mistaken</span><span><i style="background:var(--frame-hatch);border:1px solid var(--ink)"></i>role-play (frame)</span></div><span class="hint">(drag the amber window, or its edges)</span>`);
    const svg = DL.svg(fig, 1000, 150, 'Probe scores of 120 toy items as dots along a 0 to 1 axis, coloured by true label, with a movable selection window.');
    const hatch = DL.hatch(svg), L = 30, Rr = 970, BASE = 96, DR = 5.5, BINS = 60, x = DL.scale(0, 1, L, Rr);
    DL.axisX(svg, x, BASE + 8, [0, .2, .4, .6, .8, 1], v => v.toFixed(1), 'probe score (toy) →');
    DL.el('line', {x1: x(T), x2: x(T), y1: 4, y2: BASE + 8, stroke: 'var(--ink)', 'stroke-dasharray': 'var(--dash)'}, svg);
    DL.text(svg, x(T) + 6, 14, 'threshold 0.5', {class: 'm'});
    const winG = DL.el('g', {tabindex: 0, role: 'slider', 'aria-label': 'Score window'}, svg), dotsG = DL.el('g', {style: 'pointer-events:none'}, svg);
    const fill = {honest: 'var(--honest)', deceptive: 'var(--deceptive)', mistaken: 'var(--mistaken)', frame: hatch}, order = {honest: 0, mistaken: 1, frame: 2, deceptive: 3}, stacks = {};
    items.slice().sort((a, b) => order[a.label] - order[b.label]).forEach(d => { const b = Math.min(BINS - 1, Math.floor(d.score * BINS)), k = stacks[b] = (stacks[b] || 0) + 1;
      d.el = DL.el('circle', {cx: L + (b + .5) * (Rr - L) / BINS, cy: BASE - (k - .5) * DR * 2, r: DR - .6, fill: fill[d.label], stroke: d.label === 'frame' ? 'var(--ink)' : 'var(--bg)'}, dotsG); });
    let w0 = .46, w1 = .62, drag = null;
    const win = DL.el('rect', {y: 2, height: BASE + 4, rx: 2, fill: 'var(--interact)', 'fill-opacity': .12, stroke: 'var(--interact)', 'stroke-width': 1.5, style: 'cursor:grab'}, winG);
    const h0 = DL.el('rect', {y: BASE / 2 - 14, width: 6, height: 28, rx: 2, fill: 'var(--interact)', style: 'cursor:ew-resize'}, winG), h1 = h0.cloneNode(); winG.appendChild(h1);
    const sx = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return x.inv(p.matrixTransform(svg.getScreenCTM().inverse()).x); };
    const down = (mode, e) => { e.preventDefault(); drag = {mode, s: sx(e), a: w0, b: w1}; svg.setPointerCapture(e.pointerId); };
    win.addEventListener('pointerdown', e => down('m', e)); h0.addEventListener('pointerdown', e => down('l', e)); h1.addEventListener('pointerdown', e => down('r', e));
    svg.addEventListener('pointermove', e => { if (!drag) return; const d = sx(e) - drag.s;
      if (drag.mode === 'm') { const sp = drag.b - drag.a; w0 = DL.clamp(drag.a + d, 0, 1 - sp); w1 = w0 + sp; } else if (drag.mode === 'l') w0 = DL.clamp(drag.a + d, 0, w1 - .04); else w1 = DL.clamp(drag.b + d, w0 + .04, 1); update(); });
    svg.addEventListener('pointerup', () => drag = null);
    winG.addEventListener('keydown', e => { const s = e.shiftKey ? .1 : .02, sp = w1 - w0; if (e.key === 'ArrowRight') w0 = DL.clamp(w0 + s, 0, 1 - sp); else if (e.key === 'ArrowLeft') w0 = DL.clamp(w0 - s, 0, 1 - sp); else return; w1 = w0 + sp; e.preventDefault(); update(); });
    const count = DL.html(fig, 'p', {class: 'count', style: 'margin:var(--s-2) 0'}), quilt = DL.html(fig, 'div', {class: 'quilt', 'aria-live': 'polite'});
    function update() {
      win.setAttribute('x', x(w0)); win.setAttribute('width', x(w1) - x(w0)); h0.setAttribute('x', x(w0) - 3); h1.setAttribute('x', x(w1) - 3);
      winG.setAttribute('aria-valuetext', `scores ${DL.f2(w0)} to ${DL.f2(w1)}`);
      const inW = items.filter(d => d.score >= w0 && d.score <= w1).sort((a, b) => a.score - b.score);
      items.forEach(d => d.el.setAttribute('opacity', d.score >= w0 && d.score <= w1 ? 1 : .25));
      count.innerHTML = `scores <b>${DL.f2(w0)}–${DL.f2(w1)}</b> · <b>${inW.length}</b> items · <b>${inW.filter(bad).length}</b> on the wrong side of the threshold`;
      quilt.innerHTML = inW.length ? inW.map(d => `<div class="it${bad(d) ? ' bad' : ''}" data-id="${d.id}"><div class="top"><span class="chip ${d.label}">${DL.LABEL[d.label]}</span><span class="sc">${DL.f2(d.score)}</span></div>
        <div class="q">${d.q} <span style="color:var(--ink-3)">(${d.note})</span></div><div class="a">${d.ans}</div>${bad(d) ? `<div class="why">${d.score >= T ? 'false positive' : 'missed lie'}</div>` : ''}</div>`).join('') : '<p class="empty">No items in this window. Drag it over the dots.</p>';
    }
    quilt.addEventListener('pointerover', e => { const c = e.target.closest('.it'); items.forEach(d => { const on = c && +c.dataset.id === d.id; d.el.setAttribute('stroke-width', on ? 2.5 : 1); if (on) d.el.setAttribute('stroke', 'var(--ink)'); else d.el.setAttribute('stroke', d.label === 'frame' ? 'var(--ink)' : 'var(--bg)'); }); });
    update();
  }
});
