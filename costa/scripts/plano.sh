#!/usr/bin/env bash
# Genera dist-flat/: copia del sitio con rutas relativas y páginas en una sola carpeta,
# para vistas previas alojadas donde no hay rutas de servidor. Uso: bash scripts/plano.sh
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist-flat
PUBLIC_FLAT=1 npx astro build
cd dist-flat
mv residencias/*.html . && rmdir residencias
rm -f 404.html
mv _astro/*.js site.js && rmdir _astro
python3 - <<'PY'
import glob, re
for f in glob.glob('*.html'):
    s = open(f).read()
    s = re.sub(r'_astro/[^"]+\.js', 'site.js', s).replace('"/site.js', '"site.js')
    s = s.replace("url('/fonts/", "url('fonts/").replace('url(/fonts/', 'url(fonts/').replace('url("/fonts/', 'url("fonts/')
    if f == 'index.html':
        head = re.search(r'<head>(.*?)</head>', s, re.S).group(1)
        body = re.search(r'<body[^>]*>(.*)</body>', s, re.S).group(1)
        head = re.sub(r'<meta charset[^>]*>|<meta name="viewport"[^>]*>', '', head)
        s = head + body
    left = re.findall(r'(?:href|src|srcset)="/[^"]{0,40}|url\(/[^)]{0,40}', s)
    print(f, len(s), 'rutas absolutas restantes:', left[:4])
    open(f, 'w').write(s)
PY
