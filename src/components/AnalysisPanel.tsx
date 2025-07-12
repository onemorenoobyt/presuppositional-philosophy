// En src/components/AnalysisPanel.tsx
import React from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';

const AnalysisPanel: React.FC = () => {
  const { activeTermId, termsMap } = useAppContainer();
  const activeTerm = activeTermId ? termsMap.get(activeTermId) : null;

  if (!activeTerm) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-gray-500">Selecciona un término del índice para ver su detalle.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h3 className="text-2xl font-serif font-bold text-primary">{activeTerm.name}</h3>
      <p className="mt-4 text-text/90 leading-relaxed">
        {activeTerm.definition}
      </p>
    </div>
  );
};

export default AnalysisPanel;