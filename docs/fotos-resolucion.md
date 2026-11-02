# Fotos: resolución y qué pedir para que todo se vea en alta

## El problema

Las fotos que tenemos miden entre **1,000 y 1,815 px** de ancho. Para que una foto se vea nítida en una pantalla retina (iPhone, MacBook, la mayoría de celulares actuales) necesita **al menos el doble de pixeles que el espacio que ocupa**. Una foto a pantalla completa en una laptop necesita unos **2,880 px**, así que las nuestras se estiraban y se veían suaves.

No hay versiones más grandes en los paquetes: las "cine" y los JPG de "Recursos" tienen las mismas medidas y la misma calidad. Varias, además, ya traen nombres de archivo de cámara (IMG_3725, IMG_9894…), así que **los originales existen** y son mucho más grandes.

## Lo que ya se corrigió en el sitio

| Dónde | Antes | Ahora |
|---|---|---|
| Capítulos "El proyecto" y "Amenidades" | Foto a pantalla completa (1,440 px o más) con una foto de 1,086–1,448 px: se veía estirada | La foto va en un marco tipo galería que **nunca supera su resolución real** (1.6 px de imagen por px de pantalla) |
| Render del plan maestro | Se mostraba a 1,300 px con un archivo de 1,593 px | Máximo 1,000 px de ancho; la tarjeta de la etapa queda al lado |
| Zoom de plantas | Hasta 300 %: se pixeleaba | El zoom se detiene en el tamaño real del plano |
| Cocina y sala de la casa muestra | Tomas con mucha compresión | Se cambiaron por las tomas de "Recursos", más limpias y mejor encuadradas |
| Alberca (amenidades) | Vista aérea de 1,000 px | Vista con la casa club, de 1,086 px y mejor color |
| Calidad de compresión | Hero al 60 %, capítulos al 72 % | Hero al 68 %, capítulos al 80 % |

Con esto ninguna foto se muestra más grande de lo que aguanta. Para usar fotos a pantalla completa (lo más impactante), hacen falta los originales.

## Qué pedirle al cliente o al fotógrafo

Lo ideal: **los archivos originales de cámara o dron, sin recortar**, al menos **3,000 px en su lado mayor** (mejor 4,000+), en JPG de máxima calidad o TIFF. Nosotros los optimizamos para web.

| Foto | Archivo actual | Medida actual | Pedir |
|---|---|---|---|
| Fachada frontal (hero) | `fachada-frontal.jpg` (IMG_3725) | 1,448 × 1,086 | Original IMG_3725, ≥ 3,000 px |
| Conjunto de casas (El proyecto) | `conjunto-casas.jpg` (IMG_3723) | 1,448 × 1,086 | Original IMG_3723, ≥ 3,000 px |
| Casa club y alberca (Amenidades) | `casa-club-alberca.jpg` (IMG_9894) | 1,086 × 1,448 | Original IMG_9894, ≥ 3,000 px |
| Juegos infantiles | `juegos-infantiles.jpg` (IMG_3683) | 1,086 × 1,448 | Original IMG_3683 |
| Terraza casa club | `terraza-casa-club.jpg` (IMG_9901) | 1,086 × 1,448 | Original IMG_9901 |
| Sala casa club | `sala-casa-club.jpg` (IMG_3693) | 1,086 × 1,448 | Original IMG_3693 |
| Alberca otra vista | `alberca-vista.jpg` (IMG_3677) | 1,086 × 1,448 | Original IMG_3677 |
| Fachadas Violeta, Gardenia, Jazmín | `fachada-*.webp` | 1,200 × 1,800 | Originales de las 3 fachadas |
| Casa muestra (cocina, sala, comedor, recámaras, baño, jardín) | `interior-*.webp/jpg` | 1,086–1,200 px | Originales de la sesión de la casa muestra |
| Parque lineal, calle interior, alberca con familia | `*.webp` | 896–1,200 px | Originales de la sesión de amenidades |
| Render del plan maestro | `plan-maestro.png` | 1,593 × 1,059 | Exportación del render a ≥ 3,200 px (o el archivo del despacho) |
| Plantas de los modelos | `*-baja.png`, `*-alta.png` | ~450 px de ancho | Plantas en PDF/vector del arquitecto, o exportación ≥ 2,000 px |
| Vista aérea y acceso (hechas con IA) | no se usan | — | Fotogramas del video de dron original |

**Cómo integrarlas:** se reemplaza el archivo con el mismo nombre en `src/assets/fotos/`. El sitio genera solo todas las versiones (AVIF/WebP en varios tamaños). Si llegan fotos de ≥ 3,000 px, se puede regresar a la foto a pantalla completa en los capítulos subiendo el límite en `src/components/Capitulo.astro` (`foto.width / 1.6`).

## ¿Y ampliarlas con inteligencia artificial?

Se puede, pero no lo hicimos: el brief pide no ampliar artificialmente las imágenes, y la IA inventa detalles (texturas de piedra, hojas, ventanas) que pueden no coincidir con la obra real, algo delicado en publicidad inmobiliaria ante PROFECO. Si el cliente lo autoriza, conviene usarla solo en fotos de ambiente (cielo, jardín), nunca en fachadas ni interiores que muestran acabados.
