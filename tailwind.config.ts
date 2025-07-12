// En tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  // `content` no es necesario. El plugin de Vite lo gestiona automáticamente.
  // `theme` no es necesario aquí, ya que lo estamos manejando en CSS con `@theme`.
  plugins: [
    typography(), // Se recomienda llamar al plugin como una función.
  ],
} satisfies Config // <-- 'satisfies' es la forma moderna y preferida en TS.