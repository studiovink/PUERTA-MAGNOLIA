# Puerta Magnolia Residencial · sitio web

Sitio estático de **puertamagnolia.mx** hecho con Astro + TypeScript, CSS propio, GSAP (ScrollTrigger y SplitText) y Lenis.
Toma como referencia la experiencia de ever-live-here.com (capítulos, foto que se encoge a arco, buscador visual sobre el plan maestro) y la hace más intuitiva: scroll nativo, menú siempre visible, elección de casa en 3 pasos y WhatsApp a un toque.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:4321 (con --host para verlo en el celular de la misma red)
npm run build      # astro check + build estático en dist/
npm run preview    # sirve dist/
```

Requiere Node 20 o superior. El primer build tarda unos minutos porque genera todas las variantes AVIF/WebP.

## Estructura

```
src/
  assets/          fotos, plantas, render del plan maestro y logos de desarrolladores (originales; Astro los optimiza)
  components/      Header, Footer, Intro (puerta que se abre), Capitulo, Foto, PlantaVisor, Pasos, Indice…
    sections/      una sección por archivo: Hero, Proyecto, Modelos, Comparador, PlanMaestro, Amenidades,
                   Interiores, Ubicacion, Respaldo, Razones, Apartado, Faq, Contacto
  data/            site.ts (contacto, aviso legal), modelos.ts, lotes.ts (sembrado etapa 3), faq.ts, schema.ts (JSON-LD)
  layouts/Base.astro   <head>, SEO, Open Graph, JSON-LD, fuentes
  pages/           index, modelos/[modelo] (violeta, gardenia, jazmin), aviso-legal, aviso-de-privacidad, 404
  scripts/         movimiento.ts (Lenis + GSAP), ui.ts (pestañas, zoom de plantas, comparador, carruseles)
  styles/global.css    tokens de marca (base: 02_Identidad/Variables_para_Claude.css)
public/brand/      logos SVG optimizados (derivados de 02_Identidad/Logos_SVG, sin deformar)
scripts/optimize-logos.py   simplifica los SVG vectorizados píxel a píxel (523 KB → 23 KB)
```

Los ZIP originales (`Puerta_Magnolia_Web/`, `Puerta_Magnolia_Recursos/`) están fuera de git a propósito.

## Dónde cambiar datos

| Qué | Archivo |
|---|---|
| Teléfono, WhatsApp, correo, dirección, redes, apartado, URL del brochure | `src/data/site.ts` |
| Precios, m², frases y diferenciadores de cada modelo | `src/data/modelos.ts` |
| Disponibilidad por lote (hoy es de EJEMPLO) | `src/data/lotes.ts` → cambia `estadoEjemplo` por el inventario real y pon `DISPONIBILIDAD_ES_EJEMPLO = false` |
| Preguntas frecuentes | `src/data/faq.ts` (las que tienen `pendiente` no se publican en el JSON-LD) |

## Pendientes visibles en el sitio (`PENDIENTE: …`)

- PDF del brochure final (`SITE.brochureUrl` en `src/data/site.ts`).
- Disponibilidad real por lote de la tercera etapa.
- Horario de la oficina de ventas.
- Tiempos y distancias verificados a cada referencia de ubicación.
- Esquemas de pago y créditos aceptados.
- Fecha de entrega de la tercera etapa.
- Texto legal completo del aviso de privacidad.

Por confirmar con el cliente (hoy se publica tal cual viene en el contenido): que Violeta tenga recámara principal con baño y vestidor.

## Desplegar en Vercel y conectar puertamagnolia.mx

1. **Sube el repositorio a GitHub** (ya está en `studiovink/PUERTA-MAGNOLIA`).
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Astro; `vercel.json` ya define `npm run build` y la carpeta `dist`. No hace falta ninguna variable de entorno.
3. Elige la rama de producción (por ejemplo `main`, después de fusionar esta rama) y pulsa **Deploy**. Cada push genera una vista previa con su propia URL.
4. **Dominio:** en el proyecto, *Settings → Domains → Add*, escribe `puertamagnolia.mx` y luego `www.puertamagnolia.mx`. Deja `puertamagnolia.mx` como principal; `vercel.json` ya redirige `www` a la versión sin `www`.
5. **DNS** (en el proveedor donde está registrado el dominio, hoy apuntando al WordPress):
   - Registro **A** para `@` → `76.76.21.21`
   - Registro **CNAME** para `www` → `cname.vercel-dns.com`
   - Borra los registros A/CNAME anteriores de `@` y `www` que apuntan al hosting de WordPress. **No toques los registros MX** si el correo `contacto@puertamagnolia.mx` vive en ese proveedor.
   - Vercel muestra los valores exactos en la pantalla del dominio; si difieren de estos, usa los de Vercel.
6. La propagación tarda de minutos a unas horas. Vercel emite el certificado HTTPS en automático.
7. **Después del cambio:** da de alta `https://puertamagnolia.mx/sitemap-index.xml` en Google Search Console y revisa en el Administrador de eventos de Meta que el dominio siga verificado para los anuncios.

### Alternativa: Netlify

Build command `npm run build`, publish directory `dist`. Dominio en *Domain management*, con los registros DNS que indique Netlify.
