import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, stagger } from '../animations/variants';
import IdentityMark from '../components/IdentityMark';
import api from '../services/api';

function Counter({ to }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return undefined;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1000, 1);
      setVal(Math.round(to * p));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return undefined;
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}</span>;
}

export default function Home() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    api.get('/public/developers?limit=3').then((r) => setDevs(r.data.items)).catch(() => {});
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.p variants={fadeUp} className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blush">
            Hiring, reimagined
          </motion.p>
          <motion.h1 variants={fadeUp} className="text-5xl leading-[0.95] font-black md:text-7xl">
            Connect Talent With Opportunity
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-md text-lg text-ink/60 dark:text-cream/60">
            Students build living portfolios. Recruiters hire with AI match scores. Built as a complete MERN campus product.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link to="/jobs" className="rounded-full bg-sand px-6 py-3 font-bold dark:bg-white/10">
              Browse Jobs
            </Link>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="relative">
          <div className="glass-card relative overflow-hidden rounded-[40px] p-8">
            <div className="mb-6 flex items-center gap-3">
              <IdentityMark size="md" />
              <div>
                <p className="font-bold">Aarav · MERN Developer</p>
                <p className="text-sm text-ink/50 dark:text-cream/50">Ready for internships</p>
              </div>
            </div>
            <div className="space-y-3">
              {['React dashboard', 'Socket.io chat', 'Resume AI score'].map((item) => (
                <div key={item} className="rounded-2xl bg-sand px-4 py-3 text-sm font-semibold dark:bg-white/5">
                  {item}
                </div>
              ))}
            </div>
            <div className="absolute -right-2 -top-2 flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-cream shadow-xl">
              <Sparkles size={14} className="text-blush" /> AI Match 92%
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="bg-sand py-20 dark:bg-[#1c1815]">
        <div className="mx-auto max-w-6xl px-5">
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10 text-4xl font-black md:text-5xl">
            Built for campus hiring
          </motion.h2>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
            {[
              { title: 'AI Resume Analysis', text: 'Score resumes, flag missing skills, and get improvement prompts.' },
              { title: 'Developer Portfolio', text: 'Projects, GitHub, certifications and a public profile in one place.' },
              { title: 'Smart Hiring', text: 'Match student skills with job requirements and shortlist faster.' },
            ].map((c) => (
              <motion.article
                key={c.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="rounded-[32px] bg-cream p-10 dark:bg-[#241f1b]"
                style={{ padding: 40 }}
              >
                <h3 className="text-2xl font-black">{c.title}</h3>
                <p className="mt-3 text-ink/60 dark:text-cream/60">{c.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-10 text-4xl font-black">
          Developer showcase
        </motion.h2>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-6 md:grid-cols-3">
          {(devs.length ? devs : [{ _id: '1', user: { name: 'Sample Dev' }, skills: ['React'], headline: 'Student' }]).map((d, i) => (
            <motion.article key={d._id} variants={fadeUp} className="glass-card rounded-[32px] p-6" style={{ marginTop: i * 12 }}>
              <IdentityMark size="lg" className="mb-4" />
              <h3 className="text-xl font-black">{d.user?.name}</h3>
              <p className="text-sm text-ink/50 dark:text-cream/50">{d.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(d.skills || []).slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full bg-sand px-3 py-1 text-xs font-bold dark:bg-white/10">
                    {s}
                  </span>
                ))}
              </div>
              <Link to={`/developers/${d._id}`} className="btn-primary mt-6 inline-block px-4 py-2 text-sm">
                View Portfolio
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="bg-ink py-20 text-cream dark:bg-blush dark:text-ink">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-3">
          {[
            { n: 10000, label: 'Developers', suffix: '+' },
            { n: 500, label: 'Companies', suffix: '+' },
            { n: 95, label: 'Match Accuracy', suffix: '%' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-5xl font-black">
                <Counter to={s.n} />
                {s.suffix}
              </p>
              <p className="mt-2 text-sm font-semibold opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
