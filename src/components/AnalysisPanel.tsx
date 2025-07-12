// En src/components/AnalysisPanel.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import KaTeXRenderer from './KaTeXRenderer';
import { traceDependencyChain } from '../logic/knowledgeGraph';
import { termTypeStyles } from '../logic/styles';
import { twMerge } from 'tailwind-merge';
import { Network } from 'lucide-react'; // Importar el icono

const AnalysisPanel: React.FC = () => {
  const { activeTermId, setActiveTermId, termsMap } = useAppContainer();
  const [activeTab, setActiveTab] = useState<'definition' | 'proof' | 'analysis'>('definition');

  const activeTerm = useMemo(() => activeTermId ? termsMap.get(activeTermId) : null, [activeTermId, termsMap]);

  const proofTerm = useMemo(() => {
    if (!activeTerm?.hasProof) return null;
    // Itera sobre los valores del mapa para encontrar la demostración correspondiente.
    for (const term of termsMap.values()) {
        if (term.proofFor === activeTerm.id) return term;
    }
    return null;
  }, [activeTerm, termsMap]);
  
  const dependencyPath = useMemo(() => {
    return activeTermId ? traceDependencyChain(activeTermId, termsMap) : [];
  }, [activeTermId, termsMap]);

  // Efecto para resetear la pestaña a 'definición' cuando cambia el término activo
  useEffect(() => {
    setActiveTab('definition');
  }, [activeTermId]);

  // Estado de bienvenida mejorado
  if (!activeTerm) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
          <h2 className="text-2xl font-serif text-primary">Bienvenido al Glosario Interactivo</h2>
          <p className="mt-2 text-gray-600 max-w-md">
            Selecciona un término del índice para comenzar tu exploración. Una vez seleccionado, podrás usar el botón 
            <Network size={16} className="inline-block mx-1" /> 
            para visualizar sus conexiones en el grafo conceptual.
          </p>
        </div>
      );
  }
  
  // Componente interno para renderizar listas de dependencias
  const renderTermList = (termIds: string[], title: string) => (
    <div>
        <h4 className="font-semibold mt-4 mb-2">{title} ({termIds.length})</h4>
        <ul className="text-sm space-y-1">
            {termIds.slice(0, 10).map(id => {
                const term = termsMap.get(id);
                return term ? <li key={id}><button onClick={() => setActiveTermId(id)} className="text-primary hover:underline">{term.displayName}</button></li> : null;
            })}
            {termIds.length > 10 && <li className="text-gray-500">...y {termIds.length - 10} más.</li>}
        </ul>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Cabecera del término */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-2xl font-serif font-bold text-primary">{activeTerm.name}</h3>
        <span className={twMerge("mt-1 inline-block text-xs px-2 py-1 rounded font-semibold", termTypeStyles[activeTerm.type])}>
            {activeTerm.type}
        </span>
      </div>
      
      {/* Pestañas de Navegación */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4 px-4">
            <TabButton isActive={activeTab === 'definition'} onClick={() => setActiveTab('definition')}>Definición</TabButton>
            {proofTerm && <TabButton isActive={activeTab === 'proof'} onClick={() => setActiveTab('proof')}>Demostración</TabButton>}
            <TabButton isActive={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>Análisis</TabButton>
        </nav>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div className="p-4 overflow-y-auto flex-grow">
        {activeTab === 'definition' && <KaTeXRenderer text={activeTerm.definition} />}
        {activeTab === 'proof' && proofTerm && <KaTeXRenderer text={proofTerm.definition} />}
        {activeTab === 'analysis' && (
             <div>
                 <h4 className="font-semibold mb-2">Camino a los Fundamentos</h4>
                 <div className="flex flex-wrap items-center text-sm gap-2">
                    {dependencyPath.map((id, index) => {
                         const term = termsMap.get(id);
                         return term ? (
                            <React.Fragment key={id}>
                                <button onClick={() => setActiveTermId(id)} className={twMerge("p-1 rounded text-xs", termTypeStyles[term.type])}>
                                    {term.displayName}
                                </button>
                                {index < dependencyPath.length - 1 && <span className="font-bold text-gray-400"></span>}
                            </React.Fragment>
                         ) : null;
                    }).reverse()}
                 </div>
                 <div className="grid grid-cols-2 gap-8 mt-4">
                    {renderTermList(activeTerm.used_terms, 'Utiliza')}
                    {renderTermList(activeTerm.used_by, 'Utilizado Por')}
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

// Componente de botón para las pestañas
const TabButton: React.FC<{isActive: boolean, onClick: () => void, children: React.ReactNode}> = ({isActive, onClick, children}) => (
    <button onClick={onClick} className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {children}
    </button>
);

export default AnalysisPanel;