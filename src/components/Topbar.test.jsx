// src/components/Topbar.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Topbar } from "./Topbar";

// Mock de ThemeToggle para simplificar el test
jest.mock("./ThemeToggle", () => ({
  ThemeToggle: ({ theme, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Cambiar tema (${theme || "desconocido"})`}
    >
      ThemeToggle
    </button>
  ),
}));

describe("Topbar", () => {
  test("muestra el título y el subtítulo", () => {
    render(
      <Topbar
        title="World Population Dashboard"
        subtitle="Datos en vivo"
        theme="dark"
        onToggleTheme={() => {}}
        onToggleSidebar={() => {}}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /world population dashboard/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/datos en vivo/i)).toBeInTheDocument();
  });

  test("el botón de menú tiene aria-controls y aria-expanded según sidebarOpen", () => {
    const { rerender } = render(
      <Topbar
        title="Test"
        subtitle=""
        theme="dark"
        onToggleTheme={() => {}}
        onToggleSidebar={() => {}}
        sidebarOpen={false}
      />
    );

    const menuButton = screen.getByRole("button", {
      name: /abrir\/cerrar menú/i,
    });

    expect(menuButton).toHaveAttribute("aria-controls", "main-sidebar");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    // Cambiamos sidebarOpen a true y comprobamos
    rerender(
      <Topbar
        title="Test"
        subtitle=""
        theme="dark"
        onToggleTheme={() => {}}
        onToggleSidebar={() => {}}
        sidebarOpen={true}
      />
    );

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  test("llama a onToggleSidebar al hacer click en el botón de menú", () => {
    const onToggleSidebar = jest.fn();

    render(
      <Topbar
        title="Test"
        subtitle=""
        theme="dark"
        onToggleTheme={() => {}}
        onToggleSidebar={onToggleSidebar}
      />
    );

    const menuButton = screen.getByRole("button", {
      name: /abrir\/cerrar menú/i,
    });

    fireEvent.click(menuButton);
    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  test("llama a onToggleTheme al hacer click en ThemeToggle", () => {
    const onToggleTheme = jest.fn();

    render(
      <Topbar
        title="Test"
        subtitle=""
        theme="dark"
        onToggleTheme={onToggleTheme}
        onToggleSidebar={() => {}}
      />
    );

    const themeButton = screen.getByRole("button", {
      name: /cambiar tema \(dark\)/i,
    });

    fireEvent.click(themeButton);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  test("actualiza el aria-label del contenedor de acciones según el tema", () => {
    const { rerender } = render(
      <Topbar
        title="Test"
        subtitle=""
        theme="dark"
        onToggleTheme={() => {}}
        onToggleSidebar={() => {}}
      />
    );

    let actions = screen.getByLabelText(/modo oscuro activo/i);
    expect(actions).toBeInTheDocument();

    rerender(
      <Topbar
        title="Test"
        subtitle=""
        theme="light"
        onToggleTheme={() => {}}
        onToggleSidebar={() => {}}
      />
    );

    actions = screen.getByLabelText(/modo claro activo/i);
    expect(actions).toBeInTheDocument();
  });
});
