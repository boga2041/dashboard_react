// Sidebar.jsx
export function Sidebar({
  id = "main-sidebar",
  theme = "dark",
  onToggleTheme = () => {},
}) {
  const isDark = theme === "dark";

  return (
    <aside
      id={id}
      className="sidebar"
      role="complementary"
      aria-label="Navegación principal del dashboard"
    >
      <div className="brand" aria-label="World Bank Dashboard">
        WB • Dashboard
      </div>

      <nav className="nav" aria-label="Secciones del dashboard">
        <a
          className="nav-item active"
          href="#resumen"
          aria-current="page"
        >
          Resumen
        </a>

        <a
          className="nav-item"
          href="#series"
        >
          Series
        </a>

        <a
          className="nav-item"
          href="#acerca"
        >
          Acerca
        </a>

        {/* Botón de tema */}
        <button
          type="button"
          className="nav-item theme-btn"
          onClick={onToggleTheme}
          aria-pressed={isDark} 
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        </button>
      </nav>

      <div className="sidebar-foot" aria-label="Versión de la interfaz">
        v0.1 — UI
      </div>
    </aside>
  );
}
