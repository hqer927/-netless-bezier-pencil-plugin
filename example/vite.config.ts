import {resolve} from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules:{
      generateScopedName:'[name]__[local]__[hash:base64:5]',
      hashPrefix:'prefix',
    },
    preprocessorOptions:{
      less:{}
    },
  },
  base:"/netless-teaching-aids-demo",
  build: {
    // lib: {
    //   entry: path.resolve(__dirname, "src/main.tsx"),
    //   formats: ["es", "cjs"],
    // },
    outDir: "dist",
    sourcemap: false,
    rollupOptions:{
      input: resolve(__dirname,'index.html')
    }
  },
})