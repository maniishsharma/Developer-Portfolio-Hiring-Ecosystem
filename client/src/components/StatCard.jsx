import { motion } from 'framer-motion';
import { fadeUp } from '../animations/variants';

export default function StatCard({ label, value, hint }) {
  return (
    <motion.div variants={fadeUp} className="glass-card rounded-[28px] p-6">
      <p className="text-sm font-medium text-ink/50 dark:text-cream/50">{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight">{value}</p>
      {hint && <p className="mt-2 text-sm text-ink/50 dark:text-cream/50">{hint}</p>}
    </motion.div>
  );
}
