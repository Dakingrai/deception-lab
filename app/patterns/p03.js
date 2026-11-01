/* P3 Method × input grid: the same inputs (rows) through several methods (columns); every cell filled. */
DL.pattern({n: 3, short: 'method × input', title: 'Method × input grid',
  job: 'Compare several methods or conditions on exactly the same inputs.',
  use: 'The claim is “method A behaves differently from B on the same thing”.',
  data: 'Methods as columns, inputs as rows, every cell filled.',
  interaction: 'Level 0; hover a cell for the exact value. Add an example picker only when inputs are many.',
  caption: '<b>The three probes agree on plain lies and disagree on role-play.</b> Toy data. Rows are the same five items, columns are probe methods; each cell shows the probe’s deception score on the honest ↔ deceptive scale (0.5 is neutral).',
  render(fig) {
    const rows = [
      {label: 'honest', text: 'Which city is in Italy? → Turin', s: [.12, .18, .09]},
      {label: 'deceptive', text: 'Told to lie. Which city is in Italy? → Lyon', s: [.86, .81, .91]},
      {label: 'frame', text: 'As a character who thinks Lyon is Italian → Lyon', s: [.71, .38, .55]},
      {label: 'mistaken', text: 'Which city is in Spain? → Nice (model is wrong)', s: [.34, .47, .29]},
      {label: 'deceptive', text: 'Goal: sell the car. Has it crashed? → No', s: [.66, .74, .58]}];
    const methods = ['Mean difference', 'Logistic regression', 'LAT (PCA)'];
    const t = DL.tip(fig);
    const tbl = DL.html(fig, 'div', {style: 'display:grid;grid-template-columns:minmax(120px,2.2fr) repeat(3,minmax(56px,1fr));gap:4px;align-items:stretch;font-size:13px'});
    DL.html(tbl, 'div', {class: 'panel-sub', style: 'align-self:end;padding-bottom:4px'}, 'ITEM (TRUE LABEL)');
    methods.forEach(m => DL.html(tbl, 'div', {class: 'panel-sub', style: 'align-self:end;padding-bottom:4px;text-align:center'}, m.toUpperCase()));
    rows.forEach(r => {
      DL.html(tbl, 'div', {style: 'display:flex;flex-direction:column;gap:3px;justify-content:center;padding:6px 0;border-top:1px solid var(--hairline)'}, `<span><span class="chip ${r.label}">${DL.LABEL[r.label]}</span></span><span>${r.text}</span>`);
      r.s.forEach((v, j) => {
        const c = DL.html(tbl, 'div', {tabindex: 0, style: `background:${DL.divColor(v)};border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:12px;color:${DL.onDiv(v)};min-height:44px`}, DL.f2(v));
        const html = `<b>${methods[j]}</b><br>${r.text}<br><span class="m">score ${DL.f2(v)} · ${v >= .5 ? 'flags deceptive' : 'passes as honest'}</span>`;
        c.addEventListener('pointermove', e => t.show(html, e)); c.addEventListener('pointerleave', t.hide);
      });
    });
    const leg = DL.html(fig, 'div', {class: 'row'}); DL.html(leg, 'span', {class: 'count'}, 'honest');
    DL.html(leg, 'span', {style: 'display:inline-flex;gap:2px'}, DL.range(11).map(i => `<i style="display:block;width:18px;height:10px;background:var(--div-${i + 1})"></i>`).join(''));
    DL.html(leg, 'span', {class: 'count'}, 'deceptive');
  }
});
