/* P1 Parameter scrubber: one slider drives the main view; a small overview shows the whole curve with the current position. */
DL.pattern({n: 1, short: 'scrubber', title: 'Parameter scrubber',
  job: 'Show how behaviour changes as a continuous parameter changes.',
  use: 'The parameter has many values and the interesting part is where behaviour changes.',
  data: 'Precomputed results for a grid of parameter values.',
  interaction: 'Level 3: one slider. A static overview keeps the whole curve visible.',
  caption: '<b>Honest and deceptive scores separate only in the middle layers.</b> Toy data. Left: score distributions of honest and deceptive items for a probe trained at the chosen layer. Right: separation (AUROC) at every layer; the amber marker is the slider position.',
  render(fig) {
    const NL = 62, auc = DL.aurocCurve(.5, .93, .17, .56);
    const sep = l => { const a = auc(l / (NL - 1)); return Math.SQRT2 * inverseNorm(a); }; /* d' giving that AUROC: AUROC = Phi(d'/sqrt2) */
    function inverseNorm(p) { let lo = -5, hi = 5; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; DL.Phi(m) < p ? lo = m : hi = m; } return (lo + hi) / 2; }
    const ctl = DL.html(fig, 'div', {class: 'row'}, `<label style="font-size:13px">Probe layer <input type="range" min="0" max="${NL - 1}" step="1" value="12" aria-label="Probe layer"></label><span class="count">layer <b class="lv">12</b> of ${NL - 1}</span><span class="hint">(drag the slider)</span>`);
    const inp = ctl.querySelector('input'), out = ctl.querySelector('.lv');
    const wrap = DL.html(fig, 'div', {class: 'split'});
    const a = DL.svg(DL.html(wrap, 'div'), 640, 240, 'Score distributions for honest and deceptive items at the chosen layer'), b = DL.svg(DL.html(wrap, 'div'), 320, 240, 'AUROC by layer with the current layer marked');
    const xs = DL.scale(-4, 4, 40, 620), ys = DL.scale(0, .45, 200, 20);
    DL.axisX(a, xs, 200, [-4, -2, 0, 2, 4], v => v, 'probe logit →');
    const hon = DL.el('path', {fill: 'var(--honest)', 'fill-opacity': .35, stroke: 'var(--honest)', 'stroke-width': 2}, a);
    const dec = DL.el('path', {fill: 'var(--deceptive)', 'fill-opacity': .3, stroke: 'var(--deceptive)', 'stroke-width': 2}, a);
    const lh = DL.text(a, 0, 0, 'honest', {fill: 'var(--honest-ink)', 'text-anchor': 'end'}), ld = DL.text(a, 0, 0, 'deceptive', {fill: 'var(--deceptive-ink)', 'text-anchor': 'start'});
    const bx = DL.scale(0, NL - 1, 40, 305), by = DL.scale(.5, 1, 200, 20);
    DL.axisX(b, bx, 200, [0, 20, 40, 61], v => v, 'layer →'); DL.axisY(b, by, 40, [.5, .75, 1], v => v.toFixed(2), 'AUROC', 305);
    DL.el('path', {d: DL.path(DL.range(NL).map(l => [bx(l), by(auc(l / (NL - 1)))])), fill: 'none', stroke: 'var(--subject)', 'stroke-width': 2}, b);
    const mk = DL.el('line', {y1: 20, y2: 200, stroke: 'var(--interact)', 'stroke-width': 2}, b), dot = DL.el('circle', {r: 5, fill: 'var(--interact)', stroke: 'var(--bg)', 'stroke-width': 2}, b);
    function upd() {
      const l = +inp.value, d = sep(l) / 2; out.textContent = l;
      const curve = m => DL.range(161).map(i => { const v = -4 + i * .05; return [xs(v), ys(DL.pdf(v, m, 1))]; });
      const base = [[xs(4), ys(0)], [xs(-4), ys(0)]];
      hon.setAttribute('d', DL.path(curve(-d)) + DL.path(base).replace('M', 'L') + 'Z'); dec.setAttribute('d', DL.path(curve(d)) + DL.path(base).replace('M', 'L') + 'Z');
      lh.setAttribute('x', xs(-d) - 12); lh.setAttribute('y', ys(.4) - 8); ld.setAttribute('x', xs(d) + 12); ld.setAttribute('y', ys(.4) - 8);
      mk.setAttribute('x1', bx(l)); mk.setAttribute('x2', bx(l)); dot.setAttribute('cx', bx(l)); dot.setAttribute('cy', by(auc(l / (NL - 1))));
    }
    inp.addEventListener('input', upd); upd();
  }
});
