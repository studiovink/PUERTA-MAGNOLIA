// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://puertamagnolia.mx',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: { format: 'directory', inlineStylesheets: 'always' },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
