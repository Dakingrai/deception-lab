---
title: Design notes — item types, hypotheses, controls
date: 2026-10-27
status: living
---
Discussion notes from scoping the baseline experiment (2026-10-baseline-cities), after comparing the odd-one-out design against a second reviewer's reading of it. Kept because they settle three design choices.

## Three item types, not two

The predicate-inversion item is a different item from the "affirmative" type, and both are wanted.

The affirmative type has one Italian city plus three foils, so the answer is unique. The inverted type keeps the negated item's four cities and flips the question: "Which of these is in Italy? Milan, Naples, Rome, Lyon" has three true answers and one false. That is the actual CCS-style contrast pair (same facts, inverted rule), and it has a property the two-type design was missing: under the lie instruction the competent answer is unique (Lyon, D), so lie competence is P(D) against a 25% chance floor, instead of "any of three" against a 75% floor. That fixes the sensitivity problem on the ablation side (with four options a random "lie" is false 75% of the time, so belief ablation barely moves lie competence in the other two types). The honest run on an inverted item also shows, for free, how the model picks among three equally true options, which is the position-bias measurement in its purest form. It costs nothing to add: every negated item already contains it.

So: affirmative (unique truth, foils from elsewhere), negated (unique truth, the odd one out), inverted (negated's options with the affirmative question; three truths, one unique lie). Affirmative and negated carry partners for the swap; inverted is paired to its negated item and is not swapped.

## Hypotheses: H1/H0 and the finer H1/H2/H3

The reviewer's three-way framing is a finer cut of the project's H1/H0:

- H1. Factual representation → correct-answer computation → exclude the correct answer when lying.
- H2. Factual representation → separate truthful and false-answer computations, both reading the facts.
- H3. Context-dependent answer generation: a false answer produced from contextual cues without first computing and excluding a unique correct answer.

H3 is the project's H0. H2 is the "which belief does the lie read, the answer slot or the per-option facts" point already on the project page; per-option vs pre-answer patching is what separates H1 from H2. Fine to adopt the three-way framing later; nothing in the baseline changes because of it. The reviewer's "evidence comes from probability redistribution across many items, not a single switch" is already how the two readouts are defined (forbidden slot moves; truth reappears).

## Answer-position control (for the swap experiment, not the baseline)

When the belief from Proposition 2 (truth at A) is patched into Proposition 1, the lie might avoid A because an "answer is at A" variable moved, not because any geography moved. Control: patch from a non-geographic four-option item whose truth is also at A (arithmetic, say). If the lie still avoids A, the circuit reads a bare position variable. Goes into the swap experiment's design.

## Why the prompts come from Liars' Bench (2026-10-31)

Inputs are adapted from the questions behind Liars' Bench's probe-training facts rather than built from a new pool. Reason: instruction-induced lying is the established way of inducing a lie — the language model treats it as such, and multiple papers use it — so results on these prompts are comparable to the probe literature. Items are filtered to single-token answer entities. The same fact is reshaped into the three formats (free-form, yes/no, listed), with foils drawn from the answers of other facts of the same type.
