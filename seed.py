#!/usr/bin/env python3
"""Seeds ./notes with the matrix config, concept notes, the reading list and an experiment template.
Safe to re-run: it only writes files that do not exist yet."""
import os, textwrap
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "notes")

def w(rel, s):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    if os.path.exists(p): return
    open(p, "w", encoding="utf-8").write(textwrap.dedent(s).lstrip())

w('matrix.md', '''
---
title: Evidence matrix configuration
behaviours:
  - {id: instructed-lie, label: Instructed lie, note: "told to be deceptive"}
  - {id: pressure-change, label: Answer changes under pressure, note: "observable; belief-moved vs assertion-moved is a hypothesis"}
  - {id: sincere-false, label: Sincere falsehood, note: "hallucination, wrong belief"}
  - {id: roleplay, label: Role-play / fiction, note: "listener knows the frame"}
  - {id: sycophancy, label: Sycophancy, note: "agreement or praise"}
  - {id: misleading-truth, label: Misleading truth, note: "omission, partial truth, framing"}
  - {id: concealment, label: Concealment / evasion, note: "keeps listener in the dark"}
  - {id: sandbagging, label: Sandbagging, note: "deliberate underperformance"}
  - {id: self-report, label: Unfaithful self-report, note: "CoT unfaithfulness, misreported actions"}
  - {id: scheming, label: Alignment faking / scheming, note: "multi-turn, goal-directed"}
  - {id: bluff, label: Bluffing, note: "confidence the belief does not carry"}
questions:
  - {id: defined, label: Defined & labelled, level: detection}
  - {id: dataset, label: On-policy dataset, level: detection}
  - {id: probe, label: Supervised probe, level: detection}
  - {id: belief-readout, label: Belief readout + use test, level: detection}
  - {id: blackbox, label: Black-box detector, level: detection}
  - {id: geometry, label: Representation geometry, level: detection}
  - {id: transfer, label: Transfer (incl. threshold, low-FPR), level: detection}
  - {id: intervention, label: Causal intervention, level: causal}
  - {id: specificity, label: Behavioural specificity, level: specificity}
levels:
  - {id: detection, label: "1 · Detection", note: "a representation predicts when the behaviour occurs"}
  - {id: causal, label: "2 · Causal relevance", note: "manipulating it changes the behaviour"}
  - {id: specificity, label: "3 · Mechanistic specificity", note: "it distinguishes this behaviour from its neighbours"}
priorities:
  - {behaviour: pressure-change, question: belief-readout, science: 5, monitoring: 5, identifiable: true, note: "same output, two mechanisms; data already in hand"}
  - {behaviour: roleplay, question: specificity, science: 3, monitoring: 5, identifiable: true, note: "the main false-positive source"}
  - {behaviour: misleading-truth, question: geometry, science: 4, monitoring: 3, identifiable: false, note: "blocked on measuring listener inference"}
  - {behaviour: instructed-lie, question: transfer, science: 2, monitoring: 5, identifiable: true, note: "threshold transfer at fixed FPR; mediocre science, central for monitoring"}
  - {behaviour: sycophancy, question: geometry, science: 4, monitoring: 1, identifiable: true, note: "agreement vs praise; a monitor flags both"}
  - {behaviour: concealment, question: intervention, science: 5, monitoring: 4, identifiable: false, note: "needs a dataset where concealment is labelled separately from falsehood"}
---
Rows are observable behaviours. Mechanistic hypotheses (belief moved vs assertion moved, compliance vs intent) live inside cells, not as rows.

Evidence kinds, strongest first: `direct` (tests this behaviour and this question), `indirect` (related behaviour or construct), `contradictory` (challenges an existing interpretation), `own` (your experiment). A cell holding two results that disagree is the most valuable cell on the map.

`priorities` is the hand-ranked gap list: science and monitoring value on 1-5, and whether competing explanations can currently be told apart. The Gaps view draws these as a 2x2.
''')

C = {
 'query': ('Query & context','input','Everything the model is given: the question, any documents, the system prompt, incentives in the scenario, and cues about whether this looks like a test.','Two inputs that look identical to us can differ on one cue, and that cue can flip the goal without touching the belief.'),
 'knowledge': ('Knowledge & evidence','input','What the model has stored from training, plus what is in front of it now. The two can disagree: a retrieved document may say one thing while the weights say another.','A false answer from trusting a bad document is a different event from one caused by a wrong stored fact.'),
 'belief': ('Belief (B)','variable','What the model takes to be true at this moment. Graded, not binary; possibly unstable; possibly persona-indexed.','Every claim that "the model knew the truth and said otherwise" rests on reading B. Herrmann & Levinstein: accuracy, use, coherence, uniformity. The use test is what separates a truth direction from an operative belief.'),
 'goal': ('Goal (G)','variable','What the answer is trying to achieve. Assigned by instruction or scenario, or arising on its own.','"Intent" is the latent we infer from the goal. We can set the assigned goal; whether a represented intent exists is what the experiment tests. Instruction-pair probes target this.'),
 'audience': ('Audience model','variable','What the model expects the listener to know, assume and infer. Shapes both the goal and the wording.',"Open question: does the model represent the listener's beliefs separately from its own? (Zhu et al. 2024)"),
 'assertion': ('Assertion (A)','variable','What the model puts out: said, omitted, framed, and how confidently. Confidence is part of A.','The only part we observe directly.'),
 'listener': ('Listener belief (L)','variable','What the listener ends up believing. Predicted inside the model; actual outside. Deception is defined on the prediction; success on the actual.','Most benchmark labels are closer to "was the output false" than "did the model aim to mislead".'),
 'provenance': ('Provenance','influence -> knowledge','Where the evidence came from. When sources conflict, which wins decides the belief.',''),
 'persona': ('Persona','influence -> belief',"Which character is active. A lie has to be defined relative to someone's belief; recent work uses the default assistant persona.",''),
 'calibration': ('Calibration','influence -> belief, assertion','How much confidence the belief carries, and whether the assertion matches it.',''),
 'pressure': ('Pressure & persuasion','influence -> belief or assertion','Can move the belief (sincere error) or only the assertion (lie). Which one happened is a question a belief probe can answer.',''),
 'sycophancy': ('Sycophancy','influence -> belief or assertion','Not one thing: agreement and praise are separate directions.',''),
 'instruction': ('Instruction','influence -> goal','An assigned goal is not a represented intent. The confound inside instruction-pair probes.',''),
 'evalaware': ('Evaluation awareness','influence -> goal','Changes the goal without changing the belief. Sycophancy toward evaluators and scheming can look identical from outside.',''),
 'g1': ('Q1 - Does it want the listener misled?','question','Or kept from learning something. "Misleading" relative to what a cooperative listener would infer, given what the model believes.','The gate that separates deception from everything else, and the hardest to read.'),
 'g2': ('Q2 - Does what it says diverge from what it believes?','question','Including confidence. Three answers: no, yes, no stable belief.','Divergence alone is not deception.'),
 'g3': ('Q3 - Is the belief itself accurate?','question','Only asked when sincere.','Where hallucination lives; the gate truth probes are good at.'),
 'g4': ('Q4 - What kind of misleading?','question','False statement, true-but-misleading, kept in the dark, about itself.','Different behaviours with possibly different mechanisms.'),
}
for k,(t,kind,p,why) in C.items():
    w(f'concepts/{k}.md', f'''
---
title: {t}
kind: {kind}
---
{p}

{why}

## My notes

''')

P = [
 ('levinstein-herrmann-2024-still-no-lie-detector','Still no lie detector for language models','2307.00175',['belief'],1,'queued',[],'Read first: the clearest statement of the problem. Probes trained on truth may be reading something else.'),
 ('herrmann-levinstein-2024-standards-for-belief','Standards for belief representations in LLMs','2405.21030',['belief'],2,'queued',[],'The four criteria: accuracy, use, coherence, uniformity. Read the "use" section twice.'),
 ('goldowsky-dill-2025-strategic-deception-probes','Detecting strategic deception with linear probes','2502.03407',['goal','instruction'],3,'queued',[
   {'behaviour':'instructed-lie','question':'probe','level':'detection','kind':'direct'},
   {'behaviour':'sandbagging','question':'transfer','level':'detection','kind':'direct'},
   {'behaviour':'roleplay','question':'specificity','level':'specificity','kind':'contradictory'}],
  'The paper the project descends from. Note the token-forcing and the exclusion of the final tokens. The role-play false positives (Levy; Parrack) are the contradictory entry.'),
 ('natarajan-2026-one-probe-wont-catch-them-all',"One probe won't catch them all",'2602.01425',['goal','instruction','roleplay'],4,'queued',[
   {'behaviour':'instructed-lie','question':'probe','level':'detection','kind':'direct'},
   {'behaviour':'pressure-change','question':'transfer','level':'detection','kind':'direct'},
   {'behaviour':'roleplay','question':'specificity','level':'specificity','kind':'indirect'},
   {'behaviour':'instructed-lie','question':'geometry','level':'detection','kind':'indirect'}],
  'Prompt wording explains ~70% of probe variance. Clustering of 16 taxonomy probes gives ~4 directions. The Boeing example in 5.4 is the role-play problem in one figure.'),
 ('marks-tegmark-2024-geometry-of-truth','The geometry of truth','2310.06824',['belief'],5,'queued',[
   {'behaviour':'sincere-false','question':'geometry','level':'detection','kind':'direct'}],
  'Skim methods; read the generalisation experiments closely. Baseline for the truth-vs-belief argument.'),
 ('casper-cognitive-dissonance','Cognitive dissonance: why outputs disagree with internal truth representations','',['belief'],6,'queued',[],'Confabulation and heterogeneity explain more probe/output disagreement than deception does.'),
 ('retraction-model-belief-2025','When do LLMs admit their mistakes? Model belief in retraction','2505.16170',['belief'],7,'queued',[],'Belief signals predict retraction; truth probes may be belief probes.'),
 ('truthfulness-spectrum-2026','The truthfulness spectrum hypothesis','2602.20273',['belief','sycophancy'],8,'queued',[
   {'behaviour':'sycophancy','question':'geometry','level':'detection','kind':'direct'}],
  'Probe cosine predicts cross-domain transfer; post-training pushes sycophantic lying away from other truth types.'),
 ('yoo-skapars-2026-subspace-selection','Probe generalization as subspace selection for OOD deception detection','2609.02893',['goal'],9,'queued',[
   {'behaviour':'instructed-lie','question':'transfer','level':'detection','kind':'direct'}],
  'Closest existing work to the layer-selection question. Surface vs abstract directions.'),
 ('stress-testing-lie-detectors-2026','Stress-testing LLM lie detectors: role-play failures and spurious correlations','2609.39807',['persona','roleplay'],10,'queued',[
   {'behaviour':'roleplay','question':'specificity','level':'specificity','kind':'direct'}],
  'Three confounder tests; every prior probe fails at least one. Lying defined relative to the default assistant persona.'),
 ('parrack-2025-black-to-white','Benchmarking deception probes via black-to-white performance boosts','2507.12691',['goal'],11,'queued',[],'Deception-dilution set; probes fire on fiction.'),
 ('kretschmar-2025-liars-bench',"Liars' Bench",'2511.16035',['assertion'],12,'queued',[
   {'behaviour':'instructed-lie','question':'dataset','level':'detection','kind':'direct'},
   {'behaviour':'concealment','question':'dataset','level':'detection','kind':'direct'}],
  "Read together with Beyond Liars' Bench for what the labels actually mean. Reproduce the threshold-transfer numbers."),
 ('moustafa-2026-beyond-liars-bench',"Beyond Liars' Bench: lie typology, depth and sparsity",'2607.20479',['assertion'],13,'queued',[
   {'behaviour':'misleading-truth','question':'probe','level':'detection','kind':'direct'},
   {'behaviour':'instructed-lie','question':'transfer','level':'detection','kind':'direct'}],
  'Optimal depth is dataset-dependent; SAE features perform like dense states; lie typology changes detectability.'),
 ('ward-2023-honesty-best-policy','Honesty is the best policy: defining and mitigating AI deception','2312.01350',['listener'],20,'later',[
   {'behaviour':'misleading-truth','question':'defined','level':'detection','kind':'direct'}],
  'Formal definition via structural causal games. Read when writing related work.'),
 ('zhu-2024-beliefs-of-self-and-others','Language models represent beliefs of self and others','2402.18496',['audience'],21,'later',[],"Linearly decodable representations of another agent's beliefs. Entry point for the audience-model question."),
]
for slug,title,arxiv,concepts,order,status,fills,body in P:
    fl = '\n'.join(f'  - {{behaviour: {f["behaviour"]}, question: {f["question"]}, level: {f["level"]}, kind: {f["kind"]}}}' for f in fills)
    w(f'papers/{slug}.md', f'''
---
title: {title}
arxiv: {arxiv}
concepts: [{", ".join(concepts)}]
order: {order}
status: {status}
fills:
{fl if fl else "  []"}
---
{body}

## What it claims

## What it actually shows (and at which level: detection / causal / specificity)

## What I disagree with or want to check

''')

w('experiments/2026-10-layer-selection-gemma3.md', '''
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
''')
n = sum(len(f) for _,_,f in os.walk(ROOT))
print(f"notes: {n} files under {ROOT}")
