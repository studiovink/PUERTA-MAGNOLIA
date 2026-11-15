import { useEffect, useRef, useState } from 'react';
import { hero, nav, site } from '../content';

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Sobre la portada la barra es transparente; al salir de ella pasa a fondo blanco.
  useEffect(() => {
    const onScroll = () => {
      const heroEl = document.getElementById('inicio');
      const limit = (heroEl?.offsetHeight ?? window.innerHeight) - 90;
      setSolid(window.scrollY > limit);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Menú móvil: bloquea el scroll, contiene el foco, cierra con Escape y devuelve el foco.
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current!;
    const toggle = toggleRef.current;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(header.querySelectorAll<HTMLElement>('a[href], button')).filter(
        (el) => el.offsetParent !== null,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      toggle?.focus();
    };
  }, [open]);

  // Si la ventana crece a escritorio con el menú abierto, se cierra.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 961px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const close = () => setOpen(false);
  const cls = ['site-nav', solid && 'site-nav--solid', open && 'site-nav--open'].filter(Boolean).join(' ');

  return (
    <header className={cls} ref={headerRef}>
      <div className="container site-nav__bar">
        <a className="site-nav__brand" href="#inicio" aria-label={`${site.name} ${site.descriptor}, inicio`} onClick={close}>
          <span className="site-nav__logo">
            <img className="site-nav__logo-light" src="/brand/mozvar-blanco.svg" alt="" width={439} height={102} />
            <img className="site-nav__logo-dark" src="/brand/mozvar-negro.svg" alt="" width={439} height={102} />
          </span>
          <span className="site-nav__descriptor">{site.descriptor}</span>
        </a>

        <button
          ref={toggleRef}
          type="button"
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Cerrar' : 'Menú'}
        </button>

        <nav className="site-nav__panel" id="menu-principal" aria-label="Principal">
          <ul className="site-nav__list">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={close}>{item.label}</a>
              </li>
            ))}
          </ul>
          <a className="button site-nav__cta" href={hero.cta.href} onClick={close}>{hero.cta.label}</a>
        </nav>
      </div>
    </header>
  );
}
