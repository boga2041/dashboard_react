// src/components/TopCountriesPanel.jsx
import { useEffect, useMemo, useState } from "react";
import TopCountriesBar from "./TopCountriesBar";

const nf = new Intl.NumberFormat("es-ES");

/**
 * Panel Top N países por población (World Bank • SP.POP.TOTL)
 * - Busca automáticamente el último año con datos dentro de una ventana (p. ej. últimos 5 años).
 *
 * Props:
 * - year?: number | string  -> año “objetivo” (se usa como tope superior)
 * - top?: number            -> cuántos países mostrar (default 10)
 * - lookback?: number       -> cuántos años hacia atrás mirar (default 5)
 */
export default function TopCountriesPanel({ year, top = 10, lookback = 5 }) {
  const [displayYear, setDisplayYear] = useState(null);
  const [rows, setRows] = useState([]); // [{ name, total }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");

        // 1) Elegimos ventana: [from..to]
        const current = new Date().getFullYear();
        const to = Number(year || current);
        const from = Math.max(1960, to - Math.max(1, lookback) + 1);

        // 2) Pedimos el rango en UN llamado (más rápido que año por año)
        const url = `https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&date=${from}:${to}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json) ? json[1] : [];

        // 3) Filtramos solo países (excluimos agregados con region.id === "NA")
        const onlyCountries = (list || []).filter(
          (it) =>
            it &&
            it.country &&
            it.country.value &&
            it.countryiso3code &&
            it.region &&
            it.region.id &&
            it.region.id !== "NA"
        );

        // 4) Encontramos el año MÁS RECIENTE dentro de la ventana que tenga al menos un valor != null
        const yearsWithData = new Set(
          onlyCountries
            .filter((it) => it.value != null)
            .map((it) => Number(it.date))
            .filter((y) => Number.isFinite(y))
        );

        if (!yearsWithData.size) {
          if (!alive) return;
          setDisplayYear(to); // mostramos el año objetivo aunque no haya datos
          setRows([]);
          return;
        }

        const bestYear = Math.max(...Array.from(yearsWithData));

        // 5) Calculamos Top N para ese año
        const map = new Map(); // name -> total
        for (const it of onlyCountries) {
          if (Number(it.date) !== bestYear) continue;
          if (it.value == null) continue;
          const name = it.country.value;
          const val = Number(it.value);
          map.set(name, (map.get(name) || 0) + val);
        }

        let ranked = Array.from(map.entries())
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total);

        if (!alive) return;
        setDisplayYear(bestYear);
        setRows(ranked);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "No se pudieron obtener los datos");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [year, lookback]);

  const header = useMemo(
    () =>
      `Top ${top} países por población • ` +
      (displayYear == null ? "—" : `Año ${displayYear}`),
    [top, displayYear]
  );

  return (
    <div className="panel">
      <h3>{header}</h3>

      {loading && (
        <div className="text-muted" role="status" aria-live="polite">
          Cargando datos…
        </div>
      )}

      {error && (
        <div className="alert error" role="alert">
          Error: {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="text-muted" role="status" aria-live="polite">
          No hay datos disponibles para esta ventana de años.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <>
          <TopCountriesBar data={rows} top={top} />
          <div className="table-responsive" style={{ marginTop: 12 }}>
            <table
              className="table compact"
              aria-label={`Tabla con el Top ${top} de países por población para el año ${displayYear}`}
            >
              <thead>
                <tr>
                  <th>País</th>
                  <th>Población</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, top).map((r, i) => (
                  <tr key={r.name + i}>
                    <td>{r.name}</td>
                    <td>{nf.format(Math.round(r.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
