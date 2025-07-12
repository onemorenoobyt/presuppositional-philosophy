import { Routes, Route } from 'react-router-dom';
import { KnowledgeGraphProvider } from './context/KnowledgeGraphContext';
import MainLayout from './components/MainLayout';

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