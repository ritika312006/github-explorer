import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getLanguageColor } from '../utils/helpers';
import './LanguageChart.css';

export default function LanguageChart({ repos }) {
  const data = useMemo(() => {
    const counts = {};
    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [repos]);

  if (data.length === 0) return null;

  return (
    <div className="lang-chart">
      <h3 className="lang-chart-title">Languages Used</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={getLanguageColor(entry.name)}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: '#e6edf3',
              fontSize: '13px',
            }}
            formatter={(value, name) => [`${value} repos`, name]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: '#8b949e', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}