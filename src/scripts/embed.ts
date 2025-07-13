// En src/scripts/embed.ts
import 'dotenv/config'; // Carga las variables de .env al inicio
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rawTerms from '../../public/database.json'; // <-- ¡ASEGÚRATE DE QUE ESTA RUTA ES CORRECTA!

console.log('--- Iniciando Script de Ingestión ---');

// Lee las variables de entorno de tu archivo .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
  throw new Error("Faltan variables de entorno. Asegúrate de que tu archivo .env está completo y en la raíz del proyecto.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(googleApiKey);

async function embedAndStore() {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  console.log(`Procesando ${rawTerms.length} términos desde database.json...`);

  for (const term of rawTerms) {
    // Combinamos la información más relevante para crear un "párrafo" de conocimiento
    const content = `Término: ${term.displayName}. Tipo: ${term.type}. Definición: ${term.definition}`;
    
    console.log(`- Creando embedding para: "${term.displayName}"`);
    try {
      const result = await model.embedContent(content);
      const embedding = result.embedding.values;

      const { error } = await supabase.from('documents').insert({ content, embedding });

      if (error) {
        console.error(`  -> Error insertando en Supabase:`, error.message);
      } else {
        console.log(`  -> Guardado correctamente en la base de datos.`);
      }
    } catch (e) {
      console.error(`  -> Error generando embedding para "${term.displayName}":`, e);
    }
  }
  console.log('--- Proceso de Ingestión Completado ---');
}

embedAndStore();