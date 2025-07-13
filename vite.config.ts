// En vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', 
  plugins: [
    react(),
    tailwindcss(), // <-- Lo dejamos simple. La configuración se leerá desde tailwind.config.ts
  ],
})