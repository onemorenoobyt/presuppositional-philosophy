// En src/context/KnowledgeGraphContext.tsx
import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { EnrichedTerm } from '../types';
import { useKnowledgeGraph } from '../hooks/useKnowledgeGraph';
import Fuse from 'fuse.js';

interface IKnowledgeGraphContext {
  terms: EnrichedTerm[];
  termsMap: Map<string, EnrichedTerm>;
  isLoading: boolean;
  activeTermId: string | null;
  setActiveTermId: (id: string | null) => void;
  fuse: Fuse<EnrichedTerm> | null;
  termMentionMap: Map<string, string>; // Mapa para menciones -> ID
}

const KnowledgeGraphContext = createContext<IKnowledgeGraphContext | undefined>(undefined);

export const KnowledgeGraphProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { terms, termsMap, isLoading } = useKnowledgeGraph();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTermId = useMemo(() => {
    const pathParts = location.pathname.split('/');
    return pathParts[1] === 'term' && pathParts[2] ? pathParts[2] : null;
  }, [location.pathname]);

  const setActiveTermId = (id: string | null) => {
    navigate(id ? `/term/${id}` : '/');
  };

  const fuse = useMemo(() => {
    return terms.length > 0 ? new Fuse(terms, { keys: ['displayName', 'name'], threshold: 0.3 }) : null;
  }, [terms]);

  // Mapa pre-calculado para la detección de términos
  const termMentionMap = useMemo(() => {
    const mentionMap = new Map<string, string>();
    if (terms.length === 0) return mentionMap;

    const pluralize = (name: string) => {
      if (name.endsWith('ión')) return `${name.slice(0, -3)}iones`; // proposición -> proposiciones
      if (name.endsWith('o') || name.endsWith('a') || name.endsWith('e')) return `${name}s`;
      if (/[b-df-hj-np-tv-z]$/i.test(name)) return `${name}es`;
      return name;
    };

    const sortedTerms = [...terms].sort((a, b) => b.displayName.length - a.displayName.length);

    sortedTerms.forEach(term => {
      const singular = term.displayName.toLowerCase();
      if (!mentionMap.has(singular)) mentionMap.set(singular, term.id);
      
      const plural = pluralize(singular);
      if (singular !== plural && !mentionMap.has(plural)) mentionMap.set(plural, term.id);
    });
    
    return mentionMap;
  }, [terms]);

  const value = { terms, termsMap, isLoading, activeTermId, setActiveTermId, fuse, termMentionMap };

  return <KnowledgeGraphContext.Provider value={value}>{children}</KnowledgeGraphContext.Provider>;
};

export const useAppContainer = () => {
  const context = useContext(KnowledgeGraphContext);
  if (!context) throw new Error('useAppContainer debe usarse dentro de un KnowledgeGraphProvider');
  return context;
};