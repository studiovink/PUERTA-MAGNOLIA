// Interacciones de interfaz (independientes de la animación).

// ---------- Pestañas accesibles (role=tablist) ----------
export function activarTab(tab: HTMLElement, foco = false) {
  const lista = tab.closest('[role="tablist"]')!;
  const tabs = [...lista.querySelectorAll<HTMLElement>('[role="tab"]')];
  tabs.forEach((t) => {
    const activo = t === tab;
    t.setAttribute('aria-selected', String(activo));
    t.tabIndex = activo ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls')!);
    if (!panel) return;
    // paneles que deben verse sin JS se ocultan con atributo (CSS), el resto con `hidden`
    if (panel.hasAttribute('data-panel-attr')) {
      panel.toggleAttribute('data-oculto-js', !activo);
    } else {
      panel.hidden = !activo;
    }
  });
  if (foco) tab.focus();
  lista.dispatchEvent(new CustomEvent('tab-cambio', { detail: tab, bubbles: true }));
}

document.querySelectorAll<HTMLElement>('[role="tablist"]').forEach((lista) => {
  const tabs = () => [...lista.querySelectorAll<HTMLElement>('[role="tab"]')];
  lista.addEventListener('click', (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>('[role="tab"]');
    if (t) activarTab(t);
  });
  lista.addEventListener('keydown', (e) => {
    const ts = tabs();
    const i = ts.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    let j = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % ts.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + ts.length) % ts.length;
    if (e.key === 'Home') j = 0;
    if (e.key === 'End') j = ts.length - 1;
    if (j >= 0) { e.preventDefault(); activarTab(ts[j], true); }
  });
});

// ---------- Modelo elegido → formulario de contacto ----------
export function elegirModelo(id: string) {
  const sel = document.querySelector<HTMLSelectElement>('#f-modelo');
  if (sel) sel.value = id;
}
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLElement>('[data-elige-modelo]');
  if (a) elegirModelo(a.dataset.eligeModelo!);
});

// ---------- Zoom de plantas ----------
const dlg = document.querySelector<HTMLDialogElement>('#zoom');
if (dlg) {
  const img = dlg.querySelector<HTMLImageElement>('img')!;
  const lienzo = dlg.querySelector<HTMLElement>('[data-zoom-lienzo]')!;
  const titulo = dlg.querySelector<HTMLElement>('[data-zoom-titulo]')!;
  let escala = 1;
  const aplicar = () => {
    const ancho = matchMedia('(min-width: 700px)').matches;
    img.style.height = ancho ? `${escala * 100}%` : 'auto';
    img.style.width = ancho ? 'auto' : `${escala * 100}%`;
    dlg.querySelector('[data-zoom-nivel]')!.textContent = `${Math.round(escala * 100)} %`;
  };
  const abrir = (src: string, alt: string) => {
    img.src = src; img.alt = alt; titulo.textContent = alt;
    escala = 1; aplicar();
    dlg.showModal();
    (window as any).__lenis?.stop();
  };
  dlg.addEventListener('close', () => (window as any).__lenis?.start());
  dlg.querySelector('[data-zoom-mas]')!.addEventListener('click', () => { escala = Math.min(3, escala + 0.5); aplicar(); });
  dlg.querySelector('[data-zoom-menos]')!.addEventListener('click', () => { escala = Math.max(1, escala - 0.5); aplicar(); });
  dlg.querySelector('[data-zoom-cerrar]')!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  lienzo.addEventListener('dblclick', () => { escala = escala > 1 ? 1 : 2; aplicar(); });

  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const zoom = t.closest<HTMLElement>('[data-visor-zoom]');
    if (zoom) { abrir(zoom.dataset.visorZoom!, zoom.dataset.alt!); return; }
    const amp = t.closest<HTMLElement>('[data-visor-ampliar]');
    if (amp) {
      const visible = amp.closest('[data-visor]')!.querySelector<HTMLElement>('[data-visor-panel]:not([hidden]) [data-visor-zoom]');
      if (visible) abrir(visible.dataset.visorZoom!, visible.dataset.alt!);
    }
  });
}

// ---------- Comparador: mostrar solo diferencias ----------
document.querySelectorAll<HTMLButtonElement>('[data-solo-dif]').forEach((b) => {
  b.addEventListener('click', () => {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    document.querySelectorAll<HTMLElement>('[data-fila-igual]').forEach((f) => (f.hidden = on));
  });
});

// ---------- Carrusel: flechas ----------
document.querySelectorAll<HTMLElement>('[data-carrusel]').forEach((c) => {
  const pista = c.querySelector<HTMLElement>('[data-carrusel-pista]')!;
  const paso = () => (pista.querySelector<HTMLElement>(':scope > *')?.offsetWidth ?? 300) + 16;
  c.querySelector('[data-carrusel-prev]')?.addEventListener('click', () => pista.scrollBy({ left: -paso(), behavior: 'smooth' }));
  c.querySelector('[data-carrusel-sig]')?.addEventListener('click', () => pista.scrollBy({ left: paso(), behavior: 'smooth' }));
});
