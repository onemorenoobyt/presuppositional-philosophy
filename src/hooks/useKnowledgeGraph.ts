// En src/hooks/useKnowledgeGraph.ts
import { useState, useEffect } from 'react';
import type { EnrichedTerm, RawTerm } from '../types';
import { enrichTermsWithMetrics } from '../logic/knowledgeGraph';

export function useKnowledgeGraph() {
  const [terms, setTerms] = useState<EnrichedTerm[]>([]);
  const [termsMap, setTermsMap] = useState<Map<string, EnrichedTerm>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/database.json');
        const rawData: RawTerm[] = await response.json();
        const enrichedData = enrichTermsWithMetrics(rawData);
        const dataMap = new Map<string, EnrichedTerm>();
        enrichedData.forEach(term => dataMap.set(term.id, term));
        setTerms(enrichedData);
        setTermsMap(dataMap);
      } catch (error) {
        console.error("Fallo al cargar la base de datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { terms, termsMap, isLoading };
}