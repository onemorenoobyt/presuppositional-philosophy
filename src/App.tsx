// En src/App.tsx
import { Routes, Route } from 'react-router-dom';
import { KnowledgeGraphProvider, useAppContainer } from './context/KnowledgeGraphContext';

// 1. Este es tu código anterior, ahora como un componente interno.
function MainLayout() {
  const { isLoading } = useAppContainer(); // Usamos el hook para saber si los datos están listos

  // Mostramos un mensaje de carga mientras se obtienen los datos.
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p className="text-lg text-primary animate-pulse">Cargando conocimiento...</p>
      </div>
    );
  }

  // Una vez cargado, mostramos el layout principal.
  // Por ahora, es solo el título, pero aquí irán los paneles.
  return (
    <div className="p-8">
      <h1 className="text-4xl font-serif text-primary">
        Glosario de Filosofía Trascendental
      </h1>
      <p className="mt-4">
        Datos cargados. Listo para construir la UI.
      </p>
    </div>
  );
}

// 2. Este es el componente principal que se exporta.
function App() {
  return (
    // 3. El proveedor de contexto envuelve todo.
    <KnowledgeGraphProvider>
      {/* 4. El sistema de rutas define qué se muestra. */}
      <Routes>
        {/* Para cualquier ruta, muestra nuestro MainLayout. */}
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </KnowledgeGraphProvider>
  );
}

export default App;