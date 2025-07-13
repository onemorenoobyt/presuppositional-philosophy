// En src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Nota: GOOGLE_API_KEY NO se pone aquí porque no tiene el prefijo VITE_
  // y no debe ser accesible desde el código del cliente.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}