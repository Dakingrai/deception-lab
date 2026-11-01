/* P12 Pairwise matrix (and neighbourhood highlight): train × test heatmap with a crosshair on hover. */
DL.pattern({n: 12, short: 'matrix', title: 'Neighbourhood highlight and pairwise matrix',
  job: 'Show what depends on what, or how every pair relates.',
  use: 'Pairwise values (transfer, similarity) or a graph too dense for node-link (> ~40 nodes).',
  data: 'An n × n matrix (or an edge list for the node-link form; see P11 for hover-to-highlight on a graph).',
  interaction: 'Level 2: hover a cell; its row and column stay, the rest fades, and the value shows.',
  caption: '<b>Probes trained on instructed lies transfer poorly to role-play.</b> Toy data. AUROC when a probe trained on the row dataset is tested on the column dataset. Darker green-blue is better; the diagonal is in-distribution.',
  render(fig) {
    const D = ['Instructed lies', 'Goal-driven', 'Sycophancy', 'Insider trading', 'Role-play', 'Sandbagging'];
    const R = DL.rng(12), M = D.map((_, i) => D.map((_, j) => i === j ? .94 + R() * .04 : DL.clamp(.62 + R() * .22 - (j === 4 ? .12 : 0) - Math.abs(i - j) * .015, .5, .93)));
    const t = DL.tip(fig), n = D.length, cs = 64, L = 150, T = 120;
    DL.html(fig, 'div', {class: 'row'}, '<span class="hint">(hover a cell)</span>');
    const s = DL.svg(fig, L + n * cs + 120, T + n * cs + 28, 'Transfer matrix: probe AUROC trained on row dataset, tested on column dataset');
    s.style.maxWidth = '720px';
    D.forEach((d, j) => { const tx = L + j * cs + cs / 2; DL.text(s, tx, T - 10, d, {class: 's', 'text-anchor': 'start', transform: `rotate(-35 ${tx} ${T - 10})`}); });
    DL.text(s, L, T + n * cs + 16, 'rows: trained on · columns: tested on', {class: 'm'});
    const cells = [];
    M.forEach((row, i) => { DL.text(s, L - 8, T + i * cs + cs / 2 + 4, D[i], {class: 's', 'text-anchor': 'end'});
      row.forEach((v, j) => { const nv = (v - .5) / .5, g = DL.el('g', {style: 'transition:opacity var(--dur) var(--ease)'}, s);
        DL.el('rect', {x: L + j * cs + 1, y: T + i * cs + 1, width: cs - 2, height: cs - 2, fill: DL.gnbu(nv), stroke: i === j ? 'var(--ink)' : 'none', 'stroke-width': i === j ? 1.5 : 0}, g);
        DL.text(g, L + j * cs + cs / 2, T + i * cs + cs / 2 + 4, v.toFixed(2), {class: 'm', 'text-anchor': 'middle', fill: DL.onSeq(nv)});
        cells.push({g, i, j}); g.addEventListener('pointermove', e => { cells.forEach(c => c.g.setAttribute('opacity', c.i === i || c.j === j ? 1 : .25)); t.show(`train <b>${D[i]}</b><br>test <b>${D[j]}</b><br><span class="m">AUROC ${v.toFixed(2)}</span>`, e); });
      }); });
    s.addEventListener('pointerleave', () => { cells.forEach(c => c.g.setAttribute('opacity', 1)); t.hide(); });
    const lx = L + n * cs + 30; DL.text(s, lx, T + 4, 'AUROC', {class: 'm'});
    DL.range(9).forEach(k => { DL.el('rect', {x: lx, y: T + 14 + k * 20, width: 16, height: 20, fill: `var(--gnbu-${9 - k})`}, s); });
    DL.text(s, lx + 22, T + 28, '1.0', {class: 'm'}); DL.text(s, lx + 22, T + 14 + 9 * 20, '0.5', {class: 'm'});
  }
});
