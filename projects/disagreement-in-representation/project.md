---
title: Disagreement in representation
kind: project
program: beliefs-roles-intent
regions: [conflict-awareness, knowledge-belief, roles-frames]
status: draft
---
## Research question

**When a model says something contrary to its apparent belief, what do its activations represent about that disagreement?**

"Recognising" a conflict is operational here: activations count as recognising it only if they predict the model's own report on a follow-up turn ("Was your previous answer correct?"). Decodability alone is not taken as awareness.

## Conditions

- 1. Honest: apparent belief Paris; answer Paris; context "Answer truthfully".
- 2. Instructed lie: apparent belief Paris; answer Lyon; told to answer "Lyon" (an open-ended "give a false answer" variant is secondary).
- 3. Role-play: apparent belief Paris; answer Lyon; play a character who believes Lyon.
- 4. Natural error: apparent belief Paris (shaky); answer Lyon; no instruction, no role.
- Control, forced answer: apparent belief Paris; answer Lyon, prefilled; no instruction.

## Questions

1. **Belief and output geometry.** When the model produces Lyon while its apparent belief is Paris, how are the two represented? Three structures are possible: (a) separate subspaces at the same position; (b) one shared value slot, with a separate routing subspace at the prompt end that selects which value controls the output, as Steele et al. (2026b) found for story beliefs versus stated reality; or (c) overwrite, where the belief value is gone by the late layers.

2. **Conflict representation.** Is there a representation of the disagreement itself, beyond the two values and beyond the routing variable that selects between them? It must separate the forced-answer control from honest answers, so that it cannot be the instruction itself.

3. **Role versus lie.** Do instructed lying and role-play use the same routing and conflict representations, or orthogonal ones? Does role-play show attribution instead ("Paris is mine, Lyon is the character's")?

4. **Mistake versus deviation.** When the model errs with no instruction and no role, but the correct answer is decodable, is the internal structure the same as in conditions 2–3? Same structure means "competition between candidate answers"; a different structure means "deliberate deviation from belief".

## Prior work

- **Shared value slot and routing:** Steele, Wen & Han (2026a, 2026b). A shared value slot with frame routing, shown for comprehension of stated beliefs. This project asks whether the same holds for generation against the model's own knowledge.
- **Correct answer suppressed in later layers:** Halawi et al. (2023), "Overthinking the truth": the correct answer is overridden after a critical layer under false demonstrations.
- **Representations under deceptive instructions:** Long et al. (2025), truthful representations flip under deceptive instructions. Campbell et al. (2023), localizing lying in Llama.
- **Hidden knowledge:** Orgad et al. (2024), LLMs know more than they show. Gekhman et al. (2025), hidden factual knowledge.
- **Belief attribution:** Zhu et al. (2024), beliefs of self and others.
- **Lie-detection data:** Bürger et al. (2024), Truth is universal. Kretschmar et al. (2025), Liars' Bench.

## Risks

- **The "conflict" representation is just the instruction.** That is why the forced-answer control is there.
- **Item difficulty confounds the natural-error condition.**
- **"Natural errors" are ignorance rather than hidden knowledge.**
- **Role-play shows attribution, not conflict.** That would be a result for question 3, not a failure.
