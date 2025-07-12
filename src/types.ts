// En src/types.ts
export interface RawTerm {
  id: string;
  type: 'Postulado' | 'Definición' | 'Proposición' | 'Átomo lógico' | 'Axioma' | 'Teorema' | 'Demostración' | 'Corolario' | 'Conjetura' | 'Lema';
  name: string;
  definition: string;
  displayName: string;
  used_by: string[];
  used_terms: string[];
  hasProof: boolean;
  proofFor: string | null;
}

export interface EnrichedTerm extends RawTerm {
  dependencyCount: number; // Cuántos otros términos utiliza
  influenceScore: number;  // Cuántas veces es utilizado
}