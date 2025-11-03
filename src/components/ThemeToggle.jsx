export function ThemeToggle({ theme = "dark", onToggle = () => {} }) {
  return (
    <button
      aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="icon-btn"
      onClick={onToggle}
    >
      {/* Sol / Luna: cambiamos con CSS y aria-hidden */}
      {theme === "dark" ? (
        // Sol
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M12 4V2m0 20v-2M4 12H2m20 0h-2M5.64 5.64 4.22 4.22m15.56 15.56-1.42-1.42M18.36 5.64l1.42-1.42M4.22 19.78l1.42-1.42M12 8a4 4 0 100 8 4 4 0 000-8Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        // Luna
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79Z" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
}
