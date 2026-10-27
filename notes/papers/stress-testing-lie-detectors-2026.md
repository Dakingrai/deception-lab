---
title: Stress-testing LLM lie detectors: role-play failures and spurious correlations
arxiv: 2609.39807
concepts: [persona, roleplay]
order: 10
status: queued
fills:
  - {behaviour: roleplay, question: specificity, level: specificity, kind: direct}
  - {behaviour: roleplay, question: probe, level: detection, kind: direct}
  - {behaviour: roleplay, question: geometry, level: detection, kind: indirect}
  - {behaviour: instructed-lie, question: transfer, level: detection, kind: direct}
---
Three confounder tests; every prior probe fails at least one. Lying defined relative to the default assistant persona. Not the same question as my gap — it asks whether monitors survive role-play, not whether the model represents the generate/endorse distinction. Read 2026-10-26 (von Klinski, Lapuschkin, Samek, Bürger; code: github.com/max-vkl/stress-testing-llm-lie-detectors).

## What it claims

- Eight published lie/truth probes are unreliable under role-play. Dataset: 8,916 human-reviewed yes/no responses from Llama 3.3 70B, Gemma 3 27B, Gemma 4 31B under 15 anti-factual personas (reality-based: flat-earther, conspiracy theorist…; fictional: Harry Potter wizard, Federation citizen, Oceania Party member…; historical: Ptolemaic astronomer, phlogiston chemist…).
- Shared-persona prefill (SPP): honest and false answer both sit under the same anti-factual system prompt, so the prompt can't leak the label. Several probes collapse there (Goldowsky-Dill RepE 0.44, Cooney DYL 0.33 AUROC on Llama); Marks/Bürger Lie (0.89) and Cundy DolusChat (0.90) hold.
- Three confounder datasets anti-correlate truth with (i) likelihood (in-context examples make the false answer more probable), (ii) persona belief (persona *privately* holds a false belief, is not told to voice it), (iii) compliance (true answer breaks a formatting rule, false answer obeys it). On compliance every prior probe is below chance. Diagnosis: probes track instruction compliance / response likelihood, which co-vary with truth in their training data.
- Their fix: a linear probe trained on elementary facts in affirmative / negated / "forced-opposite" format (model is told to give the wrong answer, decorrelating compliance from truth). 0.98 on-policy, 0.976 SPP, 1.0 on all three confounders; never below 0.90 on the Gemmas.

## What it actually shows (and at which level: detection / causal / specificity)

- Level 1 (detection) only, with a specificity flavour: the confounder tests are a *behavioural* separability test — does the probe score move with truth or with compliance/likelihood/persona-belief? No causal interventions, no subspace or direction analysis; they say outright that failures reflect what the training data encodes rather than a clean "truth direction" and leave the representational question open. So for roleplay × geometry this is indirect evidence at best.
- The persona-belief confounder is essentially my step-1 attribution case (own knowledge vs. a simulated speaker's belief), already built and reviewed, on Gemma 3 27B. Reusable.
- Fictional personas are the hardest even for their probe (Harry Potter wizard 0.89, Federation citizen 0.89 under SPP; lowest persona is fictional on all three models). The frame/fiction case is still open — that is the empirical opening for my gap.
- Limitations they state: personas induced only by system prompt, single-turn, ≤70B; they expect more confounders. Cooney DYL is near-perfect on Gemma 4 confounders but 0.17 under SPP, so there are confounds they haven't named.

## What I disagree with or want to check

- Normative stance is the inverse of mine: a persona-consistent falsehood counts as a lie that the probe *should* flag; attribution is treated as a confound to remove, not a representation to find. For a monitor that is defensible; for the science question (does the model encode "generated but not endorsed"?) it defines the phenomenon away. My framing: the field's answer to role-play failures is better data; I ask whether the model itself carries the distinction that data fixes paper over.
- "Default assistant's beliefs" is doing a lot of work — it is operationalised as the greedy answer under "You are a helpful assistant", i.e. an output, not a belief readout. Same assertion-vs-belief slip I flag elsewhere.
- Their probe's 1.0 on the confounders is suspiciously clean given training is on element-symbol facts only; check whether the confounder datasets share the forced-opposite surface form. Appendix C.2.
- Check: do they report any per-layer behaviour? They pick the earliest layer with max validation AUROC (two probes hand-set to layers 22/36 for role-play). Relevant to my layer-selection thread.
- Todo: port the persona-belief and SPP splits to my Gemma-3-27B setup as an OOD test alongside Liars' Bench.
