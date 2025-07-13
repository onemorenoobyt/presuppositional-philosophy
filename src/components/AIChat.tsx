// En src/components/AIChat.tsx
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        body: JSON.stringify({ query: input }),
      });
      const data = await response.json();
      
      const aiMessage: Message = { text: data.response, isUser: false };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage: Message = { text: 'Lo siento, ha ocurrido un error.', isUser: false };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`flex my-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-lg ${msg.isUser ? 'bg-primary text-white' : 'bg-gray-200 text-text'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="p-3 rounded-lg bg-gray-200 text-text">...</div></div>}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Pregunta sobre el tratado..."
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-r-md hover:bg-secondary disabled:bg-gray-400" disabled={isLoading}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIChat;