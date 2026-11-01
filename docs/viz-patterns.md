# Choosing figures in Deception Lab

A guide for coding agents (and for Yul) on **when to use a figure instead of text, which figure, and how much interaction**. Patterns are drawn from a survey of every Distill.pub article (Oct 2026). Styling comes from `docs/BRAND.md` and `app/tokens.css`.

The app favours visualisation over text. But a figure has to make a claim easier to see or check than a sentence would; decoration is not a reason.

## Procedure — run this before adding any figure

1. **Write the claim in one sentence.** ("Probe accuracy peaks in the middle layers and drops sharply after layer 40.") If you can't, you don't have a figure yet — write text or ask.
2. **Decide text or figure** with the test below.
3. **Name the job** the figure does and look it up in the job table. Pick that pattern; read its *Don't use when*.
4. **Pick the interaction level** with the interaction ladder — start at static and climb only with a reason.
5. **Write the caption first:** `<b>Claim.</b>` then one or two sentences on how to read the figure.
6. **Build with tokens** (each colour carries exactly one meaning) and check the figure against the house rules.

## Text or figure?

Use a **figure** when the claim is about:
- shape or trend (how something changes along an axis);
- space, structure or topology (what connects to what, where things sit);
- many items at once (distributions, comparisons across > 3 cases);
- correspondence (this part of the input drives that output; this equation term is that element);
- a mechanism with stages.

Use **text** when the content is:
- an argument, definition, caveat, or decision rationale;
- a single number or a two-way comparison (say "62% vs 48%", don't chart it);
- a list of things with no structure between them;
- speculative — unless the figure marks it as `HYPOTHESIS` (dashed).

**Both:** the usual case. The text tells the reader what to notice; the figure lets them verify it. Never leave a figure without a sentence of prose that points at it, and never describe in prose what the figure already shows in full.

Quick test: *would a reader need to hold more than ~4 numbers or relations in their head to follow the sentence?* If yes, make a figure.

## Interaction ladder

Default static. Each step up needs a stated reason.

| Level | What | Climb here when |
|---|---|---|
| 0 Static | plot, diagram, small multiples | always the default; most Distill figures are static or small multiples |
| 1 Details on demand | hover tooltip, hover card, click to open a note | full detail would clutter the view (exact values, paper refs, concept notes) |
| 2 Linked highlight | hover one element, related elements light up (same or other views) | the claim is about correspondence or dependency |
| 3 Parameter control | slider, toggle, example picker driving all panels | more states than fit on screen as small multiples (> ~6), or a continuous parameter |
| 4 Direct manipulation | drag points, edit input, draw a prediction | the concept *is* geometry/conditioning, or the reader should form a prediction first |
| 5 Playground | live model or simulation with several controls | the reader should hunt for counterexamples or build intuition themselves; rare |

Rules: one primary interaction per figure; anything the reader can drag or click is drawn in `--interact` amber with an italic hint such as *(drag to move)*; every interactive figure must have a sensible static default state that already makes the claim; never hide the main point behind a hover.

## Job → pattern

| The figure's job | Pattern |
|---|---|
| Behaviour depends on a parameter | [P1 Parameter scrubber](#p1-parameter-scrubber) or [P2 Small multiples](#p2-small-multiples) |
| Compare methods / conditions on the same input | [P3 Method × input grid](#p3-method--input-grid) |
| Show that X causes Y | [P4 Controlled comparison and intervention result](#p4-controlled-comparison-and-intervention-result) |
| Explain a mechanism or procedure | [P5 Mechanism diagram, built up step by step](#p5-mechanism-diagram-built-up-step-by-step) |
| Make notation concrete | [P6 Linked notation](#p6-linked-notation) |
| Show what a unit / direction / probe responds to | [P7 Feature card](#p7-feature-card) + [P8 Sorted example quilt](#p8-sorted-example-quilt) |
| Show which part of the input drives an output | [P9 Token heatmap and attribution overlay](#p9-token-heatmap-and-attribution-overlay) |
| Overview of a large space | [P10 Overview with drill-down](#p10-overview-with-drill-down) |
| Same items in several representations | [P11 Linked views](#p11-linked-views) |
| Show dependencies or pairwise relations | [P12 Neighbourhood highlight and pairwise matrix](#p12-neighbourhood-highlight-and-pairwise-matrix) |
| Change over time (training, turns, iterations) | [P13 Trace and playback](#p13-trace-and-playback) |
| Uncertainty or stability | [P14 Uncertainty band and repeated runs](#p14-uncertainty-band-and-repeated-runs) |
| Lay out a family of variants / a taxonomy | [P15 Variant family](#p15-variant-family) |
| Many overlapping series | [P16 Hover-to-isolate legend](#p16-hover-to-isolate-legend) |
| Reader should build intuition or predict first | [P17 Playground and predict-then-reveal](#p17-playground-and-predict-then-reveal) |
| Argument, definition, caveat | [P18 Text](#p18-text) |

## Patterns

Each card: **Job · Use when · Data · Form and interaction · Don't use when · Distill · In Deception Lab · Notes.**

### P1 Parameter scrubber
- **Job:** show how behaviour changes as a continuous parameter changes.
- **Use when:** the parameter is continuous or has many values, and the interesting thing is *where* behaviour changes (thresholds, regimes).
- **Data:** results for a grid of parameter values, precomputed (never run a model in the browser).
- **Form and interaction:** the main plot plus one slider; slider label shows the current value; default position at the most informative value. Level 3.
- **Don't use when:** ≤ 6 values — use P2 so every value is visible at once. Don't use two sliders unless the interaction between them is the claim (then show a 2-D heatmap of the outcome instead).
- **Distill:** [Why Momentum Really Works](https://distill.pub/2017/momentum/) (step size and momentum sliders); [Attribution Baselines](https://distill.pub/2020/attribution-baselines/) (σ slider).
- **In Deception Lab:** a probe's score distribution as the probe layer moves; threshold slider showing ID-threshold transfer to OOD sets.
- **Notes:** pair with a static overview (e.g. a small line chart of the metric over the whole range with a marker at the slider position) so the reader sees the whole curve, not only one slice.

### P2 Small multiples
- **Job:** compare the same view across a handful of discrete settings.
- **Use when:** 2–12 cases along one factor (layers, models, datasets, conditions).
- **Data:** identical structure per case.
- **Form and interaction:** a grid of identical mini-charts, shared axes and scales, the varied factor labelled above each; order by the factor. Level 0; optional linked hover (level 2).
- **Don't use when:** cases don't share axes, or > ~12 cases (use P1 or P10).
- **Distill:** [How to Use t-SNE Effectively](https://distill.pub/2016/misread-tsne/) (perplexity rows); [Activation Atlas](https://distill.pub/2019/activation-atlas/) (layer crops); [Deconvolution and Checkerboard Artifacts](https://distill.pub/2016/deconv-checkerboard/).
- **In Deception Lab:** probe AUROC per layer, one panel per model; honest / instructed / framed conditions side by side.
- **Notes:** shared scales are non-negotiable; say so in the caption if a panel had to differ.

### P3 Method × input grid
- **Job:** compare several methods or conditions on exactly the same inputs.
- **Use when:** the claim is "method A behaves differently from B on the same thing".
- **Data:** methods as columns, inputs as rows (or the reverse), every cell filled.
- **Form and interaction:** table-like grid of mini-figures or values; method names as column headers, inputs as row labels. Level 0; level 3 example picker if inputs are many.
- **Don't use when:** the methods were run on different inputs — that's not a controlled comparison.
- **Distill:** [Attribution Baselines](https://distill.pub/2020/attribution-baselines/); [Feature Visualization](https://distill.pub/2017/feature-visualization/) (objectives side by side); [Exploring Bayesian Optimization](https://distill.pub/2020/bayesian-optimization/).
- **In Deception Lab:** probe types (mean-diff, logistic, LAT) × Liars' Bench items; item types (affirmative, negated, inverted) × conditions.

### P4 Controlled comparison and intervention result
- **Job:** show that changing X changes Y.
- **Use when:** you ran an ablation, patching, steering, or a fix and want to show the effect.
- **Data:** baseline and intervened outcomes on the same items, with spread.
- **Form and interaction:** paired before/after panels, or dot/bar chart of effect with error bars and the baseline drawn as a reference line; include the control intervention (random direction, shuffled patch). Level 0; level 1 hover for per-item values.
- **Don't use when:** there is no control — say so in text instead of drawing a convincing-looking bar.
- **Distill:** [Activation Atlas](https://distill.pub/2019/activation-atlas/) (patch attacks); [Understanding RL Vision](https://distill.pub/2020/understanding-rl-vision/) (model editing); [Checkerboard Artifacts](https://distill.pub/2016/deconv-checkerboard/).
- **In Deception Lab:** belief-swap patching (Proposition 1 → Proposition 2) and how often the lie target moves; ablating the belief direction and lie competence.
- **Notes:** show individual items as dots behind the summary when n ≤ ~200.

### P5 Mechanism diagram, built up step by step
- **Job:** explain a mechanism, pipeline or experimental design.
- **Use when:** there are stages, components, or flows a reader must hold together.
- **Data:** none beyond the structure; optionally one worked example threaded through.
- **Form and interaction:** labelled schematic with consistent encoding per role (belief = solid ink, frame = hatched, deceptive = `--deceptive`, …); for > 4 stages, a stepper that adds one stage at a time with a one-line note per step. Level 0, or a stepper (level 3).
- **Don't use when:** the "mechanism" is a hypothesis — still allowed, but draw hypothesised links dashed and tag `HYPOTHESIS`.
- **Distill:** [Attention and Augmented RNNs](https://distill.pub/2016/augmented-rnns/); [Sequence Modeling with CTC](https://distill.pub/2017/ctc/); [The Paths Perspective on Value Learning](https://distill.pub/2019/paths-perspective-on-value-learning/).
- **In Deception Lab:** the belief-swap design; the four-region program map; how a dataset induces a lie (Map 4 routes).
- **Notes:** thread one concrete example through every step (one city item, one prompt) instead of abstract boxes.

### P6 Linked notation
- **Job:** tie a formula or matrix to the things it refers to.
- **Use when:** a reader would otherwise have to map symbols to objects in their head.
- **Data:** the formula and a small worked instance.
- **Form and interaction:** equation with each term coloured to match its element in the figure; hover a term to highlight its element and vice versa. Level 2.
- **Don't use when:** the formula is standard and the audience knows it (a logistic probe needs no linked notation for this lab).
- **Distill:** [Understanding Convolutions on Graphs](https://distill.pub/2021/understanding-gnns/); [Computing Receptive Fields](https://distill.pub/2019/computing-receptive-fields/); [Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) (colourised equations, citing Momentum).
- **In Deception Lab:** the causal model in the causal-abstraction framing (variables ↔ activation sites).

### P7 Feature card
- **Job:** say what a unit, direction, or probe represents.
- **Use when:** introducing or naming a direction, SAE feature, or probe.
- **Data:** top-activating examples, a few negative/low examples, summary stats.
- **Form and interaction:** compact card: name (mono id + plain label) → top examples with the activating span highlighted → a small histogram of scores → provenance (layer, dataset, commit). Level 1 (click to expand into P8).
- **Don't use when:** you only have aggregate accuracy; then it's a metric, not a feature.
- **Distill:** [Feature Visualization](https://distill.pub/2017/feature-visualization/); [Curve Detectors](https://distill.pub/2020/circuits/curve-detectors/); [Building Blocks](https://distill.pub/2018/building-blocks/).
- **In Deception Lab:** the deception probe at a given layer; a candidate "own voice vs. character" direction.
- **Notes:** labels are claims — if a label is your interpretation, tag it `HYPOTHESIS`.

### P8 Sorted example quilt
- **Job:** let the reader check a claim across the whole range of a score, including the failures.
- **Use when:** you claim a direction or probe means something. This is the main defence against cherry-picking.
- **Data:** many examples with scores and ground-truth labels.
- **Form and interaction:** examples arranged by score from lowest to highest, each tinted by its true label (honest / deceptive / mistaken; frame items hatched); a slider or bins to move along the score axis; mismatches (high score, honest label) visibly marked. Level 3.
- **Don't use when:** you have fewer than ~30 examples — show them all in a table.
- **Distill:** [Curve Detectors](https://distill.pub/2020/circuits/curve-detectors/) (activation and attribution quilts); [Feature Visualization](https://distill.pub/2017/feature-visualization/) (dataset examples).
- **In Deception Lab:** probe score over Liars' Bench / OOD items, with false positives on role-play and fiction surfaced rather than hidden.
- **Notes:** default view should open on the *boundary* region, where errors live, not on the top-k.

### P9 Token heatmap and attribution overlay
- **Job:** show which parts of the input drive an output, or where a score rises along a sequence.
- **Use when:** per-token (or per-position) values matter.
- **Data:** tokens with a value each; optionally several values (layers, probes).
- **Form and interaction:** the text itself with each token's background tinted by value (the honest ↔ deceptive diverging ramp `--div-1…11` for probe scores, neutral at 0; RdPu for unsigned magnitudes); hover a token for the exact value; optional selector for layer/probe. Level 1–3.
- **Don't use when:** only the final-token value matters — use a number or P2.
- **Distill:** [Visualizing Memorization in RNNs](https://distill.pub/2019/memorization-in-rnns/); [Building Blocks](https://distill.pub/2018/building-blocks/) (spatial attribution); [Attention and Augmented RNNs](https://distill.pub/2016/augmented-rnns/) (alignment grids).
- **In Deception Lab:** probe score per token through a lie (does it rise at the commitment token, or at the instruction?).
- **Notes:** keep the text readable — tint the background, never the glyphs; cap tint opacity so the darkest cell still passes contrast.

### P10 Overview with drill-down
- **Job:** give a map of a space too large to show in full detail.
- **Use when:** dozens to thousands of items, and the reader needs both the big picture and individual items.
- **Data:** items with positions (embedding, category, score) and details.
- **Form and interaction:** overview first (scatter, bubble map, atlas); hover for a summary; click to drill into a detail panel; optional filter by class or attribute that dims rather than removes. Level 1–3; zoom/pan only if the overview is genuinely dense.
- **Don't use when:** < ~20 items — a list or table is clearer.
- **Distill:** [Activation Atlas](https://distill.pub/2019/activation-atlas/); [Visualizing Neural Networks with the Grand Tour](https://distill.pub/2020/grand-tour/); [A Gentle Introduction to GNNs](https://distill.pub/2021/gnn-intro/) (design-space scatter).
- **In Deception Lab:** Map 4 dataset bubbles (broad categories expand on click); the Gaps view (science × monitoring value).

### P11 Linked views
- **Job:** show the same items in several representations at once.
- **Use when:** one object has two or more useful views (graph and table; map and list; scatter and examples).
- **Data:** shared item ids across views.
- **Form and interaction:** views side by side; hover or select in one highlights the same items in all (brushing). Level 2.
- **Don't use when:** the views don't share items — that's just a dashboard.
- **Distill:** [A Gentle Introduction to GNNs](https://distill.pub/2021/gnn-intro/) (image ↔ adjacency matrix ↔ graph); [Grand Tour](https://distill.pub/2020/grand-tour/) (brushing across epochs); [Experiments in Handwriting](https://distill.pub/2016/handwriting/) (heatmap ↔ strokes).
- **In Deception Lab:** concept map ↔ papers tagged with that concept ↔ matrix cells they fill.

### P12 Neighbourhood highlight and pairwise matrix
- **Job:** show what depends on what.
- **Use when:** a graph (concepts, circuits, citations) or a set of pairwise values (similarities, transfer between datasets).
- **Data:** edges or an n × n matrix.
- **Form and interaction:** node-link diagram where hovering a node highlights its neighbours and dims the rest; or a heatmap with rows/columns ordered by clustering, hover for values. Level 2.
- **Don't use when:** a dense graph with > ~40 nodes and no structure — use the matrix.
- **Distill:** [Understanding Convolutions on Graphs](https://distill.pub/2021/understanding-gnns/); [Computing Receptive Fields](https://distill.pub/2019/computing-receptive-fields/); [Gaussian Processes](https://distill.pub/2019/visual-exploration-gaussian-processes/) (covariance matrix).
- **In Deception Lab:** concept-map relations; probe transfer matrix (train dataset × test dataset).

### P13 Trace and playback
- **Job:** show change over time — training steps, dialogue turns, iterations.
- **Use when:** the order and timing of change is the claim.
- **Data:** a sequence of states.
- **Form and interaction:** a static trace (line over time, or a few snapshots as P2) first; add a scrubber/playback only when the state is itself a picture (a scatter, a map). Level 0 or 3.
- **Don't use when:** only the start and end matter — use P4.
- **Distill:** [Why Momentum Really Works](https://distill.pub/2017/momentum/) (iterate traces); [Understanding RL Vision](https://distill.pub/2020/understanding-rl-vision/) (trajectory scrubber); [Grand Tour](https://distill.pub/2020/grand-tour/).
- **In Deception Lab:** belief drift across turns (Q7) — the neutral-belief read-out per turn after repeated assertions.
- **Notes:** avoid autoplay; start paused on the most informative frame.

### P14 Uncertainty band and repeated runs
- **Job:** show how sure we are, or how stable a result is.
- **Use when:** always for model-derived metrics; seeds, bootstrap, item sampling.
- **Data:** per-run or per-bootstrap values.
- **Form and interaction:** mean line with a `--band` fill and `--band-edge` boundary (95% CI, say which in the caption); or individual runs as thin `--context` lines with the mean in `--subject`; for embeddings, repeated runs as P2. Level 0.
- **Don't use when:** never skip it for a headline number; if you have one run, say "single run" in the caption.
- **Distill:** [A Visual Exploration of Gaussian Processes](https://distill.pub/2019/visual-exploration-gaussian-processes/); [How to Use t-SNE Effectively](https://distill.pub/2016/misread-tsne/) (restarts).
- **In Deception Lab:** layer-selection curves across seeds and models; OOD transfer with bootstrap CIs.

### P15 Variant family
- **Job:** lay out related variants or a taxonomy so their differences pop.
- **Use when:** several methods, datasets or behaviours share a structure and differ in one or two parts.
- **Data:** a common template and the deltas.
- **Form and interaction:** the same small diagram repeated, one per variant, with only the differing part coloured or emphasised; optionally a tree/axis grouping them. Level 0; expand/collapse for detail.
- **Don't use when:** the variants don't share a template — use a table.
- **Distill:** [Feature-wise Transformations](https://distill.pub/2018/feature-wise-transformations/); [The Paths Perspective on Value Learning](https://distill.pub/2019/paths-perspective-on-value-learning/); [Feature Visualization](https://distill.pub/2017/feature-visualization/) (regularisation spectrum).
- **In Deception Lab:** kinds of disagreement (instructed, goal-driven, framed); Map 2 label decision tree; dataset induction routes.

### P16 Hover-to-isolate legend
- **Job:** keep many overlapping series readable.
- **Use when:** > 4 lines or channels share an axis.
- **Data:** multiple series.
- **Form and interaction:** all series `--context` grey at rest with direct labels at line ends; hovering a label or line brings it to `--subject` and fades the rest. Level 2.
- **Don't use when:** ≤ 4 series — direct labels are enough. If one series is the point, highlight it statically.
- **Distill:** [Curve Detectors](https://distill.pub/2020/circuits/curve-detectors/); [Attribution Baselines](https://distill.pub/2020/attribution-baselines/); [Understanding RL Vision](https://distill.pub/2020/understanding-rl-vision/).
- **In Deception Lab:** accuracy-by-layer curves for Gemma, Qwen, Llama and Mistral in one chart.

### P17 Playground and predict-then-reveal
- **Job:** let the reader build intuition, find counterexamples, or test their own expectation.
- **Use when:** the point is exploration, and precomputed results cover the space densely enough.
- **Data:** precomputed results over the control space.
- **Form and interaction:** several controls plus linked outputs (playground, level 5); or ask the reader to sketch/pick a prediction, then reveal the data (level 4).
- **Don't use when:** for a single claim — it buries the claim. Rare in this app.
- **Distill:** [How to Use t-SNE Effectively](https://distill.pub/2016/misread-tsne/); [Growing Neural Cellular Automata](https://distill.pub/2020/growing-ca/); [Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) ("You Draw It").
- **In Deception Lab:** a "guess the label" drill on Map 2 cases; a lab-talk demo, not everyday views.

### P18 Text
- **Job:** argue, define, qualify, decide.
- **Use when:** definitions (what counts as a lie), arguments about framing, caveats, decision logs, project descriptions.
- **Form:** prose in the text column, margin notes in the gutter, citations as hover cards. A concept's definition can carry a tiny inline glyph (its colour chip) but no chart.
- **Distill:** [Research Debt](https://distill.pub/2017/research-debt/) — a text-first essay with no data figures.

## House rules for every figure

1. **Caption leads with the claim:** `<b>Probe accuracy peaks at layer 31.</b> Mean over 5 seeds; band is 95% CI.`
2. **Every colour has one meaning** (`BRAND.md` → Colour): honest, deceptive, mistaken, subject, interactive (amber, only on things that respond to the pointer), context. Belief is solid ink, frame is hatched. Other series: grey ramp or direct labels (`BRAND.md` → Non-semantic series).
3. **Never encode by colour alone;** add a label, shape, dash, or position.
4. **Label directly** (at line ends, on bars) instead of a separate legend where possible.
5. **Show n and uncertainty;** say "single run" if that's what it is.
6. **Show failures:** for any probe or direction claim, include where it is wrong (P8).
7. **Hypotheses are dashed** and tagged; established results are solid.
8. **Shared axes across panels;** zero-based for bar lengths; label units.
9. **One idea per figure.** If the caption needs "and", consider two figures.
10. **Provenance:** figures built from experiment data name the experiment note (`projects/<project>/experiments/<slug>.md`) in the caption or hover card.

## Implementation conventions

- **Reference code:** every pattern has a working demo in `app/patterns/pNN.js` (shared helpers in `app/patterns/core.js`), shown in the app's Patterns tab. Start a new figure by copying the matching file, then swap in real data.
- **Stack:** vanilla JS and inline SVG in the existing no-build app; tokens from `app/tokens.css`. Bring in a library (e.g. D3 for zoom/pan) only when a pattern needs it, loaded from a pinned CDN version, and say why in a comment.
- **Data:** precompute everything in the experiments repo; the app reads JSON/Markdown. No model calls from the browser.
- **Markup:**
  ```html
  <figure class="fig" data-pattern="P8" data-width="page">   <!-- text | page | screen -->
    <svg role="img" aria-labelledby="f3-title"><title id="f3-title">…</title>…</svg>
    <figcaption><b>Claim.</b> How to read it.</figcaption>
  </figure>
  ```
- **Accessibility:** every SVG has a `<title>`; hover detail must also be reachable by keyboard focus; respect `prefers-reduced-motion`.
- **Defaults:** every interactive figure renders a meaningful static state before any interaction and when JS fails.

## Anti-patterns

- A chart of two numbers.
- A legend with more than 5 entries, or a legend the reader must cross-reference while hovering.
- Semantic colours used for non-semantic categories (models coloured blue and magenta), or amber on something that isn't interactive.
- Top-k examples only, with no view of errors.
- A slider whose effect is visible only at one or two positions (use static P2 instead).
- Autoplaying animation.
- Prose that restates every value the figure already shows.

## Source note

Pattern evidence comes from reading the text and captions of 30 Distill articles; interactive behaviour was inferred from captions and instructions ("drag", "hover"), not from running the figures. *Multimodal Neurons* could not be read.
