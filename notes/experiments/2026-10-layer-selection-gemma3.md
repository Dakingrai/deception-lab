---
title: Layer selection for OOD transfer (Gemma-3-27B-it, Liars' Bench)
date: 2026-10
model: Gemma-3-27B-it
status: running
concepts: [goal, belief]
fills:
  - {behaviour: instructed-lie, question: transfer, level: detection, kind: own}
---
Question: what distinguishes layers with strong OOD transfer from layers with weak transfer, and can training-only measurements identify them?

## Setup
(model, probe, train/eval sets, layers swept)

## Results
(ID AUROC, OOD AUROC, threshold transfer at fixed FPR)

## What this says about the matrix cell
(in words: which hypothesis it supports, which it rules out)
