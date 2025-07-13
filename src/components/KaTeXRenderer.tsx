// En src/components/KaTeXRenderer.tsx
import React, { useMemo } from 'react';
import katex from 'katex';
import { useAppContainer } from '../context/KnowledgeGraphContext';

interface KaTeXRendererProps {
  text: string;
}

const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ text }) => {
  const { setActiveTermId, termMentionMap } = useAppContainer();

  const renderedHtml = useMemo(() => {
    if (termMentionMap.size === 0) return { __html: text };

    const allMentions = Array.from(termMentionMap.keys())
      .sort((a, b) => b.length - a.length)
      .map(mention => mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      
    // LA CORRECCIÓN CLAVE: Añadimos \b al principio y al final del grupo.
    const regex = new RegExp(`\\b(${allMentions.join('|')})\\b`, 'gi');
    
    let processedText = text.replace(regex, (match) => {
      const termId = termMentionMap.get(match.toLowerCase());
      return termId
        ? `<button class="text-primary font-semibold hover:underline" data-term-id="${termId}">${match}</button>`
        : match;
    });

    processedText = processedText.replace(/\$(.*?)\$/g, (_, equation) => {
      return katex.renderToString(equation, { throwOnError: false, displayMode: false });
    });

    return { __html: processedText };
  }, [text, termMentionMap]);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.dataset.termId) {
      setActiveTermId(target.dataset.termId);
    }
  };

  return <div onClick={handleContentClick} dangerouslySetInnerHTML={renderedHtml} className="prose max-w-none" />;
};

export default KaTeXRenderer;