---
title: Belief
kind: variable · own view, now
---
What the model itself treats as true at this point in the conversation: a truth-tracking state it actually uses, that hangs together under negation and paraphrase, and that can be wrong. It has two inputs. Training sets the prior (the no-context answer); context the model accepts as evidence (a stated fact, a correction, a persuasive pushback) updates it. With no such evidence, belief is the prior. A lie is an asserted output that contradicts this belief, not the prior; a gap between prior and current belief is a belief update, not a lie. Propositions the model only entertains (a story, a character, a supposition) do not update it; those are Scoped belief.

**In an LLM.** A model with a 2021 cutoff marks "The UK prime minister is Boris Johnson" as true: a false prior, not a truth readout. Told "the capital moved to X in 2025", it answers X: its belief is now X while the prior is unchanged. If it is then told to give a false answer and says the old capital, the output matches the prior but is a lie.

**How to test.** Herrmann & Levinstein's standards: accuracy, use, coherence, uniformity. They are criteria for calling a decoded state belief-like, not stages the model computes through. Behaviourally, the prior is the no-context answer; belief now is the answer with the context's evidence kept and any instruction, persona or pressure removed. Benchmarks that check belief with a no-context question assume the two are equal. On cases where the model is wrong, does the direction follow the model or the world?

## My notes
