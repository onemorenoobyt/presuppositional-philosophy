// En src/types.ts

// Define la estructura de los objetos tal como vienen de database.json
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

// Extiende RawTerm con métricas calculadas para su uso en la aplicación
export interface EnrichedTerm extends RawTerm {
  dependencyCount: number; // Cuántos otros términos utiliza
  influenceScore: number;  // Cuántas veces es utilizado
}

// Única fuente de verdad para los tipos de término.
// `as const` y el tipo explícito `readonly ...[]` garantizan la máxima seguridad de tipos.
export const TERM_TYPES: readonly RawTerm['type'][] = [
  'Postulado',
  'Definición',
  'Proposición',
  'Átomo lógico',
  'Axioma',
  'Teorema',
  'Demostración',
  'Corolario',
  'Conjetura',
  'Lema'
] as const;