---
title: "Mixing mechanisms: how language models retrieve bound entities in-context"
arxiv: 2510.06182
concepts: [belief, query]
order: 32
status: reading
fills:
  []
---
Gur-Arieh, Geva & Geiger. Method paper, not a deception paper. Read for the causal-model recipe behind Belief dependence of the lie: three retrieval mechanisms (positional, lexical, reflexive), one parametric causal model that mixes them (Eq. 2), fitted to the LM's output distribution under interchange interventions (full last-token residual at one layer, JSD loss, JSS 0.95 vs 0.44 for positional-only).

## What it claims

## What it actually shows (and at which level: detection / causal / specificity)

## What I disagree with or want to check

## What I found interesting

### Reflexive mechanism as a pointer

The reflexive mechanism hypothesizes that the residual stream encodes a reference feature that acts as a pointer to an entity—essentially, “retrieve the entity matching this reference”—rather than directly representing the answer itself. I find this particularly interesting because it raises the possibility that transformers may possess a general-purpose internal addressing mechanism. This opens up several research questions: How are these reference features created, propagated, and matched to their targets? Are they reused across different tasks, such as entity binding and belief tracking? And do these tasks rely on a shared addressing mechanism or develop task-specific ones?

## What I take from it for the swap experiment

- The counterfactual pair is constructed so every mechanism points to a *different* answer, and all combinations of the pointers are sampled — otherwise the weights are not identifiable.
- "Mixing" is the fitted model, not a hypothesis; single-mechanism accounts are corners of its parameter space.
- Terminology is original / counterfactual, not donor.
