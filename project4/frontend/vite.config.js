import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/patent': { target: 'http://localhost:8080', changeOrigin: true },
      '/author': { target: 'http://localhost:8080', changeOrigin: true },
      '/certification': { target: 'http://localhost:8080', changeOrigin: true }
    }
    }
  }
)