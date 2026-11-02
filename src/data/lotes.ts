// Tercera etapa · sembrado SEM-03 (enero 2026, Proyectos Lodela).
// Manzana, número de lote y prototipo (B = Gardenia, D = Violeta, G = Jazmín) se
// transcribieron del plano. La geometría es un redibujo esquemático sobre las
// coordenadas del plano (no a escala). La DISPONIBILIDAD es de EJEMPLO hasta que
// el cliente comparta el inventario real: cambia `estadoEjemplo` por datos reales.

import { modeloPorPrototipo, type ModeloId } from './modelos';

export type Estado = 'disponible' | 'apartado' | 'vendido';
export const DISPONIBILIDAD_ES_EJEMPLO = true;

export interface Lote {
  id: string; // "30-07"
  manzana: number;
  numero: number;
  modelo: ModeloId;
  estado: Estado;
  /** polígono en coordenadas del viewBox del plano */
  puntos: [number, number][];
}

type P = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;

/** rectángulo que parte de una esquina, avanza `w` en dirección θ y profundiza `d` a +90° */
function rect(o: P, theta: number, w: number, d: number): P[] {
  const ux = Math.cos(rad(theta)), uy = Math.sin(rad(theta));
  const vx = Math.cos(rad(theta + 90)), vy = Math.sin(rad(theta + 90));
  const r = (x: number, y: number): P => [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  return [r(o[0], o[1]), r(o[0] + ux * w, o[1] + uy * w), r(o[0] + ux * w + vx * d, o[1] + uy * w + vy * d), r(o[0] + vx * d, o[1] + vy * d)];
}

/** rectángulo centrado en c, con el eje largo girado `ang` grados */
function rectC(c: P, ang: number, w = 30, d = 80): P[] {
  const ux = Math.cos(rad(ang)), uy = Math.sin(rad(ang)); // eje largo (profundidad)
  const vx = -uy, vy = ux; // eje corto (frente)
  const hd = d / 2, hw = w / 2;
  const r = (x: number, y: number): P => [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  return [
    r(c[0] - ux * hd - vx * hw, c[1] - uy * hd - vy * hw),
    r(c[0] + ux * hd - vx * hw, c[1] + uy * hd - vy * hw),
    r(c[0] + ux * hd + vx * hw, c[1] + uy * hd + vy * hw),
    r(c[0] - ux * hd + vx * hw, c[1] - uy * hd + vy * hw),
  ];
}

/** fila de lotes: `orden` va en el sentido de avance */
function fila(manzana: number, o: P, theta: number, w: number, d: number, orden: [number, string][]) {
  const ux = Math.cos(rad(theta)), uy = Math.sin(rad(theta));
  return orden.map(([numero, proto], i) => ({
    manzana, numero, proto,
    puntos: rect([o[0] + ux * w * i, o[1] + uy * w * i], theta, w, d),
  }));
}

const crudos: { manzana: number; numero: number; proto: string; puntos: P[] }[] = [
  // Manzana 30 · frente a Mallorquín, de poniente a oriente (15 → 01)
  ...fila(30, [243, 125], 3.3, 31.5, 86, [
    [15, 'B'], [14, 'D'], [13, 'G'], [12, 'D'], [11, 'B'], [10, 'D'], [9, 'G'], [8, 'D'],
    [7, 'B'], [6, 'D'], [5, 'B'], [4, 'D'], [3, 'B'], [2, 'G'], [1, 'B'],
  ]),
  // Manzana 32 · esquina oriente (29 → 26, de norte a sur)
  ...fila(32, [884, 178], 84.5, 30.5, 78, [[29, 'D'], [28, 'G'], [27, 'B'], [26, 'D']]),
  // Manzana 27 · columna poniente (25 → 12, de norte a sur)
  ...fila(27, [318, 267], 88.2, 31.4, 78, [
    [25, 'B'], [24, 'D'], [23, 'G'], [22, 'B'], [21, 'D'], [20, 'G'], [19, 'D'],
    [18, 'B'], [17, 'D'], [16, 'G'], [15, 'D'], [14, 'B'], [13, 'D'], [12, 'G'],
  ]),
  // Manzana 27 · remate sur (09 → 11)
  ...fila(27, [218, 709], 0, 32, 77, [[9, 'G'], [10, 'D'], [11, 'B']]),
  // Manzana 29 · fila norte (14 → 18)
  ...fila(29, [372, 257], 0, 31, 83, [[14, 'G'], [15, 'D'], [16, 'B'], [17, 'D'], [18, 'G']]),
  // Manzana 29 · fila sur (13 → 10)
  ...fila(29, [365, 345], 0, 31.5, 88, [[13, 'D'], [12, 'B'], [11, 'G'], [10, 'B']]),
  // Manzana 29 · lotes en abanico
  { manzana: 29, numero: 9, proto: 'D', puntos: rectC([513, 393], -78, 31, 84) },
  { manzana: 29, numero: 19, proto: 'D', puntos: rectC([552, 315], -67) },
  { manzana: 29, numero: 20, proto: 'B', puntos: rectC([598, 322], -42) },
  { manzana: 29, numero: 21, proto: 'D', puntos: rectC([633, 355], -30) },
  { manzana: 29, numero: 22, proto: 'B', puntos: rectC([650, 392], -21) },
  { manzana: 29, numero: 23, proto: 'D', puntos: rectC([660, 424], -18) },
  { manzana: 29, numero: 24, proto: 'B', puntos: rectC([668, 456], -16) },
  { manzana: 29, numero: 8, proto: 'B', puntos: rectC([552, 422], -42) },
  { manzana: 29, numero: 7, proto: 'D', puntos: rectC([580, 462], -33) },
  { manzana: 29, numero: 6, proto: 'B', puntos: rectC([596, 497], -19) },
  { manzana: 29, numero: 5, proto: 'G', puntos: rectC([604, 532], -15) },
  { manzana: 29, numero: 4, proto: 'D', puntos: rectC([620, 563], -15) },
  { manzana: 29, numero: 3, proto: 'G', puntos: rectC([624, 592], -15) },
  { manzana: 29, numero: 2, proto: 'D', puntos: rectC([635, 621], -15) },
  // Manzana 22 · franja sur (15 → 02)
  ...fila(22, [200, 912], 0, 32.2, 84, [
    [15, 'B'], [14, 'D'], [13, 'G'], [12, 'B'], [11, 'D'], [10, 'G'], [9, 'B'],
    [8, 'D'], [7, 'G'], [6, 'B'], [5, 'D'], [4, 'B'], [3, 'G'], [2, 'D'],
  ]),
];

/** Disponibilidad de EJEMPLO, determinista para que no cambie entre recargas. */
function estadoEjemplo(manzana: number, numero: number): Estado {
  const h = (manzana * 37 + numero * 11) % 13;
  if (h < 2) return 'vendido';
  if (h < 4) return 'apartado';
  return 'disponible';
}

export const LOTES: Lote[] = crudos
  .map((l) => ({
    id: `${l.manzana}-${String(l.numero).padStart(2, '0')}`,
    manzana: l.manzana,
    numero: l.numero,
    modelo: modeloPorPrototipo(l.proto).id,
    estado: estadoEjemplo(l.manzana, l.numero),
    puntos: l.puntos,
  }))
  .sort((a, b) => a.manzana - b.manzana || a.numero - b.numero);

export const PLANO = {
  viewBox: '180 95 740 935',
  // contorno de la etapa (línea roja del sembrado)
  contornos: [
    'M245 118 L866 160 L906 296 L828 312 L830 478 Q700 640 470 735 Q330 780 215 790 L218 707 L242 705 Z',
    'M192 905 L680 898 Q790 902 905 1018 Q700 986 450 1000 L192 1000 Z',
  ],
  areasVerdes: [
    { d: 'M357 474 L503 474 Q545 560 566 690 Q460 742 357 766 Z', etiqueta: 'Área verde' },
    { d: 'M700 290 Q740 280 765 330 L770 470 Q745 512 708 480 Z', etiqueta: 'Área verde' },
    { d: 'M650 900 Q790 902 880 1004 Q760 992 650 990 Z', etiqueta: 'Área verde' },
  ],
  calles: [
    'M232 240 L835 268',
    'M330 250 L330 795',
    'M350 455 Q470 430 540 470',
    'M800 170 L800 290 Q790 420 700 560',
  ],
} as const;

export const resumenPorModelo = () => {
  const r: Record<ModeloId, { total: number; disponibles: number }> = {
    violeta: { total: 0, disponibles: 0 },
    gardenia: { total: 0, disponibles: 0 },
    jazmin: { total: 0, disponibles: 0 },
  };
  for (const l of LOTES) {
    r[l.modelo].total++;
    if (l.estado === 'disponible') r[l.modelo].disponibles++;
  }
  return r;
};
