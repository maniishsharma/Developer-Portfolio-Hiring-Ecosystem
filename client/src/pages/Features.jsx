import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../animations/variants';

const items = [
  { t: 'Role-based auth', d: 'JWT login for students and employers with protected dashboards.' },
  { t: 'Portfolio builder', d: 'Projects, skills, education and a public developer page.' },
  { t: 'Job pipeline', d: 'Apply, shortlist, interview and hire with status tracking.' },
  { t: 'Realtime chat', d: 'Socket.io messaging with online status and history.' },
  { t: 'AI modules', d: 'Resume score, skill match % and career suggestions (FastAPI-ready).' },
  { t: 'GitHub stats', d: 'Public GitHub profile, languages and top repositories.' },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <motion.div initial="hidden" animate="show" variants={stagger}>
        <motion.h1 variants={fadeUp} className="text-5xl font-black">
          Features
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 max-w-xl text-lg text-ink/60 dark:text-cream/60">
          Everything you need to demonstrate a complete hiring product in a viva or interview.
        </motion.p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((i) => (
            <motion.article key={i.t} variants={fadeUp} className="glass-card rounded-[28px] p-8">
              <h2 className="text-2xl font-black">{i.t}</h2>
              <p className="mt-2 text-ink/60 dark:text-cream/60">{i.d}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
