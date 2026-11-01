/* P2 Small multiples: the same chart per case, shared axes, with a crosshair linked across panels. */
DL.pattern({n: 2, short: 'small multiples', title: 'Small multiples',
  job: 'Compare the same view across a handful of discrete cases.',
  use: '2–12 cases along one factor (models, datasets, conditions) that share axes.',
  data: 'Identical structure per case.',
  interaction: 'Level 0, plus an optional linked crosshair (level 2): hover one panel and every panel marks the same depth.',
  caption: '<b>Every model peaks in the middle of the network, but not at the same depth.</b> Toy data. Probe AUROC against relative depth, one panel per model, identical axes. The dot marks each model’s best layer.',
  render(fig) {
    const curves = [DL.aurocCurve(.5, .93, .17), DL.aurocCurve(.62, .9, .14), DL.aurocCurve(.42, .88, .2), DL.aurocCurve(.55, .84, .12)];
    DL.html(fig, 'div', {class: 'row'}, '<span class="hint">(hover a panel to compare the same depth everywhere)</span>');
    const grid = DL.html(fig, 'div', {class: 'grid2'}), marks = [];
    const W = 260, H = 170, x = DL.scale(0, 1, 34, 248), y = DL.scale(.5, 1, 140, 14);
    DL.MODELS.forEach((m, i) => {
      const cell = DL.html(grid, 'div'); DL.html(cell, 'p', {class: 'panel-title'}, m);
      const s = DL.svg(cell, W, H, `AUROC by relative depth for ${m}`), f = curves[i];
      DL.axisY(s, y, 34, [.5, .75, 1], v => v.toFixed(2), null, 248); DL.axisX(s, x, 140, [0, .5, 1], v => v === 0 ? 'first' : v === 1 ? 'last' : '0.5');
      const pts = DL.range(101).map(k => [x(k / 100), y(f(k / 100))]); DL.el('path', {d: DL.path(pts), fill: 'none', stroke: 'var(--subject)', 'stroke-width': 2}, s);
      let best = 0; DL.range(101).forEach(k => { if (f(k / 100) > f(best / 100)) best = k; });
      DL.el('circle', {cx: x(best / 100), cy: y(f(best / 100)), r: 4, fill: 'var(--subject)'}, s); DL.text(s, x(best / 100) + 7, y(f(best / 100)) - 6, f(best / 100).toFixed(2), {class: 'm'});
      const g = DL.el('g', {opacity: 0}, s), ln = DL.el('line', {y1: 14, y2: 140, stroke: 'var(--ink)', 'stroke-dasharray': 'var(--dash)'}, g), lab = DL.text(g, 0, 9, '', {class: 'm', 'text-anchor': 'middle'});
      marks.push({g, ln, lab, f});
      s.addEventListener('pointermove', e => { const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const v = DL.clamp(x.inv(p.matrixTransform(s.getScreenCTM().inverse()).x), 0, 1); show(v); });
      s.addEventListener('pointerleave', () => marks.forEach(mk => mk.g.setAttribute('opacity', 0)));
    });
    function show(v) { marks.forEach(mk => { mk.g.setAttribute('opacity', 1); mk.ln.setAttribute('x1', x(v)); mk.ln.setAttribute('x2', x(v)); mk.lab.setAttribute('x', x(v)); mk.lab.textContent = mk.f(v).toFixed(2); }); }
  }
});
