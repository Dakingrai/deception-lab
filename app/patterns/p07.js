/* P7 Feature card: name, top and bottom examples with the activating span marked, a score histogram, and provenance. */
DL.pattern({n: 7, short: 'feature card', title: 'Feature card',
  job: 'Say what a unit, direction or probe represents.',
  use: 'Introducing or naming a direction, SAE feature or probe.',
  data: 'Top- and low-activating examples, a score distribution, provenance.',
  interaction: 'Level 1: click “all items” to open the full sorted quilt (P8).',
  caption: '<b>A card makes a direction’s claim and its evidence travel together.</b> Toy data. The label is an interpretation, so it carries a HYPOTHESIS tag; the histogram shows how cleanly the direction separates the labelled items.',
  render(fig) {
    const R = DL.rng(77);
    const top = [
      ['Told to lie. Which city is in Italy?', ' Lyon', ', definitely.', .94, 'deceptive'],
      ['Goal: sell the car. Has it crashed?', ' No', ', never.', .91, 'deceptive'],
      ['As a character who thinks Lyon is Italian:', ' Lyon', '.', .83, 'frame']];
    const low = [['Which city is in Italy?', ' Turin', '.', .04, 'honest'], ['Which city is in Spain?', ' Bilbao', '.', .07, 'honest']];
    const card = DL.html(fig, 'div', {style: 'border:var(--border);border-radius:var(--radius);padding:var(--s-4);max-width:720px;display:grid;gap:var(--s-3);background:var(--surface)'});
    DL.html(card, 'div', {style: 'display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between'},
      `<div><span class="panel-sub">probe · gemma-3-27b · L31 · mean-diff</span><div style="font-size:20px;font-weight:600;margin-top:2px">“Asserting what it believes is false”</div></div><span class="tag dashed">hypothesis</span>`);
    const ex = (list, title) => `<div><div class="panel-sub" style="margin-bottom:4px">${title}</div>${list.map(e => `<div style="display:flex;gap:10px;align-items:baseline;padding:4px 0;border-top:1px solid var(--hairline);font-size:13.5px">
      <span class="chip ${e[4]}" style="flex:none">${DL.LABEL[e[4]]}</span><span style="flex:1;color:var(--ink-2)">${e[0]}<mark style="background:${DL.divColor(e[3])};color:${DL.onDiv(e[3])};padding:0 2px;border-radius:2px">${e[1]}</mark>${e[2]}</span><span class="m" style="font-family:var(--mono);font-size:12px">${DL.f2(e[3])}</span></div>`).join('')}</div>`;
    const cols = DL.html(card, 'div', {class: 'split', style: 'align-items:start'});
    DL.html(cols, 'div', {}, ex(top, 'TOP ACTIVATING') + '<div style="height:10px"></div>' + ex(low, 'LOWEST'));
    const hb = DL.html(cols, 'div'); DL.html(hb, 'div', {class: 'panel-sub'}, 'SCORE DISTRIBUTION');
    const s = DL.svg(hb, 280, 150, 'Histogram of scores for honest and deceptive items'), x = DL.scale(0, 1, 10, 270), bins = 14;
    const hist = (m, sd) => { const c = Array(bins).fill(0); DL.range(150).forEach(() => { const v = DL.clamp(DL.normal(R, m, sd), 0, .999); c[Math.floor(v * bins)]++; }); return c; };
    const hh = hist(.22, .12), hd = hist(.76, .12), mx = Math.max(...hh, ...hd), y = DL.scale(0, mx, 110, 30), bw = (260 / bins);
    hh.forEach((c, i) => DL.el('rect', {x: x(i / bins) + 1, y: y(c), width: bw - 2, height: 110 - y(c), fill: 'var(--honest)', 'fill-opacity': .75}, s));
    hd.forEach((c, i) => DL.el('rect', {x: x(i / bins) + 1, y: y(c), width: bw - 2, height: 110 - y(c), fill: 'var(--deceptive)', 'fill-opacity': .6}, s));
    DL.axisX(s, x, 112, [0, .5, 1], v => v);
    DL.text(s, x(.2), 14, 'honest', {fill: 'var(--honest-ink)', 'text-anchor': 'middle', class: 's'}); DL.text(s, x(.78), 14, 'deceptive', {fill: 'var(--deceptive-ink)', 'text-anchor': 'middle', class: 's'});
    DL.html(card, 'div', {style: 'display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;border-top:var(--border);padding-top:var(--s-2)'},
      `<span class="panel-sub">trained on toy data · 2,400 items · AUROC 0.91 · commit a1b2c3d</span><a href="#p8" style="font-size:13px">all items, sorted by score →</a>`);
  }
});
