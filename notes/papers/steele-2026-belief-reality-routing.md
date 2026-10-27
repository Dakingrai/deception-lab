---
title: Belief–reality separation lives in routing over a shared value slot in language models
arxiv: 2607.11945
concepts: [scoped, space]
figures: [figures/steele-fig-a-asserted-derived.svg, figures/steele-fig-b-belief-reality.svg]
order: 24
status: reading
fills:
  []
---
Steele, Wen & Han. Companion paper on belief in depth. Frame-agnostic value slot at the answer token, separate near-orthogonal belief and reality routers at the query token (DAS, Qwen2.5 3B–32B, Mistral-7B, OLMo-2-7B). "Reality" is the story's stated reality, not the model's own knowledge. A linear probe at the value token still recovers the frame (balanced acc. 1.000).

## What it claims

Two separate experiments on the same template family (Anna/Ben/cup, colour bank). They are not one traced circuit.

- **Asserted vs. derived belief (§3.2, §4.2–4.3)** — *how a character's belief gets in.* Only the character's belief is queried; what varies is the route. Asserted: "Anna believes the cup is blue." Derived: "Anna paints it blue, Ben paints it red, Carol sees only Anna" → Carol thinks blue. Claim: both routes land in a largely shared value subspace; only the derived route depends on visibility (a lookback, after Prakash et al. 2026). n = 72 held out.
- **Belief vs. reality (§3.2, §4.4)** — *how one of two competing values is read out.* One context states both: "Anna believes the cup is blue. In reality the cup is red." The query picks the frame. Claim: belief and reality use a shared, frame-agnostic value representation; distinct query-position routing subspaces determine which frame is read out (Fig. B). n = 96 slot, 90 router.
- The authors' own Figure 1 combines both into one picture (routes write into a slot, routers choose what is read). That is a synthesis across experiments, not a tested single mechanism.
- Claims are operational (causal structure over readouts); they take "no position" on whether these are beliefs.

## What it actually shows (and at which level: detection / causal / specificity)

- Causal (level 2), via DAS interchange interventions, for both experiments.
- Value subspace: a belief-trained subspace moves the reality readout almost as well (0.87–0.95 of own range; random ≈ 0.03) → no frame-selecting information in it. Frame is still linearly decodable elsewhere in the value-token activation (probe, balanced acc. 1.000, layers 1–28, Qwen2.5-7B-Instruct).
- Routing subspaces: splicing flips the frame (1.00) without injecting the anchor's colour (0.00); cross-leg leakage ≤ 0.16 against a pre-set 0.30 bar; projecting out the matched router collapses the readout (Qwen2.5-7B 0.60 → 0.00; OLMo-2-7B 0.956 → 0.000), wrong-position or random rank-8 does not. Belief and reality routers are near-orthogonal (top cosine 0.19–0.28).
- Asserted ↔ derived transfer is not uniform. Table 4: Qwen2.5-14B base 0.74 / 0.79; Qwen2.5-7B-Instruct 0.47 / 0.89 (overlap without interchangeability). Other models only as bars in Figure 3; text gives 0.74–0.97 for base models and "near-symmetric" for OLMo-Instruct.
- Visibility: swapping which painter is seen flips the derived belief 99% (Qwen-7B); appended visibility clauses leave asserted belief unchanged (100%). Input-level only; the lookback is not localised.

How it maps onto my project:
- Belief vs. reality is the closer experiment: same conflict, except in my case "reality" is the model's own knowledge, not a sentence in the prompt ("Jane believes the capital of France is Tokyo").
- Asserted vs. derived has a counterpart too: a scoped belief can be supplied by the context ("the persona believes X") or derived from parametric knowledge ("you are a flat-earther"), as in the scoped concept note.
- Candidate explanation for probe false positives on fiction: if deception probes read value-like features at content tokens, they would be frame-blind, because the frame is chosen by routing at another position. A hypothesis, not shown here.

## What I disagree with or want to check

- "Reality" is stated in the story, not the model's knowledge; beliefs are attributed to story characters; comprehension, not generation. Nothing here about the model's own beliefs.
- Is the asserted/derived subspace the same subspace as the belief/reality value subspace? I haven't seen a test linking them; check before relying on the Figure 1 synthesis.
- Slot site: §4.4 probes value-token states, §3.4 describes the swap "at the answer token". Which is it?
- §4.2 says the Qwen-Instruct derived subspace steers asserted belief "fully", Table 4 says 0.89.
- Per-model values in Figure 3 (Qwen-7B base, Mistral, OLMo base/instruct) — read off the PDF before quoting.
- Authors' stated caveats: §4.4 readout gates are item-sample sensitive at 7B (cross-frame transfer 0.81–0.92 across samples); the anchor-splice preservation control fails on Qwen and is below detection on Mistral (0.667 vs. 0.633 random); router-to-slot connection not traced; recursive result single-model.
- Small template universe; the authors call these controlled mechanistic tests, not benchmarks.
