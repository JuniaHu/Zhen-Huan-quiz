import { dimensionMeta, dimensionOrder, type DimensionKey } from "../data/sbtiData";
import type { ScoreMap } from "../lib/scoring";

interface RadarChartProps {
  values: ScoreMap;
  size?: number;
}

export function RadarChart({ values, size = 320 }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.33;
  const levels = 5;

  const getPoint = (index: number, value: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / dimensionOrder.length;
    const pointRadius = (value / 10) * radius;
    return {
      x: center + Math.cos(angle) * pointRadius,
      y: center + Math.sin(angle) * pointRadius,
    };
  };

  const areaPath = dimensionOrder
    .map((key, index) => {
      const { x, y } = getPoint(index, values[key]);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ")
    .concat(" Z");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full overflow-visible">
      {Array.from({ length: levels }).map((_, levelIndex) => {
        const stepValue = ((levelIndex + 1) / levels) * 10;
        const ringPath = dimensionOrder
          .map((_, index) => {
            const { x, y } = getPoint(index, stepValue);
            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")
          .concat(" Z");

        return (
          <path
            key={levelIndex}
            d={ringPath}
            fill="none"
            stroke="rgba(139, 69, 19, 0.14)"
            strokeWidth="1"
          />
        );
      })}

      {dimensionOrder.map((key, index) => {
        const { x, y } = getPoint(index, 10);
        const labelAngle = -Math.PI / 2 + (Math.PI * 2 * index) / dimensionOrder.length;
        const labelX = center + Math.cos(labelAngle) * (radius + 30);
        const labelY = center + Math.sin(labelAngle) * (radius + 30);

        return (
          <g key={key}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(139, 69, 19, 0.14)"
            />
            <text
              x={labelX}
              y={labelY}
              fill="#8B4513"
              fontSize="13"
              textAnchor="middle"
              className="font-display"
            >
              {dimensionMeta[key as DimensionKey].label}
            </text>
          </g>
        );
      })}

      <path d={areaPath} fill="rgba(164, 74, 63, 0.18)" stroke="#A44A3F" strokeWidth="3" />

      {dimensionOrder.map((key, index) => {
        const { x, y } = getPoint(index, values[key]);
        return <circle key={key} cx={x} cy={y} r="4.5" fill="#8B4513" />;
      })}
    </svg>
  );
}
