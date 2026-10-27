#!/usr/bin/env python3
"""Deception Lab: a tiny local server. Notes are Markdown files under ./notes; the app under ./app is a viewer over them.
Run:  python3 server.py   then open http://localhost:8000
"""
import json, os, sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.abspath(__file__))
NOTES = os.path.join(ROOT, "notes")
PROJECTS = os.path.join(ROOT, "projects")   # served under the virtual prefix projects/
APP = os.path.join(ROOT, "app")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

def safe_note_path(rel):
    rel = unquote(rel).lstrip("/")
    base = NOTES
    if rel.startswith("projects/"):
        base, rel = PROJECTS, rel[len("projects/"):]
    full = os.path.normpath(os.path.join(base, rel))
    if not full.startswith(base + os.sep) or not full.endswith(".md"):
        return None
    return full

def list_notes():
    out = []
    for base, prefix in ((NOTES, ""), (PROJECTS, "projects/")):
        if not os.path.isdir(base): continue
        for dp, _, fns in os.walk(base):
            for fn in sorted(fns):
                if not fn.endswith(".md"): continue
                full = os.path.join(dp, fn)
                rel = prefix + os.path.relpath(full, base).replace(os.sep, "/")
                with open(full, encoding="utf-8") as f:
                    out.append({"path": rel, "raw": f.read(), "mtime": os.path.getmtime(full)})
    return out

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=APP, **k)
    def log_message(self, *a): pass
    def _json(self, code, obj):
        b = json.dumps(obj).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store"); self.send_header("Content-Length", str(len(b)))
        self.end_headers(); self.wfile.write(b)
    def end_headers(self):
        self.send_header("Cache-Control", "no-store"); super().end_headers()
    def do_GET(self):
        if self.path.startswith("/api/notes"): return self._json(200, list_notes())
        if self.path == "/": self.path = "/index.html"
        return super().do_GET()
    def do_PUT(self):
        if not self.path.startswith("/api/notes/"): return self._json(404, {"error": "not found"})
        full = safe_note_path(self.path[len("/api/notes/"):])
        if not full: return self._json(400, {"error": "bad path"})
        n = int(self.headers.get("Content-Length", 0)); body = self.rfile.read(n).decode("utf-8")
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, "w", encoding="utf-8") as f: f.write(body)
        return self._json(200, {"ok": True})
    def do_DELETE(self):
        full = safe_note_path(self.path[len("/api/notes/"):]) if self.path.startswith("/api/notes/") else None
        if not full or not os.path.exists(full): return self._json(404, {"error": "not found"})
        os.remove(full); return self._json(200, {"ok": True})

if __name__ == "__main__":
    print(f"Deception Lab  ->  http://localhost:{PORT}   (notes in {NOTES}, projects in {PROJECTS})")
    HTTPServer(("127.0.0.1", PORT), H).serve_forever()
