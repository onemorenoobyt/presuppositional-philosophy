// En src/components/KaTeXRenderer.tsx
import React, { useMemo } from 'react';
import katex from 'katex';
import { useAppContainer } from '../context/KnowledgeGraphContext';

interface KaTeXRendererProps {
  text: string;
}

const KaTeXRenderer: React.FC<KaTeXRendererProps> = ({ text }) => {
  const { termsMap, setActiveTermId } = useAppContainer();

  const renderedHtml = useMemo(() => {
    const referenceRegex = /(Axioma|Teorema|Definición|Proposición|Postulado|Corolario|Lema|Conjetura)\s+(\d+(\.\d+)*)/gi;
    let processedText = text;

    processedText = processedText.replace(referenceRegex, (match, type, number) => {
      const termId = `${type.toLowerCase().replace(/ó/g, 'o').replace(/á/g, 'a')}-${number.replace(/\./g, '-')}`;
      const term = termsMap.get(termId);

      return term 
        ? `<button class="text-primary font-bold hover:underline" data-term-id="${term.id}">${match}</button>`
        : match;
    });

    processedText = processedText.replace(/\$(.*?)\$/g, (_, equation) => {
      return katex.renderToString(equation, { throwOnError: false, displayMode: false });
    });

    return { __html: processedText };
  }, [text, termsMap]);

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.dataset.termId) {
      setActiveTermId(target.dataset.termId);
    }
  };

  return <div onClick={handleContentClick} dangerouslySetInnerHTML={renderedHtml} className="prose max-w-none" />;
};

export default KaTeXRenderer;