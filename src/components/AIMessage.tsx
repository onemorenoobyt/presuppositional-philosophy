// En src/components/AIMessage.tsx
import React, { useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';

interface AIMessageProps {
  text: string;
}

const AIMessage: React.FC<AIMessageProps> = ({ text }) => {
  const { termMentionMap, setActiveTermId } = useAppContainer();

  // Esta función divide el texto en un array de strings y componentes de React
  const parsedContent = useMemo(() => {
    if (termMentionMap.size === 0) return [text];

    const allMentions = Array.from(termMentionMap.keys())
      .sort((a, b) => b.length - a.length)
      .map(mention => mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    const regex = new RegExp(`(${allMentions.join('|')})`, 'gi');
    
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const lowerCasePart = part.toLowerCase();
      const termId = termMentionMap.get(lowerCasePart);

      if (termId) {
        return (
          <button
            key={`${termId}-${index}`}
            onClick={() => setActiveTermId(termId)}
            className="text-primary font-semibold hover:underline"
          >
            {part}
          </button>
        );
      }
      return part;
    });
  }, [text, termMentionMap, setActiveTermId]);

  return <p className="leading-relaxed">{parsedContent}</p>;
};

export default AIMessage;