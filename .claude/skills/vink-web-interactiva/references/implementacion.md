# Integración en proyectos existentes

## Decisión de stack
Inspeccionar `package.json`, rutas y lockfile. Usar scripts del proyecto y conservar
su gestor de paquetes. Reutilizar GSAP o Motion si ya resuelven el caso. El motor
nativo incluido no requiere npm y sirve para una mejora ligera.

Los módulos son ejemplos de base editables, no un motor universal que descubra por
sí solo qué elementos animar. Marcar únicamente elementos elegidos tras la auditoría.

## HTML o componentes estáticos
Copiar los cuatro archivos de `assets/native/` a una carpeta del proyecto. Ajustar
las rutas del siguiente ejemplo. Cargar el CSS desde el mecanismo del sitio.

```html
<link rel="stylesheet" href="/motion/vink.css">
<main id="pagina" data-vink-profile="inmobiliaria">
  <h1 data-vink-enter="rise">El texto aprobado del proyecto</h1>
  <div data-vink-reveal="scale">
    <!-- Mantener dimensiones reales y alt significativo. -->
    <img src="/fotos/fachada.webp" width="1440" height="960" alt="Fachada de la vivienda">
  </div>
  <a class="vink-button" href="#contacto">Agenda tu visita</a>
</main>
<script type="module">
  import { initMotion } from '/motion/vink-motion.mjs';
  import { initControls } from '/motion/vink-controls.mjs';
  const root = document.querySelector('#pagina');
  const motion = initMotion(root);
  const controls = initControls(root);
  // Al desmontar o cambiar esta vista:
  // motion.destroy(); controls.destroy();
</script>
```

No pegar estas rutas literalmente si no existen. Los elementos de ejemplo representan
contenido real que debe localizarse en el proyecto.

## Contrato de atributos
| Atributo o clase | Uso | Precaución |
| --- | --- | --- |
| `data-vink-profile` | Elegir uno de los siete nombres de perfil | Se lee al inicializar |
| `data-vink-enter="rise"` | Entrada inmediata de un elemento del hero | Valores: `rise`, `fade`, `scale` |
| `data-vink-reveal="rise"` | Entrada al alcanzar el viewport, una vez | No usar en el mismo nodo que otro transform |
| `data-vink-parallax` | Desplazamiento corto en escritorio | Máximo ocho capas por instancia |
| `data-vink-tilt` | Inclinación al mover puntero preciso | Aplicar a una capa decorativa independiente |
| `.vink-button` | Respuesta de botones y enlaces | No reemplaza semántica ni estilos de marca |
| `data-vink-filter-group` | Delimitar un grupo de filtros | No anidar grupos |
| `data-vink-filter="all"` | Botón para todos los resultados | Usar `button type="button"` |
| `data-vink-filter="casas"` | Botón para una etiqueta | Coincidencia exacta por etiqueta |
| `data-vink-filter-item="casas sur"` | Resultado con etiquetas separadas por espacios | Contenido visible antes de ejecutar JS |
| `data-vink-filter-status` | Resultado textual del filtro | Añadir `role="status"`, `aria-live="polite"` |
| `data-vink-compare` | Contenedor de comparación | Etiquetar ambas vistas |
| `data-vink-compare-range` | Rango nativo para ajustar comparación | Proporcionar `label` asociado |

Usar elementos anidados si se combinan revelado, inclinación y parallax. Nunca poner
dos efectos que escriben `transform` en el mismo nodo. Los cambios de preferencia de
movimiento cancelan la animación y dejan contenido visible; no se repite el hero.

El motor gestiona los descendientes presentes al inicializar. Si se agrega contenido
dinámico, inicializar una instancia sobre el nuevo subárbol o implementar el efecto
con el ciclo de vida del framework. Re-inicializar una raíz destruye la instancia
anterior para evitar observadores duplicados.

## Filtro accesible
```html
<section data-vink-filter-group aria-label="Modelos">
  <div role="group" aria-label="Filtrar por tipo">
    <button type="button" data-vink-filter="all" aria-pressed="true">Todos</button>
    <button type="button" data-vink-filter="casas" aria-pressed="false">Casas</button>
  </div>
  <p data-vink-filter-status role="status" aria-live="polite"></p>
  <article data-vink-filter-item="casas">Datos reales del modelo</article>
  <article data-vink-filter-item="departamentos">Datos reales del departamento</article>
</section>
```
Al filtrar se emite `vink:layout` con propagación, para recalcular escenas del sitio.
El código no consulta inventarios ni interpreta disponibilidad.

## Comparador
Copiar la estructura completa de `assets/demo/index.html`: contenedor
`data-vink-compare`, etapa con altura definida, primera vista, overlay con clase
`vink-compare-overlay`, línea y un `input type="range" min="0" max="100"` con label.
Usar dos fotografías comparables y alternativas descriptivas. No presentar una
visualización conceptual como evidencia del estado real de una propiedad o paciente.

## React y Next.js
Copiar `assets/native/` y `assets/react/` conservando su relación de carpetas. Importar
CSS en el punto permitido por el framework. Mantener el hook del lado cliente.

```jsx
'use client';
import { useVinkMotion } from './motion/react/useVinkMotion.jsx';

export function Hero() {
  const root = useVinkMotion('salud');
  return <section ref={root}>
    <h1 data-vink-enter="rise">El mensaje real de la clínica</h1>
    <p data-vink-reveal="fade">El texto aprobado de presentación</p>
  </section>;
}
```
El hook se desmonta limpiamente y admite el ciclo de efectos de Strict Mode. Usarlo
en un subárbol estable. Para filtros, comparadores o listas controladas por React,
usar `useState`, `aria-pressed` y el elemento `input`; no mezclar mutaciones directas
de `hidden` con estado React sobre los mismos nodos. El hook `useStaticVinkControls`
se reserva para marcado estático que React no actualiza.

## Framer, Webflow y otros editores
No pegar un módulo ESM donde solo se admite HTML. Usar las interacciones o componentes
del editor y traducir la dirección elegida a sus herramientas. Si hace falta un
componente de código, respetar sus props, tamaño, montaje y publicación. Este paquete
no modifica automáticamente una plantilla hospedada ni desbloquea funciones de pago.
