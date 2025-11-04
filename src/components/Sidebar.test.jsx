import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  test("muestra las secciones de navegación", () => {
    render(<Sidebar theme="dark" />);

    expect(
      screen.getByRole("navigation", { name: /secciones del dashboard/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /resumen/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /series/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /acerca/i })).toBeInTheDocument();
  });

  test("marca 'Resumen' como página actual", () => {
    render(<Sidebar theme="dark" />);

    const resumenLink = screen.getByRole("link", { name: /resumen/i });
    expect(resumenLink).toHaveAttribute("aria-current", "page");
  });

  test("muestra el texto correcto del botón de tema según el theme", () => {
    const { rerender } = render(<Sidebar theme="dark" />);

    let themeButton = screen.getByRole("button", {
      name: /activar modo claro/i,
    });
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveAttribute("aria-pressed", "true");

    rerender(<Sidebar theme="light" />);

    themeButton = screen.getByRole("button", {
      name: /activar modo oscuro/i,
    });
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveAttribute("aria-pressed", "false");
  });

  test("ejecuta onToggleTheme al hacer click en el botón de tema", () => {
    const onToggleTheme = jest.fn();

    render(<Sidebar theme="dark" onToggleTheme={onToggleTheme} />);

    const themeButton = screen.getByRole("button", {
      name: /activar modo claro/i,
    });

    fireEvent.click(themeButton);

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });
});
