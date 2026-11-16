# Uso del ZIP en Claude

Este paquete reúne siete perfiles en una sola skill. No instala bibliotecas de
JavaScript dentro de todas las páginas ni modifica sitios por el hecho de activarlo.
Claude debe tener acceso a cada proyecto y aplicar los cambios a su código.

## Claude en web o escritorio
1. Abrir **Customize / Personalizar → Skills** en https://claude.ai/customize/skills.
2. Elegir **+ → Create skill → Upload a skill** o la opción equivalente del idioma.
3. Subir `VINK_Web_Interactiva_Claude.zip` completo y activar la skill.
4. Abrir el proyecto que se quiere mejorar y aportar su código o carpeta accesible.
5. Usar un prompt de `prompts.md` o pedir «Usa VINK Web Interactiva para mejorar esta web».

Si no aparece Skills, comprobar que **Code execution and file creation / Create and
edit files** esté activo en Settings → Capabilities. La disponibilidad también puede
depender de la configuración de una organización. Si no se puede instalar, adjuntar
el ZIP a una conversación con ejecución de código y pedir que lo descomprima y lea
`vink-web-interactiva/SKILL.md`. Esa alternativa aporta contexto a esa conversación;
no equivale a instalarlo permanentemente en la cuenta.

## Claude Code
Como alternativa de proyecto, copiar la carpeta de la skill a
`.claude/skills/vink-web-interactiva/` y conservar `SKILL.md` en su raíz. Consultar la
documentación actual de Claude Code sobre descubrimiento y sincronización antes de
duplicar una skill que ya esté disponible desde la cuenta. No reemplazar un
`CLAUDE.md` existente ni otras instrucciones del repositorio.

## Demo
La carpeta `assets/demo/` es una demostración del motor nativo, no una plantilla
obligatoria ni una reproducción de sitios previos. Servir la skill con un servidor
local para que los módulos ES carguen correctamente; no abrir el HTML por `file://`.
No se incluyen las fotografías ni el código de tus proyectos anteriores: usar sus
archivos actuales al mejorar cada sitio.

## Referencias oficiales
Consultadas para preparar el paquete el 16 de noviembre de 2026. Los menús y APIs
pueden evolucionar; comprobar versión y entorno al integrar.

- Crear y empaquetar skills: https://support.claude.com/en/articles/12512198-how-to-create-custom-skills
- Instalar y activar: https://support.claude.com/en/articles/12512180-use-skills-in-claude
- Skills en Claude Code: https://code.claude.com/docs/en/skills
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- GSAP matchMedia y limpieza: https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/
- Motion para React: https://motion.dev/docs/react
- Motion y gestos: https://motion.dev/docs/react-gestures
- Spline Viewer: https://docs.spline.design/exporting-your-scene/web/exporting-as-spline-viewer

## Alcance de las comprobaciones
Se comprobaron estructura, metadatos, enlaces internos, sintaxis de módulos y el
script de inventario. También se ejecutaron pruebas de lógica de los siete perfiles,
filtros, comparador y limpieza de eventos con dobles de las interfaces DOM; esto no
equivale a una prueba visual en navegador. La revisión visual local no pudo ejecutarse
por una restricción del entorno. React, GSAP y 3D deben probarse con las versiones y
los recursos del proyecto; el adaptador GSAP solo tuvo una prueba de ciclo de vida
con dependencias simuladas. Ninguna cuenta externa se instala ni ninguna página se
publica al descargar este ZIP.
