// En src/scripts/embed.ts
import 'dotenv/config'; // <-- 1. IMPORTANTE: Esto carga las variables de .env
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import rawTerms from '../../public/database.json';

// 2. Lee las variables desde process.env en lugar de hardcodearlas
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
  throw new Error("Faltan variables de entorno. Asegúrate de que tu archivo .env está completo.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(googleApiKey);

async function embed() {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  console.log('Iniciando proceso de embedding...');
  
  for (const term of rawTerms) {
    const content = `Término: ${term.displayName}. Tipo: ${term.type}. Definición: ${term.definition}`;
    
    console.log(`- Creando embedding para: ${term.displayName}`);
    const result = await model.embedContent(content);
    const embedding = result.embedding.values;

    const { error } = await supabase.from('documents').insert({ content, embedding });
    if (error) {
      console.error(`  -> Error insertando en Supabase:`, error.message);
    } else {
      console.log(`  -> Guardado correctamente.`);
    }
  }
  console.log('Proceso de embedding completado.');
}

embed();