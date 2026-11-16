#!/usr/bin/env python3
"""Read-only, bounded project inventory. Not a runtime/accessibility score."""
import argparse
import json
import os
from pathlib import Path

SKIP = {'node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.venv', 'vendor'}
WEB = {'.html', '.jsx', '.tsx', '.vue', '.svelte', '.astro', '.css', '.js', '.ts', '.mjs'}
MEDIA = {'.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg', '.mp4', '.webm', '.glb', '.gltf'}

def audit(root):
    if not root.is_dir():
        raise ValueError('La ruta debe ser una carpeta existente')
    manifest = root / 'package.json'
    package = {}
    if manifest.is_file():
        package = json.loads(manifest.read_text(encoding='utf-8'))
    deps = {**package.get('dependencies', {}), **package.get('devDependencies', {})}
    frameworks = [name for name in ('next', 'react', 'vue', 'astro', 'svelte', 'vite') if name in deps]
    animation = [name for name in ('gsap', 'motion', 'framer-motion', 'three', '@react-three/fiber', '@splinetool/react-spline') if name in deps]
    pages, media, signals = [], [], set()
    scanned = 0
    truncated = False
    for directory, folders, files in os.walk(root, followlinks=False):
        folders[:] = sorted(folder for folder in folders
                            if folder not in SKIP and not folder.startswith('.')
                            and not (Path(directory) / folder).is_symlink())
        for name in sorted(files):
            if name.startswith('.'):
                continue
            path = Path(directory) / name
            rel = path.relative_to(root)
            if path.is_symlink() or not path.is_file():
                continue
            if scanned >= 800:
                truncated = True
                break
            scanned += 1
            if path.suffix.lower() in MEDIA:
                media.append(str(rel))
            if path.suffix.lower() not in WEB:
                continue
            pages.append(str(rel))
            if path.stat().st_size > 200_000:
                continue
            text = path.read_text(encoding='utf-8', errors='replace')
            for needle in ('prefers-reduced-motion', 'ScrollTrigger', 'useScroll', 'whileHover', 'IntersectionObserver', 'data-vink-'):
                if needle in text:
                    signals.add(needle)
        if truncated:
            break
    return {
        'frameworks': frameworks or ['sin detectar; inspeccionar archivos'],
        'animation_dependencies': animation,
        'available_scripts': sorted(package.get('scripts', {})),
        'source_files': pages[:100],
        'media_files': media[:80],
        'motion_signals': sorted(signals),
        'truncated': truncated or len(pages) > 100 or len(media) > 80,
        'note': 'Inventario estático orientativo; verificar comportamiento en navegador.',
    }

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('project', type=Path)
    args = parser.parse_args()
    try:
        print(json.dumps(audit(args.project.resolve()), ensure_ascii=False, indent=2))
    except (ValueError, OSError) as error:
        parser.exit(1, f'No se pudo inspeccionar el proyecto: {error}\n')

if __name__ == '__main__':
    main()
