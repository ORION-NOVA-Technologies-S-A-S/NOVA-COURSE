import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // funciona en la raíz o en una subcarpeta (GitHub Pages)
  plugins: [react()],
  server: {
    port: 5173,
    // En desarrollo, /api va al servidor Python local
    proxy: { "/api": "http://localhost:8000" },
  },
});
