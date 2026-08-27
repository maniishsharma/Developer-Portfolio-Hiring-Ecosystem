import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { fadeUp, stagger } from '../animations/variants';
import IdentityMark from '../components/IdentityMark';

export default function Companies() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/public/companies').then((r) => setItems(r.data)).catch(() => {});
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-5xl font-black">Companies</h1>
      <motion.div initial="hidden" animate="show" variants={stagger} className="mt-8 grid gap-5 md:grid-cols-3">
        {items.map((c) => (
          <motion.article key={c._id} variants={fadeUp} className="glass-card rounded-[28px] p-6">
            <IdentityMark role="employer" size="lg" />
            <h3 className="text-xl font-black">{c.name}</h3>
            <p className="mt-2 text-sm text-ink/60 dark:text-cream/60">{c.description || 'Hiring on DevConnect AI'}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-ink/40">{c.location}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
