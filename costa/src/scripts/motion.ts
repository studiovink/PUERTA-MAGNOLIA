/*
 * Capa de movimiento continuo: parallax, portada que responde al scroll y al puntero,
 * texto que se enciende al avanzar, marquesina, cursor contextual y contadores.
 * Todo lee el scroll nativo en un único requestAnimationFrame; nada lo secuestra.
 */
const qa = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(sel));
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/**
 * Recorrido fotográfico de la ficha: en pantallas amplias la galería queda fija y cada
 * fotografía se descubre sobre la anterior al avanzar el scroll; la primera crece desde
 * su marco hasta llenar la ventana. En móvil y con movimiento reducido es la galería normal.
 */
function setupRecorrido() {
  const section = document.querySelector<HTMLElement>('.galeria');
  const grid = section?.querySelector<HTMLElement>('.galeria-grid');
  if (!section || !grid) return null;
  const items = qa('.galeria-item', grid);
  if (items.length < 2) return null;
  const wide = window.matchMedia('(min-width: 1000px) and (min-height: 560px)');
  const STEP = 0.85; // fracción de la altura de la ventana por fotografía
  const FIRST = 0.7;
  const steps = FIRST + items.length - 1;
  const navHeight = () => document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 62;
  const counter = document.createElement('p');
  counter.className = 'recorrido-count';
  counter.setAttribute('aria-hidden', 'true');
  let on = false;
  let shown = -1;

  const layout = () => {
    if (!on) return;
    section.style.setProperty('--navh', `${navHeight()}px`);
    section.style.height = `${grid.offsetHeight + steps * STEP * window.innerHeight}px`;
  };
  const start = (i: number) => (i === 0 ? 0 : FIRST + (i - 1));
  const enable = () => {
    on = true;
    section.classList.add('recorrido');
    grid.appendChild(counter);
    layout();
  };
  const disable = () => {
    on = false;
    shown = -1;
    section.classList.remove('recorrido');
    section.style.height = '';
    counter.remove();
    items.forEach((item) => {
      item.style.removeProperty('--k');
      item.style.removeProperty('--z');
    });
  };
  const update = () => {
    if (!on) return;
    const travelled = clamp((navHeight() - section.getBoundingClientRect().top) / (STEP * window.innerHeight), 0, steps);
    let current = 0;
    items.forEach((item, i) => {
      const k = clamp((travelled - start(i)) / (i === 0 ? FIRST : 1));
      if (i > 0 && k >= 0.5) current = i;
      item.style.setProperty('--k', k.toFixed(4));
      item.style.setProperty('--z', clamp((travelled - start(i)) / 2.4).toFixed(4));
    });
    if (current !== shown) {
      shown = current;
      counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
    }
  };
  // Con teclado, enfocar una fotografía lleva el scroll hasta su momento del recorrido.
  const onFocus = (event: FocusEvent) => {
    if (!on) return;
    const i = items.findIndex((item) => item.contains(event.target as Node));
    if (i < 0 || !(event.target as HTMLElement).matches(':focus-visible')) return;
    const top = section.getBoundingClientRect().top + window.scrollY - navHeight();
    window.scrollTo({ top: top + (start(i) + (i === 0 ? FIRST : 1)) * STEP * window.innerHeight });
  };
  const onChange = () => (wide.matches ? enable() : disable());
  grid.addEventListener('focusin', onFocus);
  wide.addEventListener('change', onChange);
  window.addEventListener('resize', layout);
  if (wide.matches) enable();
  return {
    update,
    destroy() {
      grid.removeEventListener('focusin', onFocus);
      wide.removeEventListener('change', onChange);
      window.removeEventListener('resize', layout);
      disable();
    },
  };
}

export function setupMotion() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  let stopped = false;
  const recorrido = setupRecorrido();
  const root = document.documentElement;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Parallax de las fotografías dentro de su marco */
  const parallax = qa<HTMLImageElement>('.property-image img, .vision-photo img, .galeria-item img, .bento-image > img, .footer-bg, .filtro-foto img');
  parallax.forEach((img) => img.setAttribute('data-par', ''));

  /* Texto que se enciende palabra a palabra */
  const scrubs = qa('.scrub').map((el) => {
    const words = el.textContent!.trim().split(/\s+/);
    el.textContent = '';
    const spans = words.map((word, i) => {
      const span = document.createElement('span');
      span.className = 'sw';
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return span;
    });
    return { el, spans, last: -1 };
  });

  /* Marquesina */
  const marquees = qa('.marquee').map((el) => ({
    el,
    track: el.querySelector<HTMLElement>('.marquee-track')!,
    group: el.querySelector<HTMLElement>('.marquee-group')!,
    x: 0,
  }));

  /* Portada */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (hero && fine) {
    hero.addEventListener('pointermove', (e) => {
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
    });
    hero.addEventListener('pointerleave', () => {
      pointer.tx = 0;
      pointer.ty = 0;
    });
  }

  /* Cursor contextual */
  let cursor: HTMLElement | null = null;
  const cursorPos = { x: 0, y: 0, tx: 0, ty: 0, on: false };
  if (fine) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    const label = (el: Element | null) => (el?.closest('[data-lightbox]') ? 'Ampliar' : el?.closest('.property-link, .siguiente-link') ? 'Ver' : '');
    window.addEventListener(
      'pointermove',
      (e) => {
        cursorPos.tx = e.clientX;
        cursorPos.ty = e.clientY;
        const text = e.pointerType === 'mouse' ? label(e.target as Element) : '';
        if (text && !cursorPos.on) {
          cursorPos.x = cursorPos.tx;
          cursorPos.y = cursorPos.ty;
        }
        cursorPos.on = Boolean(text);
        if (text) cursor!.textContent = text;
        cursor!.classList.toggle('on', cursorPos.on);
      },
      { passive: true },
    );
    window.addEventListener('scroll', () => cursor!.classList.remove('on'), { passive: true });
  }

  /* Contadores */
  if ('IntersectionObserver' in window) {
    const counters = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          counters.unobserve(el);
          const final = el.textContent!.trim();
          const target = Number(final);
          if (!Number.isFinite(target)) return;
          const start = performance.now();
          const tick = (now: number) => {
            const p = clamp((now - start) / 1300);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased)).padStart(final.length, '0');
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = final;
          };
          el.textContent = '0'.padStart(final.length, '0');
          requestAnimationFrame(tick);
        }),
      { threshold: 0.6 },
    );
    qa('[data-count]').forEach((el) => counters.observe(el));
  }

  let lastY = window.scrollY;
  let lastT = performance.now();
  let velocity = 0;
  let direction = -1;

  const frame = (now: number) => {
    if (stopped) return;
    recorrido?.update();
    const dt = Math.min(64, now - lastT) / 1000;
    lastT = now;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const delta = y - lastY;
    lastY = y;
    velocity += (Math.abs(delta) / Math.max(dt, 0.001) - velocity) * 0.12;
    if (delta > 0.5) direction = -1;
    else if (delta < -0.5) direction = 1;

    const max = document.documentElement.scrollHeight - vh;
    root.style.setProperty('--sp', max > 0 ? clamp(y / max).toFixed(4) : '0');

    if (hero && y < hero.offsetHeight) {
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      hero.style.setProperty('--hx', `${(-pointer.x * 26).toFixed(2)}px`);
      hero.style.setProperty('--hy', `${(y * 0.3 - pointer.y * 18).toFixed(2)}px`);
      hero.style.setProperty('--cx', `${(pointer.x * 10).toFixed(2)}px`);
      hero.style.setProperty('--cy', `${(-y * 0.14 + pointer.y * 6).toFixed(2)}px`);
      hero.style.setProperty('--ho', clamp(1 - y / (hero.offsetHeight * 0.75)).toFixed(3));
    }

    for (const img of parallax) {
      const box = (img.parentElement ?? img).getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) continue;
      const p = clamp((box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2), -1, 1);
      img.style.setProperty('--py', `${(p * box.height * -0.07).toFixed(2)}px`);
    }

    for (const s of scrubs) {
      const box = s.el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) continue;
      const p = clamp((vh * 0.92 - box.top) / (vh * 0.5));
      const lit = Math.round(p * (s.spans.length + 5) * 10) / 10;
      if (lit === s.last) continue;
      s.last = lit;
      s.spans.forEach((span, i) => {
        span.style.opacity = (0.16 + 0.84 * clamp((lit - i) / 5)).toFixed(3);
      });
    }

    for (const m of marquees) {
      const box = m.el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) continue;
      const width = m.group.offsetWidth;
      if (!width) continue;
      m.x += direction * (70 + Math.min(velocity, 4000) * 0.35) * dt;
      if (m.x <= -width) m.x += width;
      if (m.x > 0) m.x -= width;
      m.track.style.transform = `translate3d(${m.x.toFixed(2)}px,0,0)`;
    }

    if (cursor && cursorPos.on) {
      cursorPos.x += (cursorPos.tx - cursorPos.x) * 0.2;
      cursorPos.y += (cursorPos.ty - cursorPos.y) * 0.2;
      cursor.style.translate = `${cursorPos.x.toFixed(1)}px ${cursorPos.y.toFixed(1)}px`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // Si la persona activa «reducir movimiento» durante la visita, todo se detiene y queda visible.
  reduce.addEventListener?.('change', (event) => {
    if (!event.matches || stopped) return;
    stopped = true;
    recorrido?.destroy();
    cursor?.remove();
    parallax.forEach((img) => {
      img.removeAttribute('data-par');
      img.style.removeProperty('--py');
    });
    scrubs.forEach((s) => s.spans.forEach((span) => (span.style.opacity = '')));
    marquees.forEach((m) => (m.track.style.transform = ''));
    if (hero) ['--hx', '--hy', '--cx', '--cy', '--ho'].forEach((name) => hero.style.removeProperty(name));
    qa('.reveal, .wipe').forEach((el) => el.classList.add('in', 'done'));
    qa('.split').forEach((el) => el.classList.add('in'));
  });
}
