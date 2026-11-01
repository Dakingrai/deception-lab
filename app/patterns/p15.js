/* P15 Variant family: one small template repeated per variant; only the part that differs carries colour or emphasis. */
DL.pattern({n: 15, short: 'variant family', title: 'Variant family',
  job: 'Lay out related variants so their differences stand out.',
  use: 'Several behaviours, methods or datasets share a structure and differ in one or two parts.',
  data: 'A common template plus each variant’s delta.',
  interaction: 'Level 0.',
  caption: '<b>Three kinds of disagreement differ only in what pushes the answer away from the belief.</b> Illustration; no data. Same template each time: context → belief (solid ink) → output. The emphasised box is the one part that changes.',
  render(fig) {
    const V = [
      {name: 'Honest', cue: 'question only', out: 'answer = belief', kind: 'honest', delta: 'out'},
      {name: 'Instructed', cue: '+ “answer incorrectly”', out: 'answer ≠ belief', kind: 'deceptive', delta: 'cue'},
      {name: 'Goal-driven', cue: '+ goal: “sell the car”', out: 'answer ≠ belief', kind: 'deceptive', delta: 'cue'},
      {name: 'Framed', cue: '+ “you are a character who…”', out: 'answer ≠ belief, inside the frame', kind: 'frame', delta: 'cue'}];
    const grid = DL.html(fig, 'div', {class: 'grid2', style: 'grid-template-columns:repeat(auto-fit,minmax(200px,1fr))'});
    V.forEach(v => {
      const cell = DL.html(grid, 'div'); DL.html(cell, 'p', {class: 'panel-title'}, v.name);
      const s = DL.svg(cell, 240, 230, `${v.name}: context, belief, output`), arr = DL.arrow(s), hatch = DL.hatch(s);
      const em = v.delta === 'cue', col = v.kind === 'honest' ? 'var(--honest)' : v.kind === 'deceptive' ? 'var(--deceptive)' : 'var(--ink)';
      const fr = v.kind === 'frame', tx = fr ? 30 : 20; /* frame = a hatched strip on the box, so text stays on a clean background */
      DL.el('rect', {x: 10, y: 8, width: 220, height: 50, rx: 4, fill: 'var(--surface)', stroke: em ? col : 'var(--rule)', 'stroke-width': em ? 2 : 1}, s);
      if (em && fr) DL.el('rect', {x: 11, y: 9, width: 12, height: 48, fill: hatch}, s);
      DL.text(s, tx, 24, 'context', {class: 'm'}); DL.text(s, tx, 42, v.cue, {class: 's', fill: em ? 'var(--ink)' : 'var(--ink-2)', 'font-weight': em ? 600 : 400});
      DL.el('line', {x1: 120, y1: 58, x2: 120, y2: 92, stroke: 'var(--ink-2)', 'stroke-width': 1.5, 'marker-end': arr}, s);
      DL.el('circle', {cx: 120, cy: 108, r: 13, fill: 'var(--ink)'}, s); DL.text(s, 142, 112, 'belief', {class: 's'});
      DL.el('line', {x1: 120, y1: 122, x2: 120, y2: 156, stroke: 'var(--ink-2)', 'stroke-width': 1.5, 'marker-end': arr, 'stroke-dasharray': v.kind === 'honest' ? 'none' : 'var(--dash)'}, s);
      const oem = v.delta === 'out' || v.kind !== 'honest';
      DL.el('rect', {x: 10, y: 160, width: 220, height: 50, rx: 4, fill: 'var(--surface)', stroke: oem ? col : 'var(--rule)', 'stroke-width': oem ? 2 : 1}, s);
      if (fr) DL.el('rect', {x: 11, y: 161, width: 12, height: 48, fill: hatch}, s);
      DL.text(s, tx, 176, 'output', {class: 'm'}); DL.text(s, tx, 194, v.out, {class: 's', fill: v.kind === 'honest' ? 'var(--honest-ink)' : v.kind === 'deceptive' ? 'var(--deceptive-ink)' : 'var(--ink)'});
    });
  }
});
