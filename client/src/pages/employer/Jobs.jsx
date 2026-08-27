import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/variants';
import api from '../../services/api';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/useToast';

export default function EmployerJobs() {
  const [jobs, setJobs] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  const load = () => api.get('/jobs/mine').then((r) => setJobs(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      await api.post('/jobs', values);
      toast('Job created');
      reset();
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-bold">Create Job</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Title" {...register('title', { required: true })} className="rounded-2xl bg-sand px-4 py-3 outline-none" />
          <input placeholder="Location" {...register('location')} className="rounded-2xl bg-sand px-4 py-3 outline-none" />
          <input placeholder="Salary" {...register('salary')} className="rounded-2xl bg-sand px-4 py-3 outline-none" />
          <select {...register('jobType')} className="rounded-2xl bg-sand px-4 py-3 outline-none">
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
          <input placeholder="Required skills (comma)" {...register('requiredSkills')} className="rounded-2xl bg-sand px-4 py-3 outline-none md:col-span-2" />
          <textarea placeholder="Description" {...register('description')} className="rounded-2xl bg-sand px-4 py-3 outline-none md:col-span-2" />
          <button className="btn-primary px-4 py-3 md:col-span-2">Create job</button>
        </form>
      </motion.div>

      <div className="grid gap-4">
        {jobs.map((j) => (
          <article key={j._id} className="glass-card rounded-[24px] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">{j.title}</h3>
                <p className="text-sm text-ink/60">{j.location} · {j.jobType}</p>
              </div>
              <div className="text-sm text-ink/70">{(j.requiredSkills || []).join(', ')}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
