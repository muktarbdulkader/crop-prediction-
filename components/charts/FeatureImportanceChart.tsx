
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FEATURE_IMPORTANCE_DATA } from '../../constants';

interface FeatureImportanceChartProps {
  t: any;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ t }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={FEATURE_IMPORTANCE_DATA}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 50,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip
          cursor={{ fill: 'rgba(101, 163, 13, 0.1)' }}
          formatter={(value) => [`${value}%`, t.visualizations.importanceLabel]}
        />
        <Legend formatter={() => t.visualizations.importanceLabel} />
        <Bar dataKey="importance" name={t.visualizations.importanceLabel} fill="#65a30d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FeatureImportanceChart;
