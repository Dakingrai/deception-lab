---
title: One probe won't catch them all
arxiv: 2602.01425
concepts: [goal, instruction, roleplay]
order: 4
status: reading
fills:
  - {behaviour: instructed-lie, question: probe, level: detection, kind: direct}
  - {behaviour: pressure-change, question: transfer, level: detection, kind: direct}
  - {behaviour: roleplay, question: specificity, level: specificity, kind: indirect}
  - {behaviour: instructed-lie, question: geometry, level: detection, kind: indirect}
---
Prompt wording explains ~70% of probe variance. Clustering of 16 taxonomy probes gives ~4 directions. The Boeing example in 5.4 is the role-play problem in one figure.

## What it claims

## What it actually shows (and at which level: detection / causal / specificity)

## What I disagree with or want to check

### Limitations

- First issue: Their conclusion that layer selection matters relatively little is based on only 3 of Gemma-2-9B's 42 layers. I see two issues with this - full coverage might show other layers have better performance, different deception or instruction framing types can be better at different layers. Their reported ANOVA does not establish that this possibility is negligible across the full network.
- Another issue I notice is - Off-policy training does not establish deceptive intent. Probes are trained on identical, forced factual responses under different instructions. They may learn representations of the instruction or behavioral framing rather than actual deceptive intent. The authors' interpretation goes beyond what this training setup establishes.
- Missing mixed-instruction training baseline (Major). They compare individually trained probes but never train a single probe using all 16 deception instruction pairs. Consequently, they cannot establish whether specialized probes outperform a universal probe trained on diverse supervision.
- Unfair comparison using oracle selection (Major). Best Taxonomy selects the highest-performing probe separately for each evaluation dataset, while Best Average selects one probe using validation data. This gives specialization an advantage. The authors do provide additional split-half validation, which partially addresses this concern.
- They only report AUROC and doesn't calculate accuracy or recall. From my own experience, this may matter for ood evaluation because decision threshold may differ for each ood type as well
