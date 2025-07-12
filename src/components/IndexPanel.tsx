// En src/components/IndexPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import { twMerge } from 'tailwind-merge';
import { termTypeStyles } from '../logic/styles'; // <-- Importamos los estilos centralizados

const IndexPanel: React.FC = () => {
  const { terms, setActiveTermId, activeTermId, fuse } = useAppContainer();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    // Si no hay término de búsqueda o fuse no está listo, devuelve todos los términos
    if (!searchTerm.trim() || !fuse) {
      return terms; 
    }
    // Si hay búsqueda, usa Fuse.js para filtrar
    return fuse.search(searchTerm).map(result => result.item);
  }, [searchTerm, terms, fuse]);

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
        {searchResults.map(term => (
          <li key={term.id}>
            <button
              onClick={() => setActiveTermId(term.id)}
              className={twMerge(
                "w-full text-left p-2 my-1 text-sm hover:bg-accent/20 transition-colors duration-150 rounded-md",
                activeTermId === term.id && "bg-accent/40 font-semibold" // Estilo para el término activo
              )}
            >
              {/* Usamos la constante de estilos importada */}
              <span className={twMerge(
                "inline-block text-xs px-1.5 py-0.5 rounded mr-2 font-mono font-bold", 
                termTypeStyles[term.type]
              )}>
                {term.type.slice(0, 3).toUpperCase()}
              </span>
              {term.displayName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPanel;