import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [VueRouter(), vue()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dir, "/src"),
      "@server": path.resolve(import.meta.dir, "../server"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        changeOrigin: true,
      },
    },
  },
});
