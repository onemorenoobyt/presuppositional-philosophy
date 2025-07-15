// En src/components/MainLayout.tsx
import React, { useState, Suspense, useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import IndexPanel from './IndexPanel';
import AnalysisPanel from './AnalysisPanel';
import SEOHelmet from './SEOHelmet';
import AIChat from './AIChat';
import { Network, FileText, Bot, X } from 'lucide-react';

const GraphPanel = React.lazy(() => import('./GraphPanel'));

// Función de ayuda para truncar texto de forma inteligente.
const smartTruncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  let truncated = text.substring(0, maxLength);
  truncated = truncated.substring(0, Math.min(truncated.length, truncated.lastIndexOf(' ')));
  return truncated + '...';
};

const MainLayout: React.FC = () => {
  const { isLoading, activeTermId, termsMap } = useAppContainer();
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // LA LÓGICA DE DERIVACIÓN CORRECTA ESTÁ AQUÍ
  const activeTerm = useMemo(() => {
    return activeTermId ? termsMap.get(activeTermId) : null;
  }, [activeTermId, termsMap]);

  const { seoTitle, seoDescription } = useMemo(() => {
    if (!activeTerm) {
      return { seoTitle: undefined, seoDescription: undefined };
    }
    
    const title = activeTerm.name;
    const prefix = `Definición de "${activeTerm.displayName}": `;
    const fullText = prefix + activeTerm.definition;
    const description = smartTruncate(fullText, 160);
    
    return { seoTitle: title, seoDescription: description };
  }, [activeTerm]); // Esta lógica ahora depende de 'activeTerm'

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-lg text-primary animate-pulse">Cargando conocimiento...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen grid grid-cols-12 font-sans relative">
      <SEOHelmet key={activeTermId || 'home'} title={seoTitle} description={seoDescription} />
      
      <div className="col-span-3 h-full border-r border-gray-200 bg-gray-50/50 overflow-y-auto">
        <IndexPanel />
      </div>

      <div className="col-span-9 h-full flex flex-col relative">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => setIsGraphVisible(!isGraphVisible)}
            disabled={!activeTermId}
            className="p-2 bg-white rounded-full shadow-lg text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={isGraphVisible ? "Mostrar vista de texto" : "Mostrar grafo conceptual"}
          >
            {isGraphVisible ? <FileText size={20} /> : <Network size={20} />}
          </button>
        </div>

        {isGraphVisible ? (
          <Suspense fallback={<div className="h-full flex items-center justify-center"><p className="text-gray-400">Cargando visualización del grafo...</p></div>}>
            <GraphPanel />
          </Suspense>
        ) : (
          <AnalysisPanel />
        )}
      </div>

      <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-96 h-[70vh] max-h-[70vh] mb-4 shadow-2xl rounded-lg border border-gray-200">
             <AIChat />
          </div>
        )}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)} 
          className="p-4 bg-primary text-white rounded-full shadow-xl hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform hover:scale-110"
          title={isChatOpen ? "Cerrar chat" : "Abrir chat con IA"}
        >
          {isChatOpen ? <X size={28} /> : <Bot size={28}/>}
        </button>
      </div>
    </div>
  );
};

export default MainLayout;