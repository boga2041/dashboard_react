import React from "react";
import { render, screen } from "@testing-library/react";
import PopulationLineChart from "./PopulationLineChart";

// Mock de react-chartjs-2 para evitar el canvas real
const mockLine = jest.fn((props) => (
  <div data-testid="mock-line" role={props.role} aria-label={props["aria-label"]} />
));

jest.mock("react-chartjs-2", () => ({
  Line: (props) => mockLine(props),
}));

describe("PopulationLineChart", () => {
  const sampleData = [
    { year: 2000, total: 1000 },
    { year: 2001, total: 1500 },
    { year: 2002, total: 2000 },
  ];

  beforeEach(() => {
    mockLine.mockClear();
  });

  test("renderiza un gráfico con rol img y aria-label por defecto", () => {
    render(<PopulationLineChart data={sampleData} />);

    const img = screen.getByRole("img", {
      name: /tendencia anual de población/i,
    });

    expect(img).toBeInTheDocument();
  });

  test("permite sobreescribir el aria-label mediante prop", () => {
    render(
      <PopulationLineChart
        data={sampleData}
        ariaLabel="Tendencia anual de población mundial"
      />
    );

    const img = screen.getByRole("img", {
      name: /tendencia anual de población mundial/i,
    });

    expect(img).toBeInTheDocument();
  });

  test("pasa los años como labels al componente Line", () => {
    render(<PopulationLineChart data={sampleData} />);

    expect(mockLine).toHaveBeenCalledTimes(1);
    const props = mockLine.mock.calls[0][0];

    expect(props.data.labels).toEqual([2000, 2001, 2002]);
  });
});
