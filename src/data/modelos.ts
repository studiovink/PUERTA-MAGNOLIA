import type { ImageMetadata } from 'astro';
import fachadaVioleta from '../assets/fotos/fachada-violeta.webp';
import fachadaGardenia from '../assets/fotos/fachada-gardenia.webp';
import fachadaJazmin from '../assets/fotos/fachada-jazmin.webp';
import violetaBaja from '../assets/plantas/violeta-baja.png';
import violetaAlta from '../assets/plantas/violeta-alta.png';
import gardeniaBaja from '../assets/plantas/gardenia-baja.png';
import gardeniaAlta from '../assets/plantas/gardenia-alta.png';
import jazminBaja from '../assets/plantas/jazmin-baja.png';
import jazminAlta from '../assets/plantas/jazmin-alta.png';

export type ModeloId = 'violeta' | 'gardenia' | 'jazmin';

export interface Modelo {
  id: ModeloId;
  nombre: string;
  /** Letra del prototipo en el sembrado SEM-03 */
  prototipo: 'D' | 'B' | 'G';
  m2: number;
  precio: number;
  frase: string;
  suma: string[];
  fachada: ImageMetadata;
  fachadaAlt: string;
  plantas: { baja: ImageMetadata; alta: ImageMetadata };
  oficina: boolean;
  salaTv: boolean;
  jardin: string;
  color: string;
}

const COMUN = {
  lote: '6 × 17 m',
  niveles: 2,
  recamaras: 3,
  banos: 2.5,
  estacionamientos: 2,
  incluye: [
    'Sala, comedor y cocina con barra',
    '3 recámaras; principal con baño y vestidor',
    '2.5 baños',
    'Área de lavado',
    '2 estacionamientos',
  ],
};
export { COMUN };

export const MODELOS: Modelo[] = [
  {
    id: 'violeta',
    nombre: 'Violeta',
    prototipo: 'D',
    m2: 101.24,
    precio: 2990000,
    frase: 'El equilibrio perfecto para empezar.',
    suma: [],
    fachada: fachadaVioleta,
    fachadaAlt: 'Fachada del modelo Violeta: dos niveles, muro de piedra y ventanales con cancelería negra',
    plantas: { baja: violetaBaja, alta: violetaAlta },
    oficina: false,
    salaTv: false,
    jardin: 'Jardín',
    color: 'var(--lote-violeta)',
  },
  {
    id: 'gardenia',
    nombre: 'Gardenia',
    prototipo: 'B',
    m2: 114.38,
    precio: 3150000,
    frase: 'Más espacio para quien también trabaja en casa.',
    suma: ['Oficina'],
    fachada: fachadaGardenia,
    fachadaAlt: 'Fachada del modelo Gardenia: dos niveles con volumen ocre, columna de piedra y cochera',
    plantas: { baja: gardeniaBaja, alta: gardeniaAlta },
    oficina: true,
    salaTv: false,
    jardin: 'Jardín',
    color: 'var(--lote-gardenia)',
  },
  {
    id: 'jazmin',
    nombre: 'Jazmín',
    prototipo: 'G',
    m2: 126.3,
    precio: 3300000,
    frase: 'Para la familia que quiere crecer con holgura.',
    suma: ['Sala de TV', 'Jardín con terraza'],
    fachada: fachadaJazmin,
    fachadaAlt: 'Fachada del modelo Jazmín: dos niveles con fachada ocre y muro de piedra junto a la entrada',
    plantas: { baja: jazminBaja, alta: jazminAlta },
    oficina: false,
    salaTv: true,
    jardin: 'Jardín con terraza',
    color: 'var(--lote-jazmin)',
  },
];

export const modeloPorId = (id: ModeloId) => MODELOS.find((m) => m.id === id)!;
export const modeloPorPrototipo = (p: string) => MODELOS.find((m) => m.prototipo === p)!;
export const fmtM2 = (n: number) => `${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })} m²`;
