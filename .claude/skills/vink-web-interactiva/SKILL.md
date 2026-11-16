---
name: vink-web-interactiva
description: Mejorar webs con animaciones e interacciones adaptadas a su marca. Usar al pedir una web dinámica, scroll narrativo, microinteracciones, 3D o mejorar sitios existentes.
---

# VINK Web Interactiva

Convertir una web existente en una experiencia dinámica, con movimiento propio de su
marca e interacciones que ayuden a explorar, elegir o contactar. Aplicar también a
webs nuevas. Trabajar sobre el código y los recursos disponibles; completar la
integración y la verificación dentro del alcance solicitado.

## 1. Revisar antes de cambiar

1. Identificar objetivo de negocio, público, CTA principal, identidad y recursos.
2. Inspeccionar el proyecto, rutas, componentes, dependencias y animaciones existentes.
   Si hay terminal, ejecutar `python3 scripts/audit_project.py RUTA_DEL_PROYECTO`.
3. Conservar marca, logotipo, textos aprobados, datos comerciales, formularios y
   conexiones. No reemplazar fotografías reales por imágenes inventadas.
4. Si solo existe una URL, inspeccionarla con las herramientas disponibles. No afirmar
   que se modificó el sitio original: solicitar su código para editarlo o crear una
   propuesta separada si eso es lo autorizado. Con capturas, distinguir lo visible de
   los comportamientos que no se pudieron observar.
5. Si falta un detalle de estilo, elegir una solución compatible y continuar. Preguntar
   únicamente por información imprescindible que no esté en los archivos.

## 2. Elegir un perfil y una firma propia

Leer [perfiles](references/perfiles.md) y elegir el perfil por el contenido real,
no únicamente por el nombre de la marca. Combinar perfiles solo con un motivo claro.

| Perfil | Movimiento principal | Interacción útil |
| --- | --- | --- |
| inmobiliaria | Recorrido fotográfico y cambio de escala moderado | Explorar modelos o amenidades |
| salud | Ritmo sereno y transiciones suaves | Explorar especialidades y preguntas |
| gastronomia | Descubrimiento de fotografía y ritmo de servicio | Filtrar la carta |
| tecnologia | Secuencia de producto precisa | Elegir variantes o comparar |
| deporte | Entradas cortas y ritmo enérgico | Explorar disciplinas u horarios |
| estudio | Composición editorial y proyectos protagonistas | Filtrar proyectos |
| editorial | Cambios de sección discretos | Índice o exploración de contenidos |

Definir en 4–6 líneas la intención, una firma memorable, dos apoyos sutiles y una
interacción funcional. Implementar enseguida; evitar pedir aprobación rutinaria del
plan cuando el usuario ya solicitó el trabajo. No convertir todos los perfiles en la
misma plantilla con distintos colores.

## 3. Elegir la implementación mínima suficiente

Leer [implementación](references/implementacion.md). Reutilizar primero lo que ya
existe en el proyecto. No instalar todas las bibliotecas del catálogo.

- HTML, Astro o componentes simples: usar `assets/native/vink-motion.mjs`,
  `vink-controls.mjs`, `profiles.mjs` y `vink.css`. Funcionan sin dependencias externas.
- React o Next.js: usar el adaptador `assets/react/useVinkMotion.jsx` en el límite
  cliente. Mantener datos y rutas en la arquitectura existente.
- Coreografía de scroll con fijación: leer `references/escenas-avanzadas.md` y usar
  `assets/advanced/gsap-story.mjs` cuando aporte algo real. Instalar GSAP solo si hace
  falta y no existe una solución adecuada en el proyecto.
- Si Motion ya está presente: seguir la receta de ese mismo documento y dar a cada
  elemento un único dueño de sus transformaciones.
- 3D interactivo: integrar una escena o modelo real disponible. Una imagen con aspecto
  3D no tiene geometría ni caras ocultas. Si falta el modelo, entregar un tratamiento
  de imagen honesto y especificar el recurso requerido para la variante 3D.

Crear una sola entrada principal. Evitar loaders decorativos que bloqueen el contenido,
scroll secuestrado, cursores que oculten el cursor normal, sonido automático y
animaciones continuas de toda la página. No añadir servicios de pago, tracking o
generaciones de medios como consecuencia automática de esta skill.

## 4. Implementar para personas y dispositivos reales

- Mantener contenido, enlaces y formularios utilizables cuando falle JavaScript.
- Usar elementos semánticos, foco visible y controles con teclado.
- Respetar `prefers-reduced-motion`, también si cambia durante la sesión.
- En móvil, sustituir efectos de hover por controles visibles; simplificar parallax,
  fijaciones y escenas pesadas. Mantener el desplazamiento natural.
- Reservar dimensiones de imágenes y videos. Priorizar el recurso principal; cargar
  el resto según necesidad. No afirmar una puntuación de rendimiento sin medirla.
- Limpiar observadores, listeners y animaciones en desmontaje o cambio de ruta.
- Mantener el CTA principal claro y accesible durante la experiencia.
- Hacer reales filtros, comparadores o selectores. No simular envíos, reservas,
  disponibilidad, precios, resultados o integraciones.

## 5. Verificar y entregar

Leer [verificación](references/verificacion.md). Ejecutar los checks existentes que
correspondan al cambio. Revisar escritorio, móvil, teclado, movimiento reducido,
JavaScript desactivado y montaje/desmontaje si hay un framework.

Entregar código integrado, una vista o artefacto revisable cuando el entorno lo permita
y un resumen breve de cambios, validación y recursos pendientes. Distinguir las pruebas
realmente ejecutadas de las comprobaciones recomendadas. No afirmar que la web está
publicada si solo se preparó el código. Para cambios en varios sitios, aplicar este
ciclo a cada uno y conservar sus identidades y dependencias por separado.

## Recursos según necesidad

- [Perfiles y ejemplos de dirección](references/perfiles.md).
- [Integración y contrato de atributos](references/implementacion.md).
- [GSAP, Motion, video y 3D](references/escenas-avanzadas.md).
- [Verificación](references/verificacion.md).
- [Prompts para repetir el proceso](references/prompts.md).
- [Instalación en Claude y fuentes oficiales](references/uso-y-fuentes.md).
- `assets/demo/index.html`: demostración local de los siete ritmos y de controles
  funcionales, sin descargas externas. Usarla para estudiar el comportamiento, no
  copiar su estilo visual a todos los proyectos.

## Ejemplos de aplicación

**Petición:** «Mejora una inmobiliaria con fotos reales y hazla más dinámica».
Elegir inmobiliaria, revelar una toma principal, secuenciar el recorrido y permitir
explorar modelos. Preservar medidas, precios, ubicación y fotos. Simplificar el
recorrido en móvil; no inventar disponibilidad.

**Petición:** «Dale más vida a mi clínica sin cambiar su identidad».
Elegir salud, organizar una entrada serena, acompañar especialidades con transiciones
contenidas y mantener el acceso a cita. Evitar pulsaciones agresivas y testimonios
inventados. Si se pide un estetoscopio 3D, comprobar el modelo antes de prometer rotación.

**Petición:** «Haz todas mis webs más interactivas».
Inventariar sitios accesibles, aplicar un perfil y una firma diferente por sitio,
implementar en su código y reportar el estado por proyecto. Si solo está instalado
este paquete, pedir los proyectos necesarios sin afirmar acceso a páginas externas.
