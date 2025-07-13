// En netlify/functions/chat.ts
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Esta es la firma correcta para una función de Netlify en Node.js
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Aseguramos que solo se acepten peticiones POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const query = body.query;

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Falta la pregunta (query) en el cuerpo de la petición.' }),
      };
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;

    if (!supabaseUrl || !supabaseKey || !googleApiKey) {
      throw new Error("Faltan variables de entorno en el servidor.");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    // 1. Crear embedding para la pregunta del usuario
    const queryEmbeddingResult = await model.embedContent(query);
    const queryEmbedding = queryEmbeddingResult.embedding.values;

    // 2. Buscar documentos relevantes en Supabase
    const { data: documents, error: rpcError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.70,
      match_count: 5,
    });

    if (rpcError) {
      throw new Error(`Error en la búsqueda de Supabase: ${rpcError.message}`);
    }
    
    const contextText = documents.map((doc: any) => doc.content).join('\n\n---\n\n');

    // 3. Generar la respuesta con Gemini
    const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const prompt = `Eres un asistente experto en filosofía presuposicional. Usando el siguiente contexto extraído de un tratado, responde a la pregunta del usuario de forma clara y concisa. Si el contexto no es suficiente, indica que no tienes información sobre ese tema específico.\n\nContexto:\n${contextText}\n\nPregunta: ${query}\n\nRespuesta:`;
    
    const chatResult = await chatModel.generateContent(prompt);
    const responseText = chatResult.response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };

  } catch (error) {
    console.error('Error en la función de chat:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'Ha ocurrido un error interno.' }),
    };
  }
};

export { handler };