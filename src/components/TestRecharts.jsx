// TestRecharts.jsx
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from "recharts";

export default function TestRecharts() {
  const data = [{ year: 2020, total: 1 }, { year: 2021, total: 2 }];
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line dataKey="total" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
