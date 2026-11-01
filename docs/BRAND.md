# Deception Lab — brand guidelines

The look follows [Distill](https://distill.pub/): white page, one reading column, hairline rules instead of boxes, and colour only where it carries meaning. Tokens live in `app/tokens.css`; use the variables, never raw hex.

Decided 2026-10-28: logo A (offset circles) with a sans wordmark; sans everywhere; pure white page; 4px corners; colour palette from Distill's [Gaussian-processes article](https://distill.pub/2019/visual-exploration-gaussian-processes/), with every colour carrying exactly one meaning, 9-step sequential ramps and an 11-step honest ↔ deceptive ramp (this replaced a first draft based on the Wong palette).

## Principles

1. **Grey chrome, meaningful hue.** Navigation, panels, buttons and borders are ink and grey. Hue is reserved for meaning (honest, deceptive, mistaken, subject, interactive, context), so a colour always means the same thing.
2. **Figures argue, text guides.** Prose says what to notice; the figure lets the reader check it. See `docs/viz-patterns.md` for choosing a figure.
3. **Show uncertainty in the form.** Hypotheses and contested definitions are drawn dashed and tagged `CONTESTED` or `HYPOTHESIS`; they never look as settled as established findings.
4. **Every claim is traceable.** Citations are grey superscripts with a hover card; papers carry their status as a badge.
5. **Precise words.** "Belief" for the model's own (neutral) view; "factual correctness" only for dataset labels; "truth" only when quoting someone else's construct.

## Logo

**Mark: two offset circles.** A filled circle (what the model believes) and an outlined circle (what it says). The overlap is agreement; the offset is the subject.

```svg
<!-- mark, square, for favicon and app header -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="12" cy="16" r="9" fill="currentColor"/>
  <circle cx="20" cy="16" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>
```

- **Lockup:** mark + "Deception Lab" in Source Sans 3, weight 600. Gap between mark and wordmark = 0.4 × mark height. Mark height ≈ cap height × 1.6.
- **Colour:** ink (`--ink`) on white, or `--bg` on ink. Never in a semantic colour, never with a gradient or shadow.
- **Minimum size:** 16px (favicon). Below 24px use the mark alone.
- **Don't:** rotate, change the offset, fill both circles, or swap which circle is filled.

## Colour

The palette follows Distill's [*A Visual Exploration of Gaussian Processes*](https://distill.pub/2019/visual-exploration-gaussian-processes/) (colours taken from its source): a magenta/violet family from ColorBrewer RdPu, a blue family from GnBu, amber for anything interactive, and grey for context. **Every colour has exactly one meaning.**

### Neutrals

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#15171A` | page |
| `--surface` | `#FFFFFF` | `#1D2024` | panels, cards (same as page in light mode; separated by hairlines) |
| `--surface-sunk` | `#F7F7F6` | `#191B1E` | code blocks, table headers, appendix |
| `--ink` | `#1F2328` | `#E9E7E1` | body text, logo, **belief** in figures |
| `--ink-2` | `#5F6670` | `#A2A7AD` | captions, metadata (≥ 4.5:1) |
| `--ink-3` | `#8B9097` | `#7D838A` | placeholders, disabled, axis ticks only (fails AA as body text) |
| `--hairline` | `rgba(0,0,0,.10)` | `rgba(255,255,255,.10)` | rules, card borders |
| `--rule` | `rgba(0,0,0,.20)` | `rgba(255,255,255,.20)` | table rules, emphasised dividers |

### Meaning colours

Each has a **base** (marks, lines, fills in figures), an **ink** (text and thin strokes; ≥ 4.5:1 on white and on its wash), and a **wash** (background behind text).

| Meaning | Token | Base | Ink | Wash | Dark base | Source in the GP article |
|---|---|---|---|---|---|---|
| Honest | `--honest` | `#4EB3D3` | `#0868AC` | `#EAF6FA` | `#1D91C0` | GnBu |
| Deceptive / dishonest | `--deceptive` | `#C51B8A` | `#AE017E` | `#F8E4F1` | `#DD3497` | mean-function magenta |
| Mistaken (honest but incorrect, hallucination) | `--mistaken` | `#9A8B7A` | `#6E6153` | `#F3F1EF` | `#8F8170` | warm grey |
| Subject (the figure's focal series when no label applies) | `--subject` | `#49006A` | `#49006A` | `#E9E0ED` | `#D9B3EA` | "Violet", RdPu darkest |
| Interactive (handles, draggable points, "(drag to …)" hints) | `--interact` | `#F5B53E` | `#9A6400` | `#FEF6E8` | `#F5B53E` | amber affordance |
| Context (other samples, reference runs, de-emphasised series) | `--context` | `#918F8F` | `--ink-2` | — | `#8F8D8D` | sample grey |
| Uncertainty band | `--band` / `--band-edge` | `#FFE0FF` fill, `#FA9FB5` edge | — | — | `#3A2533` / `#C2678D` | posterior band |

Encoded by form, not hue:

| Meaning | How |
|---|---|
| Belief / model internals | solid `--ink` fill (the logo's filled circle) |
| Frame / context-scoped content (fiction, role-play, persona) | hatched fill `--frame-hatch` in `--ink`, or an outlined shape |
| Contested / hypothesis | dashed outline (`stroke-dasharray: var(--dash)`) in the element's own colour, plus a mono `CONTESTED` / `HYPOTHESIS` tag |

Rules:

- **One meaning per colour.** Magenta is only ever deceptive; violet only ever the subject; amber only ever "you can interact with this". If a figure needs a focal series that isn't a labelled concept, it uses `--subject`, not a concept colour.
- **Amber is never decoration.** It appears only on things that respond to the pointer. Amber hint text uses `--interact-ink` (base amber is 1.8:1 on white).
- **Never encode by colour alone.** Every coloured mark also has a label, shape, dash or position. Separation under simulated colour blindness is at least ΔE 24 between any two meaning colours in light mode, but only ~15 in dark mode, so labels are mandatory there.
- **Interface chrome stays grey.** Meaning colours belong to figures, concept chips and evidence; buttons, tabs and panels use ink and grey.

### Ramps

| Ramp | Tokens | Stops | Use |
|---|---|---|---|
| RdPu (sequential, 9 steps) | `--rdpu-1…9` | `#FFF7F3 #FDE0DD #FCC5C0 #FA9FB5 #F768A1 #DD3497 #AE017E #7A0177 #49006A` | magnitudes, densities, counts |
| GnBu (sequential, 9 steps) | `--gnbu-1…9` | `#F7FCF0 #E0F3DB #CCEBC5 #A8DDB5 #7BCCC4 #4EB3D3 #2B8CBE #0868AC #084081` | matrices, similarity, covariance |
| Honest ↔ deceptive (diverging, 11 steps) | `--div-1…11` | `#0868AC #2B8CBE #4EB3D3 #7BCCC4 #CCEBC5 #F7F7F7 #FDE0DD #FA9FB5 #F768A1 #DD3497 #AE017E` | probe scores and anything signed along the honest–deceptive axis; `--div-6` is neutral (0); the two sides are matched step for step in lightness (L* 43, 55, 68, 77, 90 vs 39, 52, 64, 75, 91) |
| Grey (sequential) | `--seq-1…5` | `#D9DCE0 … #1F2328` | ordered non-semantic series (layers, steps, epochs) |

Text on a ramp cell uses `--on-ramp-dark` (white, on the two darkest steps at either end) or `--on-ramp-light` (ink) elsewhere; these do not flip with the theme because the ramps don't. Use as many steps as the data has distinguishable levels (binned maps: 5–9; continuous: interpolate between all stops). Skip `-1` on white backgrounds when the lightest step would vanish.

### Non-semantic series

Models, seeds and layers do not borrow meaning colours:
- ordered series (layers, steps, epochs) → the grey ramp `--seq-1…5`, focal series in `--subject`;
- unordered series (models) → `--context` grey with direct labels, one highlighted at a time in `--subject` via a hover-to-isolate legend;
- repeated runs → thin `--context` lines, mean in `--subject` or `--ink`.

### Links and interaction

- Links are ink with a 1px underline at 40% opacity, 80% on hover (Distill). Not blue.
- Focus ring: 2px `--ink` outline, 2px offset.
- Selected state: `--surface-sunk` background + `--ink` 1px border. Hover: `--surface-sunk`.
- Inside figures, draggable or clickable marks use `--interact`, and an italic `--interact-ink` hint ("(click to resample)") tells the reader what they can do, as in the GP article.

## Typography

One family everywhere (Distill uses a single sans), plus a mono for identifiers.

- **Sans:** Source Sans 3 (400, 600, 700), fallback `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Mono:** JetBrains Mono (500), for ids, variables, layer names, kicker labels, tags.

| Role | Size / line-height | Weight | Notes |
|---|---|---|---|
| Title | 44px / 1.1 (32px mobile) | 700 | one per page |
| H2 | 28px / 1.25 (22px mobile) | 600 | 1px `--hairline` rule underneath |
| H3 | 20px / 1.4 | 700 | |
| H4 | 15px / 1.4 | 600 | |
| Body | 17px / 1.7 | 400 | `--ink`; measure ≤ 70ch |
| UI | 14px / 1.45 | 400/600 | buttons, panels, lists |
| Caption | 13px / 1.5 | 400 | `--ink-2`; opens with a bold claim in `--ink` |
| Label / kicker | 11px / 1.4 mono | 500 | uppercase, letter-spacing .08em, `--ink-2` |
| Code | 13px mono | 500 | `--surface-sunk` background |

Sentence case for headings, buttons and labels. Mono uppercase only for kicker labels and status tags.

## Layout

Distill's grid, at ≥ 1180px: text column 704px, right gutter 152px for margin notes, page width 1072px, 32px column gap. Narrower screens collapse the gutter below the text.

- **Reading views** (notes, project pages): text in the text column; asides, citations and concept tags in the gutter; figures may break out to page width or full screen.
- **Workspace views** (maps, gaps, reading queue): full width, but keep any prose inside the text column.
- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64px (`--s-1` … `--s-8`).

## Shape and surface

- **Corners:** 4px (`--radius`) on cards, buttons, inputs, tags; pills (`999px`) only for status tags.
- **Borders:** 1px `--hairline`. No double borders; prefer a single rule over a box.
- **Shadows:** none, except floating popovers and hover cards (`--shadow-pop`).
- **Motion:** 150ms ease-out for hover and state; 300ms for layout transitions. Respect `prefers-reduced-motion`.

## Components (short spec)

- **Figure:** figure at the chosen width → caption below, 13px, `<b>Claim.</b>` then grey explanation. Number figures within a page.
- **Citation:** superscript `[n]` in `--ink-2`; hover card with title, authors, year, arXiv link, and reading status.
- **Status badge** (paper): mono 11px pill, `--hairline` border: `QUEUED`, `READING`, `READ`, `LATER`.
- **Evidence tag:** `ESTABLISHED` (solid border), `HYPOTHESIS` / `CONTESTED` (dashed border).
- **Concept chip:** concept name in the concept's ink on its wash, 4px radius; never more than one meaning colour per chip. Belief chips are ink on `--surface-sunk`; frame chips use a hatched left edge.
- **Panel:** white, left 1px `--hairline` rule, no shadow; kicker label at top.

## Voice

Plain, first-person plural, active. State the claim, then the evidence. No hype words ("groundbreaking", "unlock"). Labels are verbs or nouns, not sentences. Use the project vocabulary above.
