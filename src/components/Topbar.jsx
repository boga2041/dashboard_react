// src/components/Topbar.jsx
/* eslint-disable no-console */
import { useMemo } from "react";
import { ThemeToggle } from "./ThemeToggle";

/* ===== util debug ===== */
const isDev = () =>
  (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") ||
  (typeof window !== "undefined" && window.__DEBUG__ === true);

function log(title, data) {
  if (!isDev()) return;
  try {
    console.groupCollapsed(`[Topbar] ${title}`);
    if (data !== undefined) console.debug(data);
    console.groupEnd();
  } catch {}
}

function warn(msg, extra) {
  if (!isDev()) return;
  console.warn(`[Topbar] ${msg}`, extra ?? "");
}

export function Topbar({
  title,
  subtitle,
  theme,
  onToggleTheme,
  onToggleSidebar,
  showThemeToggle = true, // <- control explícito (por defecto visible)
  debug = false,
}) {
  if (debug) window.__DEBUG__ = true;

  // ===== Validaciones de props =====
  const safeTitle = useMemo(() => (title ?? "—"), [title]);
  const safeSubtitle = useMemo(() => (subtitle ?? ""), [subtitle]);

  if (onToggleTheme && typeof onToggleTheme !== "function") {
    warn("`onToggleTheme` no es función", onToggleTheme);
  }
  if (onToggleSidebar && typeof onToggleSidebar !== "function") {
    warn("`onToggleSidebar` no es función", onToggleSidebar);
  }
  if (theme && theme !== "light" && theme !== "dark") {
    warn("`theme` debería ser 'light' | 'dark'", { theme });
  }

  const handleSidebar = () => {
    if (typeof onToggleSidebar === "function") {
      onToggleSidebar();
      log("onToggleSidebar()");
    } else {
      warn("click menú sin `onToggleSidebar`");
    }
  };

  const handleTheme = () => {
    if (typeof onToggleTheme === "function") {
      onToggleTheme();
      log("onToggleTheme()");
    } else {
      warn("click theme sin `onToggleTheme`");
    }
  };

  // Accesibilidad: aria-live para cambios de tema (opcional)
  const ariaThemeLabel =
    theme === "dark"
      ? "Modo oscuro activo"
      : theme === "light"
      ? "Modo claro activo"
      : "Tema no definido";

  log("render", {
    title: safeTitle,
    subtitle: safeSubtitle,
    theme,
    showThemeToggle,
  });

  return (
    <header className="topbar" data-debug={isDev() ? "on" : "off"}>
      <div className="topbar-left">
        <button
          className="icon-btn menu-btn"
          aria-label="Abrir/cerrar menú"
          title="Abrir/cerrar menú"
          onClick={handleSidebar}
          type="button"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="topbar-titles">
          <h1 className="title">{safeTitle}</h1>
          {!!safeSubtitle && <p className="subtitle">{safeSubtitle}</p>}
        </div>
      </div>

      <div className="topbar-actions" aria-live="polite" aria-label={ariaThemeLabel}>
        {showThemeToggle ? (
          <ThemeToggle theme={theme} onToggle={handleTheme} />
        ) : (
          // placeholder para no “saltar” layout si decides ocultarlo
          <span style={{ width: 20, height: 20, display: "inline-block" }} aria-hidden />
        )}
      </div>
    </header>
  );
}
