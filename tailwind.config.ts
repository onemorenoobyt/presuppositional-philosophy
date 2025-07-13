// En tailwind.config.ts
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  // En v4, 'content' es manejado por el plugin de Vite,
  // por lo que no es estrictamente necesario aquí, pero añadirlo
  // ayuda a la extensión de VS Code.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  // No necesitamos la sección 'theme' aquí porque la definimos en index.css
  theme: {
    extend: {},
  },

  // Aquí registramos los plugins de JavaScript.
  plugins: [
    typography(),
  ],
}