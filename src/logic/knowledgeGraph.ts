// En src/logic/knowledgeGraph.ts
import type { EnrichedTerm, RawTerm } from '../types';

// Enriquece los datos crudos con métricas calculadas.
export function enrichTermsWithMetrics(terms: RawTerm[]): EnrichedTerm[] {
  return terms.map(term => ({
    ...term,
    dependencyCount: term.used_terms.length,
    influenceScore: term.used_by.length,
  }));
}

// Traza la ruta de dependencia más corta desde un término hasta su "raíz".
export function traceDependencyChain(termId: string, termsMap: Map<string, EnrichedTerm>): string[] {
  const rootTypes: RawTerm['type'][] = ['Axioma', 'Definición', 'Átomo lógico', 'Postulado'];
  const startTerm = termsMap.get(termId);
  if (!startTerm) return [];
  if (rootTypes.includes(startTerm.type)) return [termId];
  const queue: string[][] = [[termId]];
  const visited = new Set<string>([termId]);
  while (queue.length > 0) {
    const path = queue.shift()!;
    const currentId = path[path.length - 1];
    const currentTerm = termsMap.get(currentId);
    if (currentTerm) {
      if (rootTypes.includes(currentTerm.type)) return path;
      for (const dependencyId of currentTerm.used_terms) {
        if (!visited.has(dependencyId)) {
          visited.add(dependencyId);
          queue.push([...path, dependencyId]);
        }
      }
    }
  }
  return [];
}