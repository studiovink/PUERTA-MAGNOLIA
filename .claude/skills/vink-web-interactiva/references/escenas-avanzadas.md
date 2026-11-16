# Escenas de scroll, componentes animados y 3D

## GSAP: fijar una imagen mientras se recorre el contenido
Usar únicamente con un recorrido suficientemente largo y una imagen cuyo detalle lo
justifique. El adaptador incluido recibe GSAP y ScrollTrigger desde el proyecto: no
descarga bibliotecas por CDN ni modifica el gestor de paquetes.

1. Revisar dependencias y reutilizar la versión compatible existente.
2. Si falta GSAP y se necesita realmente, agregarlo con el gestor del proyecto
   (por ejemplo, `npm install gsap` en un proyecto npm). Mantener su lockfile.
3. Copiar `assets/advanced/gsap-story.mjs` y `story.css`.
4. Construir el siguiente marcado con recursos reales.

```html
<section class="vink-story" data-vink-story>
  <div class="vink-story-stage" data-vink-story-stage>
    <img class="vink-story-visual" data-vink-story-visual
      src="/foto-real.webp" width="1200" height="900" alt="Descripción real">
  </div>
  <div>
    <div class="vink-story-step"><h2>Primer argumento</h2><p>Contenido real.</p></div>
    <div class="vink-story-step"><h2>Segundo argumento</h2><p>Contenido real.</p></div>
    <div class="vink-story-step"><h2>Tercer argumento</h2><p>Contenido real.</p></div>
  </div>
</section>
```

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initStory } from './gsap-story.mjs';
const story = initStory(root, { gsap, ScrollTrigger });
// En el desmontaje: story.destroy();
```

Fijar el contenedor y animar su imagen interior. Verificar que el contenedor quepa en
la altura útil del viewport; si no cabe, reducir el recurso o desactivar la fijación
para esa condición. Ajustar `start` al header real. El final debe superar el inicio.
El ejemplo solo activa fijación desde 1000 px y sin movimiento reducido. En móvil el
contenido continúa en orden normal. No combinar en ese visual los atributos nativos
de `enter`, `reveal`, `tilt` o `parallax`.

Usar `gsap.matchMedia`/contextos y revertirlos. Recalcular después de cambios reales de
layout, fuentes o medios. El adaptador escucha cargas de imágenes y `vink:layout`;
si el proyecto carga fuentes tardías, refrescar también cuando terminen. Medir una
escena antes de repetirla. No cargar GSAP en páginas que no lo usan.

## Motion en proyectos React
Si el proyecto ya utiliza `motion/react`, aprovecharlo para elementos controlados por
React. No instalar Motion además del motor nativo para reproducir el mismo efecto.

```jsx
import { motion, useReducedMotion } from 'motion/react';
export function ProjectLink({ href, children }) {
  const reduce = useReducedMotion();
  return <motion.a href={href}
    initial={false}
    whileHover={reduce ? undefined : { y: -3 }}
    whileTap={reduce ? undefined : { scale: 0.99 }}
    transition={{ duration: 0.18 }}>
    {children}
  </motion.a>;
}
```
Conservar foco visible mediante CSS. No hacer depender información o navegación del
hover. Para scroll, preferir `useScroll` y `useTransform` en componentes que ya usen
esta biblioteca, sin permitir que GSAP controle la misma propiedad del mismo nodo.
Revisar siempre la documentación de la versión instalada.

## Video y secuencias
Un video puede dar una firma visual sin un motor 3D. Para un loop decorativo corto:
proporcionar poster, dimensiones, `muted`, `playsinline` y fallback estático. Detenerlo
fuera de vista y ante movimiento reducido; ofrecer pausa si se reproduce de forma
continua. No ocultar información esencial dentro del video.

Un video ligado al scroll requiere preparación distinta: un archivo largo no permite
por sí solo un scrubbing preciso. Evaluar keyframes, peso, decodificación y acceso al
recurso. Una secuencia de imágenes necesita presupuesto de memoria y carga por demanda.
Entregar primero un fallback funcional si no están los recursos; no prometer fluidez
universal ni descargar cientos de cuadros al inicio.

## Spline o modelos 3D reales
Comprobar si existe escena Spline, GLB/GLTF o modelo equivalente y si su uso está
autorizado. Elegir el recurso menos pesado que cumpla la interacción.
- Spline: integrar un enlace de escena válido con el viewer o adaptador documentado.
- Three.js/R3F: reservar para geometría e interacción que lo justifiquen; reutilizar
  la arquitectura instalada y cargar el canvas según necesidad.
- PNG/WebP: animar la imagen como plano. No afirmar que permite ver caras ocultas.

Diseñar fallback con poster, carga diferida, reducción de complejidad en móvil,
controles accesibles y salida clara de cualquier interacción de cámara. No cargar
dos motores de 3D en una misma página sin una razón comprobable. Si falta la escena,
especificar el encuadre, material, iluminación e interacción requeridos, pero no
inventar una URL ni presentarla como implementada.
