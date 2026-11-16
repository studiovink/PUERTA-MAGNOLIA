/**
 * Movimiento del sitio: un solo ciclo de animación que coordina la profundidad de la portada,
 * el parallax y la inclinación 3D de las fotos, los botones magnéticos, el texto que se
 * ilumina al avanzar, la cinta de texto, el cursor y la marca del pie.
 * No se activa si la persona pidió reducir el movimiento.
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function initMotion(): () => void {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return () => {};

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ac = new AbortController();
  const opts = { signal: ac.signal, passive: true } as const;
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, moved: false };
  window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.moved = true; }, opts);

  // Fotos: parallax interno y, con ratón, inclinación 3D con brillo.
  const medias = Array.from(document.querySelectorAll<HTMLElement>('[data-media]')).map((el) => ({
    el, img: el.querySelector('img')!, tilt: fine && el.hasAttribute('data-tilt'), visible: false, rx: 0, ry: 0, trx: 0, try: 0,
  }));
  const byEl = new Map(medias.map((m) => [m.el as Element, m]));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { const m = byEl.get(e.target); if (m) m.visible = e.isIntersecting; }), { rootMargin: '25% 0px' });
  medias.forEach((m) => {
    io.observe(m.el);
    if (!m.tilt) return;
    m.el.addEventListener('pointermove', (e) => {
      const r = m.el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      m.try = px * 11; m.trx = -py * 9;
      m.el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
      m.el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
    }, opts);
    m.el.addEventListener('pointerleave', () => { m.trx = 0; m.try = 0; }, opts);
  });

  // Botones y enlaces magnéticos.
  const magnets = !fine ? [] : Array.from(document.querySelectorAll<HTMLElement>('.button, .text-link, .site-nav__list a')).map((el) => {
    const m = { el, x: 0, y: 0, tx: 0, ty: 0 };
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      m.tx = (e.clientX - (r.left + r.width / 2)) * 0.32;
      m.ty = (e.clientY - (r.top + r.height / 2)) * 0.42;
    }, opts);
    el.addEventListener('pointerleave', () => { m.tx = 0; m.ty = 0; }, opts);
    return m;
  });

  // Cursor que acompaña al puntero y crece sobre lo interactivo.
  let cursor: HTMLElement | null = null;
  const cur = { x: pointer.x, y: pointer.y };
  if (fine) {
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursor);
    document.addEventListener('pointerover', (e) => {
      const t = e.target as Element;
      cursor!.classList.toggle('is-active', !!t.closest('a, button, [data-tilt], summary'));
      cursor!.classList.toggle('is-hidden', !!t.closest('input, select, textarea'));
    }, opts);
  }

  const heroImg = document.querySelector<HTMLElement>('.hero__picture img');
  const heroInner = document.querySelector<HTMLElement>('.hero__inner');
  const hero = { x: 0, y: 0 };

  const fills = Array.from(document.querySelectorAll<HTMLElement>('[data-fill]')).map((el) => ({ el, words: Array.from(el.querySelectorAll<HTMLElement>('.w')), n: -1 }));
  const tracks = Array.from(document.querySelectorAll<HTMLElement>('.marquee__track')).map((el, i) => ({ el, x: 0, dir: i % 2 ? 1 : -1 }));
  const wordmark = document.querySelector<HTMLElement>('.site-footer__wordmark');
  const wm = { rx: 0, ry: 0 };

  let lastY = window.scrollY;
  let vel = 0;
  let raf = 0;

  const tick = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    vel = lerp(vel, y - lastY, 0.14);
    lastY = y;
    const max = document.documentElement.scrollHeight - vh;
    root.style.setProperty('--progress', (max > 0 ? y / max : 0).toFixed(4));

    if (heroImg && heroInner && y < vh * 1.3) {
      hero.x = lerp(hero.x, pointer.moved ? (pointer.x / vw - 0.5) * -26 : 0, 0.05);
      hero.y = lerp(hero.y, pointer.moved ? (pointer.y / vh - 0.5) * -16 : 0, 0.05);
      heroImg.style.transform = `translate3d(${hero.x.toFixed(2)}px, ${(hero.y + y * 0.24).toFixed(2)}px, 0) scale(${(1.07 + y * 0.00018).toFixed(4)})`;
      heroInner.style.transform = `translate3d(${(hero.x * -0.35).toFixed(2)}px, ${(y * -0.14).toFixed(2)}px, 0)`;
      heroInner.style.opacity = clamp(1 - y / (vh * 0.8), 0, 1).toFixed(3);
    }

    for (const m of medias) {
      if (!m.visible) continue;
      const r = m.el.getBoundingClientRect();
      const p = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
      m.img.style.transform = `translate3d(0, ${(p * -8).toFixed(2)}%, 0) scale(1.18)`;
      if (m.tilt) {
        m.rx = lerp(m.rx, m.trx, 0.1); m.ry = lerp(m.ry, m.try, 0.1);
        m.el.style.transform = `perspective(1100px) rotateX(${m.rx.toFixed(2)}deg) rotateY(${m.ry.toFixed(2)}deg)`;
      }
    }

    for (const m of magnets) {
      if (!m.tx && !m.ty && Math.abs(m.x) < 0.05 && Math.abs(m.y) < 0.05) { if (m.x || m.y) { m.x = 0; m.y = 0; m.el.style.transform = ''; } continue; }
      m.x = lerp(m.x, m.tx, 0.16); m.y = lerp(m.y, m.ty, 0.16);
      m.el.style.transform = `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`;
    }

    for (const f of fills) {
      const r = f.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const n = Math.round(clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3), 0, 1) * f.words.length);
      if (n === f.n) continue;
      f.words.forEach((w, i) => w.classList.toggle('is-on', i < n));
      f.n = n;
    }

    for (const t of tracks) {
      const half = t.el.scrollWidth / 2;
      if (!half) continue;
      t.x += t.dir * (0.7 + Math.abs(vel) * 0.45);
      if (t.x <= -half) t.x += half;
      if (t.x > 0) t.x -= half;
      t.el.style.transform = `translate3d(${t.x.toFixed(2)}px, 0, 0) skewX(${clamp(vel * -0.3, -9, 9).toFixed(2)}deg)`;
    }

    if (wordmark) {
      // Se mide el contenedor, que no rota, para que la lectura sea estable.
      const r = wordmark.parentElement!.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const rise = clamp((r.bottom - vh * 0.98) / (vh * 0.6), 0, 1);
        wm.rx = lerp(wm.rx, rise * 58 + (fine ? (pointer.y / vh - 0.5) * -10 : 0), 0.1);
        wm.ry = lerp(wm.ry, fine ? (pointer.x / vw - 0.5) * 7 : 0, 0.1);
        wordmark.style.transform = `rotateX(${wm.rx.toFixed(2)}deg) rotateY(${wm.ry.toFixed(2)}deg)`;
        wordmark.style.opacity = (1 - rise * 0.55).toFixed(3);
      }
    }

    if (cursor) {
      cur.x = lerp(cur.x, pointer.x, 0.2); cur.y = lerp(cur.y, pointer.y, 0.2);
      cursor.style.transform = `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0)`;
      if (pointer.moved) cursor.classList.add('is-ready');
    }

    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    ac.abort();
    io.disconnect();
    cursor?.remove();
    const clear = (el: HTMLElement | null | undefined, ...props: string[]) => props.forEach((p) => el?.style.removeProperty(p));
    clear(heroImg, 'transform');
    clear(heroInner, 'transform', 'opacity');
    medias.forEach((m) => { clear(m.img, 'transform'); clear(m.el, 'transform'); });
    magnets.forEach((m) => clear(m.el, 'transform'));
    tracks.forEach((t) => clear(t.el, 'transform'));
    clear(wordmark, 'transform', 'opacity');
    root.style.removeProperty('--progress');
  };
}
