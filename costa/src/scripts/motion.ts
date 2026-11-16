/*
 * Capa de movimiento continuo: parallax, portada que responde al scroll y al puntero,
 * texto que se enciende al avanzar, marquesina, cursor contextual y contadores.
 * Todo lee el scroll nativo en un único requestAnimationFrame; nada lo secuestra.
 */
const qa = <T extends HTMLElement = HTMLElement>(sel: string, el: ParentNode = document) => Array.from(el.querySelectorAll<T>(sel));
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function setupMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Parallax de las fotografías dentro de su marco */
  const parallax = qa<HTMLImageElement>('.property-image img, .vision-photo img, .galeria-item img, .bento-image > img, .footer-bg');
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
}
