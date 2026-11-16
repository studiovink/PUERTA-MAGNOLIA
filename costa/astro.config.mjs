// @ts-check
import { defineConfig } from 'astro/config';

// PUBLIC_FLAT=1 genera una copia plana (rutas relativas) para vistas previas alojadas.
const flat = /** @type {any} */ (globalThis).process?.env?.PUBLIC_FLAT === '1';

export default defineConfig({
  trailingSlash: 'never',
  build: flat ? { format: 'file', inlineStylesheets: 'always' } : { format: 'directory', inlineStylesheets: 'auto' },
  outDir: flat ? './dist-flat' : './dist',
  // Este proyecto vive dentro de otro repositorio: se fija su propio tsconfig
  // para que la compilación no dependa del de la carpeta superior.
  vite: { tsconfig: './tsconfig.json' },
});
