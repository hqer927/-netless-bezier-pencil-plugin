import path from "path";
import { defineConfig } from "vite";
import pkg from './package.json'
// import bundleWorker from 'rollup-plugin-bundle-worker';

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const external = Object.keys({
    ...pkg.peerDependencies,
    ...pkg.dependencies,
    ...pkg.devDependencies,
  });
  // console.log('external', external)
  return {
    css: {
      modules:{
        generateScopedName:'[name]__[local]__[hash:base64:5]',
        hashPrefix:'prefix',
      },
      preprocessorOptions:{
        less:{}
      }
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        formats: ["es", "cjs"],
      },
      outDir: "dist",
      sourcemap: false,
      rollupOptions: {
        external
      },
      minify: isProd,
    },
    worker: {
      rollupOptions: {
        external: ['spritejs'],
        input: {
          fullWorker: path.resolve(__dirname, "src/core/worker/fullWorker.ts"),
          subWorker: path.resolve(__dirname, "src/core/worker/subWorker.ts"),
        },
        output: {
          entryFileNames: '[name]-[hash:6].js',
          format: 'iify',
          extend: false,
          banner: 'self.importScripts("https://unpkg.com/spritejs@3/dist/spritejs.js");',
          globals: {
            spritejs: 'spritejs',
          }
        }
      },
      minify: isProd,
    }
  };
});