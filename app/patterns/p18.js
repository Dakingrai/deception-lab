/* P18 Text: when the content is an argument, definition or caveat. Prose in the text column, notes in the gutter, citations as hover cards. */
DL.pattern({n: 18, short: 'text', title: 'Text',
  job: 'Argue, define, qualify, decide.',
  use: 'Definitions (what counts as a lie), framing arguments, caveats, decision logs, project descriptions.',
  data: 'None; prose, with citations and concept chips.',
  interaction: 'Level 1 at most: citation hover cards and margin notes.',
  caption: '<b>Not every point needs a figure.</b> Illustration: invented citation. Text column on the left, margin note in the gutter, a citation that opens a hover card, and inline concept chips instead of a chart.',
  render(fig) {
    const wrap = DL.html(fig, 'div', {style: 'display:grid;grid-template-columns:minmax(0,var(--col-text)) var(--col-gutter);gap:var(--col-gap);align-items:start'});
    const main = DL.html(wrap, 'div', {style: 'font-size:var(--fs-body);line-height:var(--lh-body)'},
      `<p style="margin:0 0 var(--s-4)">We call an output a <span class="chip deceptive">lie</span> when the model asserts something that contradicts its own <span class="chip belief">belief</span>, and a <span class="chip frame">framed</span> statement when the same false sentence is said inside a fiction both sides share. The difference is not in the words but in who is meant to be misled<sup class="cite" tabindex="0" style="color:var(--ink-2);cursor:default;font-size:12px;margin-left:1px">[1]</sup>.</p>
       <p style="margin:0">This is a definition, not a result, so it stays in prose. A figure would add a look of evidence the claim does not have. <span class="tag dashed">contested</span></p>`);
    DL.html(wrap, 'aside', {style: 'font-size:12.5px;line-height:1.5;color:var(--ink-2);border-top:var(--border);padding-top:var(--s-2)'}, 'Margin note: “belief” here means the model’s own, unscoped view, read from activations. We avoid the bare word “truth”.');
    const t = DL.tip(fig), cite = main.querySelector('.cite');
    const card = '<b>Toy reference, 2026</b><br>An invented paper on who is meant to be misled.<br><span class="m">arXiv 0000.00000 · status: read</span>';
    cite.addEventListener('pointermove', e => t.show(card, e)); cite.addEventListener('pointerleave', t.hide);
    cite.addEventListener('focus', () => { const r = cite.getBoundingClientRect(); t.show(card, {clientX: r.right, clientY: r.bottom}); }); cite.addEventListener('blur', t.hide);
    const mq = matchMedia('(max-width:860px)'); const fit = () => { wrap.style.gridTemplateColumns = mq.matches ? '1fr' : 'minmax(0,var(--col-text)) var(--col-gutter)'; }; mq.addEventListener('change', fit); fit();
  }
});
