// En src/components/AIMessage.tsx
import React, { useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown'; // 1. Importar el tipo 'Components'

const AIMessage: React.FC<{ text: string }> = ({ text }) => {
  const { termMentionMap, setActiveTermId } = useAppContainer();

  // 2. Definimos nuestros componentes personalizados con los tipos correctos
  const components: Components = useMemo(() => ({
    // La firma del componente `a` (enlace) espera estos props
    a: ({ node, ...props }) => {
      // El contenido de texto del enlace está en el primer hijo del nodo
      const textContent = node?.children[0]?.type === 'text' ? node.children[0].value : '';
      const termId = termMentionMap.get(textContent.toLowerCase());

      if (termId) {
        return (
          <button
            onClick={() => setActiveTermId(termId)}
            className="text-primary font-semibold hover:underline bg-primary/10 px-1 py-0.5 rounded"
          >
            {textContent}
          </button>
        );
      }
      // Si no es un término, renderiza un enlace normal pero con nuestros estilos
      return <a {...props} className="text-secondary hover:underline" />;
    },
  }), [termMentionMap, setActiveTermId]);

  return (
    <div className="prose prose-sm max-w-none leading-relaxed">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={components} // 3. Pasamos los componentes memoizados
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default AIMessage;