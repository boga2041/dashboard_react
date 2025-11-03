// services/countries.js
export async function fetchCountries() {
  // Trae países (incluye agregados/regiones); filtramos para mostrar países reales
  const res = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=400');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const items = Array.isArray(json) ? json[1] : [];

  // Filtra agregados (ej. “Africa Eastern and Southern”, etc.)
  // Heurística estable: incomeLevel.id !== 'Aggregates' y region.id !== 'NA'
  const countries = (items ?? [])
    .filter(c => c?.incomeLevel?.id !== 'Aggregates' && c?.region?.id !== 'NA')
    .map(c => ({ id: c.id, name: c.name })) // id = ISO3
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return countries;
}
