import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { QuizResult } from '../types';

interface ScoreTrendChartProps {
  data: QuizResult[];
}

const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ data }) => {
  const chartData = data.map(result => ({
    name: new Date(result.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    score: result.score
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
        <Tooltip 
            contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
        />
        <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 4, fill: '#8b5cf6'}} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreTrendChart;