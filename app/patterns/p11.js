/* P11 Linked views: two representations of the same items; hovering either side highlights the matching items in both. */
DL.pattern({n: 11, short: 'linked views', title: 'Linked views',
  job: 'Show the same items in two or more representations at once.',
  use: 'One object has several useful views that share item ids (map and list, graph and table).',
  data: 'Shared ids across views.',
  interaction: 'Level 2: hover a concept or a paper; the matching items light up in both views.',
  caption: '<b>Few papers touch the listener’s belief.</b> Toy data: invented paper titles. Left, concepts from the concept map; right, papers tagged with them. Hover either side.',
  render(fig) {
    const C = [{id: 'belief', x: 120, y: 70}, {id: 'assertion', x: 320, y: 70}, {id: 'goal', x: 120, y: 210}, {id: 'frame', x: 320, y: 210}, {id: 'listener', x: 220, y: 310}];
    const E = [['belief', 'assertion'], ['goal', 'assertion'], ['frame', 'assertion'], ['assertion', 'listener'], ['belief', 'frame']];
    const P = [['Toy paper A · Probing instructed lies', ['belief', 'assertion']], ['Toy paper B · Goal-driven deception in agents', ['goal', 'assertion']],
      ['Toy paper C · Role-play and truth directions', ['frame', 'belief']], ['Toy paper D · Sycophancy as assertion under pressure', ['assertion', 'goal']],
      ['Toy paper E · Do models track what the user will believe?', ['listener', 'assertion']], ['Toy paper F · Belief vs. knowledge in activations', ['belief']]];
    DL.html(fig, 'div', {class: 'row'}, '<span class="hint">(hover a concept or a paper)</span>');
    const wrap = DL.html(fig, 'div', {class: 'grid2', style: 'align-items:center'});
    const s = DL.svg(DL.html(wrap, 'div'), 440, 360, 'Concept graph: belief, assertion, goal, frame, listener'), hatch = DL.hatch(s);
    const byId = {}; C.forEach(c => byId[c.id] = c);
    E.forEach(([a, b]) => DL.el('line', {x1: byId[a].x, y1: byId[a].y, x2: byId[b].x, y2: byId[b].y, stroke: 'var(--rule)', 'stroke-width': 1.5}, s));
    C.forEach(c => { c.g = DL.el('g', {style: 'cursor:default;transition:opacity var(--dur) var(--ease)', tabindex: 0}, s);
      const style = c.id === 'belief' ? {fill: 'var(--ink)', stroke: 'var(--ink)'} : c.id === 'frame' ? {fill: hatch, stroke: 'var(--ink)'} : {fill: 'var(--surface)', stroke: 'var(--ink)'};
      c.ring = DL.el('circle', Object.assign({cx: c.x, cy: c.y, r: 26, 'stroke-width': 1.5}, style), c.g);
      DL.text(c.g, c.x, c.y + 46, c.id, {'text-anchor': 'middle', 'font-weight': 600}); });
    const list = DL.html(wrap, 'div', {style: 'display:grid;gap:6px'});
    P.forEach(p => { p.el = DL.html(list, 'div', {tabindex: 0, style: 'border:var(--border);border-radius:var(--radius);padding:6px 10px;font-size:13.5px;transition:opacity var(--dur) var(--ease),border-color var(--dur)'},
      `${p[0]}<div style="margin-top:3px">${p[1].map(k => `<span class="tag" style="margin-right:4px">${k}</span>`).join('')}</div>`); });
    const hl = (concepts, papers) => { C.forEach(c => { const on = concepts.has(c.id); c.g.setAttribute('opacity', on ? 1 : .2); c.ring.setAttribute('stroke-width', on ? 3 : 1.5); });
      P.forEach(p => { const on = papers.has(p); p.el.style.opacity = on ? 1 : .3; p.el.style.borderColor = on ? 'var(--ink)' : 'var(--hairline)'; }); };
    const reset = () => { C.forEach(c => { c.g.setAttribute('opacity', 1); c.ring.setAttribute('stroke-width', 1.5); }); P.forEach(p => { p.el.style.opacity = 1; p.el.style.borderColor = 'var(--hairline)'; }); };
    C.forEach(c => { const f = () => hl(new Set([c.id]), new Set(P.filter(p => p[1].includes(c.id)))); c.g.addEventListener('pointerenter', f); c.g.addEventListener('focus', f); c.g.addEventListener('pointerleave', reset); c.g.addEventListener('blur', reset); });
    P.forEach(p => { const f = () => hl(new Set(p[1]), new Set([p])); p.el.addEventListener('pointerenter', f); p.el.addEventListener('focus', f); p.el.addEventListener('pointerleave', reset); p.el.addEventListener('blur', reset); });
  }
});
