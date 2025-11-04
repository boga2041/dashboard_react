// src/components/PlaceholderChart.jsx
export function PlaceholderChart() {
  return (
    <div
      className="chart-placeholder"
      role="status"
      aria-live="polite"
      aria-label="Cargando gráfico de población. Por favor espera."
    >
      {/* Elementos visuales solo decorativos */}
      <div className="chart-grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bar"
            style={{ height: `${20 + (i % 6) * 10}%` }}
          />
        ))}
      </div>

      <div className="chart-legend" aria-hidden="true">
        <span className="dot" /> Serie: Población total (SP.POP.TOTL)
      </div>
    </div>
  );
}
