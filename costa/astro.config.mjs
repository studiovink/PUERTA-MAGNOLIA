// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  // Este proyecto vive dentro de otro repositorio: se fija su propio tsconfig
  // para que la compilación no dependa del de la carpeta superior.
  vite: { tsconfig: './tsconfig.json' },
});
