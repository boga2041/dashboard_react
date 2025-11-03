export function PlaceholderChart() {
  return (
    <div className="chart-placeholder">
      <div className="chart-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bar" style={{ height: `${20 + (i % 6) * 10}%` }} />
        ))}
      </div>
      <div className="chart-legend">
        <span className="dot" /> Serie: Población total (SP.POP.TOTL)
      </div>
    </div>
  );
}
