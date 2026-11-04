import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Three.js pesa ~700 kB minificado: es normal. Subimos el umbral del warning
    // para que no aparezca en cada build y no confunda con errores reales.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Three y R3F en chunks propios: el navegador los cachea aparte del código de la app.
        // Si el usuario ya visitó la página, solo descarga el chunk de la app (~3 kB).
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
})
