---
title: How Do Language Models Represent and Reconcile Knowledge, Beliefs, Roles, and Deceptive Intent?
kind: program
status: scoping
---
I envision four interconnected regions:

:::regions
- Knowledge & belief | What does the model represent as true? Does it distinguish its own apparent belief from another agent's belief?
- Roles & frames | Does it represent the active role, viewpoint, speaker, and context in which a claim is made?
- Conflict & awareness | Does it recognize disagreement between its apparent knowledge, the character's beliefs, and its generated answer?
- Goals & intent | Does it distinguish role-consistent output, obedience, persuasion, concealment, and intentional deception?
> Representation geometry and causal mechanisms | Directions, subspaces, binding, routing, computation across layers, and causal interventions
:::

The map should connect each question to experiments and published findings, while keeping claims about internal *awareness* operational rather than treating decodability as evidence of conscious awareness.

One especially promising research direction is **frame-dependent truth representations**. Perhaps a proposition isn't simply encoded as true or false; instead, the model maintains information about *who regards it as true*, *under which frame*, and *which frame should control the response*.

## Questions

1. **Belief representation:** Does the model distinguish its neutral belief from beliefs attributed to other agents or characters?
2. **Disagreement:** When the model expresses an answer that differs from its neutral belief, does it represent that disagreement?
3. **Contextual interpretation:** Does the model distinguish why it is expressing a particular answer—for example, following an instruction, speaking as a character, or trying to mislead someone?
4. **Spontaneous versus context-induced deviations:** When a model produces an answer that differs from its neutral belief, do spontaneous and context-induced deviations involve shared mechanisms for selecting among competing answers, or do they recruit distinct mechanisms?
5. **Belief dependence of the lie:** Is the expressed false answer computed from the neutral belief? Competent lying requires knowing the truth, so ablating or scrambling the belief representation should degrade the model's ability to pick an answer that is actually false, rather than a random one. If it does not, the assertion is produced by a route that bypasses the model's own knowledge.
6. **Listener's resulting belief:** Does the model represent what the listener will come to believe after its assertion? Deception is defined by the listener's resulting belief, not by the falsity of the assertion, so the test case is the misleading truth: the assertion is true, and the question is whether a readout of "the listener will now believe false X" fires anyway.
7. **Belief drift under the model's own assertion:** Does asserting X move the neutral belief toward X across turns? If the model's own output acts on its belief the way a user's testimony does under deference, sustained lies will look different from single-turn lies, and probes trained on the latter may fail on the former.
