// En src/scripts/embed.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, existsSync } from 'node:fs'; // Usamos import explícito para fs
import { join } from 'node:path'; // Usamos import explícito para path
import { createRequire } from 'node:module'; // 1. Importamos la función 'createRequire'

// 2. Creamos una función 'require' compatible con nuestro entorno ESM
const require = createRequire(import.meta.url);

// 3. Usamos nuestro 'require' para cargar la librería CJS
const pdf = require('pdf-parse');

console.log('--- Iniciando Script de Ingestión de PDF Completo ---');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const googleApiKey = process.env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey || !googleApiKey) {
  throw new Error("Faltan variables de entorno. Asegúrate de que tu archivo .env está completo.");
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(googleApiKey);

function chunkText(text: string, chunkSize: number = 1500, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    chunks.push(text.substring(i, end));
    i += chunkSize - overlap;
  }
  return chunks;
}

async function embedPdf() {
  console.log('Limpiando la tabla "documents" para evitar duplicados...');
  const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0);
  if (deleteError) {
    console.error("Error crítico limpiando la tabla:", deleteError);
    return;
  }
  console.log('Tabla limpiada con éxito.');

  const pdfPath = join(process.cwd(), 'Tratado de filosofía presuposicional.pdf');
  if (!existsSync(pdfPath)) {
    throw new Error(`PDF no encontrado en la raíz del proyecto: ${pdfPath}`);
  }
  
  const dataBuffer = readFileSync(pdfPath);

  console.log('Extrayendo texto del PDF...');
  const pdfData = await pdf(dataBuffer);
  const cleanedText = pdfData.text.replace(/\s\s+/g, ' ').trim();
  
  console.log(`Texto extraído. Total de caracteres: ${cleanedText.length}.`);
  
  const textChunks = chunkText(cleanedText);
  console.log(`Texto dividido en ${textChunks.length} trozos para procesar.`);

  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  for (let i = 0; i < textChunks.length; i++) {
    const chunk = textChunks[i];
    console.log(`- Procesando trozo ${i + 1} de ${textChunks.length}...`);
    
    try {
      const result = await model.embedContent(chunk);
      const embedding = result.embedding.values;
      const { error } = await supabase.from('documents').insert({ content: chunk, embedding });
      if (error) {
        console.error(`  -> Error insertando en Supabase:`, error.message);
      } else {
        console.log(`  -> Guardado correctamente.`);
      }
    } catch (e) {
      console.error(`  -> Error generando embedding para el trozo ${i + 1}:`, e);
    }
  }

  console.log('--- Proceso de Ingestión de PDF Completado ---');
}

embedPdf();