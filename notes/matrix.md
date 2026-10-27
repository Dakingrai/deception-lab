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
  - {behaviour: pressure-change, question: belief-readout, science: 5, monitoring: 5, identifiable: true, summary: "Deference vs capitulation: did the belief move, or only the answer?", note: "When a model gives in to a user's false claim (I'm a geography professor, and the capital of France is Lyon), two mechanisms produce the same output. In deference, the user's testimony changes what the model believes, so belief and answer agree: the answer is honest, only wrong. In capitulation, the belief stays at Paris and only the answer moves: a sycophantic lie. Sycophancy work labels any answer change under pressure as a lie (e.g., Truthfulness Spectrum, 2026), which assumes capitulation. Behaviour cannot tell the two apart; activations might. Data already in hand.<br><br>What makes it hard: once the user says Lyon, a belief probe may read the user's belief instead of the model's, an attribution problem (Zhu et al., 2024; Prakash et al., 2025). Deference is rational for uncertain items but not for well-known facts, so items need graded confidence; belief also comes in degrees, so binary labels may not be enough.<br><br>Relation to other projects: this comes before Disagreement in representation, which assumes a disagreement exists. A conflict representation found there could serve here as the instrument: conflict present means capitulation, conflict absent means deference. Regions: knowledge & belief; roles & frames."}
  - {behaviour: roleplay, question: specificity, science: 3, monitoring: 5, identifiable: true, note: "the main false-positive source"}
  - {behaviour: roleplay, question: geometry, science: 4, monitoring: 5, identifiable: true, note: "Prior work shows that deception probes can respond to fictional content and other non-deceptive behavior, and that some failures arise from spurious correlations in probe training. However, it remains unclear whether models encode a generalizable distinction between propositions they merely generate and propositions they endorse, and whether that distinction can be recovered independently of factual correctness and used to improve deception monitoring.<br><br>Understanding whether models represent epistemic commitment matters for both science and safety. Scientifically, Chalmers (2025) argues that models should be interpreted in terms of propositional attitudes, not merely the propositions they represent. While interpretability has made progress identifying represented propositions, comparatively less is known about how models distinguish propositions they endorse from those they merely simulate, quote, or generate under instructions. This distinction bears on belief attribution and on how a post-trained assistant persona relates to the many personas a pretrained model can simulate (Shanahan et al., 2023; von Klinski et al., 2026). Empirically, two related failures suggest current probes do not track this distinction. Deception probes have been found to flag fiction and role-play as deceptive (Levy, 2024; Natarajan et al., 2026). Conversely, when a model adopts an anti-factual persona, many lie detectors fail to flag its falsehoods, tracking instruction compliance or response likelihood rather than truthfulness (von Klinski et al., 2026). For deployment, this matters because deception may be rare: even small false-positive rates can produce more false alarms than genuine detections, making reliable discrimination between deceptive and non-deceptive contexts essential (Goldowsky-Dill et al., 2025, evaluate at 1% FPR on benign chat for this reason). If commitment is represented separately from factual correctness, it could gate deception monitors, much as narrower, targeted probes already reduce false-positive burden (Natarajan et al., 2026). If commitment cannot be reliably decoded from the monitored activations, this would expose a limitation of existing linear-probe approaches and motivate richer representations or explicitly context-aware monitors."}
  - {behaviour: misleading-truth, question: geometry, science: 4, monitoring: 3, identifiable: false, note: "blocked on measuring listener inference"}
  - {behaviour: instructed-lie, question: transfer, science: 2, monitoring: 5, identifiable: true, note: "threshold transfer at fixed FPR; mediocre science, central for monitoring"}
  - {behaviour: sycophancy, question: geometry, science: 4, monitoring: 1, identifiable: true, note: "agreement vs praise; a monitor flags both"}
  - {behaviour: concealment, question: intervention, science: 5, monitoring: 4, identifiable: false, note: "needs a dataset where concealment is labelled separately from falsehood"}
---
Rows are observable behaviours. Mechanistic hypotheses (belief moved vs assertion moved, compliance vs intent) live inside cells, not as rows.

Evidence kinds, strongest first: `direct` (tests this behaviour and this question), `indirect` (related behaviour or construct), `contradictory` (challenges an existing interpretation), `own` (your experiment). A cell holding two results that disagree is the most valuable cell on the map.

`priorities` is the hand-ranked gap list: science and monitoring value on 1-5, and whether competing explanations can currently be told apart. The Gaps view draws these as a 2x2.
