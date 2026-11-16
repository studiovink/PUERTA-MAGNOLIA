/*
 * Un solo lugar para la marca, el contacto, los tiempos de animación y las residencias.
 * NUMA es un nombre editable de ejemplo. Los campos de contacto vacíos no se muestran en el sitio.
 */

export const SITE = {
  brand: 'NUMA',
  descriptor: 'Private Residences',
  /** Ruta de un logo oficial dentro de public/ (por ejemplo "/brand/logo.svg"). Vacío = texto. */
  logo: '',
  /** Foto real para el bloque de perfil (ruta dentro de public/). Vacío = inicial de la marca. */
  profileImage: '',
  /** Datos reales de contacto. Mientras estén vacíos no se publica ningún enlace. */
  email: '',
  phone: '',
  /** Solo dígitos con lada de país, por ejemplo "5216241234567". */
  whatsapp: '',
  /** true = las residencias se presentan como conceptos visuales, no como inmuebles en venta. */
  demo: true,
  description:
    'Una colección visual de residencias costeras inspiradas en Los Cabos y Punta Mita.',
};

/** Tiempos en milisegundos. Calibrados contra la referencia; ver docs/MOTION_SPEC.md. */
export const MOTION = {
  ease: 'cubic-bezier(.22,1,.36,1)',
  introCard: 1500,
  introStagger: 300,
  introHeroDelay: 1150,
  introHeroTravel: 800,
  introHeroExpand: 820,
  heroZoom: 1450,
  titleReveal: 900,
  titleStagger: 90,
  menuOpen: 720,
  menuClose: 520,
  menuLinkDelay: 130,
  menuLinkStagger: 70,
  menuLink: 650,
  switchOut: 230,
  switchIn: 450,
  accordionOpen: 350,
  accordionClose: 260,
  pageLeave: 420,
};

export type Formato = 'h' | 'v';

export interface Foto {
  /** Prefijo del archivo en public/images, sin ancho ni extensión. */
  id: string;
  formato: Formato;
  alt: string;
  /** Etiqueta corta del espacio. */
  label: string;
  position?: string;
}

export interface Residencia {
  id: string;
  title: string;
  region: string;
  description: string;
  texto: string[];
  materiales: string[];
  hero: Foto;
  heroMovil: Foto;
  /** Sala, Baño y Recámara de la misma serie (franja de portada). */
  espacios: [Foto, Foto, Foto];
  terraza: Foto;
}

const h = (id: string, label: string, alt: string, position = '50% 50%'): Foto => ({
  id,
  formato: 'h',
  label,
  alt,
  position,
});
const v = (id: string, label: string, alt: string): Foto => ({
  id,
  formato: 'v',
  label,
  alt,
  position: '50% 48%',
});

export const RESIDENCIAS: Residencia[] = [
  {
    id: 'casa-duna',
    title: 'Casa Duna',
    region: 'Los Cabos',
    description: 'Piedra clara, horizonte abierto y una vida junto al mar.',
    texto: [
      'Casa Duna nace del desierto que se encuentra con el océano. Volúmenes bajos de travertino, vidrio en tono bronce y techos de madera cálida enmarcan el horizonte sin competir con él.',
      'Los interiores se abren hacia la terraza y la alberca; afuera, agaves y roca conservan el carácter del paisaje de Los Cabos.',
    ],
    materiales: ['Travertino', 'Vidrio bronce', 'Madera cálida', 'Agaves y roca'],
    hero: h('01-cabos-fachada', 'Fachada', 'Casa Duna, concepto arquitectónico frente al mar inspirado en Los Cabos', '50% 46%'),
    heroMovil: v('11-cabos-portada-movil', 'Fachada', 'Casa Duna, concepto arquitectónico frente al mar inspirado en Los Cabos'),
    espacios: [
      h('03-cabos-sala', 'Sala', 'Sala de Casa Duna abierta al mar', '50% 52%'),
      h('07-cabos-bano', 'Baño', 'Baño en travertino de Casa Duna'),
      h('05-cabos-recamara', 'Recámara', 'Recámara de Casa Duna con vista al mar'),
    ],
    terraza: h('09-cabos-alberca-terraza', 'Alberca y terraza', 'Alberca y terraza de Casa Duna frente a la costa'),
  },
  {
    id: 'casa-palma',
    title: 'Casa Palma',
    region: 'Punta Mita',
    description: 'Arquitectura contemporánea entre palmeras y el Pacífico.',
    texto: [
      'Casa Palma se resguarda entre la vegetación de la costa. Piedra marfil, madera de parota y un pórtico curvo suavizan la luz del trópico y la llevan hasta el interior.',
      'Las estancias miran a las palmeras y al Pacífico; la terraza y la alberca prolongan la casa hacia el jardín.',
    ],
    materiales: ['Piedra marfil', 'Parota', 'Pórtico curvo', 'Palmeras y jardín costero'],
    hero: h('02-punta-mita-fachada', 'Fachada', 'Casa Palma, concepto arquitectónico entre palmeras inspirado en Punta Mita', '50% 46%'),
    heroMovil: v('12-punta-mita-portada-movil', 'Fachada', 'Casa Palma, concepto arquitectónico entre palmeras inspirado en Punta Mita'),
    espacios: [
      h('04-punta-mita-sala', 'Sala', 'Sala tropical de Casa Palma', '50% 52%'),
      h('08-punta-mita-bano', 'Baño', 'Baño tropical de Casa Palma'),
      h('06-punta-mita-recamara', 'Recámara', 'Recámara de Casa Palma entre palmeras'),
    ],
    terraza: h('10-punta-mita-alberca-terraza', 'Alberca y terraza', 'Alberca de Casa Palma frente al Pacífico'),
  },
];

/** Fotos de la galería completa de una residencia, en orden de recorrido. */
export const galeria = (r: Residencia): Foto[] => [r.hero, r.espacios[0], r.espacios[2], r.espacios[1], r.terraza];

export const FAQ = [
  {
    q: '¿Qué inspira esta colección?',
    a: 'El contraste entre el paisaje desértico de Los Cabos y la costa tropical de Punta Mita. Cada residencia interpreta su región con materiales, vegetación y luz propios.',
  },
  {
    q: '¿Las residencias están en venta?',
    a: 'No. Casa Duna y Casa Palma son conceptos visuales creados para explorar una dirección arquitectónica. Por eso no se publican precios, superficies ni direcciones.',
  },
  {
    q: '¿Puedo ver más espacios de cada residencia?',
    a: 'Sí. Las tarjetas de la portada muestran sala, baño y recámara; Explorar abre la ficha con la galería completa de cada casa.',
  },
  {
    q: '¿Cómo se incorporan propiedades reales?',
    a: 'Cada propiedad real se añade como una colección propia, con sus fotografías y datos verificados, dentro de este mismo sistema visual.',
  },
];

/* ---------- Rutas e imágenes ---------- */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
/** Antepone la base del sitio a una ruta interna. */
/** Versión plana (rutas relativas y páginas .html en una sola carpeta) para vistas previas alojadas. */
export const FLAT = import.meta.env.PUBLIC_FLAT === '1';
export const url = (path: string) => {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (!FLAT) return `${BASE}${p}`;
  if (p === '/' || p.startsWith('/#')) return `index.html${p.slice(1)}`;
  if (p.startsWith('/residencias/')) return `${p.slice('/residencias/'.length)}.html`;
  return p.slice(1);
};

const WIDTHS: Record<Formato, number[]> = { h: [1280, 1920, 3840], v: [900, 1290, 2160] };
const RATIO: Record<Formato, number> = { h: 9 / 16, v: 16 / 9 };

export const src = (f: Foto, width?: number) => url(`/images/${f.id}-${width ?? WIDTHS[f.formato][0]}.webp`);
export const srcset = (f: Foto) => WIDTHS[f.formato].map((w) => `${src(f, w)} ${w}w`).join(', ');
export const full = (f: Foto) => src(f, WIDTHS[f.formato][2]);
export const dims = (f: Foto) => {
  const width = WIDTHS[f.formato][2];
  return { width, height: Math.round(width * RATIO[f.formato]) };
};
