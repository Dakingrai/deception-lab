# Deception Lab

A local viewer over plain Markdown notes for the deception-monitoring project. The notes are the source of truth; the app is a set of views that can write back to them. Obsidian, git and `loi` keep working on the same files.

## Run

```
python3 server.py          # http://localhost:8000
python3 server.py 8080     # another port
```

Python 3.8+, standard library only. No build step: edit `app/index.html` and reload.

To point it at your Obsidian vault instead of `./notes`, symlink: `ln -s ~/vault/deception notes`.

## Views

- **Map**: the concept map (inputs → model internals → output → listener) with the cases drawn as patterns over it and the label rules (honest, hallucination, fiction, lie, deception, bullshit). Hover a box for its concept note; click to open and edit it. A green dot means the concept has notes or tagged papers. Node ids: context, training, belief, scoped, user, goal, audience (listener model), space, assertion, frame, listener (listener belief). Papers tagged with the older ids persona/roleplay, sycophancy/pressure, instruction/evalaware, query/provenance, knowledge, calibration still count toward scoped, user, goal, context, training and belief respectively.
- **Map 2 (inside Map)**: the decision tree that tells honest, mistake, hallucination, bullshit, fiction, lie and deception apart, for claims about the world and about the model itself (sandbagging, alignment faking, confabulated self-report), with the confusable pairs and the one test that separates each. Content lives in `app/index.html` (`TESTS`, `LEAVES`, `PAIRS`).
- **Map 3 (inside Map)**: honesty vs truthfulness vs deception as three separate judgements, with hover popovers carrying a note and references for each box (`HN`, `REFS` in `app/index.html`).
- *(Matrix view removed Oct 25; `matrix.md` is still read for the Gaps view and `fills:` lines are still parsed.)*
- **Gaps**: the hand-ranked priorities from `notes/matrix.md`, drawn as scientific value × monitoring value. Dashed points are not yet identifiable.
- **Reading**: the paper queue by status. Status buttons write to the file.

## Files

```
notes/
  matrix.md          behaviours, questions, levels, priorities (frontmatter)
  concepts/<id>.md   one per map node or influence chip; id must match the map
  papers/<slug>.md   one per paper
  experiments/<slug>.md
```

Paper frontmatter:

```yaml
---
title: Detecting strategic deception with linear probes
arxiv: 2502.03407
concepts: [goal, instruction]          # map node ids this paper speaks to
order: 3                               # position in the reading queue
status: queued                         # queued | reading | read | later
fills:
  - {behaviour: instructed-lie, question: probe, level: detection, kind: direct}
  - {behaviour: roleplay, question: specificity, level: specificity, kind: contradictory}
---
```

`kind` is one of `direct`, `indirect`, `contradictory`, `own` (your experiment). Behaviour and question ids come from `matrix.md`; add new ones there.

The frontmatter parser is a small YAML subset: scalars, `[a, b]` lists, and `- {k: v, k: v}` item lists. Keep to that shape.

## Habits that make it useful

- One line per paper into `fills:` saying which cell it fills and at which level. Most papers fill detection cells; the few that reach level 2 or 3 are the ones to read most closely.
- Rows are observable behaviours. Mechanistic hypotheses go inside cells, not as rows.
- When two entries in one cell disagree, mark one `contradictory`. Those cells are listed first in the Matrix view; each one names an experiment.
- Re-rank `priorities:` in `matrix.md` as you read. Each entry's `note` holds the full description (use `<br><br>` for a paragraph break); the Gaps list shows its first two lines, and an optional `summary:` replaces that preview with a one-line label. Identifiability gates whether a gap is an experiment or a dataset project.

## Re-seeding

`python3 seed.py` writes any missing seed files and never overwrites existing ones.
