// En src/logic/styles.ts
import type { RawTerm } from '../types';

export const termTypeStyles: Record<RawTerm['type'], string> = {
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