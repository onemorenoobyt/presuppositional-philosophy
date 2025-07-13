// En src/components/MainLayout.tsx
import React, { useState, Suspense } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import IndexPanel from './IndexPanel';
import AnalysisPanel from './AnalysisPanel';
import AIChat from './AIChat'; // 1. Importar el nuevo componente de chat
import { Network, FileText, Bot, X } from 'lucide-react'; // 2. Importar los nuevos iconos

// La carga diferida del GraphPanel se define aquí.
const GraphPanel = React.lazy(() => import('./GraphPanel'));

const MainLayout: React.FC = () => {
  const { isLoading, activeTermId } = useAppContainer();
  const [isGraphVisible, setIsGraphVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // 3. Estado para controlar el chat

  // Muestra una pantalla de carga global mientras los datos se están obteniendo.
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-lg text-primary animate-pulse">Cargando conocimiento...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen grid grid-cols-12 font-sans relative"> {/* Añadido 'relative' para el posicionamiento absoluto */}
      {/* Columna Izquierda: Panel de Índice */}
      <div className="col-span-3 h-full border-r border-gray-200 bg-gray-50/50 overflow-y-auto">
        <IndexPanel />
      </div>

      {/* Columna Derecha: Contenido Principal (Análisis o Grafo) */}
      <div className="col-span-9 h-full flex flex-col">
        {/* Botón flotante para cambiar de vista */}
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

        {/* Lógica de renderizado condicional para el panel principal */}
        {isGraphVisible ? (
          <Suspense fallback={<div className="h-full flex items-center justify-center"><p className="text-gray-400">Cargando visualización del grafo...</p></div>}>
            <GraphPanel />
          </Suspense>
        ) : (
          <AnalysisPanel />
        )}
      </div>

      {/* 4. Botón y Panel de Chat Flotante */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col items-end">
        {/* El panel del chat aparece encima del botón cuando está abierto */}
        {isChatOpen && (
          <div className="w-96 h-[70vh] max-h-[70vh] mb-4 shadow-2xl rounded-lg border border-gray-200">
             <AIChat />
          </div>
        )}
        
        {/* El botón para abrir/cerrar el chat */}
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