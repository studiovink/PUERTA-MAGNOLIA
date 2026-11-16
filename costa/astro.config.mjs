// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  trailingSlash: 'never',
  build: process.env.PUBLIC_FLAT === '1' ? { format: 'file', inlineStylesheets: 'always' } : { format: 'directory', inlineStylesheets: 'auto' },
  outDir: process.env.PUBLIC_FLAT === '1' ? './dist-flat' : './dist',
  // Este proyecto vive dentro de otro repositorio: se fija su propio tsconfig
  // para que la compilación no dependa del de la carpeta superior.
  vite: { tsconfig: './tsconfig.json' },
});
