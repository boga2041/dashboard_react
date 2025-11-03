// src/components/YearFilter.jsx
export function YearFilter({ from, to, onChangeFrom, onChangeTo }) {
  // Obtiene el año actual dinámicamente
  const currentYear = new Date().getFullYear();

  // Genera lista desde 1960 hasta el año actual
  const years = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => 1960 + i);

  return (
    <div className="field-group">
      {/* Desde */}
      <div className="field">
        <label>Desde</label>
        <select
          value={from}
          onChange={(e) => onChangeFrom(e.target.value)}
        >
          {/* Placeholder */}
          <option value="">— Selecciona —</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Hasta */}
      <div className="field">
        <label>Hasta</label>
        <select
          value={to}
          onChange={(e) => onChangeTo(e.target.value)}
        >
          {/* Placeholder */}
          <option value="">— Selecciona —</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
