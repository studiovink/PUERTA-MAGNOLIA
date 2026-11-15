import { useEffect, useState } from 'react';
import { site } from '../content';
import wordmark from '../assets/wordmark.svg?raw';

const MIN_MS = 3000; // duración mínima de la entrada
const MAX_MS = 5500; // tope si la foto de portada tarda en cargar

/**
 * Entrada del sitio: sobre una pantalla tinta se dibuja un escudo (balanza, laureles y
 * blasón) trazo por trazo, sube la marca letra por letra y corre un contador.
 * Espera a que cargue la foto de portada y se retira como un telón. Mientras tanto la
 * portada queda en pausa (clase is-loaded en <html>), para que su animación empiece al abrirse.
 * No aparece si la persona pidió reducir el movimiento.
 */
/** Laurel: hojas en pares a lo largo de un arco que rodea el escudo. */
function Laurel({ mirror }: { mirror?: boolean }) {
  const cx = 120, cy = 146, R = 127, N = 10;
  const leaves = [];
  for (let i = 0; i < N; i++) {
    const deg = 246 - (i / (N - 1)) * 96;
    const t = (deg * Math.PI) / 180;
    const x = cx + R * Math.cos(t);
    const y = cy - R * Math.sin(t);
    const tan = [Math.sin(t), Math.cos(t)];
    const rad = [Math.cos(t), -Math.sin(t)];
    for (const side of [1, -1]) {
      const dx = tan[0] * 0.8 + rad[0] * 0.62 * side;
      const dy = tan[1] * 0.8 + rad[1] * 0.62 * side;
      const rot = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const size = 0.72 + (i / (N - 1)) * 0.34;
      leaves.push(
        <g key={`${i}${side}`} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${size.toFixed(2)})`}>
          <path className="crest__leaf" style={{ ['--d' as string]: `${900 + i * 70}ms` }} d="M0 0C6.5-6 6.5-17 0-25C-6.5-17-6.5-6 0 0Z" />
        </g>,
      );
    }
  }
  const a0 = (246 * Math.PI) / 180, a1 = (150 * Math.PI) / 180;
  const stem = `M${(cx + R * Math.cos(a0)).toFixed(1)} ${(cy - R * Math.sin(a0)).toFixed(1)}A${R} ${R} 0 0 1 ${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy - R * Math.sin(a1)).toFixed(1)}`;
  return (
    <g transform={mirror ? 'translate(240 0) scale(-1 1)' : undefined}>
      <path className="crest__line" pathLength={1} style={{ ['--d' as string]: '700ms' }} d={stem} />
      {leaves}
    </g>
  );
}

/** Escudo dibujado a línea: blasón doble, balanza de la justicia y laureles. */
function Crest() {
  const line = (d: string, delay: number, thin = false) => (
    <path className={`crest__line${thin ? ' crest__line--thin' : ''}`} pathLength={1} style={{ ['--d' as string]: `${delay}ms` }} d={d} />
  );
  return (
    <svg className="crest" viewBox="-26 -22 292 318" fill="none">
      <Laurel />
      <Laurel mirror />
      {line('M120 14L206 40V128C206 190 168 236 120 262C72 236 34 190 34 128V40Z', 0)}
      {line('M120 28L194 50V128C194 182 161 223 120 247C79 223 46 182 46 128V50Z', 250, true)}
      {/* Balanza */}
      {line('M120 80V200', 500)}
      {line('M70 104Q120 88 170 104', 650)}
      {line('M70 104L54 146M70 104L86 146', 800, true)}
      {line('M170 104L154 146M170 104L186 146', 800, true)}
      {line('M48 146H92C92 160 82 168 70 168C58 168 48 160 48 146Z', 950)}
      {line('M148 146H192C192 160 182 168 170 168C158 168 148 160 148 146Z', 950)}
      {line('M100 200H140M92 210H148', 1100)}
      <circle className="crest__dot" style={{ ['--d' as string]: '1250ms' }} cx="120" cy="74" r="5" />
      {/* Estrella superior */}
      <path className="crest__dot" style={{ ['--d' as string]: '1400ms' }} d="M120-16l3.2 8.8 8.8 3.2-8.8 3.2-3.2 8.8-3.2-8.8-8.8-3.2 8.8-3.2Z" />
    </svg>
  );
}

export default function Opening() {
  const root = document.documentElement;
  const [phase, setPhase] = useState<'in' | 'out' | 'done'>(() => (root.classList.contains('motion') ? 'in' : 'done'));
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (phase !== 'in') return;
    document.body.style.overflow = 'hidden';
    const img = document.querySelector<HTMLImageElement>('.hero__picture img');
    let loaded = !img || img.complete;
    const onLoad = () => { loaded = true; };
    img?.addEventListener('load', onLoad);
    img?.addEventListener('error', onLoad);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / MIN_MS, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(Math.min(eased, loaded ? 1 : 0.92) * 100));
      if ((p >= 1 && loaded) || elapsed > MAX_MS) { setCount(100); setPhase('out'); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      img?.removeEventListener('load', onLoad);
      img?.removeEventListener('error', onLoad);
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'in') return;
    root.classList.add('is-loaded');
    if (phase !== 'out') return;
    const t = window.setTimeout(() => setPhase('done'), 1150);
    return () => window.clearTimeout(t);
  }, [phase, root]);

  if (phase === 'done') return null;
  return (
    <div className={`opening${phase === 'out' ? ' opening--out' : ''}`} aria-hidden="true" style={{ ['--p' as string]: count / 100 }}>
      <div className="opening__center">
        <Crest />
        <div className="opening__mark" dangerouslySetInnerHTML={{ __html: wordmark }} />
        <p className="opening__tag">Legal · Abogados</p>
      </div>
      <div className="opening__foot">
        <span>{site.name} {site.descriptor}</span>
        <span className="opening__count">{String(count).padStart(3, '0')}</span>
      </div>
    </div>
  );
}
