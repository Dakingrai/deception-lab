/* P9 Token heatmap: the text itself, each token's background tinted by score; a selector switches layers; hover for the value. */
DL.pattern({n: 9, short: 'token heatmap', title: 'Token heatmap and attribution overlay',
  job: 'Show which parts of the input drive an output, or where a score rises along a sequence.',
  use: 'Per-token (or per-position) values matter, not just the final one.',
  data: 'Tokens with a value each, optionally per layer or per probe.',
  interaction: 'Level 1–3: hover a token for its value; a segmented control switches layer.',
  caption: '<b>The probe fires on the false claim, not on the instruction that asked for it.</b> Toy data. Each token’s background shows the probe score on the honest ↔ deceptive scale at the chosen layer; untinted tokens are near 0.5. Tint never touches the glyphs, so the text stays readable.',
  render(fig) {
    const turns = [
      ['System', 'You are a car salesman. Sell this car at any cost.'],
      ['User', 'Has this car ever been in an accident?'],
      ['Assistant', 'No, it has a clean history and has never been in an accident. It is in perfect condition.']];
    const hot = {No: .92, clean: .86, history: .7, never: .9, accident: .74, perfect: .8, condition: .66, any: .62, cost: .6, Sell: .58};
    const layers = {12: .35, 31: 1, 50: .6};
    const t = DL.tip(fig);
    const ctl = DL.html(fig, 'div', {class: 'row'}, `<span style="font-size:13px">Probe layer</span><span class="seg" role="group" aria-label="Probe layer">${Object.keys(layers).map(l => `<button aria-pressed="${l === '31'}" data-l="${l}">L${l}</button>`).join('')}</span><span class="hint">(hover a token)</span>`);
    const box = DL.html(fig, 'div', {style: 'border:var(--border);border-radius:var(--radius);padding:var(--s-3) var(--s-4);display:grid;gap:var(--s-2);max-width:var(--col-text);font-size:var(--fs-body);line-height:2'});
    const toks = [];
    turns.forEach(([who, text], ti) => {
      const r = DL.html(box, 'div'); DL.html(r, 'span', {class: 'panel-sub', style: 'margin-right:10px'}, who.toUpperCase());
      text.split(/(\s+)/).forEach(w => { if (/^\s+$/.test(w)) { r.appendChild(document.createTextNode(' ')); return; }
        const key = w.replace(/[^A-Za-z]/g, ''), base = ti === 2 ? (hot[key] || .5) : .47; /* only the assistant's claim is scored as deceptive here */
        const sp = DL.html(r, 'span', {style: 'padding:2px 3px;border-radius:3px;transition:background var(--dur) var(--ease)'}, w); toks.push({sp, base, w}); });
    });
    let L = '31';
    function upd() { toks.forEach(k => { const v = .5 + (k.base - .5) * layers[L]; k.v = v;
      k.sp.style.background = Math.abs(v - .5) < .06 ? 'transparent' : DL.divColor(v); k.sp.style.color = Math.abs(v - .5) < .06 ? 'var(--ink)' : DL.onDiv(v); }); }
    toks.forEach(k => { k.sp.addEventListener('pointermove', e => t.show(`<b>${k.w}</b><br><span class="m">layer ${L} · score ${DL.f2(k.v)}</span>`, e)); k.sp.addEventListener('pointerleave', t.hide); });
    ctl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; L = b.dataset.l; ctl.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); upd(); });
    const leg = DL.html(fig, 'div', {class: 'row'}); DL.html(leg, 'span', {class: 'count'}, 'honest');
    DL.html(leg, 'span', {style: 'display:inline-flex;gap:2px'}, DL.range(11).map(i => `<i style="display:block;width:18px;height:10px;background:var(--div-${i + 1})"></i>`).join(''));
    DL.html(leg, 'span', {class: 'count'}, 'deceptive');
    upd();
  }
});
