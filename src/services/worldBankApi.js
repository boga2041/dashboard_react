// services/worldBankApi.js
const API_URL =
  "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000";

/**
 * Descarga todos los registros SP.POP.TOTL y devuelve
 * [{ country, iso3, year, value }, ...] ordenados (país asc, año desc)
 */
export async function fetchWorldBankPopulation() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`WorldBank HTTP ${res.status}`);
  const json = await res.json();
  const data = Array.isArray(json) ? json[1] : [];

  const rows = (data || []).map((d) => ({
    country: d?.country?.value ?? "",
    iso3: d?.countryiso3code ?? "",
    year: Number(d?.date),
    value: d?.value == null ? null : Number(d.value),
  }));

  rows.sort((a, b) => {
    if (a.country < b.country) return -1;
    if (a.country > b.country) return 1;
    return b.year - a.year;
  });

  return rows;
}
