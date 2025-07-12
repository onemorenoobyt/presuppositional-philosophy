// En src/App.tsx
import React, { useState, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { KnowledgeGraphProvider, useAppContainer } from './context/KnowledgeGraphContext';
import IndexPanel from './components/IndexPanel';
import AnalysisPanel from './components/AnalysisPanel';
import { Network, FileText } from 'lucide-react'; // Iconos para el botón

// Usamos React.lazy para cargar el componente del grafo solo cuando se necesite.
// Esto mejora el rendimiento de la carga inicial.
const GraphPanel = React.lazy(() => import('./components/GraphPanel'));

/**
 * MainLayout es el componente que define la estructura visual de la aplicación.
 * Accede al estado global a través del hook useAppContainer.
 */
function MainLayout() {
  const { isLoading, activeTermId } = useAppContainer();
  const [isGraphVisible, setIsGraphVisible] = useState(false);

  // Muestra un mensaje de carga mientras los datos se obtienen del JSON.
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-lg text-primary animate-pulse">Cargando conocimiento...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen grid grid-cols-12 font-sans">
      {/* Panel de Índice (siempre visible a la izquierda) */}
      <div className="col-span-3 h-full border-r border-gray-200 bg-gray-50/50 overflow-y-auto">
        <IndexPanel />
      </div>

      {/* Panel de Contenido Principal (derecha) */}
      <div className="col-span-9 h-full flex flex-col relative">
        {/* Botón flotante para alternar entre la vista de texto y la de grafo */}
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={() => setIsGraphVisible(!isGraphVisible)}
            disabled={!activeTermId} // El botón solo se activa si hay un término seleccionado
            className="p-2 bg-white rounded-full shadow-lg text-primary hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={isGraphVisible ? "Mostrar vista de texto" : "Mostrar grafo conceptual"}
          >
            {isGraphVisible ? <FileText size={20} /> : <Network size={20} />}
          </button>
        </div>

        {/* Renderiza el Grafo o el Panel de Análisis según el estado */}
        {isGraphVisible ? (
          <Suspense fallback={<div className="h-full flex items-center justify-center"><p className="text-gray-400">Cargando visualización del grafo...</p></div>}>
            <GraphPanel />
          </Suspense>
        ) : (
          <AnalysisPanel />
        )}
      </div>
    </div>
  );
}

/**
 * App es el componente raíz que envuelve toda la aplicación con los proveedores
 * de contexto y enrutamiento necesarios.
 */
function App() {
  return (
    <KnowledgeGraphProvider>
      <Routes>
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </KnowledgeGraphProvider>
  );
}

export default App;