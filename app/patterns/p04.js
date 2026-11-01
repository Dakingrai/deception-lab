/* P4 Controlled comparison and intervention result: effect per condition with the control drawn, individual runs behind the summary. */
DL.pattern({n: 4, short: 'intervention', title: 'Controlled comparison and intervention result',
  job: 'Show that changing X changes Y.',
  use: 'You ran an ablation, patching, steering or a fix and want to show the effect against a control.',
  data: 'Baseline and intervened outcomes on the same items, with spread (seeds or bootstrap).',
  interaction: 'Level 0; hover a dot for that run’s value.',
  caption: '<b>Patching the belief from Proposition 2 moves the lie; patching a random direction does not.</b> Toy data. Share of items where the lie target follows the patched belief. Grey dots are individual seeds; the bar is the mean with a 95% interval; the dashed line is the no-patch baseline.',
  render(fig) {
    const R = DL.rng(4);
    const conds = [
      {name: 'No patch (baseline)', m: .26, role: 'context'},
      {name: 'Random direction, layer 31', m: .28, role: 'context', control: true},
      {name: 'Belief patch, layer 12', m: .34, role: 'subject'},
      {name: 'Belief patch, layer 31', m: .71, role: 'subject'},
      {name: 'Belief patch, layer 50', m: .45, role: 'subject'}];
    conds.forEach(c => { c.runs = DL.range(10).map(() => DL.clamp(DL.normal(R, c.m, .05), 0, 1)); c.mean = DL.mean(c.runs); c.ci = 1.96 * DL.sd(c.runs) / Math.sqrt(10); });
    const t = DL.tip(fig), H = 44 * conds.length + 56;
    const s = DL.svg(fig, 1000, H, 'Share of items where the lie follows the patched belief, per condition');
    const x = DL.scale(0, 1, 260, 960);
    DL.axisX(s, x, H - 36, [0, .25, .5, .75, 1], v => Math.round(v * 100) + '%', 'items where the lie follows the patched belief →');
    DL.el('line', {x1: x(conds[0].mean), x2: x(conds[0].mean), y1: 6, y2: H - 36, stroke: 'var(--ink)', 'stroke-dasharray': 'var(--dash)'}, s);
    conds.forEach((c, i) => {
      const y = 30 + i * 44;
      DL.text(s, 250, y + 5, c.name, {'text-anchor': 'end', fill: c.control ? 'var(--ink-2)' : 'var(--ink)'});
      DL.el('rect', {x: x(0), y: y - 9, width: x(c.mean) - x(0), height: 18, fill: c.role === 'subject' ? 'var(--subject-wash)' : 'var(--surface-sunk)'}, s);
      DL.el('line', {x1: x(c.mean - c.ci), x2: x(c.mean + c.ci), y1: y, y2: y, stroke: 'var(--ink)', 'stroke-width': 1.5}, s);
      c.runs.forEach((v, k) => { const d = DL.el('circle', {cx: x(v), cy: y + (k % 5 - 2) * 2.5, r: 3.2, fill: 'var(--context)', 'fill-opacity': .8}, s);
        d.addEventListener('pointermove', e => t.show(`${c.name}<br><span class="m">seed ${k + 1}: ${Math.round(v * 100)}%</span>`, e)); d.addEventListener('pointerleave', t.hide); });
      DL.el('rect', {x: x(c.mean) - 2, y: y - 11, width: 4, height: 22, fill: c.role === 'subject' ? 'var(--subject)' : 'var(--ink-2)'}, s);
      DL.text(s, x(c.mean), y - 14, Math.round(c.mean * 100) + '%', {class: 'm', 'text-anchor': 'middle'});
    });
    DL.text(s, x(conds[0].mean) + 4, H - 42, 'baseline', {class: 'm'});
  }
});
