---
title: Role-play / fiction × representation geometry
kind: project
program: beliefs-roles-intent
regions: [roles-frames, knowledge-belief]
gap: {behaviour: roleplay, question: geometry}
status: scoping
---
## Research question

**Do language models linearly encode whether a generated proposition is asserted in the assistant's own voice or produced on behalf of a simulated speaker (fiction, role-play, quotation, instructed error), separably from whether the model itself holds the proposition to be true (its own, unscoped belief)?**

Two halves, taken in order. *Attribution* (stage 1): whose claim is this — the default assistant's or a simulated speaker's? *Commitment* (stage 2): is the content put forward as the model's own, or merely produced under a frame? Attribution goes first because it has a behavioural anchor (the persona's answer and the default assistant's answer are both observable); commitment does not.

## Why it matters

Chalmers (2025) argues that interpretability should target propositional attitudes, not just the propositions a model represents. Probing work has made real progress on the propositions — truth directions (Marks & Tegmark, 2024), belief representations for self and others (Zhu et al., 2024), belief tracking in narratives (Prakash et al., 2026) — but comparatively little is known about the attitude: whether the model distinguishes what it endorses from what it simulates, quotes, or generates under instruction. The distinction bears on how a post-trained assistant persona relates to the many personas a pretrained model can simulate (Shanahan et al., 2023), and on what "belief" can mean for a model at all (Herrmann & Levinstein, 2024).

For monitoring, the same distinction is the main source of false positives. Deception monitors are evaluated at ~1% FPR on benign chat because deception is rare and false alarms otherwise swamp detections (Goldowsky-Dill et al., 2025). Fiction and role-play are where current probes fail in both directions: they flag framed falsehoods as lies (Parrack et al., 2025; Natarajan et al., 2026), and when a model adopts an anti-factual persona many lie detectors stop flagging its falsehoods, tracking instruction compliance or response likelihood instead of truth (von Klinski et al., 2026).

## What is known, and the gap

- Factual-correctness labels are linearly decodable but context-sensitive, and a probe trained on them may be reading something other than the model's belief (Levinstein & Herrmann, 2024; Marks & Tegmark, 2024).
- Probe behaviour on role-play is explained largely by prompt wording; sixteen deception-taxonomy probes cluster into roughly four directions (Natarajan et al., 2026).
- The field's response to role-play failures is better data — decorrelating truth from compliance and likelihood (von Klinski et al., 2026) — or narrower probes (Natarajan et al., 2026). Neither asks whether the model itself encodes the frame.
- Factual correctness is used throughout as a proxy for belief, valid only on items where the model's neutral-context answer matches the label; the gap between the two is a measured quantity, not an assumption.
- The nearest mechanistic result is on comprehension, not generation: a shared router over a value slot selects which mental space is read out (Steele, Wen & Han, 2026a, 2026b).

Gap: nobody reads attribution or commitment directly. The evidence is probe false positives, which cannot separate (a) the model represents the distinction and probes never learned it from (b) the distinction is not separably represented.

## Plan (staged)

1. **Attribution readout.** Reuse existing data (von Klinski et al.'s shared-persona-prefill and persona-belief splits on Gemma 3 27B; Liars' Bench, Kretschmar et al., 2025). Label by speaker; restrict to items the model answers correctly in a neutral context so that factual labels stand in for belief, and balance that label within each speaker class. Train an attribution probe; test separability from the factual-label ("truth") direction and from compliance; test whether it predicts where existing deception probes false-positive on fiction.
2. **Commitment / routing.** Only after stage 1 is settled: same-proposition designs crossing frame type × belief-match × committed/uncommitted, with surface controls (endorsed vs rejected quotation). See `experiments/` as they are written.

## Risks named up front

- *Lexical frame direction.* A "fiction" direction almost certainly exists because fiction prompts differ lexically. The result is only interesting if it survives the surface controls; those are decided before any probe is trained.
- *Commitment is unobservable.* Stage 2 needs behavioural anchors ("do you actually think so?", cross-frame consistency) or it collapses into stage 1.
- *The gate may not be safe.* A monitor that stands down when the model is "in a frame" would miss the hidden persona (von Klinski et al., 2026; Map 2, test 4). Whether the frame is shared with the listener is a fact about the deployment, not the model, unless the model represents the user's knowledge. The monitoring payoff is conditional on that, and this project does not assume it.

## References

- Chalmers, D. (2025). Propositional interpretability in artificial intelligence. arXiv:2501.15740.
- Goldowsky-Dill, N., et al. (2025). Detecting strategic deception using linear probes. arXiv:2502.03407.
- Herrmann, D. A., & Levinstein, B. A. (2024). Standards for belief representations in LLMs. *Minds and Machines*. arXiv:2405.21030.
- Kretschmar, K., et al. (2025). Liars' Bench. arXiv:2511.16035.
- Levinstein, B. A., & Herrmann, D. A. (2024). Still no lie detector for language models. arXiv:2307.00175.
- Marks, S., & Tegmark, M. (2024). The geometry of truth. *COLM*. arXiv:2310.06824.
- Natarajan, et al. (2026). One probe won't catch them all: towards targeted deception detection. arXiv:2602.01425.
- Parrack, et al. (2025). Benchmarking deception probes via black-to-white performance boosts. arXiv:2507.12691.
- Prakash, N., et al. (2026). Language models use lookbacks to track beliefs. *ICLR*. arXiv:2505.14685.
- Shanahan, M., McDonell, K., & Reynolds, L. (2023). Role play with large language models. *Nature* 623, 493–498.
- Steele, Wen & Han (2026a). One mechanism for many mental spaces: a shared router over a value slot in language models. arXiv:2607.10248.
- Steele, Wen & Han (2026b). Belief–reality separation lives in routing over a shared value slot in language models. arXiv:2607.11945.
- von Klinski, M., Lapuschkin, S., Samek, W., & Bürger, L. (2026). Stress-testing LLM lie detectors: role-play failures and spurious correlations. arXiv:2609.39807.
- Zhu, W., et al. (2024). Language models represent beliefs of self and others. arXiv:2402.18496.
