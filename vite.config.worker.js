import path from "path";
import { defineConfig } from "vite";
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import pkg from './package.json';
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    define: {
      __NAME__: JSON.stringify(pkg.name),
      __VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/cdn.ts"),
        fileName: "cdn",
        formats: ["cjs"],
      },
      outDir: "cdn",
      sourcemap: false,
      minify: isProd,
    },
    worker: {
      format:'es',
      rollupOptions: {
        input: {
          fullWorker: path.resolve(__dirname, "src/core/worker/fullWorker.ts"),
          subWorker: path.resolve(__dirname, "src/core/worker/subWorker.ts"),
        },
        output: [
          {
            entryFileNames: '[name]-[hash:6].js',
            format: 'esm',
            plugins: [getBabelOutputPlugin({ presets: ['@babel/preset-env'] })],
            extend: false,
          }
        ]
      },
      minify: isProd,
    }
  }
});