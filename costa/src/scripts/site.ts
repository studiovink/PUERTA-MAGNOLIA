/*
 * Movimiento e interacción. Sin dependencias: HTML, CSS y Web Animations API.
 * Los tiempos viven en src/data/site.ts (MOTION); la guía, en docs/MOTION_SPEC.md.
 */
import { FLAT, MOTION, RESIDENCIAS, src, srcset, url } from '../data/site';
import { setupMotion } from './motion';
import { initControls } from './vink-controls.mjs';

const root = document.documentElement;
const q = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = document) => el.querySelector<T>(sel);
const qa = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(sel));

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let reduced = motionQuery.matches;
const isSmall = () => window.innerWidth <= 767;

const page = q('main')!;
const footer = q('.footer');
const nav = q('.nav')!;
const hero = q('[data-hero]');
const heroImage = q<HTMLImageElement>('#hero-photo');

function play(el: Element | null, keyframes: Keyframe[], options: KeyframeAnimationOptions = {}) {
  if (!el || typeof el.animate !== 'function') return null;
  return el.animate(keyframes, {
    duration: 800,
    easing: MOTION.ease,
    fill: 'both',
    ...options,
    ...(reduced ? { duration: 1, delay: 0 } : {}),
  });
}
const finished = (a: Animation | null) => (a ? a.finished.then(() => {}, () => {}) : Promise.resolve());
/** Deja el estado final en los estilos propios del elemento y libera la animación. */
function release(a: Animation | null) {
  if (!a) return;
  a.finished.then(() => a.cancel(), () => {});
}
function loadImage(source: string, timeout = 4500) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    let done = false;
    const complete = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(complete, timeout);
    image.onload = complete;
    image.onerror = complete;
    image.src = source;
    if (image.complete) complete();
  });
}
function setInert(on: boolean) {
  page.inert = on;
  if (footer) footer.inert = on;
}

/* ---------- Portada: aparición ---------- */
function revealHero(zoom = true) {
  root.classList.remove('is-booting', 'is-entering');
  if (reduced) return;
  release(play(nav, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 70 }));
  if (!hero) return;
  if (zoom) release(play(heroImage, [{ transform: 'scale(1.045)' }, { transform: 'scale(1)' }], { duration: MOTION.heroZoom }));
  release(play(q('.hero-shade', hero), [{ opacity: 0 }, { opacity: 1 }], { duration: 700 }));
  release(play(q('.hero-corner', hero), [{ opacity: 0 }, { opacity: 0.9 }], { duration: 700, delay: 110 }));
  heroTitle();
  release(play(q('.hero-meta', hero), [{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 0.92, transform: 'none' }], { duration: 700, delay: 360 }));
  release(play(q('.hero-side', hero), [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 300 }));
  release(play(q('.hero-rail', hero), [{ opacity: 0, transform: 'translateY(42px)' }, { opacity: 1, transform: 'none' }], { duration: 850, delay: 300 }));
}

/** Parte el título de portada en letras que suben con un leve giro, una tras otra. */
function heroTitle(texts?: [string, string]) {
  if (!hero) return;
  const lines = [q('.hero-title', hero), q('.hero-location', hero)];
  const h1 = q('h1', hero);
  lines.forEach((line, i) => {
    if (!line) return;
    const text = texts?.[i] ?? line.textContent ?? '';
    if (reduced) {
      line.textContent = text;
      return;
    }
    line.textContent = '';
    Array.from(text).forEach((char, j) => {
      const span = document.createElement('span');
      span.className = 'hc';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = char === ' ' ? '\u00a0' : char;
      line.appendChild(span);
      release(
        play(span, [{ transform: 'translateY(118%) rotate(9deg)' }, { transform: 'none' }], {
          duration: MOTION.titleReveal,
          delay: 110 + i * 140 + j * 26,
        }),
      );
    });
  });
  h1?.setAttribute('aria-label', lines.map((l) => l?.textContent?.replace(/\u00a0/g, ' ') ?? '').join(' '));
}

/* ---------- Introducción ---------- */
const intro = q('.intro');
const introAnimations: (Animation | null)[] = [];
let introDone = !root.classList.contains('is-booting');

function finishIntro(zoom = false) {
  if (introDone) return;
  introDone = true;
  try {
    sessionStorage.setItem('intro', '1');
  } catch {
    /* almacenamiento no disponible */
  }
  if (intro) intro.hidden = true;
  setInert(false);
  nav.inert = false;
  revealHero(zoom);
}
function skipIntro() {
  if (introDone) return;
  introAnimations.forEach((a) => a?.cancel());
  finishIntro(true);
}
async function runIntro() {
  if (!intro || reduced || typeof intro.animate !== 'function') {
    finishIntro(true);
    return;
  }
  setInert(true);
  nav.inert = true;
  const cards = qa('.intro-card', intro);
  const heroCard = q('.intro-hero', intro)!;
  const heroCardImage = q<HTMLImageElement>('img', heroCard)!;
  const sources = [heroImage?.currentSrc || heroImage?.src || '', ...cards.map((c) => q<HTMLImageElement>('img', c)!.src)].filter(Boolean);
  await Promise.all(sources.map((s) => loadImage(s, 2600)));
  if (typeof heroCardImage.decode === 'function') await Promise.race([heroCardImage.decode().catch(() => {}), new Promise((r) => setTimeout(r, 1200))]);
  if (introDone) return;

  const small = isSmall();
  const angles = small ? [-4, 4, -3] : [-7, 6, -5];
  const center = 'translate3d(-50%,-50%,0)';
  cards.forEach((card, i) => {
    const a = angles[i];
    const last = i === 0; // la primera cruza y sale; las otras dos se apilan y esperan a la portada
    const frames: Keyframe[] = last
      ? [
          { offset: 0, opacity: 0, transform: `translate3d(-50%,70vh,0) rotateX(12deg) rotateY(${a}deg) rotateZ(${a}deg) scale(.82)` },
          { offset: 0.2, opacity: 1 },
          { offset: 0.5, opacity: 1, transform: `translate3d(-50%,-58%,0) rotateX(3deg) rotateY(${-a / 2}deg) rotateZ(${a / 2}deg) scale(.94)` },
          { offset: 0.85, opacity: 1 },
          { offset: 1, opacity: 0, transform: `translate3d(-50%,-190%,0) rotateX(-6deg) rotateY(0deg) rotateZ(${-a}deg) scale(1)` },
        ]
      : [
          { offset: 0, opacity: 0, transform: `translate3d(-50%,70vh,0) rotateX(12deg) rotateY(${a}deg) rotateZ(${a}deg) scale(.84)` },
          { offset: 0.25, opacity: 1 },
          { offset: 0.7, opacity: 1, transform: `${center} rotateX(2deg) rotateY(${-a / 3}deg) rotateZ(${a / 1.6}deg) scale(1)` },
          { offset: 1, opacity: 1, transform: `${center} rotateX(0deg) rotateY(0deg) rotateZ(${a / 2}deg) scale(1.02)` },
        ];
    introAnimations.push(play(card, frames, { duration: last ? MOTION.introCard * 1.15 : MOTION.introCard, delay: i * MOTION.introStagger, easing: 'cubic-bezier(.45,0,.18,1)' }));
  });

  // La portada llega como una fotografía más y crece hasta llenar la ventana.
  const first = cards[1].getBoundingClientRect();
  const cardW = cards[1].offsetWidth || first.width;
  const cardH = cards[1].offsetHeight || first.height;
  const scale = Math.min(0.9, (cardW / window.innerWidth) * 1.02);
  const insetY = Math.max(0, (1 - cardH / (window.innerHeight * scale)) / 2) * 100;
  const clip = `inset(${insetY.toFixed(2)}% 0% round 10px)`;
  const total = MOTION.introHeroTravel + 120 + MOTION.introHeroExpand;
  const land = MOTION.introHeroTravel / total;
  const hold = (MOTION.introHeroTravel + 120) / total;
  const heroAnimation = play(
    heroCard,
    [
      { offset: 0, opacity: 1, clipPath: clip, transform: `translateY(${112 - insetY}vh) rotate(${small ? 4 : 6}deg) scale(${scale * 0.9})`, easing: 'cubic-bezier(.3,0,.2,1)' },
      { offset: land, opacity: 1, clipPath: clip, transform: `translateY(0) rotate(${small ? -2 : -3}deg) scale(${scale})`, easing: 'linear' },
      { offset: hold, opacity: 1, clipPath: clip, transform: `translateY(0) rotate(${small ? -2 : -3}deg) scale(${scale})`, easing: 'cubic-bezier(.7,0,.2,1)' },
      { offset: 1, opacity: 1, clipPath: 'inset(0% 0% round 0px)', transform: 'translateY(0) rotate(0deg) scale(1)' },
    ],
    { duration: total, delay: MOTION.introHeroDelay, easing: 'linear' },
  );
  introAnimations.push(heroAnimation);
  await finished(heroAnimation);
  finishIntro(false);
}

/* ---------- Franja de espacios ---------- */
function setupRail() {
  const rail = q('.photo-rail');
  if (!rail) return;
  const cards = qa('.space-card', rail);
  const set = (index: number) =>
    cards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
      card.setAttribute('aria-pressed', String(i === index));
    });
  cards.forEach((card, i) => {
    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') set(i);
    });
    card.addEventListener('focus', () => set(i));
    card.addEventListener('click', () => {
      // En la ficha, la tarjeta abre la fotografía; en inicio, el toque la despliega o la recoge.
      if (card.dataset.open) return;
      const wasActive = card.classList.contains('active') && card.dataset.touched === '1';
      cards.forEach((c) => delete c.dataset.touched);
      if (wasActive) set(-1);
      else {
        set(i);
        card.dataset.touched = '1';
      }
    });
  });
  // Mientras nadie la toca, la franja se despliega sola para invitar a explorarla.
  let auto = !reduced;
  let turn = -1;
  const stop = () => {
    auto = false;
  };
  rail.addEventListener('pointerenter', stop);
  rail.addEventListener('focusin', stop);
  rail.addEventListener('pointerdown', stop);
  window.setInterval(() => {
    if (!auto || document.hidden || root.classList.contains('is-booting') || root.classList.contains('menu-open')) return;
    if (window.scrollY > window.innerHeight * 0.5) return;
    turn = (turn + 1) % (cards.length + 1);
    set(turn === cards.length ? -1 : turn);
  }, 2200);
  rail.addEventListener('pointerleave', (e) => {
    if ((e as PointerEvent).pointerType === 'mouse' && !rail.contains(document.activeElement)) set(-1);
  });
  rail.addEventListener('focusout', (e) => {
    if (!rail.contains((e as FocusEvent).relatedTarget as Node | null)) set(-1);
  });
}

/* ---------- Cambio de residencia en la portada de inicio ---------- */
function setupSwitch() {
  const buttons = qa<HTMLButtonElement>('[data-switch]');
  if (!buttons.length || !hero || !heroImage) return;
  const mobileSource = q<HTMLSourceElement>('.hero-mobile-source', hero)!;
  let active = 0;
  let switching = false;
  buttons.forEach((button) =>
    button.addEventListener('click', async () => {
      const index = Number(button.dataset.switch);
      const item = RESIDENCIAS[index];
      if (switching || index === active || !item) return;
      switching = true;
      try {
        const next = isSmall() ? item.heroMovil : item.hero;
        const width = Math.min(window.innerWidth * window.devicePixelRatio, 3840);
        const candidates = isSmall() ? [900, 1290, 2160] : [1280, 1920, 3840];
        await loadImage(src(next, candidates.find((w) => w >= width) ?? candidates[2]));
        await finished(play(heroImage, [{ opacity: 1 }, { opacity: 0 }], { duration: MOTION.switchOut, easing: 'ease' }));
        active = index;
        mobileSource.srcset = srcset(item.heroMovil);
        heroImage.srcset = srcset(item.hero);
        heroImage.src = src(item.hero);
        heroImage.alt = item.hero.alt;
        hero.dataset.residencia = item.id;
        heroTitle([`${item.title},`, item.region]);
        qa('.space-card', hero).forEach((card, i) => {
          const foto = item.espacios[i];
          const image = q<HTMLImageElement>('img', card)!;
          image.srcset = srcset(foto);
          image.src = src(foto);
          image.alt = foto.alt;
          image.style.objectPosition = foto.position ?? '';
          q('.space-label', card)!.textContent = foto.label;
          card.setAttribute('aria-label', `Ampliar vista de ${foto.label.toLowerCase()}`);
          card.classList.remove('active');
          card.setAttribute('aria-pressed', 'false');
        });
        q<HTMLAnchorElement>('[data-explorar]', hero)!.href = url(`/residencias/${item.id}`);
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.switch) === index)));
        if (typeof heroImage.decode === 'function') await heroImage.decode().catch(() => {});
        release(play(heroImage, [{ opacity: 0 }, { opacity: 1 }], { duration: MOTION.switchIn, easing: 'ease' }));
        release(play(q('.hero-copy', hero), [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 650 }));
        release(play(q('.photo-rail', hero), [{ opacity: 0.4 }, { opacity: 1 }], { duration: 650 }));
      } finally {
        switching = false;
      }
    }),
  );
}

/* ---------- Menú ---------- */
function setupMenu() {
  const menu = q('.menu-pane');
  const toggle = q<HTMLButtonElement>('.menu-toggle');
  if (!menu || !toggle) return;
  const label = q('.menu-toggle-label', toggle)!;
  let open = false;
  let version = 0;
  let animation: Animation | null = null;
  const links = () => qa<HTMLAnchorElement>('nav a', menu);
  const focusables = () => [...links(), ...qa<HTMLAnchorElement>('.menu-contact a', menu), toggle];

  function openMenu() {
    const v = ++version;
    open = true;
    menu!.hidden = false;
    root.classList.add('menu-open', 'is-locked');
    setInert(true);
    toggle!.setAttribute('aria-expanded', 'true');
    toggle!.setAttribute('aria-label', 'Cerrar menú');
    label.textContent = 'Cerrar';
    animation?.cancel();
    animation = play(menu, [{ clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)' }], { duration: MOTION.menuOpen });
    links().forEach((link, i) => {
      release(play(link.firstElementChild, [{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: MOTION.menuLink, delay: MOTION.menuLinkDelay + i * MOTION.menuLinkStagger }));
    });
    release(play(q('.menu-contact', menu!), [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: MOTION.menuLink, delay: MOTION.menuLinkDelay + 120 }));
    finished(animation).then(() => {
      if (open && version === v && !menu!.contains(document.activeElement)) links()[0]?.focus({ preventScroll: true });
    });
  }
  async function closeMenu(restoreFocus = true) {
    if (!open) return;
    const v = ++version;
    open = false;
    root.classList.remove('menu-open');
    toggle!.setAttribute('aria-expanded', 'false');
    toggle!.removeAttribute('aria-label');
    label.textContent = 'Menú';
    animation?.cancel();
    animation = play(menu, [{ clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)' }], { duration: MOTION.menuClose });
    await finished(animation);
    if (version !== v || open) return;
    menu!.hidden = true;
    setInert(false);
    root.classList.remove('is-locked');
    if (restoreFocus) toggle!.focus({ preventScroll: true });
  }
  toggle.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  qa<HTMLAnchorElement>('a', menu).forEach((link) =>
    link.addEventListener('click', async (event) => {
      const target = samePageTarget(link);
      if (target === undefined) return; // otra página: lo resuelve la cortina
      event.preventDefault();
      event.stopPropagation();
      await closeMenu(false);
      scrollToTarget(target, link.hash);
    }),
  );
  document.addEventListener('keydown', (event) => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* ---------- Navegación entre secciones y páginas ---------- */
const samePath = (a: string, b: string) => a.replace(/\/$/, '') === b.replace(/\/$/, '');
/** null = inicio de esta página; elemento = ancla en esta página; undefined = otra página. */
function samePageTarget(link: HTMLAnchorElement): HTMLElement | null | undefined {
  const flatHome = FLAT && !!document.getElementById('coleccion') && link.pathname.endsWith('/index.html');
  if (link.origin !== location.origin || (!samePath(link.pathname, location.pathname) && !flatHome)) return undefined;
  if (!link.hash) return null;
  return document.getElementById(decodeURIComponent(link.hash.slice(1))) ?? null;
}
function scrollToTarget(target: HTMLElement | null, hash = '') {
  const behavior: ScrollBehavior = reduced ? 'auto' : 'smooth';
  if (!target) {
    window.scrollTo({ top: 0, behavior });
    history.replaceState(null, '', location.pathname);
    return;
  }
  target.scrollIntoView({ behavior });
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (hash) history.replaceState(null, '', hash);
}
function setupLinks() {
  const curtain = q('.cortina');
  let leaving = false;
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest?.('a');
    if (!link || link.target || link.hasAttribute('download') || link.origin !== location.origin) return;
    const target = samePageTarget(link);
    if (target !== undefined) {
      if (link.pathname === location.pathname && link.getAttribute('href')?.startsWith('#') && !target) return;
      event.preventDefault();
      scrollToTarget(target, link.hash);
      return;
    }
    if (reduced || !curtain || leaving) return;
    event.preventDefault();
    leaving = true;
    const go = () => {
      location.href = link.href;
    };
    const a = play(curtain, [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: MOTION.pageLeave });
    finished(a).then(go);
    setTimeout(go, MOTION.pageLeave + 400);
  });
  // Al volver con el historial, la página guardada no debe quedar tapada.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    leaving = false;
    curtain?.getAnimations().forEach((a) => a.cancel());
    root.classList.remove('is-booting', 'is-entering');
  });
}

/* ---------- Scroll: títulos y bloques ---------- */
function splitHeading(heading: HTMLElement) {
  const lines = qa('.line', heading);
  const label = (lines.length ? lines.map((l) => l.textContent!.trim()).join(' ') : heading.textContent!.trim()).replace(/\s+/g, ' ');
  heading.setAttribute('aria-label', label);
  let index = 0;
  (lines.length ? lines : [heading]).forEach((line) => {
    const words = line.textContent!.trim().split(/\s+/);
    line.textContent = '';
    line.setAttribute('aria-hidden', 'true');
    words.forEach((word, i) => {
      const outer = document.createElement('span');
      outer.className = 'w';
      for (const char of Array.from(word)) {
        const span = document.createElement('span');
        span.className = 'c';
        span.textContent = char;
        span.style.setProperty('--d', `${Math.min(index++ * 11, 420)}ms`);
        outer.appendChild(span);
      }
      line.appendChild(outer);
      if (i < words.length - 1) line.appendChild(document.createTextNode(' '));
    });
  });
}
function setupReveals() {
  const blocks = qa('.reveal, .wipe');
  const headings = qa('.split');
  if (reduced || !('IntersectionObserver' in window)) {
    blocks.forEach((el) => el.classList.add('in', 'done'));
    return;
  }
  headings.forEach(splitHeading);
  const observer = new IntersectionObserver(
    (entries) => {
      // Los bloques que entran a la vez se escalonan ligeramente.
      let order = 0;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        observer.unobserve(el);
        if (el.classList.contains('reveal') || el.classList.contains('wipe')) {
          el.style.setProperty('--d', `${Math.min(order++, 4) * 80}ms`);
          setTimeout(() => el.classList.add('done'), 1800);
        }
        el.classList.add('in');
      });
    },
    { threshold: 0.13 },
  );
  [...blocks, ...headings].forEach((el) => observer.observe(el));
}

/* ---------- Acordeones ---------- */
function setupFAQ() {
  qa<HTMLDetailsElement>('.faq details').forEach((details) => {
    const summary = q('summary', details)!;
    const answer = q('.answer', details)!;
    let animation: Animation | null = null;
    let opening = false;
    summary.addEventListener('click', (event) => {
      if (reduced || typeof answer.animate !== 'function') return;
      event.preventDefault();
      const from = details.open ? answer.getBoundingClientRect().height : 0;
      animation?.cancel();
      opening = !details.open || (animation !== null && !opening);
      if (opening) {
        details.open = true;
        details.classList.remove('is-closing');
        details.classList.add('is-open');
      } else {
        details.classList.add('is-closing');
      }
      const to = opening ? answer.scrollHeight : 0;
      const current = animation = answer.animate(
        [
          { height: `${from}px`, opacity: opening ? 0 : 1 },
          { height: `${to}px`, opacity: opening ? 1 : 0 },
        ],
        { duration: opening ? MOTION.accordionOpen : MOTION.accordionClose, easing: MOTION.ease },
      );
      current.onfinish = () => {
        if (animation !== current) return;
        animation = null;
        if (!opening) details.open = false;
        details.classList.remove('is-closing', 'is-open');
      };
    });
  });
}

/* ---------- Galería de la ficha ---------- */
function setupLightbox() {
  const dialog = q<HTMLDialogElement>('.lightbox');
  const items = qa<HTMLButtonElement>('[data-lightbox]');
  if (!dialog || !items.length || typeof dialog.showModal !== 'function') return;
  const image = q<HTMLImageElement>('.lightbox-img', dialog)!;
  const count = q('.lightbox-count', dialog)!;
  let index = 0;
  let opener: HTMLElement | null = null;
  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    const thumb = q<HTMLImageElement>('img', item)!;
    // Primero la versión ya descargada; la 4K entra cuando termina de cargar.
    image.classList.add('cargando');
    image.src = thumb.currentSrc || thumb.src;
    image.alt = item.dataset.alt ?? '';
    image.width = Number(item.dataset.w);
    image.height = Number(item.dataset.h);
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    const fullSrc = item.dataset.full!;
    const wanted = index;
    loadImage(fullSrc, 15000).then(() => {
      if (wanted !== index || !dialog.open) return;
      image.src = fullSrc;
      image.classList.remove('cargando');
    });
  };
  const openAt = (i: number, from: HTMLElement) => {
    opener = from;
    dialog.showModal();
    root.classList.add('is-locked');
    show(i);
  };
  items.forEach((item, i) => item.addEventListener('click', () => openAt(i, item)));
  qa('[data-open]').forEach((card) => card.addEventListener('click', () => openAt(Number(card.dataset.open), card)));
  qa('[data-dir]', dialog).forEach((b) => b.addEventListener('click', () => show(index + Number(b.dataset.dir))));
  q('.lightbox-close', dialog)!.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  dialog.addEventListener('close', () => {
    if (!root.classList.contains('menu-open')) root.classList.remove('is-locked');
    opener?.focus({ preventScroll: true });
  });
}

/* ---------- Filtro de espacios y comparador (controles de VINK Web Interactiva) ---------- */
function setupControls() {
  initControls(document.documentElement);

  // Al cambiar el filtro, las vistas que quedan entran escalonadas.
  qa('[data-vink-filter-group]').forEach((group) => {
    let first = true;
    const enter = () => {
      if (first) {
        first = false;
        return;
      }
      qa('[data-vink-filter-item]', group)
        .filter((item) => !item.hidden)
        .forEach((item, i) => {
          release(play(item, [{ opacity: 0, transform: 'translateY(26px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 620, delay: Math.min(i, 9) * 45 }));
        });
    };
    first = false;
    group.addEventListener('vink:layout', enter);
  });

  // El comparador también se arrastra directamente sobre la fotografía.
  qa('[data-vink-compare]').forEach((compare) => {
    const stage = q('.vink-compare-stage', compare);
    const range = q<HTMLInputElement>('[data-vink-compare-range]', compare);
    if (!stage || !range) return;
    const set = (event: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      range.value = String(Math.round(((event.clientX - box.left) / box.width) * 100));
      range.dispatchEvent(new Event('input', { bubbles: true }));
    };
    stage.addEventListener('pointerdown', (event) => {
      stage.setPointerCapture(event.pointerId);
      stage.classList.add('arrastrando');
      set(event);
    });
    stage.addEventListener('pointermove', (event) => {
      if (stage.hasPointerCapture(event.pointerId)) set(event);
    });
    const end = (event: PointerEvent) => {
      stage.classList.remove('arrastrando');
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
  });
}

/* ---------- Estado de la navegación ---------- */
function setupNav() {
  if (!hero) return;
  const update = () => nav.classList.toggle('on-paper', window.scrollY > hero.offsetHeight - 70);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

motionQuery.addEventListener?.('change', (event) => {
  reduced = event.matches;
  if (reduced) {
    skipIntro();
    qa('.reveal').forEach((el) => el.classList.add('in', 'done'));
    qa('.split').forEach((el) => el.classList.add('in'));
  }
});

q('.skip-intro')?.addEventListener('click', skipIntro);
q('.skip-link')?.addEventListener('click', skipIntro);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') skipIntro();
});

// Si la portada no llega, queda el color de fondo en lugar de un icono roto.
heroImage?.addEventListener('error', () => {
  heroImage.style.visibility = 'hidden';
});
heroImage?.addEventListener('load', () => {
  heroImage.style.visibility = '';
});

setupNav();
setupRail();
setupSwitch();
setupMenu();
setupLinks();
setupReveals();
setupFAQ();
setupLightbox();
setupControls();
setupMotion();

if (root.classList.contains('is-booting')) runIntro().catch(() => finishIntro(true));
else revealHero(true);
