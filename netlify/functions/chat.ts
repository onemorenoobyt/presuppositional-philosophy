// En netlify/functions/chat.ts
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async (req: Request) => {
  const { query } = await req.json();

  const supabaseUrl = process.env.VITE_SUPABASE_URL!;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
  const googleApiKey = process.env.GOOGLE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const genAI = new GoogleGenerativeAI(googleApiKey);
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  // 1. Crear embedding para la pregunta del usuario
  const queryEmbeddingResult = await model.embedContent(query);
  const queryEmbedding = queryEmbeddingResult.embedding.values;

  // 2. Buscar documentos relevantes en Supabase
  const { data: documents, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: 0.70, // Umbral de similitud
    match_count: 5,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const contextText = documents.map((doc: any) => doc.content).join('\n\n---\n\n');
  
  // 3. Generar la respuesta con Gemini
  const chatModel = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Eres un asistente experto en filosofía presuposicional. Usando el siguiente contexto extraído de un tratado, responde a la pregunta del usuario de forma clara y concisa. Si el contexto no es suficiente, indica que no tienes información sobre ese tema específico.

Contexto:
${contextText}

Pregunta: ${query}

Respuesta:`;

  const chatResult = await chatModel.generateContent(prompt);
  const responseText = chatResult.response.text();

  return new Response(JSON.stringify({ response: responseText }), { status: 200 });
};