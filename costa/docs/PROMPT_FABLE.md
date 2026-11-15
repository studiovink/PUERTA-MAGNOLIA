# Construye la web con este paquete

Actúa como un director de arte digital y desarrollador frontend senior. Descomprime el ZIP, lee los documentos y construye una web inmobiliaria premium con las fotografías de este paquete.

## Prioridad principal

Quiero que el diseño y, especialmente, la animación se parezcan lo máximo posible a esta página:

https://www.framer.com/marketplace/templates/real/
https://realagent.framer.website/

La referencia aprobada incluye una entrada de imágenes inclinadas sobre fondo blanco, después una casa que llena la pantalla, un título muy grande en la zona central-derecha y una franja inferior con perfil, tres fotos expandibles y una tarjeta negra para explorar.

También tiene un menú que llena la ventana, bloques editoriales con mucho espacio, propiedades con fotografías grandes y apariciones de texto y fotos al hacer scroll.

No quiero un resultado genérico de inmobiliaria. Conserva esas proporciones, disposición y comportamiento. Debe sentirse como una interpretación propia de la referencia con nuestras imágenes y marca.

## Qué debes leer y usar

1. MOTION_SPEC.md: estados, tiempos, curvas, posiciones, interacción y adaptación móvil.
2. MINI_MANUAL.pdf y MINI_MANUAL.md: identidad y fotografías.
3. assets.json: cada imagen, resolución, colección y punto de encuadre.
4. starter/index.html, site.css, site.js y config.js: base de movimiento ya preparada.
5. public/images y public/fonts: recursos finales que debes incorporar al proyecto.

No borres la base de movimiento para reemplazarla por unos fade-in genéricos. Puedes adaptarla a React y a la estructura existente del proyecto, conservando los estados y las interacciones.

Los tiempos de la base son parámetros iniciales calibrados visualmente. Compara tu resultado con la referencia en el navegador y ajusta lo necesario. No afirmes que el parecido está verificado sin revisar ambas vistas.

## Marca y contenido

La base usa NUMA como texto editable de ejemplo, con descriptor Private Residences. Configura el nombre en un solo lugar. Si el usuario facilita el logo oficial o indica otra marca, usa esa identidad.

Las series se llaman Casa Duna / Los Cabos y Casa Palma / Punta Mita. Son conceptos visuales generados. No presentes sus imágenes como inmuebles verificados en venta ni inventes precios, direcciones, superficies, número de habitaciones o una cartera de clientes.

Si se adjuntan fotografías reales adicionales, intégralas también. La carpeta tus-fotos está preparada para ellas. Conserva las propiedades por separado: no mezcles una casa real con una villa generada como si fueran distintas habitaciones del mismo inmueble.

No inventes retratos del usuario o agentes. El bloque de perfil admite una foto real si se proporciona; mientras tanto usa la inicial y el nombre editable de la base.

## Estructura que debes construir

### Portada

Foto de Casa Duna como inicio. La alternativa es Casa Palma.

Imagen de borde a borde, sin contenedor de ancho máximo, ocupando la altura de la pantalla. Usar una fuente vertical para móvil, no un recorte estrecho que destruya la fachada.

Navegación distribuida: marca a la izquierda; contacto en una segunda columna; indicador verdadero de dos destinos en otra; Menú y dos puntos a la derecha.

Titular grande:

    Casa Duna,
    Los Cabos

Apoyo breve y descriptivo. Mantener fachada, piscina y horizonte reconocibles. La imagen se oscurece solo lo necesario para leer.

La franja inferior conserva la estructura de la referencia: bloque de perfil a la izquierda y, a la derecha, Sala, Baño, Recámara y Explorar.

Esas miniaturas pertenecen a Casa Duna. Cuando se cambie a Casa Palma, actualizar portada, título y todas las miniaturas a la serie correcta.

### Entrada y movimiento

Implementa el cronograma de MOTION_SPEC.md y la lógica de starter/site.js.

La entrada tiene tres imágenes independientes, profundidad e inclinación suave. Después se retira el blanco y aparece la portada. La foto de fondo, las dos líneas del título, la navegación y la franja inferior deben tener tiempos coordinados.

La carga tiene que terminar: si una imagen falla o tarda, mostrar una alternativa y permitir navegar. El estado de introducción no puede bloquear el scroll o el foco de forma permanente.

No uses un MP4 de la interfaz, una diapositiva única o un video generado para simular estos elementos. Cada tarjeta, enlace y menú tiene que funcionar.

### Galería inferior

Hover y foco expanden una foto horizontalmente y revelan su etiqueta. Las tarjetas vecinas se adaptan al ancho disponible. Mantener radios pequeños y movimiento suave.

En móvil, un toque debe poder activar la tarjeta. La información no depende solo del puntero. No cambiar automáticamente toda la portada al pasar sobre cada miniatura.

Explorar debe llevar a una ficha individual de la residencia. La base muestra una galería en un diálogo como demostración; en la web completa construye rutas claras para las fichas.

### Menú

Menú a pantalla completa con fondo #F1F2F4.

Datos y marca a la izquierda; Inicio, Residencias, Nuestra visión y Contacto en gran tamaño a la derecha. En móvil, una sola columna.

Animar apertura y cierre como en la guía. Los dos puntos del botón cambian de orientación. Manejar Escape, foco de teclado, fondo inerte y bloqueo de scroll. Al cerrar, restituir el foco y la posición de la página.

### Colección

Cabecera editorial asimétrica y fotografías grandes en dos columnas. Cada residencia lleva su nombre, región y un enlace a la ficha.

Utiliza Casa Duna y Casa Palma como dos conceptos distintos. No conviertas las doce fotografías en doce propiedades independientes.

### Fichas

Crear una ruta para cada residencia, con portada, galería completa, descripción editable y llamada al contacto.

Las fotos 4K se cargan cuando corresponde, no todas durante la entrada. Las galerías deben conservar proporción y permitir una lectura clara en móvil.

### Nuestra visión y bloques interiores

Combinar textos grandes, materiales, interiorismo y dos fotos. Usar el fondo claro y el bloque oscuro descritos en el manual.

Mantener la lógica de columnas de la referencia. Se puede usar una composición bento en el bloque oscuro, sin llenar toda la web de tarjetas iguales.

Los encabezados entran con máscara de caracteres, sin que eso altere el espacio real entre palabras. Las fotografías se descubren con una máscara y desplazamiento discretos. No aplicar la misma animación exagerada a cada elemento.

### Preguntas y contacto

Acordeones con altura animada, icono + que cambia de estado y navegación por teclado.

CTA final sobre una foto costera y pie de página con navegación. Si se proporciona un correo, teléfono o WhatsApp real, conectarlo desde la configuración. No inventar uno ni simular mensajes enviados.

## Fotografías y rendimiento

Hay 12 fotografías 4K: diez horizontales de 3840 x 2160 y dos verticales de 2160 x 3840. Están en WebP y tienen doce variantes ligeras.

Las rutas finales se encuentran en assets.json. Copia public a la raíz pública del proyecto. En la base local se usa ../public/images; en el proyecto servido adapta las rutas a /images.

La tipografía local está en public/fonts con su licencia.

Usa picture, srcset y sizes reales. Portada con carga prioritaria; interiores con carga diferida. Asigna ancho, alto o aspect-ratio explícitos para evitar saltos.

Precarga solo los recursos esenciales de la entrada y la portada del dispositivo actual. No descargues las dos portadas de móvil y escritorio a la vez si solo necesitas una.

No rebajes las fotos a miniaturas para usarlas de fondo en un monitor grande. Evita blur y filtros que destruyan el detalle. Tampoco subas artificialmente los archivos para llamarlos 8K.

## Calidad y adaptación

- Instrument Sans con pesos 400-600.
- Interfaz casi monocromática; los tonos del mar, la piedra y la vegetación proceden de las fotos.
- Grandes titulares, espacio editorial y bordes fotográficos sutiles.
- Scroll nativo.
- Respetar prefers-reduced-motion.
- Un solo h1, jerarquía de títulos, foco visible, menús y acordeones accesibles.
- No copiar estadísticas, clientes, nombres, teléfonos o textos comerciales de la plantilla de referencia.

La base no es la web final ya publicada. Debes integrarla al proyecto, completar rutas y conectar solo los datos reales que se proporcionen.

## Verificación y entrega

Trabaja hasta que la implementación compile y las rutas de imágenes funcionen.

Revisa como mínimo 390 x 844, 768 px, 1440 x 900 y 1920 px. Verifica también una pantalla ancha con las fotos grandes.

Compara la apertura y las tarjetas con la referencia al mismo tamaño de ventana. Ajusta el ritmo de las imágenes inclinadas, la máscara blanca, el título y el menú. Comprueba que los clics rápidos no dejan una capa blanca, el menú bloqueado o el scroll deshabilitado.

Entrega el código completo y cómo ejecutarlo. Explica cualquier integración de contacto pendiente. No termines con una propuesta: construye y revisa el resultado.
