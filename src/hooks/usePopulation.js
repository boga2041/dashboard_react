// hooks/usePopulation.js
import { useEffect, useMemo, useState } from "react";
import { fetchWorldBankPopulation } from "../services/worldBankApi";

/**
 * Maneja todo lo relativo a:
 * - carga de datos
 * - filtros (country, years)
 * - métricas (latestYear, totalPopulation, growth)
 * - paginación
 */
export function usePopulation({ selectedCountry, yearFrom, yearTo, pageSize = 50 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga una vez
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchWorldBankPopulation();
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e.message || "Error cargando datos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const yFrom = Number(yearFrom);
  const yTo = Number(yearTo);

  // Filtro
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const inYear = r.year >= yFrom && r.year <= yTo;
      const inCountry =
        selectedCountry === "ALL"
          ? true
          : r.iso3 === selectedCountry || r.country === selectedCountry;
      return inYear && inCountry;
    });
  }, [rows, yFrom, yTo, selectedCountry]);

  // Métricas
  const countriesInFiltered = useMemo(() => {
    const set = new Set(filtered.map((r) => r.iso3).filter(Boolean));
    return set.size;
  }, [filtered]);

  const latestYear = useMemo(() => {
    let max = null;
    for (const r of filtered) {
      if (r.value == null) continue;
      if (max === null || r.year > max) max = r.year;
    }
    return max;
  }, [filtered]);

  const totalPopulation = useMemo(() => {
    if (!latestYear) return null;
    if (selectedCountry === "ALL") {
      return filtered
        .filter((r) => r.year === latestYear && r.value != null)
        .reduce((acc, r) => acc + r.value, 0);
    } else {
      const row = filtered.find((r) => r.year === latestYear && r.value != null);
      return row ? row.value : null;
    }
  }, [filtered, latestYear, selectedCountry]);

  const growthYoY = useMemo(() => {
    if (!latestYear) return null;
    const prevYear = latestYear - 1;
    if (selectedCountry === "ALL") {
      const curr = filtered
        .filter((r) => r.year === latestYear && r.value != null)
        .reduce((a, r) => a + r.value, 0);
      const prev = filtered
        .filter((r) => r.year === prevYear && r.value != null)
        .reduce((a, r) => a + r.value, 0);
      if (!prev) return null;
      return ((curr - prev) / prev) * 100;
    } else {
      const curr = filtered.find((r) => r.year === latestYear && r.value != null)?.value;
      const prev = filtered.find((r) => r.year === prevYear && r.value != null)?.value;
      if (curr == null || prev == null || prev === 0) return null;
      return ((curr - prev) / prev) * 100;
    }
  }, [filtered, latestYear, selectedCountry]);

  // Paginación
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
  }, [selectedCountry, yearFrom, yearTo]);

  const totalRows = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return {
    loading,
    error,
    // datos filtrados (para tabla paginada)
    pageRows,
    totalRows,
    page,
    totalPages,
    setPage,
    // métricas
    latestYear,
    totalPopulation,
    growthYoY,
    countriesInFiltered,
  };
}
