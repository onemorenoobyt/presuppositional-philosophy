// En src/components/AIChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import AIMessage from './AIMessage';

interface Message {
  text: string;
  isUser: boolean;
}

// Mensaje de bienvenida predefinido
const welcomeMessage: Message = {
  text: "¡Hola! Soy tu asistente de filosofía presuposicional. Puedes preguntarme sobre cualquier concepto, relación o argumento contenido en el tratado. Todavía soy algo rudimentario por lo que es recomendable usar preguntas específicas y con la ortografía correcta. No te fíes de mis respuestas, siempre es bueno acudir a los vídeos o a la comunidad de Discord de Kantian Project.",
  isUser: false,
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage: Message = { text: data.response || "No se recibió respuesta.", isUser: false };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error en la petición de chat:", error);
      const errorMessage: Message = { text: 'Lo siento, ha ocurrido un error al contactar al asistente.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg border">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex my-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-lg ${msg.isUser ? 'bg-primary text-white' : 'bg-gray-200 text-text'}`}>
              {msg.isUser ? <p>{msg.text}</p> : <AIMessage text={msg.text} />}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-200 text-text animate-pulse">...</div></div>}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Pregunta sobre el tratado..."
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-r-md hover:bg-secondary disabled:bg-gray-400" disabled={isLoading || !input.trim()}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIChat;