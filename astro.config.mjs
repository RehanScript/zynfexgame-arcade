// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';



// https://astro.build/config
export default defineConfig({
  site: 'https://zynfexgame.me',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: []
});