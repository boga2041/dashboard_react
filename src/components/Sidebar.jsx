export function Sidebar({ theme = "dark", onToggleTheme = () => {} }) {
  return (
    <aside className="sidebar">
      <div className="brand">WB • Dashboard</div>

      <nav className="nav">
        <a className="nav-item active" href="#">Resumen</a>
        <a className="nav-item" href="#">Series</a>
        <a className="nav-item" href="#">Acerca</a>

        {/* Botón de tema */}
        <button className="nav-item theme-btn" onClick={onToggleTheme}>
          {theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        </button>
      </nav>

      <div className="sidebar-foot">v0.1 — UI</div>
    </aside>
  );
}
