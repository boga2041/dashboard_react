// src/components/PopulationLineChart.jsx
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement, PointElement, LinearScale, CategoryScale,
  Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler);

const nf = new Intl.NumberFormat("es-ES");

export default function PopulationLineChart({ data = [] }) {
  const labels = data.map(d => d.year);
  const dataset = data.map(d => Math.round(d.total || 0));

  const chartData = {
    labels,
    datasets: [{
      label: "Población total anual (SP.POP.TOTL)",
      data: dataset,
      fill: true,
      tension: 0.25,
      borderColor: getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#4f46e5",
      backgroundColor: (ctx) => {
        const { chart } = ctx;
        const { ctx: c } = chart;
        const grad = c.createLinearGradient(0, 0, 0, chart.height);
        grad.addColorStop(0, "rgba(79,70,229,0.25)");
        grad.addColorStop(1, "rgba(79,70,229,0.05)");
        return grad;
      },
      pointRadius: 2,
      pointHoverRadius: 5,
      borderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // controla altura desde el contenedor
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${nf.format(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: { ticks: { maxTicksLimit: 8 } },
      y: {
        ticks: { callback: (v) => nf.format(v) }
      }
    }
  };

  return (
    <div style={{ width: "100%", height: 320 }}>
      <Line data={chartData} options={options} role="img" aria-label="Tendencia anual de población" />
    </div>
  );
}
