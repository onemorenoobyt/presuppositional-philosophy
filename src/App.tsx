// En src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { KnowledgeGraphProvider, useAppContainer } from './context/KnowledgeGraphContext';
import IndexPanel from './components/IndexPanel';
import AnalysisPanel from './components/AnalysisPanel';
// Por ahora no importamos GraphPanel para mantenerlo simple

function MainLayout() {
  const { isLoading } = useAppContainer();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <p className="text-lg text-primary animate-pulse">Cargando conocimiento...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen grid grid-cols-12 font-sans">
      {/* Panel de Índice */}
      <div className="col-span-3 h-full border-r border-gray-200 bg-gray-50/50 overflow-y-auto">
        <IndexPanel />
      </div>

      {/* Panel de Contenido Principal */}
      <div className="col-span-9 h-full flex flex-col">
        {/* Dejamos espacio para el grafo, por ahora vacío */}
        <div className="h-2/3 border-b-2 border-accent/50 bg-gray-100/80">
          {/* GraphPanel irá aquí */}
        </div>
        {/* Panel de Análisis */}
        <div className="h-1/3 bg-white">
          <AnalysisPanel />
        </div>
      </div>
    </div>
  );
}

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