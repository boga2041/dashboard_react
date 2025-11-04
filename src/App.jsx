// src/App.jsx
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import "./index.css";
import "./App.css";

import { Topbar } from "./components/Topbar";
import { Sidebar } from "./components/Sidebar";
import { StatCard } from "./components/StatCard";
import { PopulationChart } from "./components/PopulationChart";
import { DataTable } from "./components/DataTable";
import { YearFilter } from "./components/YearFilter";
import { CountrySelect } from "./components/CountrySelect";
import TopCountriesPanel from "./components/TopCountriesPanel";

const nf = new Intl.NumberFormat("es-ES");

export default function App() {
  // ID accesible para el selector de país
  const COUNTRY_SELECT_ID = "country-select";

  // Controles de UI
  const [selectedCountry, setSelectedCountry] = useState({ id: "", name: "" });
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  // Filtros aplicados (los que usa la tabla)
  const [appliedCountryId, setAppliedCountryId] = useState(""); // id ISO3
  const [appliedCountryName, setAppliedCountryName] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");

  // Países/Agregados desde la API
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countriesError, setCountriesError] = useState("");

  // KPIs
  const [latestYear, setLatestYear] = useState(null);
  const [totalPopLatest, setTotalPopLatest] = useState(null);
  const [countriesCount, setCountriesCount] = useState(0);
  const [growthAbs, setGrowthAbs] = useState(null);
  const [growthPct, setGrowthPct] = useState(null);
  const [series, setSeries] = useState([]);

  // === Cargar países ===
  useEffect(() => {
    let aborted = false;
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingCountries(true);
        setCountriesError("");
        const res = await fetch(
          "https://api.worldbank.org/v2/country?format=json&per_page=400",
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json) ? json[1] : [];
        const list = (items || [])
          .map((c) => ({ id: c.id, name: c.name })) // id = ISO3
          .sort((a, b) => a.name.localeCompare(b.name, "es"));

        if (!aborted) setCountries(list);
      } catch (e) {
        if (!aborted)
          setCountriesError(e.message || "No se pudieron cargar los países");
      } finally {
        if (!aborted) setLoadingCountries(false);
      }
    })();
    return () => {
      aborted = true;
      ac.abort();
    };
  }, []);

  // === Tema ===
  const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // 🔔 Helper: alerta que respeta el tema
  const showThemedAlert = ({ icon = "info", title = "", text = "" }) => {
    const isDark = theme === "dark";

    Swal.fire({
      icon,
      title,
      text,
      background: isDark ? "#020617" : "#ffffff",
      color: isDark ? "#e5e7eb" : "#020617",
      confirmButtonText: "Aceptar",
      iconColor: isDark ? "#38bdf8" : undefined,
      confirmButtonColor: "#4f46e5",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn primary",
      },
    });
  };

  // === Aplicar filtros ===
  const onApply = () => {
    const hasCountry = !!selectedCountry?.id;
    const hasFrom = !!yearFrom;
    const hasTo = !!yearTo;
    const hasAnyDate = hasFrom || hasTo;

    // ❌ No dejar aplicar si todo va vacío
    if (!hasCountry && !hasAnyDate) {
      showThemedAlert({
        icon: "warning",
        title: "Sin filtros",
        text: "Selecciona al menos un rango de años o un país antes de aplicar.",
      });
      return;
    }

    let from = yearFrom;
    let to = yearTo;
    if (yearFrom && yearTo) {
      const a = Math.min(Number(yearFrom), Number(yearTo)).toString();
      const b = Math.max(Number(yearFrom), Number(yearTo)).toString();
      from = a;
      to = b;
    }

    setAppliedCountryId(hasCountry ? selectedCountry.id : "");
    setAppliedCountryName(hasCountry ? selectedCountry.name : "");
    setAppliedFrom(hasAnyDate ? (from || to) : "");
    setAppliedTo(hasAnyDate ? (to || from) : "");

    if (hasCountry && hasAnyDate) {
      showThemedAlert({
        icon: "success",
        title: "Filtros aplicados",
        text: `Se filtró por país (${selectedCountry.name}) y por rango de años.`,
      });
    } else if (hasAnyDate) {
      showThemedAlert({
        icon: "success",
        title: "Filtro por fecha",
        text: "Se aplicó el filtro por rango de años.",
      });
    } else if (hasCountry) {
      showThemedAlert({
        icon: "success",
        title: "Filtro por país",
        text: `Se aplicó el filtro para ${selectedCountry.name}.`,
      });
    }
  };

  const onReset = () => {
    setSelectedCountry({ id: "", name: "" });
    setYearFrom("");
    setYearTo("");
    setAppliedCountryId("");
    setAppliedCountryName("");
    setAppliedFrom("");
    setAppliedTo("");

    showThemedAlert({
      icon: "info",
      title: "Filtros reseteados",
      text: "Se limpiaron los filtros y la tabla vuelve al estado inicial.",
    });
  };

  // === Auto-aplicar país si no hay fechas ===
  const handleCountryChange = (val) => {
    setSelectedCountry(val || { id: "", name: "" });
    const noDates = !yearFrom && !yearTo;
    if (noDates) {
      setAppliedCountryId(val?.id || "");
      setAppliedCountryName(val?.name || "");
      setAppliedFrom("");
      setAppliedTo("");
    }
  };

  // === Responsive / Sidebar ===
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia("(max-width: 820px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.matchMedia("(min-width: 821px)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 821px)");
    const handler = (e) => setSidebarOpen(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  // Bloquear scroll cuando el sidebar está abierto en móvil
  useEffect(() => {
    document.body.style.overflow = isMobile && sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, sidebarOpen]);

  // Cerrar sidebar con Escape (especialmente útil en móvil)
  useEffect(() => {
    if (!sidebarOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  // === KPIs ===
  const handleStats = (stats) => {
    setLatestYear(stats.latestYear);
    setTotalPopLatest(stats.totalPopLatest);
    setCountriesCount(stats.countriesCount);
    setGrowthAbs(stats.growthAbs);
    setGrowthPct(stats.growthPct);
    setSeries(stats.series || []);
  };

  const fmtNum = (n) => (n == null ? "—" : nf.format(Math.round(n)));
  const fmtPct = (p) => (p == null ? "—" : `${(p * 100).toFixed(2)}%`);

  return (
    <div className={`layout ${sidebarOpen ? "sidebar-open" : "sidebar-hidden"}`}>
      <Sidebar
        id="main-sidebar"
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {isMobile && sidebarOpen && (
        <div
          className="backdrop show"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <main className="content" role="main">
     <Topbar
  title="World Population Dashboard"
  subtitle="Datos en vivo de World Bank • SP.POP.TOTL"
  theme={theme}
  onToggleTheme={toggleTheme}
  onToggleSidebar={toggleSidebar}
  showThemeToggle={true}
  sidebarOpen={sidebarOpen}
/>


        {/* Sección Resumen: filtros + KPIs */}
        <section
          id="resumen"
          className="panel"
          aria-label="Filtros de país y rango de años"
        >
          <div className="panel-row">
            <YearFilter
              from={yearFrom}
              to={yearTo}
              onChangeFrom={setYearFrom}
              onChangeTo={setYearTo}
            />

            <div className="field country">
              <label htmlFor={COUNTRY_SELECT_ID}>País</label>
              <div style={{ minWidth: 240 }}>
                <CountrySelect
                  id={COUNTRY_SELECT_ID}
                  options={countries}
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  disabled={loadingCountries}
                />
              </div>
              <div aria-live="polite" aria-atomic="true">
                {countriesError && (
                  <small className="text-danger" role="status">
                    Error: {countriesError}
                  </small>
                )}
              </div>
            </div>

            <div className="field">
              <button
                type="button"
                className="btn primary"
                onClick={onApply}
              >
                Aplicar
              </button>
              <button
                type="button"
                className="btn"
                onClick={onReset}
                style={{ marginLeft: 8 }}
              >
                Resetear
              </button>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section
          className="cards"
          aria-label="Indicadores clave de población"
          aria-live="polite"
        >
          <StatCard
            title="Población Total"
            value={fmtNum(totalPopLatest)}
            hint={latestYear ? `personas (año ${latestYear})` : "personas"}
          />
          <StatCard
            title="Año más reciente"
            value={latestYear ?? "—"}
            hint="año"
          />
          <StatCard
            title="Países"
            value={fmtNum(countriesCount)}
            hint="incluidos"
          />
          <StatCard
            title="Crecimiento"
            value={
              growthAbs == null
                ? "—"
                : `${fmtNum(growthAbs)} (${fmtPct(growthPct)})`
            }
            hint="vs. año previo"
          />
        </section>

        {/* Chart + Tabla */}
        <section
          id="series"
          className="grid-2"
          aria-label="Tendencias y registros de población mundial"
        >
          <div className="panel">
            <h3>Tendencia de población</h3>
            <PopulationChart series={series} />
          </div>

          <div className="panel">
            <h3>Registros de World Bank (SP.POP.TOTL)</h3>
            <DataTable
              countryId={appliedCountryId}
              countryName={appliedCountryName}
              yearFrom={appliedFrom}
              yearTo={appliedTo}
              onStatsChange={handleStats}
            />
          </div>
        </section>

        {/* Segundo gráfico: Top países */}
        <section
          id="acerca"
          aria-label="Top de países por población"
        >
          <TopCountriesPanel year={latestYear} top={10} />
        </section>

        <footer className="footer">
          <span>World Bank API • SP.POP.TOTL • Datos reales</span>
        </footer>
      </main>
    </div>
  );
}
