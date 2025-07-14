// En src/components/SEOHelmet.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHelmetProps {
  title?: string;
  description?: string;
}

const defaultTitle = 'Glosario de Filosofía Presuposicional';
const defaultDescription = 'Una herramienta interactiva para explorar los conceptos del Tratado de Filosofía Presuposicional.';

const SEOHelmet: React.FC<SEOHelmetProps> = ({ title, description }) => {
  // Lógica corregida y más clara
  const finalTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const finalDescription = description || defaultDescription;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEOHelmet;