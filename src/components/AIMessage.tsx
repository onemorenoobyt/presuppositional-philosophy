// En src/components/AIMessage.tsx
import React, { useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';

interface AIMessageProps {
  text: string;
}

const AIMessage: React.FC<AIMessageProps> = ({ text }) => {
  const { termMentionMap, setActiveTermId } = useAppContainer();

  const parsedContent = useMemo(() => {
    if (termMentionMap.size === 0) return [text];

    const allMentions = Array.from(termMentionMap.keys())
      .sort((a, b) => b.length - a.length)
      .map(mention => mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    // LA CORRECCIÓN CLAVE: Añadimos \b al principio y al final del grupo.
    const regex = new RegExp(`\\b(${allMentions.join('|')})\\b`, 'gi');
    
    const parts = [];
    let lastIndex = 0;
    
    const matches = text.matchAll(regex);

    for (const match of matches) {
      const matchedText = match[0];
      const index = match.index!;

      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }

      const termId = termMentionMap.get(matchedText.toLowerCase());
      parts.push(
        <button
          key={`${termId}-${index}`}
          onClick={() => setActiveTermId(termId!)}
          className="text-primary font-semibold hover:underline bg-primary/10 px-1 py-0.5 rounded"
        >
          {matchedText}
        </button>
      );
      
      lastIndex = index + matchedText.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  }, [text, termMentionMap, setActiveTermId]);

  return <div className="prose prose-sm max-w-none leading-relaxed">{parsedContent}</div>;
};

export default AIMessage;