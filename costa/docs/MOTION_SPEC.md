# Dirección de movimiento

Referencia: https://realagent.framer.website/

La meta es reproducir el comportamiento visual observado: fotografías inclinadas sobre blanco al entrar, revelado de portada, título grande, galería inferior que se ensancha, menú completo, tipografía que aparece al hacer scroll y fotografías que se descubren con suavidad.

Los tiempos siguientes son una calibración visual para iniciar la implementación. No se han obtenido del código privado de la plantilla. Fable debe ajustarlos al comparar la demo y el resultado a la misma resolución.

## Escena inicial

La escena se anima con elementos HTML e imágenes independientes. El código de ejemplo está en starter/site.js y los valores en starter/config.js.

Primero cargar la imagen de portada que corresponde al dispositivo y las tres versiones ligeras de la entrada. Una imagen que tarde o falle no debe bloquear la página indefinidamente. El ejemplo limita esta espera y tiene una salida de emergencia.

El siguiente cronograma empieza al terminar esa precarga:

| Tiempo aproximado | Acción |
| --- | --- |
| 0.00-2.22 s | Tres fotografías cruzan el encuadre sobre fondo blanco, con inclinación alternada y profundidad discreta |
| 2.22-2.86 s | La capa blanca se recoge hacia arriba y revela la residencia |
| 2.86-4.31 s | La foto de portada pasa de escala 1.045 a 1.000 |
| 2.93-3.63 s | Aparece la navegación con un desplazamiento vertical de 12 px |
| 2.97-3.96 s | Entran las dos líneas del título, enmascaradas y con 90 ms de separación |
| 3.16-4.01 s | Sube y aparece la franja de tarjetas inferiores |

### Fotografías de la entrada

- Usar recámara, sala y baño, no tres copias de una fachada.
- Perspectiva: 1400 px.
- Escritorio: ancho aproximado 59vw, máximo 950 px, proporción 1.55.
- Móvil: ancho 82vw y proporción 1.18.
- Inclinaciones de inicio: -7°, +6°, -5°; en móvil: -4°, +4°, -3°.
- Cada imagen dura 1700 ms, con 260 ms de desfase.
- Trayectoria: entrar desde abajo, pasar por el centro y salir arriba.
- Mantener los giros suaves. Las fotos no deben dar vueltas completas.
- La foto final de la portada no es una tarjeta: debe llenar el viewport sin marco.

## Portada

| Elemento | Escritorio | Móvil |
| --- | --- | --- |
| Imagen | Horizontal de 3840 x 2160 | Fuente vertical de 2160 x 3840 |
| Alto | 100svh, mínimo 780 px en la base | 100svh, mínimo 760 px en la base |
| Titular | Inicio cerca de x=35%, y=35% | Margen de 22 px, y cercano al 30% |
| Título | 60-114 px, peso 400 | 48-68 px, peso 400 |
| Tarjetas | Franja inferior con proporción 1:2 entre perfil y galería | Perfil compacto y fila de espacios debajo |
| Encuadre | object-fit: cover; 50% 46% | object-fit: cover; 50% 48% |

La marca, un contacto y el indicador de destinos se reparten arriba; el menú queda en la esquina superior derecha. El texto grande corresponde a la residencia, no a un eslogan genérico superpuesto sin relación con la foto.

La base usa NUMA como texto editable de ejemplo. El bloque de perfil muestra una inicial y no inventa una persona. Si el usuario facilita foto o logo, se sustituye ese bloque.

En ventanas de menos de 760-780 px de alto, la base reduce tipografía y franja inferior para conservar la altura del viewport sin ocultar las tarjetas.

## Tarjetas expandibles

- Tres tarjetas: Sala, Baño y Recámara, más una tarjeta negra Explorar.
- Perfil a la izquierda, aproximadamente un tercio de la franja.
- Al entrar con el puntero o enfocar con teclado, la tarjeta activa crece de flex-grow 1 a 1.65.
- Duración: 560 ms.
- Curva: cubic-bezier(.22,1,.36,1).
- La imagen escala apenas hasta 1.025.
- El número se desvanece y aparece el nombre del espacio.
- El resto de la franja se adapta; no superponer una tarjeta encima de las otras.
- En móvil, el primer toque activa la tarjeta. No depender solo de hover.
- No cambiar de forma automática la foto de fondo al pasar por una miniatura.
- Explorar abre la galería de la residencia en la base. En la web final debe enlazar a la ficha individual con la transición correspondiente.

## Menú completo

- Fondo gris muy claro que cubre la pantalla.
- Apertura mediante máscara vertical desde arriba, 720 ms.
- Cierre inicial: aproximadamente 520 ms.
- Dos columnas en escritorio: datos a la izquierda, enlaces grandes a la derecha.
- En móvil: enlaces primero, datos debajo.
- Los dos puntos horizontales del activador giran a vertical.
- Los enlaces aparecen con 130 ms de espera inicial, 70 ms de desfase y 650 ms de duración.
- Bloquear el scroll del fondo, conservar la posición y volver al punto anterior al cerrar.
- El fondo no debe ser enfocable mientras esté abierto.
- Escape cierra; Tab recorre el menú sin escapar; el foco vuelve al botón al cerrar.
- Cancelar la animación anterior si el usuario abre o cierra rápidamente.

## Scroll

Encabezados: líneas naturales y caracteres individuales que suben desde una máscara. Los espacios entre palabras deben seguir siendo normales. Mantener una etiqueta accesible que permita leer el título completo.

- Activar cuando aproximadamente 13% del elemento entra al viewport.
- Animación de caracteres: 800 ms.
- Desfase: 11 ms por carácter, limitado a 420 ms en total.
- Fotografías y bloques: 850 ms, desplazamiento de 30 px y una máscara discreta.
- Ejecutar una vez por carga, no cada vez que se pasa por la sección.
- La página mantiene scroll nativo. No secuestrar la rueda ni sincronizar toda la página con una línea de tiempo.

## Tarjetas de propiedades y cambio de residencia

Hover o foco: un zoom sutil de 1.035 en la foto durante 900 ms.

La base cambia entre Casa Duna y Casa Palma. Precarga la portada siguiente, desvanece la anterior durante 230 ms, actualiza los contenidos y muestra la nueva foto durante 450 ms. No repite la introducción de toda la página.

La web completa debe incluir rutas individuales y galerías para ambas residencias, en vez de presentar cada foto interior como un inmueble diferente.

## Acordeones

Apertura de altura: 350 ms. Cierre: 260 ms. El signo + gira 45°. La altura vuelve a su valor natural al acabar para permitir cambios de tamaño de texto o ventana.

## Movimiento reducido y robustez

Con prefers-reduced-motion, mostrar la portada directamente, mantener lectura y navegación, reducir los cambios a estados inmediatos y no realizar scroll animado.

El contenido tiene que ser visible si falla una imagen. Una petición lenta no debe dejar la portada tapada por blanco. No aplicar blur al fondo ni generar un video de la interfaz: las tarjetas y el menú deben seguir siendo interactivos.

El halo azul del cursor de algunas observaciones no forma parte de la identidad visual y no se reproduce.

## Comparación final que debe hacer Fable

1. Comparar al mismo tamaño de ventana, primero 1440 x 900 y después 390 x 844.
2. Grabar una carga desde cero de cada página.
3. Comparar el paso de imágenes, inclinación, tamaño y momento de revelado.
4. Comparar proporciones de portada, título y franja de tarjetas.
5. Probar hover, foco, toque, menú rápido, Escape y regreso de navegación.
6. Repetir con movimiento reducido y una imagen que no llegue.

La prueba de sintaxis y las rutas de archivos se revisan en este kit. La calibración visual final del sitio implementado corresponde a Fable.
