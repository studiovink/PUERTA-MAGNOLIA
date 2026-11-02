// Schema.org en JSON-LD: Organization, Place, SingleFamilyResidence + Offer (MXN) y FAQPage.
import { SITE } from './site';
import { MODELOS, COMUN, type Modelo } from './modelos';
import { FAQ } from './faq';

const direccion = {
  '@type': 'PostalAddress',
  streetAddress: SITE.direccion.calle,
  addressLocality: SITE.direccion.ciudad,
  addressRegion: SITE.direccion.estadoCompleto,
  postalCode: SITE.direccion.cp,
  addressCountry: SITE.direccion.pais,
};

export const organizacion = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organizacion`,
  name: SITE.nombre,
  url: SITE.url,
  logo: `${SITE.url}/icon-512.png`,
  email: SITE.correo,
  telephone: SITE.telefonoIntl,
  foundingDate: SITE.fundacion,
  address: direccion,
  sameAs: [SITE.instagram, SITE.facebook],
  contactPoint: { '@type': 'ContactPoint', telephone: SITE.telefonoIntl, contactType: 'sales', areaServed: 'MX', availableLanguage: 'es' },
};

export const lugar = {
  '@context': 'https://schema.org',
  '@type': ['Place', 'Residence'],
  '@id': `${SITE.url}/#residencial`,
  name: SITE.nombre,
  description: 'Residencial de casas de dos niveles y 3 recámaras al sur de Guadalajara, en San Agustín, Tlajomulco, Jalisco; cerca de Galerías Santa Anita y con acceso directo a Av. López Mateos Sur.',
  address: direccion,
  hasMap: SITE.mapsUrl,
  amenityFeature: ['Alberca', 'Casa club', 'Terraza de eventos', 'Juegos infantiles', 'Parque lineal y áreas verdes', 'Pet park'].map((n) => ({
    '@type': 'LocationFeatureSpecification', name: n, value: true,
  })),
};

export const residencia = (m: Modelo) => ({
  '@context': 'https://schema.org',
  '@type': 'SingleFamilyResidence',
  '@id': `${SITE.url}/modelos/${m.id}#casa`,
  name: `Casa modelo ${m.nombre} · ${SITE.nombreCorto}`,
  description: `${m.frase} Casa de ${COMUN.niveles} niveles y ${m.m2} m² de construcción en lote de ${COMUN.lote}: ${COMUN.recamaras} recámaras, ${COMUN.banos} baños${m.suma.length ? `, ${m.suma.join(', ').toLowerCase()}` : ''}, jardín y ${COMUN.estacionamientos} estacionamientos.`,
  url: `${SITE.url}/modelos/${m.id}`,
  floorSize: { '@type': 'QuantitativeValue', value: m.m2, unitCode: 'MTK' },
  numberOfRooms: COMUN.recamaras,
  numberOfBedrooms: COMUN.recamaras,
  numberOfFullBathrooms: 2,
  numberOfPartialBathrooms: 1,
  containedInPlace: { '@id': `${SITE.url}/#residencial` },
  address: direccion,
  offers: {
    '@type': 'Offer',
    price: m.precio,
    priceCurrency: 'MXN',
    availability: 'https://schema.org/InStock',
    url: `${SITE.url}/modelos/${m.id}`,
    seller: { '@id': `${SITE.url}/#organizacion` },
    description: `Precio desde ${m.precio} MXN. Sujeto a cambios y disponibilidad.`,
  },
});

export const preguntas = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.filter((f) => !f.pendiente).map((f) => ({
    '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r },
  })),
};

export const migas = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: it.url })),
});

export const todosLosModelos = () => MODELOS.map(residencia);
