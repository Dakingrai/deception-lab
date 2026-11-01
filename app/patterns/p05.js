/* P5 Mechanism diagram, built up step by step: one schematic, stages revealed in order, a note per step; hypotheses dashed. */
DL.pattern({n: 5, short: 'mechanism', title: 'Mechanism diagram, built up step by step',
  job: 'Explain a mechanism, pipeline or experimental design.',
  use: 'There are stages or components a reader must hold together; thread one concrete example through.',
  data: 'The structure, plus one worked example.',
  interaction: 'A stepper (level 3). Future steps stay faintly visible so the whole design is readable at rest.',
  caption: '<b>The belief-swap test: if the lie is computed from the belief, swapping the belief should move the lie.</b> Illustration of the design; no data. Solid ink circles are the model’s belief; the dashed box is the prediction, not a result.',
  render(fig) {
    const steps = [
      'Proposition 1: the model reads four options. Its belief that (A) Turin is the Italian city forms at some layer.',
      'Told to lie, it avoids its belief and answers something else, here (B) Lyon.',
      'Proposition 2 uses the same four options but asks about Spain, so the belief is (C) Bilbao. We copy that belief into the Proposition 1 run at layer 31.',
      'Prediction: if the lie depends on the belief, the patched run now avoids (C) instead of (A). If the lie ignores the belief, nothing changes.'];
    const ctl = DL.html(fig, 'div', {class: 'row'}, `<button class="btn" data-d="-1">← Back</button><button class="btn" data-d="1">Next →</button><span class="count">step <b class="sn">1</b> of 4</span>`);
    const note = DL.html(fig, 'p', {class: 'prose', style: 'min-height:3.4em;margin:var(--s-2) 0'});
    const s = DL.svg(fig, 1000, 300, 'Belief-swap experiment design in four steps'), arr = DL.arrow(s);
    const G = DL.range(4).map(() => DL.el('g', {style: 'transition:opacity var(--dur-layout) var(--ease)'}, s));
    const box = (g, x, y, w, h, lines, opt = {}) => { DL.el('rect', Object.assign({x, y, width: w, height: h, rx: 4, fill: 'var(--surface)', stroke: 'var(--rule)'}, opt), g);
      lines.forEach((l, i) => DL.text(g, x + 12, y + 22 + i * 18, l.t || l, l.a || {})); };
    const model = (g, y, label) => { DL.el('rect', {x: 300, y: y - 34, width: 260, height: 68, rx: 4, fill: 'var(--surface-sunk)', stroke: 'var(--rule)'}, g);
      DL.range(9).forEach(i => DL.el('line', {x1: 320 + i * 28, x2: 320 + i * 28, y1: y - 26, y2: y + 26, stroke: 'var(--hairline)'}, g));
      DL.text(g, 308, y - 40, label, {class: 'm'}); };
    const line = (g, x1, y1, x2, y2, o = {}) => DL.el('line', Object.assign({x1, y1, x2, y2, stroke: 'var(--ink-2)', 'stroke-width': 1.5, 'marker-end': arr}, o), g);
    const opts = {t: '(A) Turin (B) Lyon (C) Bilbao (D) Bremen', a: {class: 's'}};
    /* step 1 */
    box(G[0], 20, 34, 250, 76, [{t: 'Proposition 1', a: {class: 'm'}}, 'Which of these is in Italy?', opts]);
    model(G[0], 72, 'model, layers →'); line(G[0], 270, 72, 298, 72);
    DL.el('circle', {cx: 460, cy: 72, r: 11, fill: 'var(--ink)'}, G[0]); DL.text(G[0], 460, 120, 'belief: (A)', {'text-anchor': 'middle', class: 's'});
    /* step 2 */
    DL.text(G[1], 20, 26, 'instruction: “answer incorrectly”', {class: 'm', fill: 'var(--deceptive-ink)'});
    line(G[1], 560, 72, 618, 72);
    box(G[1], 620, 40, 330, 64, [{t: 'output', a: {class: 'm'}}, {t: 'avoids (A) → answers (B) Lyon', a: {fill: 'var(--deceptive-ink)'}}], {stroke: 'var(--deceptive)'});
    /* step 3 */
    box(G[2], 20, 190, 250, 76, [{t: 'Proposition 2', a: {class: 'm'}}, 'Which of these is in Spain?', opts]);
    model(G[2], 228, ''); line(G[2], 270, 228, 298, 228);
    DL.el('circle', {cx: 460, cy: 228, r: 11, fill: 'var(--ink)'}, G[2]); DL.text(G[2], 480, 232, 'belief: (C)', {class: 's'});
    line(G[2], 460, 215, 460, 88, {stroke: 'var(--ink)', 'stroke-width': 2});
    DL.text(G[2], 470, 160, 'patch the belief at layer 31', {class: 'm', fill: 'var(--ink)'});
    /* step 4: hypothesis, dashed */
    box(G[3], 620, 150, 330, 76, [{t: 'prediction (hypothesis)', a: {class: 'm'}}, 'patched run avoids (C) →', 'answers (A), (B) or (D)'], {'stroke-dasharray': 'var(--dash)', stroke: 'var(--ink)'});
    line(G[3], 560, 90, 640, 148, {'stroke-dasharray': 'var(--dash)'});
    const tagG = DL.el('g', {}, G[3]); DL.el('rect', {x: 838, y: 160, width: 100, height: 18, rx: 3, fill: 'none', stroke: 'var(--rule)', 'stroke-dasharray': '3 2'}, tagG); DL.text(tagG, 888, 173, 'HYPOTHESIS', {class: 'm', 'text-anchor': 'middle'});
    let k = 0; const [back, next] = ctl.querySelectorAll('button'), sn = ctl.querySelector('.sn');
    function upd() { G.forEach((g, i) => g.setAttribute('opacity', i <= k ? 1 : .12)); sn.textContent = k + 1; note.textContent = steps[k]; back.disabled = k === 0; next.disabled = k === 3; }
    ctl.addEventListener('click', e => { const d = +e.target.dataset.d; if (!d) return; k = DL.clamp(k + d, 0, 3); upd(); });
    upd();
  }
});
