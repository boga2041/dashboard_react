// src/components/PopulationChart.jsx
import { useMemo, useState, useCallback } from "react";

const nf = new Intl.NumberFormat("es-ES");

export function PopulationChart({ series = [], showLegend = true }) {
  // series: [{ year: 1960, total: 12345 }, ...] en orden ascendente
  const [hoverIdx, setHoverIdx] = useState(null);

  const dims = { W: 720, H: 260, M: { t: 16, r: 16, b: 36, l: 64 } };

  const model = useMemo(() => {
    if (!series?.length) {
      return {
        points: [],
        minY: 0,
        maxY: 0,
        yearMin: null,
        yearMax: null,
        x: () => 0,
        y: () => 0,
      };
    }

    const ys = series.map((d) => d.total);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const yearMin = series[0].year;
    const yearMax = series[series.length - 1].year;

    const { W, H, M } = dims;
    const innerW = W - M.l - M.r;
    const innerH = H - M.t - M.b;

    const x = (year) =>
      innerW * (year - yearMin) / Math.max(1, yearMax - yearMin) + M.l;

    const y = (val) => {
      if (maxY === minY) return M.t + innerH;
      const t = (val - minY) / (maxY - minY);
      return M.t + (1 - t) * innerH; // invertido (arriba = mayor)
    };

    const points = series.map((d) => [x(d.year), y(d.total)]);
    return { points, minY, maxY, yearMin, yearMax, x, y };
  }, [series]);

  const pathD = useMemo(() => {
    if (!model.points.length) return "";
    return model.points
      .map((p, i) => (i ? "L" : "M") + p[0] + "," + p[1])
      .join(" ");
  }, [model.points]);

  const yTicks = useMemo(() => {
    const ticks = 4;
    const vals = Array.from({ length: ticks + 1 }, (_, i) =>
      model.minY + (i * (model.maxY - model.minY)) / ticks
    );
    return vals;
  }, [model.minY, model.maxY]);

  // === Interacción (tooltip) ===
  const findNearestIdx = useCallback(
    (clientX, svgEl) => {
      if (!svgEl || !model.points.length) return null;
      const pt = svgEl.createSVGPoint();
      pt.x = clientX;
      const svgP = pt.matrixTransform(svgEl.getScreenCTM().inverse());
      let best = 0;
      let bestDist = Math.abs(model.points[0][0] - svgP.x);
      for (let i = 1; i < model.points.length; i++) {
        const d = Math.abs(model.points[i][0] - svgP.x);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      return best;
    },
    [model.points]
  );

  const handleMove = useCallback((e) => {
    const svgEl = e.currentTarget;
    const idx = findNearestIdx(e.clientX, svgEl);
    setHoverIdx(idx);
  }, [findNearestIdx]);

  const handleLeave = () => setHoverIdx(null);

  const { W, H, M } = dims;
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  const hovered =
    hoverIdx == null || !series[hoverIdx]
      ? null
      : { ...series[hoverIdx], pt: model.points[hoverIdx] };

  // Posicionamiento del tooltip
  const tooltip = useMemo(() => {
    if (!hovered) return null;
    const padding = 8;
    const content = [
      `Año: ${hovered.year}`,
      `Total: ${nf.format(Math.round(hovered.total))}`,
    ];
    const w = Math.max(...content.map((t) => t.length)) * 7 + padding * 2;
    const h = content.length * 14 + padding * 2;

    let x = hovered.pt[0] + 10;
    let y = hovered.pt[1] - h - 10;

    if (x + w > W - M.r) x = hovered.pt[0] - w - 10;
    if (y < M.t) y = hovered.pt[1] + 10;

    return { x, y, w, h, content };
  }, [hovered, W, M]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="280"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        role="img"
        aria-label="Tendencia de población anual. Use Tab o el ratón para explorar los puntos de datos."
      >
        {/* fondo */}
        <rect x="0" y="0" width={W} height={H} rx="12" ry="12" fill="var(--panel-2)" />

        {/* grid horizontal + labels Y */}
        {yTicks.map((v, i) => {
          const py = M.t + innerH - (i * innerH) / (yTicks.length - 1);
          return (
            <g key={i}>
              <line
                x1={M.l} x2={W - M.r}
                y1={py} y2={py}
                stroke="var(--border)" strokeOpacity="0.4"
              />
              <text
                x={M.l - 8} y={py + 4}
                fontSize="10" textAnchor="end" fill="var(--muted)"
              >
                {nf.format(Math.round(v))}
              </text>
            </g>
          );
        })}

        {/* eje X (extremos) */}
        {model.yearMin != null && model.yearMax != null && (
          <>
            <text x={M.l} y={H - 10} fontSize="11" fill="var(--muted)">
              {model.yearMin}
            </text>
            <text x={W - M.r} y={H - 10} fontSize="11" textAnchor="end" fill="var(--muted)">
              {model.yearMax}
            </text>
          </>
        )}

        {/* área (sombra) */}
        {model.points.length > 1 && (
          <path
            d={`${pathD} L ${W - M.r},${M.t + innerH} L ${M.l},${M.t + innerH} Z`}
            fill="var(--primary)"
            opacity="0.08"
          />
        )}

        {/* línea principal */}
        {pathD && (
          <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
        )}

        {/* puntos interactivos */}
   {model.points.map((p, i) => (
  <g
    key={i}
    tabIndex={0}
    onFocus={() => setHoverIdx(i)}
    onBlur={() => setHoverIdx(null)}
    role="group"
    aria-label={`Año ${series[i].year}, total ${nf.format(
      Math.round(series[i].total)
    )}`}
  >
    <circle
      cx={p[0]}
      cy={p[1]}
      r={hoverIdx === i ? 3.6 : 2.4}
      fill="var(--primary)"
      opacity={hoverIdx == null || hoverIdx === i ? 1 : 0.5}
    />
  </g>
))}


        {/* guía vertical + punto destacado */}
        {hovered && (
          <>
            <line
              x1={hovered.pt[0]} x2={hovered.pt[0]}
              y1={M.t} y2={M.t + innerH}
              stroke="var(--primary)" strokeDasharray="4 4" strokeOpacity="0.6"
            />
            <circle cx={hovered.pt[0]} cy={hovered.pt[1]} r="4.2" fill="var(--primary)" />
          </>
        )}

        {/* tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x} y={tooltip.y}
              width={tooltip.w} height={tooltip.h} rx="8" ry="8"
              fill="var(--panel)" stroke="var(--border)"
            />
            {tooltip.content.map((t, i) => (
              <text
                key={i}
                x={tooltip.x + 8}
                y={tooltip.y + 14 + i * 14}
                fontSize="12"
                fill="var(--text)"
              >
                {t}
              </text>
            ))}
          </g>
        )}
      </svg>

      {/* Leyenda */}
      {showLegend && (
        <div className="chart-legend" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
          <span
            style={{
              display: "inline-block",
              width: 10, height: 10, borderRadius: "50%",
              background: "var(--primary)"
            }}
          />
          <span style={{ color: "var(--muted)", fontSize: 12 }}>
            Serie: <strong style={{ color: "var(--text)" }}>Población total anual (SP.POP.TOTL)</strong>
          </span>
        </div>
      )}
    </div>
  );
}
