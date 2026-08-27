import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';

export default function EmployerApplications() {
  const [apps, setApps] = useState([]);
  const toast = useToast();

  const load = () => api.get('/applications/employer').then((r) => setApps(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      toast('Status updated');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const schedule = async (id) => {
    const when = prompt('Enter interview time (e.g. 2026-09-01T10:00)');
    if (!when) return;
    try {
      await api.post(`/applications/${id}/interview`, { scheduledAt: when });
      toast('Interview scheduled');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Applicants</h1>
      <div className="grid gap-3">
        {apps.map((a) => (
          <article key={a._id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink/60">{a.student?.user?.name} • {a.student?.user?.email}</p>
                <h3 className="text-xl font-black">{a.job?.title}</h3>
                <p className="text-sm">Match: <strong>{a.matchPercent}%</strong></p>
              </div>
              <div className="flex gap-2">
                <a href={a.student?.resume?.fileUrl || '#'} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-2">View resume</a>
                <button onClick={() => updateStatus(a._id, 'Shortlisted')} className="btn-primary px-3 py-2">Shortlist</button>
                <button onClick={() => updateStatus(a._id, 'Rejected')} className="btn-ghost px-3 py-2">Reject</button>
                <button onClick={() => schedule(a._id)} className="btn-outline px-3 py-2">Schedule</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
