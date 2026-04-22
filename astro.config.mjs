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
  image: {
    domains: ['games.assets.gamepix.com', 'prod.iogames.space', 'images.unsplash.com', 'images.crazygames.com', 'img.poki.com']
  },
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: []
});