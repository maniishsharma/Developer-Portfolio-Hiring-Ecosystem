import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/useToast';
import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/variants';

export default function EmployerCompany() {
  const { register, handleSubmit, reset } = useForm();
  const [logo, setLogo] = useState('');
  const toast = useToast();

  const load = async () => {
    try {
      const { data } = await api.get('/employer/company');
      reset({ name: data.name, description: data.description, website: data.website, location: data.location });
      setLogo(data.logo || '');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      const fd = new FormData();
      fd.append('name', values.name || '');
      fd.append('description', values.description || '');
      fd.append('website', values.website || '');
      fd.append('location', values.location || '');
      if (values.logo?.[0]) fd.append('logo', values.logo[0]);
      const { data } = await api.put('/employer/company', fd);
      setLogo(data.logo || '');
      toast('Company updated');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp} className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold">Company Profile</h2>
      <p className="mt-3 text-sm text-ink/70">Manage company information, logo and description.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-3 max-w-2xl">
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none" placeholder="Company name" {...register('name')} />
        <textarea className="rounded-2xl bg-sand px-4 py-3 outline-none" placeholder="Description" {...register('description')} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none" placeholder="Website" {...register('website')} />
        <input className="rounded-2xl bg-sand px-4 py-3 outline-none" placeholder="Location" {...register('location')} />
        <div className="flex items-center gap-4">
          <input type="file" accept="image/*" {...register('logo')} />
          {logo && <img src={logo} alt="logo" className="h-12 w-12 rounded-md object-cover" />}
        </div>
        <button className="btn-primary px-4 py-2">Save company</button>
      </form>
    </motion.div>
  );
}
