// src/components/TopCountriesBar.jsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement, LinearScale, CategoryScale, Tooltip, Legend, Title
} from "chart.js";

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const nf = new Intl.NumberFormat("es-ES");

export default function TopCountriesBar({ data = [], top = 10 }) {
  const sliced = (Array.isArray(data) ? data : []).slice(0, top);
  const labels = sliced.map(d => d?.name ?? "—");
  const vals = sliced.map(d => Math.round(d?.total ?? 0));

  const chartData = {
    labels,
    datasets: [{
      label: "Población (año más reciente)",
      data: vals,
      backgroundColor:
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim() || "#4f46e5",
      borderWidth: 0,
      borderSkipped: false,
      hoverBackgroundColor:
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim() || "#4f46e5",
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // para que el contenedor controle la altura
    plugins: {
      title: {
        display: false,
        text: "Top países por población"
      },
      legend: { display: true },
      tooltip: {
        callbacks: {
          title: (items) => items?.[0]?.label ?? "",
          label: (ctx) => ` ${nf.format(ctx.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        ticks: { maxRotation: 45, minRotation: 0, autoSkip: false },
        grid: { display: false }
      },
      y: {
        ticks: { callback: (v) => nf.format(v) },
        beginAtZero: true
      }
    }
  };

  // Accesibilidad: rol e identificación clara del gráfico
  const ariaLabel = `Gráfico de barras con el Top ${top} de países por población. ` +
    `Eje X: nombres de países. Eje Y: población (personas).`;

  return (
    <div style={{ width: "100%", height: 320 }}>
      {/* react-chartjs-2 pasa props extra al <canvas> interno */}
      <Bar
        data={chartData}
        options={options}
        role="img"
        aria-label={ariaLabel}
      />
    </div>
  );
}
