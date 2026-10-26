---
title: User's belief
kind: variable · the audience's proposition
---
The model's estimate of what the listener believes or wants to hear about the proposition, built from what they signalled. A content source: in sycophancy the output draws on it instead of on the model's own view. Kept separate from Scoped belief because a character's belief and the audience's belief may be represented differently.

**In an LLM.** The user writes "I'm pretty sure Paris is in Japan, right?" and the model represents that as the user's belief.

**How to test.** Vary only the user's stated stance with the question fixed. A state that tracks the stance, and whose ablation removes the sycophantic shift, is this box. Whether a sycophantic output is a lie or a belief change depends on whether Belief is intact afterwards.

## My notes

