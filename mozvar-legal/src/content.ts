/**
 * Contenido y configuración de MOZVAR Legal.
 * Todo lo editable del sitio vive aquí: textos, navegación, imágenes y datos de contacto.
 */

export type ImageId =
  | '01-hero-firma'
  | '02-contratos'
  | '03-experiencia'
  | '04-metodo'
  | '05-casos'
  | '07-resolucion-controversias'
  | '08-estrategia-empresarial'
  | '09-hero-alternativo';

export interface SiteImage {
  id: ImageId;
  alt: string;
  /** Punto de encuadre (object-position), tomado de assets.json del kit. */
  position: string;
}

const img = (id: ImageId, alt: string, position = '50% 50%'): SiteImage => ({ id, alt, position });

export const site = {
  name: 'MOZVAR',
  descriptor: 'Legal',
  /**
   * Datos de contacto. Están PENDIENTES: complétalos con información real.
   * Un valor vacío no se muestra en la página.
   */
  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    hours: '',
  },
  /** Ruta o URL del aviso de privacidad. Vacío: no se enlaza. */
  privacyUrl: '',
  /**
   * Servicio que recibe el formulario. Se configura con VITE_FORM_ENDPOINT (ver README).
   * Sin él, el formulario no simula un envío: avisa que la conexión está pendiente.
   */
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) ?? '',
};

export const nav = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'El despacho', href: '#despacho' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Método', href: '#metodo' },
  { label: 'Contacto', href: '#contacto' },
];

export const hero = {
  /** Cada elemento es una línea del titular en escritorio. */
  titleLines: ['Claridad legal', 'para decidir', 'con confianza.'],
  support: 'Acompañamos a personas y empresas con una estrategia jurídica clara, precisa y cercana.',
  cta: { label: 'Agendar consulta', href: '#contacto' },
  link: { label: 'Conocer servicios', href: '#servicios' },
  /** Portada de escritorio. Alternativa disponible en el kit: '09-hero-alternativo' (posición '60% 45%'). */
  desktop: img('01-hero-firma', '', '50% 46%'),
  alt: 'Abogado firmando un documento sobre una mesa de piedra oscura.',
};

export const intro = {
  label: 'El despacho',
  paragraphs: [
    'Entendemos cada asunto antes de proponer el siguiente paso.',
    'En MOZVAR Legal buscamos que las decisiones importantes se apoyen en una estrategia clara y un acompañamiento cercano.',
  ],
};

export const services = {
  label: 'Servicios',
  title: 'Estrategia jurídica para decisiones importantes.',
  link: { label: 'Hablemos de tu asunto', href: '#contacto' },
  items: [
    {
      title: 'Asesoría legal',
      text: 'Comprende tus opciones y define los siguientes pasos con una visión clara de tu asunto.',
      image: img('01-hero-firma', 'Abogado revisando y firmando un documento.', '50% 46%'),
    },
    {
      title: 'Contratos y documentos',
      text: 'Revisión y preparación de acuerdos para dar claridad a tus compromisos.',
      image: img('02-contratos', 'Revisión de un contrato sobre el escritorio.'),
    },
    {
      title: 'Resolución de controversias',
      text: 'Análisis del conflicto y definición de una ruta de actuación.',
      image: img('07-resolucion-controversias', 'Abogados conversando sobre un asunto.', '50% 46%'),
    },
    {
      title: 'Derecho empresarial',
      text: 'Acompañamiento jurídico para operaciones, proyectos y decisiones de negocio.',
      image: img('08-estrategia-empresarial', 'Equipo de trabajo en una reunión de estrategia.', '52% 48%'),
    },
  ],
};

export const approach = {
  label: 'Forma de acompañar',
  title: 'Una estrategia clara para cada asunto.',
  image: img('03-experiencia', 'Conversación entre un abogado y sus clientes.', '50% 45%'),
  ideas: [
    { title: 'Comprender el contexto.', text: 'Partimos de lo que ocurre y de lo que necesitas resolver.' },
    { title: 'Explicar las opciones.', text: 'Presentamos los caminos posibles en un lenguaje directo.' },
    { title: 'Dar seguimiento al proceso.', text: 'Mantenemos la comunicación mientras el asunto avanza.' },
  ],
};

export const method = {
  label: 'Método',
  title: 'El siguiente paso empieza por entender tu caso.',
  image: img('04-metodo', 'Análisis de documentos durante una sesión de trabajo.', '48% 45%'),
  steps: [
    { title: 'Escuchamos.', text: 'Conocemos el contexto y la información disponible.' },
    { title: 'Definimos una ruta.', text: 'Ordenamos prioridades y explicamos las opciones.' },
    { title: 'Acompañamos.', text: 'Damos continuidad a la estrategia acordada.' },
  ],
};

export const matters = {
  label: 'Asuntos y enfoque',
  title: 'Una visión integral para decisiones que importan.',
  image: img('05-casos', 'Espacio de trabajo del despacho.'),
  categories: [
    { title: 'Empresas', text: 'Operaciones, proyectos y decisiones de negocio.' },
    { title: 'Contratos', text: 'Acuerdos claros para compromisos importantes.' },
    { title: 'Patrimonio', text: 'Orden y previsión para lo que construyes.' },
  ],
};

export const faq = {
  label: 'Preguntas frecuentes',
  title: 'Antes de conversar.',
  items: [
    {
      q: '¿Cómo es la primera consulta?',
      a: 'Es una conversación para conocer tu asunto, la información disponible y lo que buscas resolver. A partir de ahí te explicamos cómo podríamos acompañarte.',
    },
    {
      q: '¿Qué información conviene preparar?',
      a: 'Los documentos y comunicaciones relacionados con tu asunto, además de una breve cronología de lo ocurrido. Si no tienes todo a la mano, empezamos con lo que haya.',
    },
    {
      q: '¿Atienden a personas y a empresas?',
      a: 'Sí. Acompañamos tanto asuntos personales como decisiones y operaciones de negocio.',
    },
    {
      q: '¿Cómo dan seguimiento a un asunto?',
      a: 'Acordamos contigo la forma y la frecuencia de comunicación, y te informamos de los avances y de los siguientes pasos.',
    },
  ],
};

export const contactSection = {
  label: 'Contacto',
  title: 'Hablemos del siguiente paso.',
  support: 'Cuéntanos brevemente qué necesitas y encontremos la mejor forma de conversar.',
  image: img('09-hero-alternativo', 'Abogada atendiendo una reunión en el despacho.', '60% 45%'),
  areas: [...services.items.map((s) => s.title), 'Otro asunto'],
  submitLabel: 'Enviar mensaje',
};

export const footer = {
  note: 'MOZVAR Legal es un concepto de sitio web. La información de esta página no constituye asesoría jurídica.',
};
