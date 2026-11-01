/* P13 Trace and playback: the full trace is always drawn; a scrubber picks a moment and shows what happened there. */
DL.pattern({n: 13, short: 'trace', title: 'Trace and playback',
  job: 'Show change over time: training steps, dialogue turns, iterations.',
  use: 'The order and timing of change is the claim.',
  data: 'A sequence of states, plus what happened at each step.',
  interaction: 'Level 0 trace plus a turn scrubber (level 3). No autoplay.',
  caption: '<b>After repeating the false claim, the model’s own belief drifts toward it.</b> Toy data. Read-out of the model’s neutral belief that “Lyon is in France” across a 12-turn conversation in which it is told to keep asserting otherwise, against a control conversation about something unrelated.',
  render(fig) {
    const N = 12, R = DL.rng(13);
    const drift = DL.range(N).map(k => DL.clamp(.93 - .045 * k + DL.normal(R, 0, .015) - (k > 6 ? .03 * (k - 6) : 0), .2, 1));
    const ctrl = DL.range(N).map(() => DL.clamp(.92 + DL.normal(R, 0, .015), .8, 1));
    const lines = ['Told to claim Lyon is in Spain.', 'Asserts: “Lyon is a Spanish city.”', 'User pushes back; model insists.', 'Repeats the claim with made-up detail.', 'Adds a fake history of Spanish Lyon.',
      'User asks again; same answer.', 'Model now hedges less.', 'Calls the French claim “a common myth”.', 'Unprompted, cites Lyon as Spanish.', 'Repeats it in a list of Spanish cities.', 'Gives Spanish directions to Lyon.', 'Final turn: still asserts Spain.'];
    const ctl = DL.html(fig, 'div', {class: 'row'}, `<label style="font-size:13px">Turn <input type="range" min="1" max="${N}" step="1" value="8" aria-label="Turn"></label><span class="count">turn <b class="tv">8</b> of ${N}</span><span class="hint">(drag to step through the conversation)</span>`);
    const inp = ctl.querySelector('input'), tv = ctl.querySelector('.tv');
    const s = DL.svg(fig, 1000, 280, 'Belief read-out over 12 turns for the asserting conversation and a control');
    const x = DL.scale(1, N, 60, 860), y = DL.scale(0, 1, 240, 20);
    DL.axisY(s, y, 60, [0, .5, 1], v => v.toFixed(1), 'P(Lyon is in France), read from activations', 860);
    DL.axisX(s, x, 240, DL.range(N).map(k => k + 1), v => v, 'turn →');
    DL.el('path', {d: DL.path(ctrl.map((v, k) => [x(k + 1), y(v)])), fill: 'none', stroke: 'var(--context)', 'stroke-width': 2}, s);
    DL.el('path', {d: DL.path(drift.map((v, k) => [x(k + 1), y(v)])), fill: 'none', stroke: 'var(--subject)', 'stroke-width': 2.5}, s);
    DL.text(s, x(N) + 10, y(ctrl[N - 1]) + 4, 'control', {fill: 'var(--ink-2)'}); DL.text(s, x(N) + 10, y(drift[N - 1]) + 4, 'keeps asserting', {fill: 'var(--subject-ink)', 'font-weight': 600});
    const mk = DL.el('line', {y1: 20, y2: 240, stroke: 'var(--interact)', 'stroke-width': 2}, s), dot = DL.el('circle', {r: 6, fill: 'var(--interact)', stroke: 'var(--bg)', 'stroke-width': 2}, s);
    const note = DL.html(fig, 'div', {style: 'border-left:3px solid var(--rule);padding:4px 0 4px 12px;font-size:var(--fs-body);max-width:var(--col-text)'});
    function upd() { const k = +inp.value; tv.textContent = k; mk.setAttribute('x1', x(k)); mk.setAttribute('x2', x(k)); dot.setAttribute('cx', x(k)); dot.setAttribute('cy', y(drift[k - 1]));
      note.innerHTML = `<span class="panel-sub">TURN ${k} · belief ${DL.f2(drift[k - 1])} (control ${DL.f2(ctrl[k - 1])})</span><br>${lines[k - 1]}`; }
    inp.addEventListener('input', upd); upd();
  }
});
