---
title: Do lie and truthfulness probes transfer across languages?
date: 2026-10
papers: [miranda-2026-cross-lingual-deception-probes, singh-2026-hinglish-truthfulness-probes, alvi-2026-multihaludet, calvo-figueras-2025-truth-knows-no-language, cross-lingual-factual-steering-2026]
---
Synthesis across the five multilingual papers in the reading queue (orders 25–29). Drawn from abstracts and landing pages, not full PDFs; check the numbers when reading.

## Three main findings

1. **The signal mostly carries across languages, at least between well-resourced ones.** Deception probes trained in one language worked nearly as well in English, Portuguese, Spanish, German and Chinese as probes trained in each language ([[miranda-2026-cross-lingual-deception-probes]]). Hallucination probes held up on mixed Hindi-English text, 0.88–0.99 AUROC ([[singh-2026-hinglish-truthfulness-probes]]).

2. **It weakens as languages get less common in training data.** Probe AUROC drops from about 98 in English to 96 in French, 89 in Bangla and 77 in Amharic ([[alvi-2026-multihaludet]]). The models themselves also hallucinate more in Hindi and Hinglish ([[singh-2026-hinglish-truthfulness-probes]]) and are least truthful in Basque ([[calvo-figueras-2025-truth-knows-no-language]]). A probe trained on a closely related language beats an English one: Hindi probes transfer to Hinglish better than English probes do.

3. **A shared direction doesn't prove a shared concept.** Probe directions from different languages line up around one common direction, but response representations still cluster by language, and surface features (style, sentiment, factual correctness, length) explain part of how well the best probes do ([[miranda-2026-cross-lingual-deception-probes]]). Transfer could partly come from cues that don't depend on language rather than from deception itself.

## Gaps relative to this project

- None of these tests deception the model wasn't instructed to produce (Liars' Bench-style); Miranda et al. use instructed honest/deceptive contrasts.
- None uses Gemma-3-27B.
- Finding 3 is the same confound question as generalising outside the training distribution, now along the language axis.
