// En src/context/KnowledgeGraphContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
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

  const value = { terms, termsMap, isLoading, activeTermId, setActiveTermId, fuse };

  return <KnowledgeGraphContext.Provider value={value}>{children}</KnowledgeGraphContext.Provider>;
};

export const useAppContainer = () => {
  const context = useContext(KnowledgeGraphContext);
  if (!context) throw new Error('useAppContainer debe usarse dentro de un KnowledgeGraphProvider');
  return context;
};