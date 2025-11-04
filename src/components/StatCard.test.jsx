import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  test("renderiza título, valor y hint", () => {
    render(
      <StatCard
        title="Población Total"
        value="7,900,000,000"
        hint="personas (año 2023)"
      />
    );

    expect(
      screen.getByText(/población total/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText("7,900,000,000")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/personas \(año 2023\)/i)
    ).toBeInTheDocument();
  });
});
