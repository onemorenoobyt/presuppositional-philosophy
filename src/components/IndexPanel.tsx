// En src/components/IndexPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAppContainer } from '../context/KnowledgeGraphContext';
import type { RawTerm } from '../types';
import { twMerge } from 'tailwind-merge';

const termTypeStyles: Record<RawTerm['type'], string> = {
  'Postulado': 'bg-blue-200 text-blue-800',
  'Definición': 'bg-green-200 text-green-800',
  'Proposición': 'bg-indigo-200 text-indigo-800',
  'Átomo lógico': 'bg-gray-200 text-gray-800',
  'Axioma': 'bg-red-200 text-red-800',
  'Teorema': 'bg-yellow-200 text-yellow-800',
  'Demostración': 'bg-purple-200 text-purple-800',
  'Corolario': 'bg-pink-200 text-pink-800',
  'Conjetura': 'bg-orange-200 text-orange-800',
  'Lema': 'bg-teal-200 text-teal-800',
};

const IndexPanel: React.FC = () => {
  const { terms, setActiveTermId, activeTermId, fuse } = useAppContainer();
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || !fuse) return terms;
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
                activeTermId === term.id && "bg-accent/40 font-semibold"
              )}
            >
              <span className={twMerge("inline-block text-xs px-1.5 py-0.5 rounded mr-2 font-mono font-bold", termTypeStyles[term.type])}>
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