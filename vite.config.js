import path from "path";
import { defineConfig } from "vite";
import pkg from './package.json'
// import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
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
      sourcemap: isProd,
      rollupOptions: {
        external: Object.keys({
          ...pkg.peerDependencies,
          ...pkg.dependencies
        }),
      },
      minify: isProd,
    },
  };
});