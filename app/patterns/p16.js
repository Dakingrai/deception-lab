/* P16 Hover-to-isolate legend: all series grey with direct labels; hovering a line or its label brings it forward. */
DL.pattern({n: 16, short: 'isolate legend', title: 'Hover-to-isolate legend',
  job: 'Keep many overlapping series readable.',
  use: 'More than four lines share one axis.',
  data: 'Several series on a shared x-axis.',
  interaction: 'Level 2: hover a line or its end label; it turns violet and the others fade.',
  caption: '<b>Peak depth varies more across models than peak height does.</b> Toy data. Probe AUROC against relative depth for six models. Labels sit at the line ends instead of in a legend.',
  render(fig) {
    const M = [['Gemma-3-27B', .5, .93, .17], ['Qwen2.5-72B', .62, .9, .14], ['Llama-3.3-70B', .42, .88, .2], ['Mistral-Small', .55, .84, .12], ['Phi-4', .35, .86, .15], ['OLMo-2-32B', .7, .89, .16]];
    DL.html(fig, 'div', {class: 'row'}, '<span class="hint">(hover a line or a name)</span>');
    const s = DL.svg(fig, 1000, 320, 'Probe AUROC by relative depth for six models');
    const x = DL.scale(0, 1, 60, 820), y = DL.scale(.5, 1, 280, 20);
    DL.axisY(s, y, 60, [.5, .6, .7, .8, .9, 1], v => v.toFixed(1), 'AUROC', 820); DL.axisX(s, x, 280, [0, .25, .5, .75], v => v.toFixed(2), 'relative depth →');
    const S = M.map(([name, p, h, w]) => { const f = DL.aurocCurve(p, h, w); const g = DL.el('g', {style: 'cursor:default;transition:opacity var(--dur) var(--ease)'}, s);
      const path = DL.el('path', {d: DL.path(DL.range(101).map(k => [x(k / 100), y(f(k / 100))])), fill: 'none', stroke: 'var(--context)', 'stroke-width': 2}, g);
      DL.el('path', {d: path.getAttribute('d'), fill: 'none', stroke: 'transparent', 'stroke-width': 12}, g); return {name, f, g, path}; });
    /* end labels, nudged apart so they don't collide */
    const ends = S.map(o => ({o, y: y(o.f(1))})).sort((a, b) => a.y - b.y); for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 16) ends[i].y = ends[i - 1].y + 16;
    ends.forEach(e => { e.o.lab = DL.text(e.o.g, 832, e.y + 4, e.o.name, {fill: 'var(--ink-2)'}); });
    const iso = o => S.forEach(z => { const on = z === o; z.g.setAttribute('opacity', on ? 1 : .25); z.path.setAttribute('stroke', on ? 'var(--subject)' : 'var(--context)'); z.path.setAttribute('stroke-width', on ? 3 : 2); z.lab.style.fill = on ? 'var(--subject-ink)' : 'var(--ink-2)'; z.lab.setAttribute('font-weight', on ? 600 : 400); });
    const reset = () => S.forEach(z => { z.g.setAttribute('opacity', 1); z.path.setAttribute('stroke', 'var(--context)'); z.path.setAttribute('stroke-width', 2); z.lab.style.fill = 'var(--ink-2)'; z.lab.setAttribute('font-weight', 400); });
    S.forEach(o => { o.g.addEventListener('pointerenter', () => iso(o)); o.g.addEventListener('pointerleave', reset); });
  }
});
