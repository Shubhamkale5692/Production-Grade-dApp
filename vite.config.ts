import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [
    wasm()
  ],
  optimizeDeps: {
    exclude: [
      '@midnight-ntwrk/midnight-js-contracts'
    ]
  },
  build: {
    target: 'esnext'
  }
});
