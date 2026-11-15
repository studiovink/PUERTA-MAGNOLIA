import { useEffect, useState } from 'react';
import { site } from '../content';
import wordmark from '../assets/wordmark.svg?raw';

const MIN_MS = 1900; // duración mínima de la entrada
const MAX_MS = 4500; // tope si la foto de portada tarda en cargar

/**
 * Entrada del sitio: pantalla tinta con la marca subiendo letra por letra y un contador.
 * Espera a que cargue la foto de portada y se retira como un telón. Mientras tanto la
 * portada queda en pausa (clase is-loaded en <html>), para que su animación empiece al abrirse.
 * No aparece si la persona pidió reducir el movimiento.
 */
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
      <div className="opening__mark" dangerouslySetInnerHTML={{ __html: wordmark }} />
      <div className="opening__foot">
        <span>{site.descriptor}</span>
        <span className="opening__count">{String(count).padStart(3, '0')}</span>
      </div>
    </div>
  );
}
