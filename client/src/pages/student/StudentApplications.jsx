import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function StudentApplications() {
  const [apps, setApps] = useState([]);

  const load = () => api.get('/applications/mine').then((r) => setApps(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h1 className="text-3xl font-black">My Applications</h1>
      <div className="mt-4 grid gap-3">
        {apps.map((a) => (
          <article key={a._id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">{a.job?.title}</h3>
                <p className="text-sm text-ink/60">{a.job?.company?.name} · {a.job?.location}</p>
                <p className="mt-2 text-sm">Applied on: {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-sm font-bold">Status: {a.status}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
