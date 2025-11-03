// components/DataTable.jsx
import 'datatables.net-dt/css/dataTables.dataTables.css';
import DataTableLib from 'datatables.net-react';
import DT from 'datatables.net-dt';
import { useEffect, useMemo, useRef } from 'react';

DataTableLib.use(DT);

const nf = new Intl.NumberFormat('es-ES');

const columns = [
  { title: "ISO",  data: "code" },
  { title: "País", data: "name" },
  {
    title: "Población",
    data: "population",
    render: (d) => (d == null ? "—" : nf.format(d)),
  },
  { title: "Año",  data: "year" },
];

const API_BASE_URL = "https://api.worldbank.org/v2";

// Objeto de stats vacío reutilizable
const EMPTY_STATS = {
  latestYear: null,
  totalPopLatest: null,
  countriesCount: 0,
  growthAbs: null,
  growthPct: null,
  series: [],
  countryTotalsLatest: [],
};

function escapeRegex(s = "") {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Construye la URL SOLO en función del rango de años
// Siempre usamos country=all para que haya datos de todos los países
function buildUrl(yearFrom, yearTo) {
  let from;
  let to;

  if (!yearFrom && !yearTo) {
    // Sin años => rango completo 1960–2024
    from = 1960;
    to = 2024;
  } else if (yearFrom && yearTo) {
    const a = Math.min(Number(yearFrom), Number(yearTo));
    const b = Math.max(Number(yearFrom), Number(yearTo));
    from = a;
    to = b;
  } else {
    const y = Number(yearFrom || yearTo);
    from = y;
    to = y;
  }

  return `${API_BASE_URL}/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&date=${from}:${to}`;
}

export function DataTable({
  countryId = "",      // lo recibimos, pero NO lo usamos aquí
  countryName = "",
  yearFrom = "",
  yearTo = "",
  onStatsChange,
}) {
  const tableRef = useRef(null);

  const options = useMemo(
    () => ({
      responsive: true,
      autoWidth: false,
      processing: true,
      serverSide: false,
      deferRender: true,

      searching: true,
      ordering: true,

      paging: true,
      pageLength: 25,
      lengthChange: true,
      info: true,

      scrollY: 360,
      scrollCollapse: true,

      language: {
        lengthMenu: "_MENU_ por página",
        search: "Buscar:",
        info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
        infoEmpty: "Mostrando 0 a 0 de 0 entradas",
        zeroRecords: "Sin resultados",
        processing: "Cargando…",
        paginate: { first: "«", previous: "‹", next: "›", last: "»" },
      },

      dom: '<"dt-toolbar"l>t<"dt-footer"ip>',

      // Tabla empieza vacía, rellenamos con fetch
      data: [],
      columns,
    }),
    []
  );

  // Aplica solo filtro por nombre de país sobre los datos que ya están cargados
  function applyFilters(dt) {
    if (countryName) {
      dt
        .column(1)
        .search(`^${escapeRegex(countryName)}$`, true, false, false);
    } else {
      dt.column(1).search("", false, false, false);
    }
    dt.draw();
  }

  // Calcula KPIs con las filas filtradas y dispara onStatsChange
  function computeAndEmitStats(dt) {
    if (!onStatsChange) return;

    const arr = dt.rows({ search: "applied" }).data().toArray();

    if (!arr.length) {
      onStatsChange(EMPTY_STATS);
      return;
    }

    const years = Array.from(new Set(arr.map((r) => r.year))).filter(Boolean);
    const latestYear = years.length ? Math.max(...years) : null;

    const countries = new Set(arr.map((r) => r.name));
    const countriesCount = countries.size;

    let totalPopLatest = null;
    let totalPopPrev = null;

    if (latestYear != null) {
      const latestRows = arr.filter(
        (r) => r.year === latestYear && r.population != null
      );
      totalPopLatest = latestRows.reduce(
        (sum, r) => sum + Number(r.population || 0),
        0
      );

      const prevRows = arr.filter(
        (r) => r.year === latestYear - 1 && r.population != null
      );
      totalPopPrev = prevRows.length
        ? prevRows.reduce((sum, r) => sum + Number(r.population || 0), 0)
        : null;
    }

    // Serie anual agregada
    const totalsByYear = new Map();
    for (const r of arr) {
      if (r.population == null || !r.year) continue;
      totalsByYear.set(
        r.year,
        (totalsByYear.get(r.year) || 0) + Number(r.population)
      );
    }
    const series = Array.from(totalsByYear.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, total]) => ({ year, total }));

    // Top por país en el año más reciente
    let countryTotalsLatest = [];
    if (latestYear != null) {
      const map = new Map(); // name -> total
      for (const r of arr) {
        if (r.year !== latestYear || r.population == null) continue;
        map.set(r.name, (map.get(r.name) || 0) + Number(r.population));
      }
      countryTotalsLatest = Array.from(map.entries())
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);
    }

    let growthAbs = null;
    let growthPct = null;
    if (totalPopLatest != null && totalPopPrev != null && totalPopPrev !== 0) {
      growthAbs = totalPopLatest - totalPopPrev;
      growthPct = growthAbs / totalPopPrev;
    }

    onStatsChange({
      latestYear,
      totalPopLatest,
      countriesCount,
      growthAbs,
      growthPct,
      series,
      countryTotalsLatest,
    });
  }

  // 1) Carga datos de la API cuando cambian los AÑOS (o al inicio)
  useEffect(() => {
    const dt = tableRef.current?.dt();
    if (!dt) return;

    const url = buildUrl(yearFrom, yearTo);

    dt.clear().draw();
    dt.processing(true);

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const items = Array.isArray(json) ? json[1] : [];
        const rows = (items || []).map((r) => ({
          code: r?.country?.id ?? "",
          name: r?.country?.value ?? "",
          population: r?.value ?? null,
          year: Number(r?.date ?? 0),
        }));

        dt.rows.add(rows);
        applyFilters(dt);        // aplica país si hay
        computeAndEmitStats(dt); // KPIs para ese rango de años
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        dt.clear().draw();
        if (onStatsChange) onStatsChange(EMPTY_STATS);
      })
      .finally(() => {
        dt.processing(false);
      });
  }, [yearFrom, yearTo]);

  // 2) Si solo cambia el país, re-filtramos en cliente sin volver a llamar a la API
  useEffect(() => {
    const dt = tableRef.current?.dt();
    if (!dt) return;
    applyFilters(dt);
    computeAndEmitStats(dt);
  }, [countryName]);

  return (
    <div className="table-wrap">
      <DataTableLib
        ref={tableRef}
        className="display stripe hover"
        options={options}
      />
    </div>
  );
}
