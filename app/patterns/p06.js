/* P6 Linked notation: each equation term is tied to its element in the diagram; hover either side to highlight both. */
DL.pattern({n: 6, short: 'linked notation', title: 'Linked notation',
  job: 'Tie a formula to the things it refers to.',
  use: 'A reader would otherwise have to map symbols to objects in their head.',
  data: 'The formula and one small worked instance.',
  interaction: 'Level 2: hover a term or an element; its partner lights up and the rest fades.',
  caption: '<b>A linear probe is a weighted vote over one layer’s activations.</b> Toy numbers. Hover a term in the equation or a part of the diagram.',
  render(fig) {
    const R = DL.rng(6), n = 8, h = DL.range(n).map(() => DL.normal(R, 0, 1)), w = DL.range(n).map(() => DL.normal(R, 0, .8)), b = -.3;
    const z = h.reduce((s, v, i) => s + v * w[i], 0) + b, p = 1 / (1 + Math.exp(-z));
    const eq = DL.html(fig, 'div', {style: 'font-size:22px;margin:var(--s-2) 0 var(--s-3);font-family:var(--font)'},
      `<span data-k="p" style="color:var(--deceptive-ink);font-weight:600">p</span> = <span data-k="s">σ</span>( <span data-k="w" style="color:var(--subject-ink);font-weight:600">w</span><sup>⊤</sup> <span data-k="h" style="font-weight:600">h</span><sub style="font-size:13px">31</sub> + <span data-k="b" style="color:var(--ink-2);font-weight:600">b</span> ) <span class="hint" style="font-size:13px;margin-left:12px">(hover a term)</span>`);
    eq.querySelectorAll('[data-k]').forEach(e => { e.style.cursor = 'default'; e.style.padding = '0 2px'; e.style.borderRadius = 'var(--radius)'; });
    const s = DL.svg(fig, 1000, 250, 'Diagram of a linear probe: activation vector, weight vector, bias, sigmoid, output probability');
    const G = {}; ['h', 'w', 'b', 's', 'p'].forEach(k => { G[k] = DL.el('g', {'data-k': k, style: 'transition:opacity var(--dur) var(--ease)'}, s); });
    const cell = 22, x0 = 60, y0 = 20;
    DL.text(G.h, x0 + cell / 2, y0 + n * cell + 22, 'h₃₁', {'text-anchor': 'middle', 'font-weight': 600});
    DL.text(G.h, x0 + cell / 2, y0 + n * cell + 38, 'activations', {class: 'm', 'text-anchor': 'middle'});
    h.forEach((v, i) => { DL.el('rect', {x: x0, y: y0 + i * cell, width: cell, height: cell - 2, fill: 'var(--ink)', 'fill-opacity': DL.clamp(.15 + Math.abs(v) / 2.5, .15, 1)}, G.h); });
    DL.text(s, x0 + 66, y0 + n * cell / 2 + 6, '×', {'font-size': 20, 'text-anchor': 'middle', fill: 'var(--ink-2)'});
    w.forEach((v, i) => { DL.el('rect', {x: x0 + 110, y: y0 + i * cell, width: cell, height: cell - 2, fill: 'var(--subject)', 'fill-opacity': DL.clamp(.15 + Math.abs(v) / 2, .15, 1)}, G.w); });
    DL.text(G.w, x0 + 121, y0 + n * cell + 22, 'w', {'text-anchor': 'middle', 'font-weight': 600, fill: 'var(--subject-ink)'});
    DL.text(G.w, x0 + 121, y0 + n * cell + 38, 'probe weights', {class: 'm', 'text-anchor': 'middle'});
    DL.text(s, 240, y0 + n * cell / 2 + 6, `Σ = ${(z - b).toFixed(2)}`, {class: 'm'});
    DL.el('rect', {x: 320, y: y0 + n * cell / 2 - 16, width: 80, height: 32, rx: 4, fill: 'var(--surface-sunk)', stroke: 'var(--rule)'}, G.b);
    DL.text(G.b, 360, y0 + n * cell / 2 + 5, `+ b = ${b}`, {'text-anchor': 'middle', fill: 'var(--ink-2)'});
    DL.text(G.b, 360, y0 + n * cell / 2 + 36, 'bias', {class: 'm', 'text-anchor': 'middle'});
    const sx = DL.scale(-6, 6, 470, 760), sy = DL.scale(0, 1, 190, 30);
    DL.el('path', {d: DL.path(DL.range(121).map(i => { const v = -6 + i * .1; return [sx(v), sy(1 / (1 + Math.exp(-v)))]; })), fill: 'none', stroke: 'var(--ink-2)', 'stroke-width': 2}, G.s);
    DL.axisX(G.s, sx, 190, [-6, 0, 6], v => v); DL.text(G.s, 615, 238, 'σ (sigmoid)', {class: 'm', 'text-anchor': 'middle'});
    DL.el('line', {x1: sx(z), x2: sx(z), y1: 190, y2: sy(p), stroke: 'var(--ink-2)', 'stroke-dasharray': 'var(--dash)'}, G.s);
    DL.el('circle', {cx: sx(z), cy: sy(p), r: 5, fill: 'var(--deceptive)'}, G.p);
    DL.el('line', {x1: sx(z), x2: 820, y1: sy(p), y2: sy(p), stroke: 'var(--deceptive)', 'stroke-dasharray': 'var(--dash)'}, G.p);
    DL.el('rect', {x: 820, y: sy(p) - 22, width: 150, height: 44, rx: 4, fill: DL.divColor(p)}, G.p);
    DL.text(G.p, 895, sy(p) + 5, `p = ${DL.f2(p)}`, {'text-anchor': 'middle', 'font-weight': 600, fill: DL.onDiv(p)});
    DL.text(G.p, 895, sy(p) + 40, 'P(deceptive)', {class: 'm', 'text-anchor': 'middle'});
    const all = [...fig.querySelectorAll('[data-k]')];
    const on = k => all.forEach(e => { const m = e.dataset.k === k; if (e.tagName === 'g') e.setAttribute('opacity', m ? 1 : .18); else e.style.background = m ? 'var(--surface-sunk)' : 'none'; });
    const off = () => all.forEach(e => { if (e.tagName === 'g') e.setAttribute('opacity', 1); else e.style.background = 'none'; });
    all.forEach(e => { e.addEventListener('pointerenter', () => on(e.dataset.k)); e.addEventListener('pointerleave', off); });
  }
});
