import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';

export default function StudentPortfolio() {
  const [projects, setProjects] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const load = () => api.get('/projects').then((r) => setProjects(r.data));
  useEffect(() => {
    load().catch(() => {});
  }, []);

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      fd.append('title', values.title);
      fd.append('description', values.description || '');
      fd.append('techStack', values.techStack || '');
      fd.append('githubLink', values.githubLink || '');
      fd.append('liveDemo', values.liveDemo || '');
      if (values.images?.[0]) fd.append('images', values.images[0]);
      await api.post('/projects', fd);
      reset();
      toast('Project added');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-black">Portfolio</h1>
      <form className="glass-card mt-6 grid max-w-2xl gap-3 rounded-[28px] p-6" onSubmit={handleSubmit(onSubmit)}>
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Title" {...register('title', { required: true })} />
        <textarea className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Description" {...register('description')} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Tech stack (comma)" {...register('techStack')} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="GitHub link" {...register('githubLink')} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Live demo" {...register('liveDemo')} />
        <input type="file" accept="image/*" {...register('images')} />
        <button className="btn-primary px-5 py-3">Add project</button>
      </form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
          <article key={p._id} className="glass-card rounded-[28px] p-5">
            <div className="flex gap-4">
              {p.images?.[0] ? <img src={p.images[0]} alt="project" className="h-24 w-36 rounded-md object-cover" /> : <div className="h-24 w-36 rounded-md bg-sand" />}
              <div>
                <h3 className="text-xl font-black">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/60 dark:text-cream/60">{p.description}</p>
                <p className="mt-2 text-xs font-bold">{(p.techStack || []).join(' · ')}</p>
                <div className="mt-3 flex gap-3">
                  {p.githubLink && (
                    <a href={p.githubLink} target="_blank" rel="noreferrer" className="btn-ghost px-3 py-1">GitHub</a>
                  )}
                  {p.liveDemo && (
                    <a href={p.liveDemo} target="_blank" rel="noreferrer" className="btn-secondary px-3 py-1">Live</a>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button type="button" className="text-sm font-bold" onClick={async () => { await api.delete(`/projects/${p._id}`); load(); }}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
