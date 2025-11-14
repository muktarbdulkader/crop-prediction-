
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, Cell } from 'recharts';
import { CORRELATION_DATA } from '../../constants';

interface CorrelationHeatmapProps {
  t: any;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ t }) => {
  const features = ['N', 'P', 'K', 'Temp', 'Humid', 'pH', 'Yield'];
  const data = CORRELATION_DATA.flatMap((row, i) =>
    features.map((feature, j) => {
      const zValue = row[feature as keyof typeof row] as number;
      return {
        x: i,
        y: j,
        z: zValue,
        absZ: Math.abs(zValue),
        xLabel: row.feature,
        yLabel: feature,
      };
    })
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-2 border rounded shadow-md text-sm">
          <p className="font-bold">{`${data.xLabel} vs ${data.yLabel}`}</p>
          <p>{`${t.visualizations.correlation}: ${data.z.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
        <XAxis
          type="number"
          dataKey="x"
          tickCount={CORRELATION_DATA.length}
          tickFormatter={(tick) => CORRELATION_DATA[tick]?.feature || ''}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
        />
        <YAxis
          type="number"
          dataKey="y"
          tickCount={features.length}
          tickFormatter={(tick) => features[tick] || ''}
          interval={0}
        />
        <ZAxis type="number" dataKey="absZ" domain={[0, 1]} range={[0, 1000]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
        <Scatter
          data={data}
          shape="square"
        >
          {data.map((entry, index) => {
            const colorValue = (entry.z + 1) / 2; // Normalize to 0-1 range
            // Positive: green, Negative: brown, Neutral: light gray
            const r = entry.z < 0 ? 180 : 247;
            const g = entry.z > 0 ? 254 : 252;
            const b = entry.z < 0 ? 153 : 231;
            const mix = (c1: number, c2: number, weight: number) => Math.round(c1 * (1 - weight) + c2 * weight);
            
            const color = entry.z >= 0
              ? `rgb(${mix(247, 101, colorValue)}, ${mix(254, 163, colorValue)}, ${mix(231, 13, colorValue)})` // light green to brand-green
              : `rgb(${mix(247, 180, -entry.z)}, ${mix(252, 83, -entry.z)}, ${mix(231, 9, -entry.z)})`; // light gray to brand-brown

            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default CorrelationHeatmap;
