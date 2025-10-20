import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { QuizResult } from '../types';

interface ProgressChartProps {
  data: QuizResult[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const chartData = data.map(result => ({
    name: new Date(result.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    score: result.score,
    subject: result.subject,
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
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" domain={[0, 100]} />
        <Tooltip 
            contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                color: '#374151'
            }}
            itemStyle={{ color: '#374151' }}
            labelStyle={{ color: '#6b7280' }}
        />
        <Legend wrapperStyle={{ color: '#374151' }} />
        <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 4}} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;