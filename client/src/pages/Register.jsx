import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { setUser } from '../redux/authSlice';
import { useToast } from '../hooks/useToast';
import { fadeUp } from '../animations/variants';

export default function Register() {
  const { register, handleSubmit, watch } = useForm({ defaultValues: { role: 'student' } });
  const role = watch('role');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/register', values);
      dispatch(setUser(data));
      toast('Account created');
      navigate(data.role === 'employer' ? '/employer' : '/student');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="glass-card rounded-[32px] p-8">
        <h1 className="text-4xl font-black">Get Started</h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Full name" {...register('name', { required: true })} />
          <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Email" {...register('email', { required: true })} />
          <input type="password" className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Password (min 6)" {...register('password', { required: true, minLength: 6 })} />
          <select className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" {...register('role')}>
            <option value="student">Student / Developer</option>
            <option value="employer">Employer / HR</option>
          </select>
          {role === 'employer' && (
            <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Company name" {...register('companyName')} />
          )}
          <button className="btn-primary w-full py-3">Create account</button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/login" className="font-bold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
