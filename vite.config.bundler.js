import path from "path";
import { defineConfig } from "vite";
import pkg from './package.json';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const external = Object.keys({
    ...pkg.peerDependencies,
    ...pkg.dependencies,
  });
  return {
    define: {
      __NAME__: JSON.stringify(pkg.name),
      __VERSION__: JSON.stringify(pkg.version),
    },
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
      outdir: "dist",
      sourcemap: false,
      rollupOptions: {
        external
      },
      minify: isProd,
    },
    worker: {
      format:'es',
      rollupOptions: {
        input: {
          fullWorker: path.resolve(__dirname, "src/core/worker/fullWorker.ts"),
          subWorker: path.resolve(__dirname, "src/core/worker/subWorker.ts"),
        },
        output: {
          entryFileNames: '[name].js',
          format: 'esm',
          extend: false,
          plugins: [ getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
            allowAllFormats: true
          })],
        }
      },
      minify: isProd,
    }
  };
});
