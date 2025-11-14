
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SCATTER_PLOT_DATA } from '../../constants';

interface YieldScatterPlotProps {
  xKey: 'rainfall' | 'temperature';
  xLabel: string;
  t: any;
}

const YieldScatterPlot: React.FC<YieldScatterPlotProps> = ({ xKey, xLabel, t }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey={xKey} name={xLabel} unit={xKey === 'rainfall' ? 'mm' : '°C'} />
        <YAxis type="number" dataKey="yield" name={t.visualizations.yield} unit="kg/ha" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend formatter={() => t.visualizations.yieldData} />
        <Scatter name={t.visualizations.yieldData} data={SCATTER_PLOT_DATA} fill="#b45309" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default YieldScatterPlot;
