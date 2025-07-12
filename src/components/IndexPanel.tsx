// En src/components/IndexPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import { twMerge } from 'tailwind-merge';
import { termTypeStyles } from '../logic/styles';
import { TERM_TYPES } from '../types'; // Importando la lista canónica de tipos
import type { RawTerm } from '../types';

// Componente de UI para mostrar mientras los datos principales cargan
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
  
  // El estado de los filtros ahora se inicializa de forma segura desde TERM_TYPES
  const [activeFilters, setActiveFilters] = useState<Set<RawTerm['type']>>(new Set(TERM_TYPES));

  // Maneja el cambio de estado de un checkbox de filtro
  const handleFilterChange = (type: RawTerm['type']) => {
    setActiveFilters(prevFilters => {
      const newFilters = new Set(prevFilters);
      if (newFilters.has(type)) {
        newFilters.delete(type);
      } else {
        newFilters.add(type);
      }
      return newFilters;
    });
  };

  // Memoiza el resultado de la búsqueda y el filtrado para optimizar el rendimiento
  const filteredAndSortedTerms = useMemo(() => {
    let results = terms;

    if (searchTerm.trim() && fuse) {
      results = fuse.search(searchTerm).map(result => result.item);
    }

    return results.filter(term => activeFilters.has(term.type));
  }, [searchTerm, terms, fuse, activeFilters]);

  // Muestra el Skeleton Loader si los datos aún no están listos
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
      
      {/* Sección de Filtros por Tipo */}
      <div className="mt-4">
        <div className="text-sm font-semibold text-gray-600 mb-2">Filtrar por tipo:</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {TERM_TYPES.map((type) => (
            <label key={type} className="flex items-center space-x-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={activeFilters.has(type)}
                onChange={() => handleFilterChange(type)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contador de Resultados */}
      <p className="mt-4 text-xs text-gray-500 font-medium">
        {filteredAndSortedTerms.length} {filteredAndSortedTerms.length === 1 ? 'resultado' : 'resultados'}
      </p>

      {/* Lista de Términos Filtrados */}
      <ul className="mt-2 overflow-y-auto flex-grow pr-2">
        {filteredAndSortedTerms.length > 0 ? (
          filteredAndSortedTerms.map(term => (
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
            No se encontraron resultados.
          </li>
        )}
      </ul>
    </div>
  );
};

export default IndexPanel;