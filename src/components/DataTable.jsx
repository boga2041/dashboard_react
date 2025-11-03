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

const BOOT_URL =
  "https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&date=1960:2024";

function escapeRegex(s = "") {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function DataTable({
  countryName = "",
  yearFrom = "",
  yearTo = "",
  onStatsChange,              // <- NUEVO: callback para KPIs
}) {
  const tableRef = useRef(null);

  const options = useMemo(() => ({
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

    ajax: {
      url: BOOT_URL,
      dataSrc: (json) => {
        const items = Array.isArray(json) ? json[1] : [];
        return (items || []).map((r) => ({
          code: r?.country?.id ?? "",
          name: r?.country?.value ?? "",
          population: r?.value ?? null,
          year: Number(r?.date ?? 0),
        }));
      },
    },
    columns,
  }), []);

  function applyFilters(dt) {
    // País por nombre (columna 1)
    if (countryName) {
      dt.column(1).search(`^${escapeRegex(countryName)}$`, true, false, false);
    } else {
      dt.column(1).search("", false, false, false);
    }

    // Años (columna 3)
    if (!yearFrom && !yearTo) {
      dt.column(3).search("", false, false, false);
    } else if (yearFrom && yearTo) {
      const a = Math.min(Number(yearFrom), Number(yearTo));
      const b = Math.max(Number(yearFrom), Number(yearTo));
      const years = [];
      for (let y = a; y <= b; y++) years.push(String(y));
      dt.column(3).search(`^(${years.join("|")})$`, true, false, false);
    } else {
      const y = String(yearFrom || yearTo);
      dt.column(3).search(`^${escapeRegex(y)}$`, true, false, false);
    }

    dt.draw();
  }

  // Calcula KPIs con las filas filtradas y dispara onStatsChange
function computeAndEmitStats(dt) {
  if (!onStatsChange) return;

  const arr = dt.rows({ search: "applied" }).data().toArray();

  if (!arr.length) {
    onStatsChange({
      latestYear: null,
      totalPopLatest: null,
      countriesCount: 0,
      growthAbs: null,
      growthPct: null,
      series: [],
      countryTotalsLatest: [],   // <- NUEVO
    });
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

  // NUEVO: Top por país en el año más reciente
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
    countryTotalsLatest, // <- NUEVO
  });
}




  // Aplica filtros cuando cambian props y re-calcula KPIs en cada draw/xhr
  useEffect(() => {
    const dt = tableRef.current?.dt();
    if (!dt) return;

    applyFilters(dt);               // aplicar filtros actuales
    computeAndEmitStats(dt);        // KPIs tras aplicar

    // Re-aplicar/recálculo al recibir datos y en cada draw
    dt.off('.filtersStats');
    dt.on('xhr.filtersStats', () => {
      applyFilters(dt);
      computeAndEmitStats(dt);
    });
    dt.on('draw.filtersStats', () => {
      computeAndEmitStats(dt);
    });

    return () => { dt.off('.filtersStats'); };
  }, [countryName, yearFrom, yearTo]);

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
