import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';

const COLORS = ['#e4a4bd', '#f7b7c8', '#ffd6e0', '#ffc4dd'];

export default function StudentAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/student/analytics').then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="glass-card p-6">
        <h3 className="text-xl font-black">Applications By Month</h3>
        <div style={{ height: 240 }} className="mt-4">
          <ResponsiveContainer>
            <BarChart data={data.applicationsByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#e4a4bd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-black">Skills Progress</h3>
        <div style={{ height: 240 }} className="mt-4">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data.skills} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} fill="#8884d8">
                {data.skills.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
