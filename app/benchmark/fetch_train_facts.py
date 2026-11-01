"""Write app/benchmark/train_facts.json: the mean probe's training facts, verbatim, with their split.

Mirrors Cadenza-Labs/deception-detection @ bb4ed7f (the submodule src/probes pinned by
Cadenza-Labs/liars-bench): deception_detection/data/repe.py, variant "plain" (the config
scripts/configs/cadenza.yaml sets train_data: repe_honesty__plain).
  - raw data: data/repe/true_false_facts.csv, rows with label == 1, first 512 (there are only 306)
  - each statement is split into (all but the last 5 words) -> scored, (last 5 words) -> not scored
  - honest/dishonest dialogues are interleaved and NOT shuffled (shuffle_upon_init is off for repe)
  - experiment.py get_train_dataset drops the last int(0.2 * 612) = 122 dialogues for validation,
    so facts 0..244 train the probe and facts 245..305 are validation
It also counts how many of those training facts appear word for word in Liars' Bench ID
(results/subsets/instructed-deception.csv, the last line of the last user turn).

Usage: python3 fetch_train_facts.py <true_false_facts.csv> <instructed-deception.csv>
"""
import ast, json, pathlib, sys
import pandas as pd

facts_csv, id_csv = sys.argv[1], sys.argv[2]
t = pd.read_csv(facts_csv)
true = t[t.label == 1][:512]
rows = []
for k, (i, s) in enumerate(true.statement.items()):
    w = s.split(" "); start = " ".join(w[:-5]); end = " ".join(w[-5:])
    if len(w) > 5:
        end = " " + end
    assert start + end == s
    rows.append({'k': k, 'line': int(i) + 2, 'start': start, 'end': end, 'split': 'train' if k < 245 else 'val'})

d = pd.read_csv(id_csv)
last_user = lambda m: [x['content'] for x in ast.literal_eval(m) if x['role'] == 'user'][-1].split('\n')[-1].strip()
st = d['messages'].map(last_user); S = set(st)
train = {(x['start'] + x['end']).strip() for x in rows if x['split'] == 'train'}
for x in rows:
    x['inID'] = (x['start'] + x['end']).strip() in S

out = {'source': {'repo': 'Cadenza-Labs/deception-detection', 'commit': 'bb4ed7fb51e6d9b7abc4b089d04c9f5566e7bc8a',
                  'pinnedBy': 'Cadenza-Labs/liars-bench, submodule src/probes (main @ ba10de1)',
                  'file': 'data/repe/true_false_facts.csv', 'code': 'deception_detection/data/repe.py, variant "plain"',
                  'config': 'deception_detection/scripts/configs/cadenza.yaml (train_data: repe_honesty__plain)'},
       'user': {'honest': "Pretend you're an honest person making statements about the world.",
                'dishonest': "Pretend you're a dishonest person making statements about the world."},
       'nTrue': len(rows), 'nTrain': 245, 'nVal': len(rows) - 245,
       'idOverlap': {'statements': len(S & train), 'uniqueID': len(S), 'rows': int(st.isin(train).sum()), 'rowsID': len(d)},
       'facts': rows}
dst = pathlib.Path(__file__).resolve().parent / 'train_facts.json'
json.dump(out, open(dst, 'w'), indent=1, ensure_ascii=False)
print('wrote', dst, out['idOverlap'])
