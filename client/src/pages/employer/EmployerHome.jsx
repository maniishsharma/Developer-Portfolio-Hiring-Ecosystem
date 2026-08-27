import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/variants';

export default function EmployerHome() {
  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp} className="glass-card rounded-xl p-6">
      <h2 className="text-2xl font-bold">Employer Dashboard</h2>
      <p className="mt-3 text-sm text-ink/70">Overview of active jobs, applicants and hiring metrics.</p>
    </motion.div>
  );
}
