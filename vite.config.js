import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Injeta todos os bundles gerados (JS/CSS) na lista de pré-cache do Service Worker. */
function injectSwAssets() {
  return {
    name: 'inject-sw-assets',
    generateBundle(_options, bundle) {
      const assets = Object.keys(bundle).map((f) => `./${f}`);
      this.emitFile({
        type: 'asset',
        fileName: 'sw-assets.json',
        source: JSON.stringify(assets),
      });
    },
  };
}

// base './' permite hospedar em qualquer subpasta (GitHub Pages, Netlify, etc.)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), injectSwAssets()],
  server: { host: true },
});

