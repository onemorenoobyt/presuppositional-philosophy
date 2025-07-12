import React, { useState, useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import { twMerge } from 'tailwind-merge';
import { termTypeStyles } from '../logic/styles';

// Componente interno para el "esqueleto" de carga
const SkeletonLoader: React.FC = () => (
  <div className="space-y-3 mt-4 animate-pulse">
    {[...Array(15)].map((_, i) => (
      <div key={i} className="flex items-center space-x-2">
        <div className="h-5 w-12 bg-gray-300 rounded"></div>
        <div className="h-5 flex-grow bg-gray-300 rounded"></div>
      </div>
    ))}
  </div>
);

const IndexPanel: React.FC = () => {
  const { terms, isLoading, setActiveTermId, activeTermId, fuse } = useAppContainer();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !fuse) return terms;
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, terms, fuse]);

  // Si los datos están cargando, muestra el Skeleton Loader
  if (isLoading) {
    return (
      <div className="p-4 h-full flex flex-col">
        <h2 className="text-xl font-serif font-bold text-primary">Índice Inteligente</h2>
        <div className="w-full mt-2 p-4 border rounded-md bg-gray-200"></div>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-xl font-serif font-bold text-primary">Índice Inteligente</h2>
      <input
        type="text"
        placeholder="Buscar término..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mt-2 p-2 border rounded-md focus:ring-2 focus:ring-accent/50 focus:outline-none"
      />
      <ul className="mt-4 overflow-y-auto flex-grow pr-2">
        {searchResults.length > 0 ? (
          searchResults.map(term => (
            <li key={term.id}>
              <button
                onClick={() => setActiveTermId(term.id)}
                className={twMerge("w-full text-left p-2 my-1 text-sm hover:bg-accent/20 transition-colors duration-150 rounded-md", activeTermId === term.id && "bg-accent/40 font-semibold")}
              >
                <span className={twMerge("inline-block text-xs px-1.5 py-0.5 rounded mr-2 font-mono font-bold", termTypeStyles[term.type])}>
                  {term.type.slice(0, 3).toUpperCase()}
                </span>
                {term.displayName}
              </button>
            </li>
          ))
        ) : (
          <li className="p-4 text-center text-sm text-gray-500">
            No se encontraron resultados para "{searchTerm}".
          </li>
        )}
      </ul>
    </div>
  );
};

export default IndexPanel;