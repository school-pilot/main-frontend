import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5170,
    proxy: {
      '/api': {
        target: 'https://school-pilot-api.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', {
              method: req.method,
              url: req.url,
              path: proxyReq.path,
              headers: proxyReq.getHeaders()
            });
          });
        }
      }
    }
  }
})