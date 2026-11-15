# MOZVAR Legal · sitio web

Sitio de una sola página para **MOZVAR Legal**, un concepto de firma jurídica. Hecho con React, TypeScript y Vite, con CSS propio. Sigue el prompt maestro y el mini manual del kit `MOZVAR_Claude_Ligero`.

Es un proyecto independiente del sitio de Puerta Magnolia que vive en la raíz de este repositorio: tiene su propio `package.json` y se despliega por separado.

## Ejecutar

Requiere Node 20 o superior.

```bash
cd mozvar-legal
npm install
npm run dev       # desarrollo, http://localhost:5173
npm run build     # revisa tipos y compila a dist/
npm run preview   # sirve dist/
```

## Estructura

```
public/
  brand/    wordmarks SVG (blanco y negro) y favicon, del kit
  fonts/    Instrument Sans variable y su licencia OFL
  images/   9 fotografías en WebP: variante ligera (1280 px) y 4K (3840 px); la vertical, 1080 y 2160 px
src/
  content.ts          textos, navegación, imágenes y datos de contacto (todo lo editable)
  App.tsx             orden de las secciones y revelado al hacer scroll
  components/         Header, Hero, Sections (despacho, servicios, acompañamiento, método, asuntos), Faq, Contact, Footer, Picture
  styles/tokens.css   fuente local, colores y medidas del kit
  styles/site.css     estilos por sección
```

## Dónde cambiar cada cosa

| Qué | Dónde |
|---|---|
| Textos, servicios, preguntas frecuentes | `src/content.ts` |
| Correo, teléfono, WhatsApp, dirección, horario | `site.contact` en `src/content.ts` |
| Aviso de privacidad | `site.privacyUrl` en `src/content.ts` |
| Foto de portada (alternativa: `09-hero-alternativo`) | `hero.desktop` en `src/content.ts` |
| Colores, tipografía, márgenes | `src/styles/tokens.css` |

## Movimiento

Todo el movimiento vive en `src/motion.ts` y en el bloque final de `src/styles/site.css`:

- Entrada: sobre una pantalla tinta se dibuja un escudo (blasón, balanza y laureles) trazo por trazo, sube la marca y corre un contador; espera a la foto de portada y se retira como telón (`src/components/Opening.tsx`).
- Portada con profundidad: la foto sigue al cursor y se desplaza al hacer scroll; el titular entra línea por línea.
- Fotos que se descubren al entrar, con parallax interno e inclinación 3D con brillo al pasar el cursor.
- Botones y enlaces magnéticos, y un cursor que acompaña al puntero.
- Titulares que entran palabra por palabra y texto del despacho que se ilumina al avanzar.
- Cinta de texto continua cuya velocidad responde al scroll.
- Marca del pie que se levanta en 3D, letra por letra.

Con `prefers-reduced-motion` no se activa nada de esto y el contenido se muestra completo. En pantallas táctiles se omiten el cursor, el efecto magnético y la inclinación.

## Pendientes antes de publicar

- **Datos de contacto.** Están vacíos a propósito: no se inventó teléfono, correo, dirección ni WhatsApp. Un dato vacío no se muestra; al llenarlo aparece en la sección de contacto y, en su caso, en el pie.
- **Envío del formulario.** No hay servicio conectado. El formulario valida los campos y, al enviar, avisa que el mensaje no se envió; nunca muestra un éxito falso. Para conectarlo, crea un archivo `.env` (hay un ejemplo en `.env.example`) con:

  ```bash
  VITE_FORM_ENDPOINT=https://tu-servicio.example/formulario
  ```

  El sitio hace un `POST` con JSON (`nombre`, `correo`, `telefono`, `area`, `mensaje`) y espera una respuesta 2xx. Sirve cualquier servicio de formularios que acepte JSON o una función propia.
- **Aviso de privacidad.** Falta su contenido real; al definir `site.privacyUrl` se enlaza desde el formulario y el pie.
- **Imagen social.** `og:image` usa una ruta relativa (`/images/09-hero-alternativo-1280.webp`). Cuando exista dominio, cámbiala por la URL completa en `index.html`.
- **Marca y dominio.** MOZVAR Legal es un nombre de concepto sin validación registral ni de dominio.
- **Contenido.** No se incluyen clientes, testimonios, cifras ni credenciales. Las personas de las fotos son generadas y no identifican a un equipo real.

## Comprobado

Compilación sin errores y revisión en navegador a 390, 768, 1440 y 1920 px: sin desplazamiento horizontal, todas las imágenes cargan, un solo `h1`, menú móvil con foco contenido y cierre con Escape, anclas que respetan la altura de la navegación, acordeón por teclado y validación del formulario.
