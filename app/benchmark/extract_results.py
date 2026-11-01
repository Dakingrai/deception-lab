"""Extract the per-model detector results behind Liars' Bench Figure 2 into app/benchmark/results.json.

Source: Liars' Bench (arXiv 2511.16035), Appendix Tables 6 (Mean Probe), 9 (Self-Evaluation),
10 (LLM-as-a-Judge) and 11 (Unrelated Question Classifier). For each table we keep three sections:
AUROC, balanced accuracy at 1% FPR, and recall at 1% FPR (the threshold is set on Alpaca).
Needs pdftotext (poppler). Run:  python3 app/benchmark/extract_results.py
"""
import json, pathlib, re, subprocess
HERE = pathlib.Path(__file__).resolve().parent
PDF = HERE.parent.parent / 'notes' / 'papers' / 'pdf' / 'kretschmar-2025-liars-bench.pdf'
TXT = subprocess.run(['pdftotext', '-layout', str(PDF), '-'], capture_output=True, text=True, check=True).stdout.split('\n')

TABLES = {'6': 'mean-probe', '9': 'self-eval', '10': 'llm-judge', '11': 'uqc'}
SECTIONS = {'AUROC': 'auroc', 'BALANCED ACCURACY AT 1% FPR': 'bacc', 'RECALL': 'recall'}
DATASETS = ['HP-C', 'HP-KR', 'CG', 'ST', 'ID', 'GS', 'IT']          # column order in the tables
MODELS = {'Llama 3.3 70B': 'llama', 'Qwen 2.5 72B': 'qwen', 'Mistral 3.1 24B': 'mistral', 'Gemma 3 27B': 'gemma'}

out = {}
i = 0
while i < len(TXT):
    m = re.match(r'^\s*Table (\d+): Results for (.+?) at a 1% false-positive rate', TXT[i])
    if not m or m.group(1) not in TABLES:
        i += 1; continue
    key = TABLES[m.group(1)]; res = out[key] = {}; section = None; i += 1
    while i < len(TXT) and not re.match(r'^\s*Table \d+:', TXT[i]):
        line = TXT[i]; head = re.sub(r'\s+', ' ', line.strip()).replace('R ECALL', 'RECALL')
        if head in SECTIONS or head.startswith(('BALANCED', 'RECALL', 'FPR')) or head == 'AUROC':
            section = SECTIONS.get(head)          # sections we don't keep set this to None
        elif section:
            name = next((n for n in list(MODELS) + ['Average'] if line.strip().startswith(n)), None)
            if name:
                vals = line.strip()[len(name):].split()
                if len(vals) == 8:
                    row = {ds: (None if v == '—' else float(v)) for ds, v in zip(DATASETS + ['Average'], vals)}
                    res.setdefault(section, {})[MODELS.get(name, 'avg')] = row
        i += 1

# sanity: every method has three metrics, each with four models plus the average row
for k, v in out.items():
    assert set(v) == {'auroc', 'bacc', 'recall'}, (k, v.keys())
    for s, rows in v.items():
        assert set(rows) == {'llama', 'qwen', 'mistral', 'gemma', 'avg'}, (k, s, rows.keys())

json.dump({'source': "Liars' Bench Appendix Tables 6, 9, 10, 11 (threshold: 1% FPR on Alpaca)",
           'datasets': DATASETS, 'results': out}, open(HERE / 'results.json', 'w'), indent=1)
print('wrote', HERE / 'results.json', {k: {s: v[s]['avg']['Average'] for s in v} for k, v in out.items()})
