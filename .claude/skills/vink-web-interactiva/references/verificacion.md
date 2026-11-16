# Verificación por proyecto

## Función
- Ejecutar build, lint y verificaciones relevantes ya disponibles.
- Probar navegación, menú, formularios, CTA, filtros y comparador con datos reales.
- Confirmar que los formularios mantienen su integración y estados de error.
- Revisar montaje, desmontaje y cambio de ruta; evitar listeners duplicados.
- Comprobar que un filtro no deja contenido esencial inaccesible.

## Vista y movimiento
- Revisar a 390 px y a 1440 px; ampliar si el diseño lo requiere.
- Confirmar ausencia de scroll horizontal accidental, saltos y texto cortado.
- Activar movimiento reducido antes de cargar y cambiarlo durante la sesión.
- Recorrer con Tab, Enter, Espacio y flechas en controles nativos.
- Desactivar JavaScript: conservar texto, enlaces, contacto e imágenes esenciales.
- En móvil, mantener acciones visibles y eliminar dependencias del hover.
- Comprobar que el CTA y el encabezado no quedan detrás de una escena fijada.
- Asegurar que cada imagen conserva la identidad, proporciones y contenido aprobados.

## Rendimiento
- Registrar peso de medios, librerías nuevas y carga inicial.
- Medir el sitio real con las herramientas disponibles; no inventar resultados.
- Observar tirones al scroll en un dispositivo razonable, además del escritorio.
- Cargar imágenes inferiores de forma diferida; reservar sus proporciones.
- Buscar observadores, RAF o animaciones que sigan activos después del desmontaje.
- Verificar fallback si el video, canvas o escena remota no carga.

## Informe breve
Indicar: perfil y firma elegidos; cambios funcionales; pruebas ejecutadas; recursos
pendientes y razón. No confundir la validación del paquete con la del sitio final.

## Validación del propio paquete
La demostración nativa puede servirse desde la raíz de la skill con
`python3 -m http.server 8765 --bind 127.0.0.1`; abrir
`http://127.0.0.1:8765/assets/demo/`.
Los adaptadores de bibliotecas opcionales requieren validación dentro del proyecto
que las instala. La demostración nativa no prueba por sí sola GSAP, React, Motion o
una escena de Spline.
