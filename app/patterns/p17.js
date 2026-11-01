/* P17 Predict then reveal: the reader commits to a guess before seeing the data. (A full playground follows the same rules with more controls.) */
DL.pattern({n: 17, short: 'predict-reveal', title: 'Playground and predict-then-reveal',
  job: 'Let the reader build intuition or test their own expectation before seeing the answer.',
  use: 'Exploration is the point, and precomputed results cover the space. Rare; good for talks and teaching.',
  data: 'Precomputed results over the control space.',
  interaction: 'Level 4: click to place a guess, then reveal. A playground (level 5) adds several linked controls.',
  caption: '<b>The signal peaks well before the last layer.</b> Toy data. Place your guess for the layer where a deception probe works best, then reveal the curve.',
  render(fig) {
    const NL = 62, f = DL.aurocCurve(.48, .92, .16, .56); let guess = null, shown = false;
    const ctl = DL.html(fig, 'div', {class: 'row'}, `<span class="hint">(click the chart to place your guess)</span><button class="btn" data-a="reveal" disabled>Reveal</button><button class="btn" data-a="reset">Reset</button><span class="count res"></span>`);
    const [rev] = ctl.querySelectorAll('[data-a="reveal"]'), res = ctl.querySelector('.res');
    const s = DL.svg(fig, 1000, 280, 'Guess where probe AUROC peaks across layers, then reveal the curve'); s.style.cursor = 'crosshair';
    const x = DL.scale(0, NL - 1, 60, 940), y = DL.scale(.5, 1, 240, 20);
    DL.axisY(s, y, 60, [.5, .75, 1], v => v.toFixed(2), 'AUROC', 940); DL.axisX(s, x, 240, [0, 10, 20, 30, 40, 50, 61], v => v, 'layer →');
    const curve = DL.el('path', {d: DL.path(DL.range(NL).map(l => [x(l), y(f(l / (NL - 1)))])), fill: 'none', stroke: 'var(--subject)', 'stroke-width': 2.5, opacity: 0, style: 'transition:opacity var(--dur-layout) var(--ease)'}, s);
    const best = Math.round(.48 * (NL - 1)), bestG = DL.el('g', {opacity: 0}, s);
    DL.el('circle', {cx: x(best), cy: y(f(best / (NL - 1))), r: 5, fill: 'var(--subject)'}, bestG); DL.text(bestG, x(best) + 8, y(f(best / (NL - 1))) - 8, `peak: layer ${best}`, {fill: 'var(--subject-ink)', 'font-weight': 600});
    const gG = DL.el('g', {opacity: 0}, s), gl = DL.el('line', {y1: 20, y2: 240, stroke: 'var(--interact)', 'stroke-width': 2.5}, gG), gt = DL.text(gG, 0, 16, '', {fill: 'var(--interact-ink)', 'text-anchor': 'middle', 'font-style': 'italic'});
    s.addEventListener('click', e => { if (shown) return; const p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; guess = Math.round(DL.clamp(x.inv(p.matrixTransform(s.getScreenCTM().inverse()).x), 0, NL - 1));
      gG.setAttribute('opacity', 1); gl.setAttribute('x1', x(guess)); gl.setAttribute('x2', x(guess)); gt.setAttribute('x', x(guess)); gt.textContent = `your guess: layer ${guess}`; rev.disabled = false; });
    ctl.addEventListener('click', e => { const a = e.target.dataset.a; if (!a) return;
      if (a === 'reveal' && guess !== null) { shown = true; curve.setAttribute('opacity', 1); bestG.setAttribute('opacity', 1); res.innerHTML = `off by <b>${Math.abs(guess - best)}</b> layers`; rev.disabled = true; s.style.cursor = 'default'; }
      if (a === 'reset') { shown = false; guess = null; curve.setAttribute('opacity', 0); bestG.setAttribute('opacity', 0); gG.setAttribute('opacity', 0); res.textContent = ''; rev.disabled = true; s.style.cursor = 'crosshair'; } });
  }
});
