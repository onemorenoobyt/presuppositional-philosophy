// En src/App.tsx

function App() {
  return (
    // 'p-8' ya estaba bien. Aplica padding.
    <div className="p-8">
      {/* 
        AQUÍ ESTÁ LA MAGIA:
        - Reemplazamos el style="" por clases de utilidad.
        - 'text-4xl': Para el tamaño de la fuente.
        - 'font-serif': Aplica la fuente serif que definiste en @theme.
        - 'text-primary': Aplica el color primario que definiste en @theme.
        El orden de las clases no importa.
      */}
      <h1 className="text-4xl font-serif text-primary">
        Glosario de Filosofía Trascendental
      </h1>
      
      {/* 
        Este párrafo heredará la fuente y color por defecto del `body`,
        tal y como lo configuraste en `index.css`.
      */}
      <p className="mt-4">
        Entorno configurado correctamente.
      </p>
    </div>
  );
}

export default App;