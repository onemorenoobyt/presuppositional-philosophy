// En src/components/AIMessage.tsx
import React, { useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

const AIMessage: React.FC<{ text: string }> = ({ text }) => {
  const { termMentionMap, setActiveTermId } = useAppContainer();

  // Paso 1: Pre-procesar el texto para crear enlaces de ancla válidos.
  const processedText = useMemo(() => {
    if (termMentionMap.size === 0) return text;

    const allMentions = Array.from(termMentionMap.keys())
      .sort((a, b) => b.length - a.length)
      .map(mention => mention.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      
    const regex = new RegExp(`\\b(${allMentions.join('|')})\\b`, 'gi');
    
    return text.replace(regex, (match) => {
      const termId = termMentionMap.get(match.toLowerCase());
      // Creamos un enlace de ancla con el prefijo #/term/
      return termId ? `[${match}](#/term/${termId})` : match;
    });
  }, [text, termMentionMap]);

  // Paso 2: Renderizador personalizado que intercepta nuestros enlaces de ancla.
  const components: Components = useMemo(() => ({
    a: ({ href, children }) => {
      // CASO A: Es un enlace INTERNO que creamos nosotros.
      if (href?.startsWith('#/term/')) {
        const termId = href.replace('#/term/', '');
        
        const handleTermClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
          // Prevenimos la acción por defecto del navegador (que sería saltar a un ancla).
          event.preventDefault(); 
          // Ejecutamos nuestra propia lógica de navegación de la SPA.
          setActiveTermId(termId);
        };

        return (
          <a
            href={`/term/${termId}`} // href semántico para accesibilidad
            onClick={handleTermClick}
            className="font-semibold !text-primary hover:!underline bg-primary/10 px-1 py-0.5 rounded cursor-pointer"
          >
            {children}
          </a>
        );
      }
      
      // CASO B: Es un enlace EXTERNO normal (http, https).
      if (href?.startsWith('http')) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
            {children}
          </a>
        );
      }

      // CASO C (Fallback): Para cualquier otro tipo de enlace, muestra solo el texto.
      return <>{children}</>;
    },
  }), [setActiveTermId]);

  return (
    <div className="prose prose-sm max-w-none leading-relaxed">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedText}
      </ReactMarkdown>
    </div>
  );
};

export default AIMessage;