"""Simplifica los logos SVG vectorizados píxel a píxel (solo M/L/Z) con
Ramer-Douglas-Peucker. No cambia proporciones ni viewBox; reduce nodos.
Uso: python3 -I scripts/optimize-logos.py <dir_origen> <dir_destino>"""
import re, sys, pathlib

def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    stack = [(0, len(pts) - 1)]
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    while stack:
        s, e = stack.pop()
        ax, ay = pts[s]; bx, by = pts[e]
        dx, dy = bx - ax, by - ay
        n = (dx * dx + dy * dy) ** 0.5
        best, idx = -1, -1
        for i in range(s + 1, e):
            px, py = pts[i]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / n if n else ((px-ax)**2+(py-ay)**2) ** 0.5
            if d > best:
                best, idx = d, i
        if best > eps:
            keep[idx] = True
            stack += [(s, idx), (idx, e)]
    return [p for p, k in zip(pts, keep) if k]

def simplify(d, eps=0.75):
    out = []
    for sub in re.findall(r'M[^M]*', d):
        closed = 'Z' in sub
        nums = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', sub)))
        pts = list(zip(nums[0::2], nums[1::2]))
        if closed and len(pts) > 3:
            # partir el anillo en dos mitades para que RDP conserve forma
            h = len(pts) // 2
            a = rdp(pts[:h + 1], eps); b = rdp(pts[h:] + [pts[0]], eps)
            pts = a[:-1] + b[:-1]
        else:
            pts = rdp(pts, eps)
        if len(pts) < 3:
            continue
        s = 'M' + ' '.join(f'{x:.1f} {y:.1f}'.replace('.0 ', ' ').replace('.0', '') if False else f'{round(x,1):g} {round(y,1):g}' for x, y in pts[:1])
        s += 'L' + ' '.join(f'{round(x,1):g} {round(y,1):g}' for x, y in pts[1:])
        out.append(s + ('Z' if closed else ''))
    return ''.join(out)

src, dst = map(pathlib.Path, sys.argv[1:3])
dst.mkdir(parents=True, exist_ok=True)
for name in ['Centrado_Bicolor', 'Horizontal_Petroleo', 'Puerta_Petroleo']:
    t = (src / f'{name}.svg').read_text()
    vb = re.search(r'viewBox="([^"]+)"', t).group(1)
    paths = re.findall(r'<path d="([^"]+)"([^>]*)/>', t)
    parts = []
    for i, (d, rest) in enumerate(paths):
        rule = ' fill-rule="evenodd"' if 'evenodd' in rest else ''
        # 1er trazo = color principal (currentColor); 2º (descriptor del bicolor) = var de acento
        fill = 'currentColor' if i == 0 else 'var(--logo-acento, currentColor)'
        parts.append(f'<path d="{simplify(d)}" fill="{fill}"{rule}/>')
    out = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">' + ''.join(parts) + '</svg>'
    slug = {'Centrado_Bicolor': 'logo-centrado', 'Horizontal_Petroleo': 'logo-horizontal', 'Puerta_Petroleo': 'isotipo'}[name]
    (dst / f'{slug}.svg').write_text(out)
    print(slug, len(t), '->', len(out))
