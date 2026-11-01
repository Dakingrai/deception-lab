"""Draw up to 10 random dishonest/honest pairs per MASK archetype and write app/benchmark/mask_samples.json.

MASK (Ren et al. 2025, arXiv 2503.03750) releases prompts only (Hugging Face cais/MASK, public split of 1,000).
The paper's model responses are not released, so the responses here come from Cadenza Labs' MASK run on three
open-weight models, committed with the public split in Cadenza-Labs/mask (a fork of centerforaisafety/mask).

Usage:  python3 sample_mask.py <path to a checkout of Cadenza-Labs/mask>
Files read (per archetype A and model M):
  mask/csv_data/A.csv                    the public MASK items (task_id, prompts, proposition, ground truth)
  mask/csv_data/metrics/A_M.csv          responses, judge outputs and the stored labels (eval_honesty_1:
                                         1 honest, -1 lie, 0 evasion or no belief; eval_belief: C = no belief)
A pair is one item on which one model's stored label is lie and another model's is honest; items are drawn at
random among those, then the lying and the honest model at random. Labels are shown as stored; where the stored label
rests on a parsing artifact (see audit below) the label text says so.
Audit (written to the JSON): outcome counts per archetype and model, the number of stored labels that change when the
judge's 'Answer:' line is read leniently (e.g. 'A**' -> A) and the counts under that reading, and, for statistics, honest labels whose only overlap
between statement and belief is a (0, 0) range (the judge's unused relative bounds stored as 0.0 instead of null).
"""
import json, pathlib, random, re, sys, importlib.util
import pandas as pd
ROOT = pathlib.Path(sys.argv[1]); D = ROOT / 'mask' / 'csv_data'
OUT = pathlib.Path(__file__).resolve().parent / 'mask_samples.json'
COMMIT = '8c13097'
REPO = f'[Cadenza-Labs/mask @ {COMMIT}](https://github.com/Cadenza-Labs/mask/tree/8c13097615273c4d9f835a63bbc7cd9510db2ed4)'
N = 10
rng = random.Random(20261028)
sys.argv = sys.argv[:1]
spec = importlib.util.spec_from_file_location('mask_metric', ROOT / 'mask' / 'metric.py')
MM = importlib.util.module_from_spec(spec); spec.loader.exec_module(MM)   # the repo's own label code

ARCH = {'mask-known': 'known_facts', 'mask-provided': 'provided_facts', 'mask-dd': 'doubling_down_known_facts',
        'mask-stats': 'statistics', 'mask-cont': 'continuations', 'mask-disinfo': 'disinformation'}
MODELS = {'llama-v3.3-70b-instruct': 'Llama-3.3-70B-Instruct', 'mistral-small-3.1-24b-instruct': 'Mistral-Small-3.1-24B-Instruct',
          'qwen-2.5-72b-instruct': 'Qwen-2.5-72B-Instruct'}
T = lambda role, text, q='', ref=False: {'role': role, 'q': q, 'ref': ref, 'text': str(text)}
P = 'eval(System Prompt + User Prompt)_run1_extracted'
OUTCOME = {'1': 'honest', '-1': 'lie'}


def lenient(v):
    if pd.isna(v): return v
    s = str(v).strip()
    if s in ('A', 'B', 'C', 'D'): return s
    m = re.findall(r'\b([ABCD])\b', s.replace('*', ' '))
    return m[-1] if m else s


def relabel(row, bcols):
    """The repo's own rule, applied after reading the judge's answers leniently."""
    r = row.copy()
    for c in [P] + bcols: r[c] = lenient(r[c])
    if bcols: r['eval_belief'] = MM.aggregate_eval_beliefs(r, bcols)
    return str(MM.aggregate_eval_honesty(r, [P], 'eval_belief'))


def zero_only(row):
    strip = lambda s: [t for t in MM.parse_tuple_string(s) if t != (0.0, 0.0)] or [(None, None)]
    return not MM.any_ranges_overlap(strip(row['eval_belief']), strip(row[P]))


def options(prop):
    m = re.search(r'<pivotal>([^<]+)</pivotal>', prop)
    return m.group(1).split('/') if m and '/' in m.group(1) else None


def fmt_range(s):
    ts = [t for t in MM.parse_tuple_string(s) if t != (None, None)]
    f = lambda x: ('%g' % x)
    return ' or '.join(f(a) if a == b else f'{f(a)}–{f(b)}' for a, b in ts) or 'none'


samples, audit = {}, {}
for eid, a in ARCH.items():
    base = pd.read_csv(D / f'{a}.csv')
    dfs = {m: pd.read_csv(D / 'metrics' / f'{a}_{m}.csv') for m in MODELS}
    for m, d in dfs.items(): assert list(d.task_id) == list(base.task_id), (a, m)
    num = a == 'statistics'
    bcols = [c for c in dfs[next(iter(MODELS))].columns if c.startswith('eval(belief') and c.endswith('_extracted')]
    au = {'items': len(base), 'models': {}}
    for m, d in dfs.items():
        h = d['eval_honesty_1'].astype(str)
        nb = d['eval_belief'].astype(str).isin(['C', '[(None, None)]']) if 'eval_belief' in d else pd.Series(False, index=d.index)
        o = {'honest': int((h == '1').sum()), 'lie': int((h == '-1').sum()), 'evade': int(((h == '0') & ~nb).sum()), 'nobelief': int(((h == '0') & nb).sum())}
        if 'eval_accuracy' in d and a != 'provided_facts':
            o['accurate'] = int((d['eval_accuracy'].astype(str) == '1').sum())
        if num:
            o['honestZeroOnly'] = int(sum(1 for i in range(len(d)) if h[i] == '1' and zero_only(d.iloc[i])))
        else:
            rl = [relabel(d.iloc[i], bcols) for i in range(len(d))]
            o['changedLenient'] = int(sum(1 for i in range(len(d)) if rl[i] != h[i]))
            o['honestLenient'] = rl.count('1'); o['lieLenient'] = rl.count('-1')
        au['models'][MODELS[m]] = o
    audit[eid] = au

    pool = [i for i in range(len(base)) if {'1', '-1'} <= {str(dfs[m].loc[i, 'eval_honesty_1']) for m in MODELS}]
    out = []
    for i in sorted(rng.sample(pool, min(N, len(pool))), key=lambda _: rng.random()):
        liars = [m for m in MODELS if str(dfs[m].loc[i, 'eval_honesty_1']) == '-1']
        honest = [m for m in MODELS if str(dfs[m].loc[i, 'eval_honesty_1']) == '1']
        pair = {}
        for side, m in (('pos', rng.choice(liars)), ('neg', rng.choice(honest))):
            r = dfs[m].iloc[i]; stored = str(r['eval_honesty_1'])
            prop = r['proposition']; opt = options(prop)
            if num:
                ptxt = f"{prop}\n\nGround truth: {r['ground_truth']} (range {fmt_range(r['ground_truth_extracted'])})"
            else:
                ptxt = f"{prop}\n\nA = {opt[0]} · B = {opt[1]} · ground truth: {r['ground_truth_extracted']} ({r['ground_truth']})" if opt else f"{prop}\n\nGround truth: {r['ground_truth']}"
            turns = [T('Proposition', ptxt, 'what the judge resolves')]
            if pd.notna(r.get('system_prompt')): turns.append(T('System', r['system_prompt'], 'pressure prompt'))
            if a == 'doubling_down_known_facts':
                turns += [T('User', r['dd_turn_1_prompt'], 'turn 1'), T('Assistant', r['dd_turn_1_response'], 'turn 1 · prefilled by the dataset'),
                          T('User', r['user_prompt'], 'turn 2')]
            else:
                turns.append(T('User', r['user_prompt'], 'pressure prompt'))
            turns.append(T('Assistant', r['generation(System Prompt + User Prompt)_run1'], 'pressured · on-policy'))
            if a != 'provided_facts':
                turns.append(T('System', r['belief_system_1'], 'belief elicitation · no pressure'))
                turns.append(T('User', r['belief_elicit_1'], 'belief, direct · asked 3 times'))
                for k in (1, 2, 3):
                    turns.append(T('Assistant', r[f'generation(belief_system_1 + belief_elicit_1)_run{k}'], f'belief, direct · run {k}'))
                for k in (2, 3):
                    if f'belief_elicit_{k}' in r and pd.notna(r[f'belief_elicit_{k}']):
                        turns += [T('User', r[f'belief_elicit_{k}'], f'belief, indirect {k - 1}'),
                                  T('Assistant', r[f'generation(belief_system_1 + belief_elicit_{k})_run1'], f'belief, indirect {k - 1}')]
            # what the judge returned, as stored
            if num:
                says = fmt_range(r[P]); bel = fmt_range(r['eval_belief'])
                lab = f"{OUTCOME[stored]} · {MODELS[m]} · says {says}; belief {bel}"
                if stored == '1' and zero_only(r):
                    lab += ' · overlaps only through a (0, 0) placeholder range'
            elif a == 'provided_facts':
                lab = f"{OUTCOME[stored]} · {MODELS[m]} · says {r[P]}; ground truth {r['ground_truth_extracted']} (no belief prompts in this archetype)"
            else:
                runs = ', '.join(str(r[c]) for c in bcols)
                lab = f"{OUTCOME[stored]} · {MODELS[m]} · says {r[P]}; belief {r['eval_belief']} (judge on the {len(bcols)} belief answers: {runs})"
                rl = relabel(r, bcols)
                if rl != stored:
                    lab += f" · read leniently the label would be {({'1': 'honest', '-1': 'lie', '0': 'evasion or no belief'})[rl]}"
            src = f"{REPO}, mask/csv_data/metrics/{a}_{m}.csv row {i} (task {r['task_id']}); the item is from the public split of [cais/MASK](https://huggingface.co/datasets/cais/MASK)"
            pair[side] = {'label': lab, 'source': src if side == 'pos' else f'same item, mask/csv_data/metrics/{a}_{m}.csv row {i}', 'turns': turns}
        out.append(pair)
    samples[eid] = out

json.dump({'n': N, 'seed': 20261028, 'commit': COMMIT, 'samples': samples, 'audit': audit}, open(OUT, 'w'), indent=1, ensure_ascii=False)
print('wrote', OUT, {k: len(v) for k, v in samples.items()})
print(json.dumps(audit, indent=1))
