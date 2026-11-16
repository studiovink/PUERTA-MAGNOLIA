import { getProfile } from './profiles.mjs';

const instances = new WeakMap();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Progressive enhancement. Never hide content in CSS waiting for JavaScript.
 * Return destroy() and call it on unmount. Reinitializing a root disposes its old instance.
 * Own only descendants marked with data-vink-*; use a dedicated wrapper per effect.
 */
export function initMotion(root = document.documentElement, options = {}) {
  instances.get(root)?.destroy();
  const doc = root.ownerDocument || root;
  const win = doc.defaultView;
  if (!win) return { destroy() {} };
  const config = getProfile(options.profile || root.dataset?.vinkProfile);
  const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = win.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  const running = new Set();
  let cleanups = [];
  let stopped = false;

  const on = (target, type, callback, opts) => {
    target.addEventListener(type, callback, opts);
    cleanups.push(() => target.removeEventListener(type, callback, opts));
  };

  const play = (el, index = 0) => {
    if (!el.animate || reduced.matches) return;
    const effect = el.dataset.vinkReveal || el.dataset.vinkEnter || 'rise';
    const shift = effect === 'fade' ? 0 : config.distance;
    const frames = effect === 'scale'
      ? [{ opacity: 0, transform: 'scale(.965)' }, { opacity: 1, transform: 'scale(1)' }]
      : [{ opacity: 0, transform: `translateY(${shift}px)` }, { opacity: 1, transform: 'translateY(0)' }];
    const anim = el.animate(frames, {
      duration: config.duration,
      delay: Math.min(index, 5) * config.stagger,
      easing: 'cubic-bezier(.22,1,.36,1)',
      fill: 'backwards',
    });
    running.add(anim);
    anim.finished.then(() => running.delete(anim), () => running.delete(anim));
  };

  const reset = () => {
    for (const fn of cleanups.splice(0)) fn();
    for (const anim of running) anim.cancel();
    running.clear();
  };

  const setup = (entrance) => {
    reset();
    if (stopped || reduced.matches) return;
    if (entrance) {
      root.querySelectorAll('[data-vink-enter]').forEach(play);
      if ('IntersectionObserver' in win) {
        const observer = new win.IntersectionObserver(entries => {
          let index = 0;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            play(entry.target, index++);
            observer.unobserve(entry.target);
          }
        }, { threshold: 0.08 });
        root.querySelectorAll('[data-vink-reveal]').forEach(el => observer.observe(el));
        cleanups.push(() => observer.disconnect());
      }
    }
    if (!pointer.matches) return;

    for (const el of root.querySelectorAll('[data-vink-tilt]')) {
      let raf = 0;
      let point = null;
      const clear = () => {
        win.cancelAnimationFrame(raf);
        raf = 0;
        point = null;
        el.style.removeProperty('--vink-rotate-x');
        el.style.removeProperty('--vink-rotate-y');
      };
      const move = event => {
        point = { x: event.clientX, y: event.clientY };
        if (raf) return;
        raf = win.requestAnimationFrame(() => {
          raf = 0;
          if (!point) return;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          const x = clamp((point.x - r.left) / r.width - .5, -.5, .5);
          const y = clamp((point.y - r.top) / r.height - .5, -.5, .5);
          el.style.setProperty('--vink-rotate-x', `${-y * config.tilt * 2}deg`);
          el.style.setProperty('--vink-rotate-y', `${x * config.tilt * 2}deg`);
        });
      };
      on(el, 'pointermove', move, { passive: true });
      on(el, 'pointerleave', clear);
      on(el, 'pointercancel', clear);
      cleanups.push(clear);
    }

    const layers = [...root.querySelectorAll('[data-vink-parallax]')].slice(0, 8);
    if (layers.length) {
      let frame = 0;
      const update = () => {
        frame = 0;
        if (doc.hidden) return;
        const h = win.innerHeight;
        for (const el of layers) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -80 || rect.top > h + 80) continue;
          const position = clamp((h / 2 - rect.top - rect.height / 2) / h, -1, 1);
          el.style.setProperty('--vink-parallax-y', `${position * config.parallax}px`);
        }
      };
      const schedule = () => {
        if (!frame) frame = win.requestAnimationFrame(update);
      };
      on(win, 'scroll', schedule, { passive: true });
      on(win, 'resize', schedule, { passive: true });
      on(root, 'vink:layout', schedule);
      on(doc, 'visibilitychange', schedule);
      schedule();
      cleanups.push(() => {
        win.cancelAnimationFrame(frame);
        layers.forEach(el => el.style.removeProperty('--vink-parallax-y'));
      });
    }
  };

  const changed = () => setup(false);
  reduced.addEventListener('change', changed);
  pointer.addEventListener('change', changed);
  setup(true);
  const handle = {
    destroy() {
      if (stopped) return;
      stopped = true;
      reset();
      reduced.removeEventListener('change', changed);
      pointer.removeEventListener('change', changed);
      if (instances.get(root) === handle) instances.delete(root);
    },
  };
  instances.set(root, handle);
  return handle;
}
