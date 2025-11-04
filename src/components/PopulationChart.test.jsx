import { render, screen } from "@testing-library/react";
import { PopulationChart } from "./PopulationChart";

const sampleSeries = [
  { year: 2000, total: 1000 },
  { year: 2001, total: 1500 },
  { year: 2002, total: 2000 },
];

describe("PopulationChart", () => {
  test("renderiza el svg con rol img y aria-label", () => {
    render(<PopulationChart series={sampleSeries} />);

    const svg = screen.getByRole("img", {
      name: /tendencia de población anual/i,
    });

    expect(svg).toBeInTheDocument();
  });

  test("crea puntos accesibles para cada año de la serie", () => {
    render(<PopulationChart series={sampleSeries} />);

    // Los <g> con tabIndex se mapean como role="group"
    const groups = screen.getAllByRole("group");
    expect(groups.length).toBe(sampleSeries.length);

    // Aseguramos que uno tenga el año 2001 en el aria-label
    const point2001 = groups.find((el) =>
      el.getAttribute("aria-label")?.includes("2001")
    );

    expect(point2001).toBeDefined();
  });
});
