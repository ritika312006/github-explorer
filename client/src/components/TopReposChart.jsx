import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './TopReposChart.css';

export default function TopReposChart({ repos }) {
  const data = repos
    .filter((r) => r.stargazersCount > 0)
    .sort((a, b) => b.stargazersCount - a.stargazersCount)
    .slice(0, 8)
    .map((r) => ({ name: r.name, stars: r.stargazersCount }));

  if (data.length === 0) return null;

  return (
    <div className="top-repos-chart">
      <h3 className="top-repos-title">Top Repos by Stars</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
          <XAxis
            dataKey="name"
            tick={{ fill: '#8b949e', fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fill: '#8b949e', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '8px',
              color: '#e6edf3',
              fontSize: '13px',
            }}
            formatter={(value) => [`${value} stars`, 'Stars']}
          />
          <Bar dataKey="stars" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={index === 0 ? '#58a6ff' : index === 1 ? '#bc8cff' : '#3fb950'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}