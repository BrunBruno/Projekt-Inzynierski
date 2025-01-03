/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { host } from "./globals";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: host,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  assetsInclude: ["**/*.jpg", "**/*.png", "**/*.svg"],
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
