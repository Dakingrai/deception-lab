---
title: Still no lie detector for language models
arxiv: 2307.00175
concepts: [belief]
order: 1
status: read
fills:
  []
---
Read first: the clearest statement of the problem. Probes trained on truth may be reading something else.

## What it claims

1. **Beliefs are possible, not shown.** LMs are optimized only to predict the next token, but tracking truth may be a useful means to that end, so an internal belief state could emerge (ends ≠ means; decision-theory and selection-pressure arguments). This rebuts the skeptics who say LMs *can't* have beliefs (Bender et al., Shanahan). The paper doesn't claim LMs have beliefs; it argues we can't rule them out and that the question is empirical.
2. **Current probes fail, empirically and conceptually.** Two probing approaches are tested on LLaMA-30B. Supervised probes (Azaria & Mitchell) do well in distribution but fall *below chance* on negated statements. CCS (Burns et al.) reaches low loss by detecting negation and is at chance accuracy. Conceptually:
   - (a) labeled data must be unambiguous, so probes can learn properties that merely correlate with truth ("true and commonly believed");
   - (b) probe outputs are the probe's probabilities, not the model's credences, without evidence the model *uses* the representation (Harding: information, use, misrepresentation);
   - (c) **Coherence can't isolate truth.** CCS trains the probe only to be *coherent*, meaning its outputs obey probability rules like probe(x) + probe(¬x) ≈ 1, and confident. But those rules constrain how the numbers relate, not what they're about: any property that flips under negation satisfies them equally well. A negation detector (1 for x, 0 for ¬x) is perfectly coherent, which is what their CCS probes learned. Something beyond coherence, such as labels or evidence of use, is needed to pin down truth.
3. **Two data-side directions.** (a) Prompt the model to evaluate truth ("think hard about…"), changing the activations so a truth representation is easier to find. (b) Use chance setups (urns) to get unlimited, exactly graded labels, which test credence and calibration rather than only belief. Both stay at the detection level: neither solves the conceptual problems nor tests use.

## What it actually shows (and at which level: detection / causal / specificity)

## What I disagree with or want to check

