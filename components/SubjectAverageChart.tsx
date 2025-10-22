
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QuizResult } from '../types.ts';

interface SubjectAverageChartProps {
  data: QuizResult[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

const SubjectAverageChart: React.FC<SubjectAverageChartProps> = ({ data }) => {
  const subjectAverages: { [key: string]: { totalScore: number; count: number } } = {};

  data.forEach(result => {
    if (!subjectAverages[result.subject]) {
      subjectAverages[result.subject] = { totalScore: 0, count: 0 };
    }
    subjectAverages[result.subject].totalScore += result.score;
    subjectAverages[result.subject].count += 1;
  });

  const chartData = Object.keys(subjectAverages).map(subject => ({
    name: subject,
    averageScore: Math.round(subjectAverages[subject].totalScore / subjectAverages[subject].count),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData}
        margin={{ top: 5, right: 20, left: -10, bottom: 5, }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
        <Tooltip 
            contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
            }}
        />
        <Bar dataKey="averageScore" barSize={30}>
            {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SubjectAverageChart;