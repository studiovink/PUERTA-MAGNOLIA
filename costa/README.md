# Costa · NUMA Private Residences

Sitio inmobiliario construido a partir del paquete `Costa_Fable_Kit`: Astro + TypeScript, CSS propio y Web Animations API, sin librerías de animación. Es un proyecto independiente del sitio de Puerta Magnolia que vive en la raíz de este repositorio.

## Ejecutarlo

```bash
cd costa
npm install
npm run dev        # http://localhost:4321
npm run build      # astro check + sitio estático en dist/
npm run preview    # sirve dist/
bash scripts/plano.sh   # copia con rutas relativas en dist-flat/, para vistas previas alojadas
```

Requiere Node 20 o superior. Para publicarlo en Vercel o Netlify, crea un proyecto aparte con `costa` como directorio raíz (build `npm run build`, salida `dist`).

## Qué incluye

- **Inicio** (`src/pages/index.astro`): entrada de fotografías inclinadas, portada a pantalla completa con Casa Duna (alternable a Casa Palma), franja de perfil + Sala / Baño / Recámara expandibles + Explorar, colección, Nuestra visión, bloque oscuro tipo bento, preguntas y pie con llamada al contacto.
- **Fichas** (`/residencias/casa-duna`, `/residencias/casa-palma`): portada, texto editable, galería completa con visor a 4K y enlace a la otra residencia.
- **Explora** (inicio): filtro real de las 10 vistas por residencia o tipo de espacio y comparador deslizable de las dos fachadas. Usa `src/scripts/vink-controls.mjs`, del paquete VINK Web Interactiva.
- **Recorrido** (fichas, pantallas de 1000 px o más): la galería queda fija y cada foto se descubre con el scroll; en móvil, con movimiento reducido o sin JavaScript es la galería normal.
- **Menú** a pantalla completa con Escape, foco atrapado, fondo inerte y bloqueo de scroll.

## Dónde cambiar cada cosa

| Qué | Dónde |
|---|---|
| Marca, descriptor, logo, foto de perfil | `SITE` en `src/data/site.ts` |
| Correo, teléfono, WhatsApp | `SITE.email`, `SITE.phone`, `SITE.whatsapp` (vacíos = no se muestra ningún enlace) |
| Tiempos de animación | `MOTION` en `src/data/site.ts` |
| Residencias, textos, fotos y encuadres | `RESIDENCIAS` en `src/data/site.ts` |
| Preguntas frecuentes | `FAQ` en `src/data/site.ts` |
| Colores, tipografía y retícula | variables al inicio de `src/styles/site.css` |

`SITE.demo = true` presenta las residencias como conceptos visuales (etiqueta «Concepto», nota en fichas y pie). Ponlo en `false` cuando se publiquen propiedades reales con datos verificados.

## Fotografías

`public/images` contiene las 12 fotos del kit en 4K y su variante ligera, más una variante intermedia generada por reducción (1920 px en horizontales, 1290 px en verticales) para que un monitor de 1440–1920 px no descargue el archivo 4K completo. Se regeneran con `npm run variantes`.

Para añadir fotos reales: guarda los originales en `tus-fotos/`, exporta a `public/images` con el patrón `nombre-1280.webp`, `nombre-1920.webp`, `nombre-3840.webp` y crea una residencia nueva en `RESIDENCIAS`. No mezcles una casa real con las series generadas.

## Pendiente

- **Contacto:** no se proporcionó correo, teléfono ni WhatsApp. El pie muestra «Los datos de contacto se publicarán aquí» hasta que se rellenen en `SITE`. No hay formulario ni envío simulado.
- **Marca:** NUMA es el nombre de ejemplo del kit; falta el logo oficial (`SITE.logo`).
- **Fotos del usuario:** la carpeta `tus-fotos/` está vacía.

La documentación original del kit está en `docs/`.
