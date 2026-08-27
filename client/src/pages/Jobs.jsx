import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import api from '../services/api';
import { fadeUp, stagger } from '../animations/variants';

export default function Jobs() {
  const [data, setData] = useState({ items: [], pages: 1 });
  const user = useSelector((s) => s.auth.user);
  const toast = useToast();
  const [filters, setFilters] = useState({ q: '', location: '', jobType: '', skill: '', page: 1 });

  useEffect(() => {
    const params = new URLSearchParams(filters).toString();
    api.get(`/jobs?${params}`).then((r) => setData(r.data)).catch(() => {});
  }, [filters]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-5xl font-black">Jobs</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Search title" onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Location" onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value, page: 1 }))} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Skill" onChange={(e) => setFilters((f) => ({ ...f, skill: e.target.value, page: 1 }))} />
        <select className="rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" onChange={(e) => setFilters((f) => ({ ...f, jobType: e.target.value, page: 1 }))}>
          <option value="">All types</option>
          <option>Full-time</option>
          <option>Part-time</option>
          <option>Internship</option>
          <option>Contract</option>
        </select>
      </div>
      <motion.div initial="hidden" animate="show" variants={stagger} className="mt-8 grid gap-5">
        {data.items.map((job) => (
          <motion.article key={job._id} variants={fadeUp} className="glass-card flex flex-col justify-between gap-4 rounded-[28px] p-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-black">{job.title}</h3>
              <p className="text-sm text-ink/50 dark:text-cream/50">
                {job.company?.name} · {job.location} · {job.jobType}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(job.requiredSkills || []).map((s) => (
                  <span key={s} className="rounded-full bg-sand px-2 py-1 text-xs font-bold dark:bg-white/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              {job.matchPercent != null && <p className="mb-2 text-sm font-black text-blush">{job.matchPercent}% Match</p>}
              {user?.role === 'student' ? (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.post(`/applications/${job._id}`);
                      toast('Applied successfully');
                    } catch (e) {
                      toast(e.message, 'error');
                    }
                  }}
                  className="btn-primary inline-block px-4 py-2 text-sm"
                >
                  Apply
                </button>
              ) : (
                <Link to="/login" className="btn-primary inline-block px-4 py-2 text-sm">
                  Sign in to apply
                </Link>
              )}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
