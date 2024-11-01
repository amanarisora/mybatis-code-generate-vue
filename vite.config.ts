import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath} from "url";
import svgLoader from 'vite-svg-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),svgLoader(),],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
})


