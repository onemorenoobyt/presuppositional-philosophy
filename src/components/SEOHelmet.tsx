// En src/components/SEOHelmet.tsx
import React from 'react';

interface SEOHelmetProps {
  title?: string;
  description?: string;
}

const defaultTitle = 'Glosario de Filosofía Presuposicional';
const defaultDescription = 'Una herramienta interactiva para explorar los conceptos del Tratado de Filosofía Presuposicional.';

const SEOHelmet: React.FC<SEOHelmetProps> = ({ title, description }) => {
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;

  // En React 19, puedes devolver estas etiquetas directamente.
  // React las moverá al <head> del documento automáticamente.
  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
    </>
  );
};

export default SEOHelmet;