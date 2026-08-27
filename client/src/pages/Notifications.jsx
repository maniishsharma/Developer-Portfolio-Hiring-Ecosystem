import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from '../hooks/useToast';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const toast = useToast();

  const load = () => api.get('/notifications').then((r) => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}`);
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const markAll = async () => {
    try {
      await api.patch('/notifications/read-all');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Notifications</h1>
        <button onClick={markAll} className="btn-ghost">Mark all read</button>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((n) => (
          <div key={n._id} className={`glass-card p-3 ${n.read ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">{n.title}</p>
                <p className="text-sm text-ink/70">{n.message}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-xs text-ink/50">{new Date(n.createdAt).toLocaleString()}</p>
                {!n.read && <button onClick={() => markRead(n._id)} className="btn-primary mt-2 px-3 py-1">Mark read</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
