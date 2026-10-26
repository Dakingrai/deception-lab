---
title: Context
kind: input · this turn
---
Everything in the prompt the model conditions on: instructions, stated incentives, evidence, and frame cues such as "write a story" or "you are a pirate". Context builds scoped beliefs for the model to generate from, supplies aims the model may adopt, and tells the model who it is talking to.

**In an LLM.** System prompt: "You are a salesperson. Never admit the car has defects." It builds a persona space and supplies an aim.

**How to test.** Vary the context with everything else fixed. Separate what the context supplies (a space, a value, an instruction) from what the model does with it. Probes trained on instructed lies can learn to read the instruction rather than any internal state (Natarajan et al. 2026; von Klinski et al. 2026).

## My notes

