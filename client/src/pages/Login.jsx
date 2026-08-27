import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { setUser } from '../redux/authSlice';
import { useToast } from '../hooks/useToast';
import { fadeUp } from '../animations/variants';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      dispatch(setUser(data));
      toast('Welcome back');
      navigate(data.role === 'employer' ? '/employer' : '/student');
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="glass-card rounded-[32px] p-8">
        <h1 className="text-4xl font-black">Login</h1>
        <p className="mt-2 text-sm text-ink/50 dark:text-cream/50">Demo: student@devconnect.ai or employer@devconnect.ai / password123</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Email" {...register('email', { required: true })} />
          <input type="password" className="w-full rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10" placeholder="Password" {...register('password', { required: true })} />
          <button className="btn-primary w-full py-3">Sign in</button>
        </form>
        <p className="mt-4 text-sm">
          New here? <Link to="/register" className="font-bold">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}
