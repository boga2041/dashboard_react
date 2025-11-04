// src/components/DataTable.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { DataTable } from "./DataTable";

// Mock de datatables.net-react para evitar la librería real
jest.mock("datatables.net-react", () => {
  const React = require("react");

  const MockDataTable = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      dt: () => null,
    }));

    return (
      <table
        data-testid="mock-datatable"
        aria-label={props["aria-label"]}
        className={props.className}
      >
        {props.children}
      </table>
    );
  });

  MockDataTable.use = () => {};

  return MockDataTable;
});

jest.mock("datatables.net-dt", () => ({}));

describe("DataTable", () => {
  test("renderiza una región accesible con una tabla con nombre descriptivo", () => {
    render(
      <DataTable
        countryId=""
        countryName=""
        yearFrom=""
        yearTo=""
        onStatsChange={jest.fn()}
      />
    );

    const region = screen.getByRole("region", {
      name: /tabla de registros de población del banco mundial filtrados por país y años/i,
    });
    expect(region).toBeInTheDocument();

    const table = screen.getByRole("table", {
      name: /tabla de registros de población del banco mundial por país, población total y año/i,
    });
    expect(table).toBeInTheDocument();
  });
});
