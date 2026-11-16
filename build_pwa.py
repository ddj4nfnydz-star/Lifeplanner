#!/usr/bin/env python3
"""Baut pwa/index.html aus app.html (Quelle) und kopiert optional ins GitHub-Repo.

Nutzung:
  python3 build_pwa.py                 # nur pwa/index.html neu bauen
  python3 build_pwa.py /pfad/zum/repo  # zusätzlich pwa/* ins Repo kopieren (dann committen + pushen)

Hosting: https://ddj4nfnydz-star.github.io/lifeplanner/ (Repo ddj4nfnydz-star/lifeplanner, Branch main).
Nach Änderungen an Dateien, die gecacht werden, CACHE in sw.js hochzählen.
"""
import pathlib, re, shutil, sys

HERE = pathlib.Path(__file__).resolve().parent
HEAD = """<!doctype html>
<html lang="de"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Lifeplanner">
<meta name="theme-color" content="#FFFFFF">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-192.png">
"""
SAFE = '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}</style>\n</head><body>'
TAIL = '\n\n<script>if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});</script>\n</body></html>'

src = (HERE / "app.html").read_text(encoding="utf-8")
src = re.sub(r'<meta name="claude:viewport-fit-sides"[^>]*>\n?', "", src, count=1)
i = src.index("</style>") + len("</style>")
out = HEAD + src[:i] + "\n\n" + SAFE + "\n" + src[i:].lstrip("\n").rstrip("\n") + TAIL
(HERE / "pwa" / "index.html").write_text(out, encoding="utf-8")
print("pwa/index.html gebaut,", len(out), "Bytes")

if len(sys.argv) > 1:
    repo = pathlib.Path(sys.argv[1])
    for f in (HERE / "pwa").iterdir():
        shutil.copy2(f, repo / f.name)
    print("kopiert nach", repo)
