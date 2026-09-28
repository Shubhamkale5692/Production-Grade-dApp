import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    wasm(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        global: true,
        process: true,
        Buffer: true,
      },
    }),
  ],

  optimizeDeps: {
    include: [
      'buffer',
      'events',
      'process',
      'util',
      'stream',
      'assert',
    ],
    exclude: [
      '@midnight-ntwrk/midnight-js-contracts',
    ],
  },

  build: {
    target: 'esnext',
  },
});
