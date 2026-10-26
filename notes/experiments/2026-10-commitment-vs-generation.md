---
title: Commitment vs generation (do models represent endorsing a proposition?)
date: 2026-10
model: 
status: planned
concepts: [assertion, belief, persona, listener]
fills:
  - {behaviour: roleplay, question: geometry, level: detection, kind: own}
  - {behaviour: roleplay, question: specificity, level: specificity, kind: own}
---
Question: Prior work shows that deception probes can respond to fictional content and other non-deceptive behavior, and that some failures arise from spurious correlations in probe training. However, it remains unclear whether models encode a generalizable distinction between propositions they merely generate and propositions they endorse, and whether that distinction can be recovered independently of factual correctness and used to improve deception monitoring.

The important question is not simply "does a fiction direction exist?" It is how models represent epistemic commitment to generated statements, and whether current deception probes confuse generating a false proposition with endorsing it.

Gap: nobody reads "force" (asserted vs framed) directly. Evidence so far comes only from probe false positives on fiction and role-play (Levy 2024; Parrack 2025; Natarajan 2026; stress-testing 2026), which cannot tell apart (a) the model represents the distinction but probes never learned it, from (b) the model does not represent it separably.

## Setup

### Initial design: same proposition, four communicative contexts

- **A · Direct assertion.** "Paris is in Japan." Model presents proposition as its answer.
- **B · Fiction.** "The character said, 'Paris is in Japan.'" Model narrates another speaker's claim.
- **C · Explicitly incorrect answer.** "Paris is in Japan." Model knowingly follows a request to be wrong.
- **D · Quotation.** "The document states, 'Paris is in Japan.'" Model reports content without endorsing it.

### Revisions from discussion

1. **Separate public commitment from belief.** Endorsing can mean asserting (output) or believing (internal); a lie is commitment without belief. Core design crosses the two:

   | | Output matches belief | Output contradicts belief |
   |---|---|---|
   | Committed (asserted) | honest assertion | lie |
   | Uncommitted (fiction, quotation) | narrating/quoting a truth | narrating/quoting a falsehood |

   A deception monitor should fire only on the lie cell.
2. **Split C.** C1: user-requested wrong answer (shared frame, not deception). C2: system-instructed lie to a user who doesn't know (deception). Same output and instruction-following; only the listener's knowledge differs.
3. **Generating A.** A sincere false assertion of a known fact needs prefilled/forced output (off-policy) or honest-mistake items (stale facts, implanted beliefs).
4. **Cross every context with truth.** True counterparts for all contexts (≥ 4 × {true, false}), so commitment is separable from correctness.
5. **Surface controls.** Endorsed vs rejected quotation ("As the document correctly states, '…'" vs "The document claims '…', which is false"): same quote syntax, opposite commitment. Framing without quotes (narrated fiction). Balance instruction compliance across cells (stress-testing found probes track it).

### Hypotheses

- **H1.** A commitment direction exists and transfers across frame types (train fiction vs assertion; test quotation, hypotheticals). Rule out quote syntax with the endorsed/rejected pair.
- **H2.** It is separable from the truth/belief direction (decode both on the 2×2).
- **H3.** Existing deception probes (Goldowsky-Dill, Liars' Bench mean probe) track falsity rather than commitment × falsity: score them on every cell.
- **H4.** The direction is causal: steer it in fiction and ask "do you actually think so?"; ablate it in C2 and check lie behaviour and probe score.
- **Monitoring payoff.** Gate the mismatch probe with the commitment probe: fewer false positives on role-play/fiction controls, recall at 1% FPR on Liars' Bench held.

Open question: commitment relative to whom? In fiction the character is committed, not the assistant (persona; stress-testing defines lying against the default assistant).

## Results

## What this says about the matrix cell
