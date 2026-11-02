import { mxn } from './site';

// Solo datos de Contenido_del_sitio.md. Lo que falta queda como pendiente visible
// y NO se publica en el JSON-LD de FAQPage.
export interface Pregunta { p: string; r: string; pendiente?: string }

export const FAQ: Pregunta[] = [
  {
    p: '¿Cuánto cuestan las casas en Puerta Magnolia?',
    r: `Violeta desde ${mxn(2990000)}, Gardenia desde ${mxn(3150000)} y Jazmín desde ${mxn(3300000)}. Los precios están en pesos mexicanos y sujetos a cambios y disponibilidad.`,
  },
  {
    p: '¿Con cuánto puedo apartar?',
    r: `Apartas con ${mxn(10000)}, sujeto a disponibilidad. Puedes elegir tu lote en la tercera etapa.`,
  },
  {
    p: '¿Qué formas de pago tienen?',
    r: 'Formas de pago pensadas para que des el paso sin forzar tu economía. Un asesor te explica las opciones vigentes.',
    pendiente: 'esquemas de pago y créditos aceptados',
  },
  {
    p: '¿Dónde está Puerta Magnolia?',
    r: 'En Jesús Aguilar 1047, Jardines de Santa Anita, 45646 San Agustín, Jal., al sur de Guadalajara: nueva zona de Galerías Sur, cerca de Galerías Santa Anita y con acceso directo a Av. López Mateos Sur.',
  },
  {
    p: '¿Qué amenidades tiene el residencial?',
    r: 'Alberca, casa club, terraza de eventos, juegos infantiles y un parque lineal con áreas verdes, pet park, pérgolas y área de picnic.',
  },
  {
    p: '¿Cuántas recámaras tienen las casas?',
    r: 'Los tres modelos tienen 3 recámaras, 2.5 baños, dos niveles, jardín y 2 estacionamientos, en lote de 6 × 17 m. Gardenia suma oficina y Jazmín suma sala de TV y jardín con terraza.',
  },
  {
    p: '¿Cuándo se entregan las casas?',
    r: 'Pregunta a un asesor por la fecha de entrega de tu lote.',
    pendiente: 'fecha de entrega de la tercera etapa',
  },
  {
    p: '¿Quién construye Puerta Magnolia?',
    r: 'Fonurba y Lodela, empresas que suman 75 años de experiencia en construcción.',
  },
];
