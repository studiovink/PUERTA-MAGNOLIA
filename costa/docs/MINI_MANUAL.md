# Costa / Dirección visual

## Identidad editable

La base utiliza NUMA como nombre editable de ejemplo para una inmobiliaria de residencias privadas. El nombre y la identidad definitiva se cambian en starter/config.js. Si se facilita el logo oficial, usar ese archivo.

La propuesta toma el lenguaje de la plantilla Real: una fotografía protagonista, tipografía grande y regular, navegación distribuida, tarjetas fotográficas en la parte baja y bloques interiores en blanco o gris claro.

## Colores

| Función | Hex |
| --- | --- |
| Blanco de entrada | #FFFFFF |
| Fondo claro | #F1F2F4 |
| Texto oscuro | #111312 |
| Texto secundario | #777E7D |
| Divisiones | #DFE2E3 |
| Bloque oscuro | #323838 |

Los colores cálidos, azules y verdes proceden de las fotografías. Mantener la interfaz casi monocromática.

## Tipografía y forma

Instrument Sans variable, incluida con licencia. Titulares de peso 400, textos de peso 400-500, marca de peso 600.

Portada: 60-114 px en escritorio y 48-68 px en celular. Títulos de sección: 38-76 px en escritorio y 42 px como punto inicial móvil. Ajustar con la longitud real de los textos.

Tracking de titulares: -0.045 a -0.055 em. Interlineado de 1.03-1.10. Márgenes laterales: 2.65vw en escritorio y alrededor de 22 px en móvil.

Fotografías rectangulares con radio de 5-6 px. Evitar sombras grandes. Botones de llamada a la acción en cápsula cuando haga falta.

## Series fotográficas

Casa Duna / Los Cabos: piedra travertino, vidrio bronce, techos de madera cálida, agaves, roca y océano azul. Es la propuesta principal de portada.

Casa Palma / Punta Mita: piedra marfil, parota, pórtico curvo, palmeras, vegetación costera y Pacífico.

Cada serie contiene fachada, sala, recámara, baño, alberca/terraza y portada vertical. Son conceptos visuales, no propiedades verificadas.

Usar la sala, baño y recámara de la misma serie en la franja de portada. Las dos portadas verticales tienen un encuadre específico para celular.

## Resolución

Diez fotos horizontales: 3840 x 2160. Dos verticales: 2160 x 3840.

Todas se entregan en WebP con una variante ligera adicional. Las versiones horizontales ligeras tienen 1280 px de ancho; las verticales, 900 px.

La foto grande se selecciona mediante srcset y sizes: 100vw. La portada carga con prioridad; los interiores utilizan carga diferida y proporción explícita. La nitidez de 4K no exige descargar todos los archivos grandes al abrir la página.

## Fotos que proporcione el usuario

Añadir las nuevas fotos a la carpeta tus-fotos y conservar su propiedad e identidad. Si pertenecen a otro inmueble, crear otra colección. Actualizar el mapa y las galerías; no dar por hecho que una fotografía de una casa real muestra un cuarto de alguna de las villas generadas.

## Contenido

Priorizar el nombre de la residencia y su región. No copiar el nombre de la agente, teléfonos, testimonios, precios o estadísticas de la referencia.

La demo muestra dos destinos y doce vistas, que corresponden al contenido del kit. Los datos comerciales reales y medios de contacto se completarán cuando se proporcionen.

## Animación

La guía detallada está en MOTION_SPEC.md. La base usa elementos HTML, CSS y Web Animations API sin dependencias externas.

El resultado final debe conservar la entrada con fotos, la portada completa, los paneles expandibles y el menú a pantalla completa. La animación acompaña la fotografía; no sustituye la página por un video.
