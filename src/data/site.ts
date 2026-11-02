// Datos verificados de 07_Contenido/Contenido_del_sitio.md.
// Lo que no aparece ahí se marca como PENDIENTE y se muestra visible en el sitio.

export const SITE = {
  nombre: 'Puerta Magnolia Residencial',
  nombreCorto: 'Puerta Magnolia',
  url: 'https://puertamagnolia.mx',
  fundacion: '2022',
  telefono: '33 2215 7297',
  telefonoIntl: '+523322157297',
  whatsapp: '523322157297',
  correo: 'contacto@puertamagnolia.mx',
  direccion: {
    calle: 'Jesús Aguilar 1047',
    colonia: 'Jardines de Santa Anita',
    cp: '45646',
    ciudad: 'San Agustín',
    estado: 'Jal.',
    estadoCompleto: 'Jalisco',
    pais: 'MX',
  },
  mapsUrl: 'https://maps.app.goo.gl/ZM1ktyRTdyW4WEpFA',
  instagram: 'https://instagram.com/puertamagnolia',
  facebook: 'https://facebook.com/puertamagnolia',
  apartado: 10000,
  etapa: { nombre: 'Tercera etapa', viviendas: 73 },
  experiencia: 75,
  // El brochure final no se ha entregado: el botón queda desactivado hasta tenerlo.
  brochureUrl: null as string | null,
} as const;

export const direccionCompleta = `${SITE.direccion.calle}, ${SITE.direccion.colonia}, ${SITE.direccion.cp} ${SITE.direccion.ciudad}, ${SITE.direccion.estado}`;

export const mxn = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);

export const waLink = (mensaje: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const WA_DEFAULT = waLink('Hola, me interesa Puerta Magnolia. ¿Me dan información para agendar una visita?');
export const WA_APARTAR = waLink(`Hola, quiero apartar una casa en Puerta Magnolia con ${mxn(10000)}. ¿Qué lotes tienen disponibles?`);

export const NAV = [
  { href: '/#modelos', label: 'Modelos', id: 'modelos' },
  { href: '/#amenidades', label: 'Amenidades', id: 'amenidades' },
  { href: '/#ubicacion', label: 'Ubicación', id: 'ubicacion' },
  { href: '/#por-que', label: 'Por qué aquí', id: 'por-que' },
  { href: '/#contacto', label: 'Contacto', id: 'contacto' },
] as const;

export const AVISO_LEGAL =
  'Las imágenes, renders, planos y representaciones visuales contenidas en este material son de carácter ilustrativo y referencial, elaboradas con fines de promoción. No constituyen una representación exacta ni definitiva del inmueble, sus acabados, dimensiones, mobiliario o amenidades, los cuales pueden variar respecto al producto final. Las amenidades mostradas pueden encontrarse en proceso de construcción o proyecto. Los precios están expresados en pesos mexicanos (MXN), corresponden a la fecha de publicación y están sujetos a cambios y disponibilidad sin previo aviso. La información comercial definitiva y vinculante será la establecida en el contrato de compraventa correspondiente, registrado ante PROFECO conforme a la NOM-247-SE-2021. Este material no constituye oferta vinculante.';
