import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
  ],
  optimizeDeps: {
    exclude: [
      '@midnight-ntwrk/midnight-js-contracts',
      '@midnight-ntwrk/compact-runtime'
    ]
  },
  build: {
    target: 'esnext'
  }
});
