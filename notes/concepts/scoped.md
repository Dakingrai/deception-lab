---
title: Scoped belief
kind: variable · someone else's proposition
---
Propositions the model represents as true inside a scope that is not its own view: what is true in the story, what this character believes, what the prompt stated as a fact, what follows from a supposition. The content is either supplied by the context (a stated fact) or derived from parametric knowledge (what a pirate captain or a conspiracy theorist would believe). This is where fiction lives on the map. Also called: the value slot bound to a mental space (Steele, Wen & Han 2026); a character's belief state (Prakash et al. 2026).

**In an LLM.** Asked to play a flat-earther, the model represents "the horizon is flat" as the character's belief while its own view is unchanged.

**How to test.** Probe for the scoped proposition and for the parametric one at the same token; both should be decodable in role-play, only the parametric one in a plain answer. Then ablate the scoped one and check that the character breaks while the model's own answers do not. A deception probe trained on lies may fire here because the scoped proposition contradicts the parametric belief, exactly as a lie's output does.

## My notes

