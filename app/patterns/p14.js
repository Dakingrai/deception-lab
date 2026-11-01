/* P14 Uncertainty band and repeated runs: thin grey runs, the mean in the subject colour, a 95% band; toggle between the two readings. */
DL.pattern({n: 14, short: 'uncertainty', title: 'Uncertainty band and repeated runs',
  job: 'Show how sure we are, or how stable a result is.',
  use: 'Always, for any model-derived metric: seeds, bootstrap, item resampling.',
  data: 'Per-run or per-bootstrap values.',
  interaction: 'Level 0. A toggle switches between the band and the individual runs.',
  caption: '<b>The best layer is stable across seeds; the peak height is not.</b> Toy data. Probe AUROC by layer over 8 training seeds. The band is a 95% interval of the mean; the thin lines are the individual seeds.',
  render(fig) {
    const NL = 40, S = 8, R = DL.rng(14), base = DL.aurocCurve(.55, .9, .18, .56);
    const runs = DL.range(S).map(() => { const h = DL.normal(R, 0, .025); return DL.range(NL).map(l => DL.clamp(base(l / (NL - 1)) + h * Math.exp(-((l / (NL - 1) - .55) ** 2) / .03) + DL.normal(R, 0, .008), .5, 1)); });
    const mean = DL.range(NL).map(l => DL.mean(runs.map(r => r[l]))), ci = DL.range(NL).map(l => 1.96 * DL.sd(runs.map(r => r[l])) / Math.sqrt(S) * 1.15);
    const ctl = DL.html(fig, 'div', {class: 'row'}, `<span class="seg" role="group" aria-label="Show"><button aria-pressed="true" data-m="both">band and runs</button><button aria-pressed="false" data-m="band">band only</button><button aria-pressed="false" data-m="runs">runs only</button></span>`);
    const s = DL.svg(fig, 1000, 300, 'AUROC by layer: mean with 95% band and individual seeds');
    const x = DL.scale(0, NL - 1, 60, 940), y = DL.scale(.5, 1, 260, 20);
    DL.axisY(s, y, 60, [.5, .6, .7, .8, .9, 1], v => v.toFixed(1), 'AUROC', 940); DL.axisX(s, x, 260, [0, 10, 20, 30, 39], v => v, 'layer →');
    const band = DL.el('path', {d: DL.area(mean.map((m, l) => [x(l), y(m + ci[l])]), mean.map((m, l) => [x(l), y(m - ci[l])])), fill: 'var(--band)', stroke: 'var(--band-edge)', 'stroke-width': 1}, s);
    const rg = DL.el('g', {}, s); runs.forEach(r => DL.el('path', {d: DL.path(r.map((v, l) => [x(l), y(v)])), fill: 'none', stroke: 'var(--context)', 'stroke-width': 1, 'stroke-opacity': .7}, rg));
    DL.el('path', {d: DL.path(mean.map((m, l) => [x(l), y(m)])), fill: 'none', stroke: 'var(--subject)', 'stroke-width': 2.5}, s);
    let bi = 0; mean.forEach((m, l) => { if (m > mean[bi]) bi = l; });
    DL.el('circle', {cx: x(bi), cy: y(mean[bi]), r: 4.5, fill: 'var(--subject)'}, s);
    DL.text(s, x(bi) + 8, y(.975), `best layer ${bi} · ${mean[bi].toFixed(2)} ± ${ci[bi].toFixed(2)}`, {class: 'm'});
    DL.text(s, 940, 12, `n = ${S} seeds`, {class: 'm', 'text-anchor': 'end'});
    ctl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const m = b.dataset.m; ctl.querySelectorAll('button').forEach(z => z.setAttribute('aria-pressed', z === b));
      band.setAttribute('opacity', m === 'runs' ? 0 : 1); rg.setAttribute('opacity', m === 'band' ? 0 : 1); });
  }
});
