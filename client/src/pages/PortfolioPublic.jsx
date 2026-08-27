import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { fadeUp } from '../animations/variants';
import Skeleton from '../components/Skeleton';

export default function PortfolioPublic() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/public/developers/${id}`).then((r) => setData(r.data)).catch(() => {});
  }, [id]);

  if (!data) return <div className="mx-auto max-w-4xl px-5 py-16"><Skeleton className="h-64" /></div>;

  const s = data.student;
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="glass-card rounded-[32px] p-8">
        <h1 className="text-5xl font-black">{s.user?.name}</h1>
        <p className="mt-2 text-lg text-ink/60 dark:text-cream/60">{s.headline}</p>
        <p className="mt-6 leading-relaxed">{s.about}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {s.skills?.map((sk) => (
            <span key={sk} className="rounded-full bg-sand px-3 py-1 text-sm font-bold dark:bg-white/10">{sk}</span>
          ))}
        </div>
      </motion.div>
      <h2 className="mt-10 text-3xl font-black">Projects</h2>
      <div className="mt-4 grid gap-4">
        {data.projects.map((p) => (
          <article key={p._id} className="glass-card rounded-[28px] p-6">
            <h3 className="text-xl font-black">{p.title}</h3>
            <p className="mt-2 text-sm text-ink/60 dark:text-cream/60">{p.description}</p>
            <p className="mt-2 text-xs font-bold">{(p.techStack || []).join(' · ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
