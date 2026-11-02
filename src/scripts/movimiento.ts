// Movimiento del sitio: scroll nativo suavizado (Lenis) + GSAP/ScrollTrigger.
// Nunca se bloquea la rueda: los "capítulos" usan pin + scrub solo en escritorio.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'expo.out';

// ---------- Entrada: la puerta se abre (animación CSS en Intro.astro) ----------
function intro(): Promise<void> {
  if (!root.classList.contains('con-intro')) return Promise.resolve();
  return new Promise((resolve) => addEventListener('pm-intro-fin', () => resolve(), { once: true }));
}

// ---------- Scroll suave ----------
let lenis: Lenis | null = null;
function scrollSuave() {
  if (reduce) return;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as any).__lenis = lenis;
}

// ---------- Títulos que emergen ----------
function titulos() {
  document.querySelectorAll<HTMLElement>('[data-titulo]').forEach((el) => {
    const porLetra = el.dataset.titulo === 'letras';
    SplitText.create(el, {
      type: porLetra ? 'chars,lines' : 'lines',
      mask: 'lines',
      autoSplit: true,
      linesClass: 'linea-split',
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(porLetra ? self.chars : self.lines, {
          yPercent: 105,
          duration: porLetra ? 1.1 : 1.2,
          ease: EASE,
          stagger: porLetra ? 0.035 : 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });
}

// ---------- Revelados ----------
function revelados() {
  ScrollTrigger.batch('[data-revela]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1, ease: EASE, stagger: 0.08, overwrite: true }),
  });
  document.querySelectorAll<HTMLElement>('[data-foto]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
    if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: EASE }, 0.1);
  });
}

// ---------- Parallax leve ----------
function parallax(mm: gsap.MatchMedia) {
  mm.add('(min-width: 900px)', () => {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const d = parseFloat(el.dataset.parallax || '8');
      gsap.fromTo(el, { yPercent: -d / 2 }, {
        yPercent: d / 2, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  });
}

// ---------- Capítulos: foto a pantalla completa que se encoge a arco ----------
function capitulos(mm: gsap.MatchMedia) {
  mm.add('(min-width: 900px)', () => {
    document.querySelectorAll<HTMLElement>('[data-capitulo]').forEach((sec) => {
      const marco = sec.querySelector<HTMLElement>('[data-capitulo-foto]');
      const titulo = sec.querySelector<HTMLElement>('[data-capitulo-titulo]');
      const texto = sec.querySelectorAll<HTMLElement>('[data-capitulo-texto]');
      if (!marco) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sec, start: 'top top', end: '+=110%', scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(marco,
        { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' },
        { clipPath: 'inset(14% 34% 10% 34% round 999px 999px 0px 0px)', ease: 'power2.inOut', duration: 1 })
        .fromTo(marco.querySelector('img'), { scale: 1.08 }, { scale: 1, ease: 'none', duration: 1 }, 0)
        .to(titulo, { yPercent: 60, opacity: 0.0, ease: 'power1.in', duration: 0.6 }, 0.15)
        .fromTo(texto, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 }, 0.55);
    });
  });
}

// ---------- Botones magnéticos (solo puntero fino) ----------
function magneticos(mm: gsap.MatchMedia) {
  mm.add('(hover: hover) and (pointer: fine)', () => {
    const handlers: [HTMLElement, (e: PointerEvent) => void, () => void][] = [];
    document.querySelectorAll<HTMLElement>('[data-magnetico]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      };
      const leave = () => { xTo(0); yTo(0); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      handlers.push([el, move, leave]);
    });
    return () => handlers.forEach(([el, m, l]) => { el.removeEventListener('pointermove', m); el.removeEventListener('pointerleave', l); gsap.set(el, { x: 0, y: 0 }); });
  });
}

// ---------- Índice lateral de capítulos ----------
function indice() {
  const items = document.querySelectorAll<HTMLAnchorElement>('[data-indice] a');
  if (!items.length) return;
  items.forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href')!.replace('/', ''));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: (st) => { if (st.isActive) items.forEach((b) => b.toggleAttribute('aria-current', b === a)); },
    });
  });
}

// ---------- Pétalos (solo escritorio, decorativo) ----------
function petalos(mm: gsap.MatchMedia) {
  mm.add('(min-width: 1100px)', () => {
    document.querySelectorAll<HTMLElement>('[data-petalo]').forEach((p, i) => {
      gsap.fromTo(p, { y: -60, rotate: -20 + i * 15, opacity: 0 }, {
        y: 260 + i * 40, rotate: 40 + i * 25, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: p.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      });
    });
  });
}

// ---------- Inicio ----------
// Se reparte el trabajo en tramos para no bloquear el primer render (LCP/TBT en móvil).
const ceder = () => new Promise<void>((r) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(() => r(), { timeout: 200 }) : setTimeout(r, 1)));

function heroEntrada() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  gsap.fromTo(hero.querySelectorAll('[data-hero-in]'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.08, delay: 0.1 });
  hero.querySelectorAll<HTMLElement>('[data-titulo]').forEach((el) => {
    el.removeAttribute('data-titulo');
    SplitText.create(el, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, { yPercent: 105, duration: 1.2, ease: EASE, stagger: 0.09, delay: 0.05 });
      },
    });
  });
}

async function iniciar() {
  (window as any).__pm = true;
  if (reduce) {
    root.classList.remove('anima');
    return;
  }
  scrollSuave();
  const mm = gsap.matchMedia();
  await intro();
  heroEntrada();
  await ceder();
  revelados();
  await ceder();
  titulos();
  await ceder();
  parallax(mm);
  capitulos(mm);
  await ceder();
  magneticos(mm);
  petalos(mm);
  indice();
  ScrollTrigger.refresh();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
  addEventListener('pm-relayout', () => ScrollTrigger.refresh());
}

iniciar();

export { lenis };
