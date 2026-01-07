import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5170,
    proxy: {
      '/api': {
        target: 'https://school-pilot-api.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
