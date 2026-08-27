import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { fadeUp, stagger } from '../animations/variants';
import IdentityMark from '../components/IdentityMark';
import Skeleton from '../components/Skeleton';

export default function Developers() {
  const [data, setData] = useState({ items: [], pages: 1 });
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/public/developers?q=${encodeURIComponent(q)}&page=${page}`)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, page]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="text-5xl font-black">Developers</h1>
      <input
        value={q}
        onChange={(e) => {
          setPage(1);
          setQ(e.target.value);
        }}
        placeholder="Search by headline or about"
        className="mt-6 w-full max-w-md rounded-2xl bg-sand px-4 py-3 outline-none dark:bg-white/10"
      />
      {loading ? (
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger} className="mt-8 grid gap-5 md:grid-cols-3">
          {data.items.map((d) => (
            <motion.article key={d._id} variants={fadeUp} className="glass-card rounded-[28px] p-6">
              <IdentityMark size="lg" />
              <h3 className="text-xl font-black">{d.user?.name}</h3>
              <p className="text-sm text-ink/50">{d.headline}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(d.skills || []).slice(0, 4).map((s) => (
                  <span key={s} className="rounded-full bg-sand px-2 py-1 text-xs font-bold dark:bg-white/10">
                    {s}
                  </span>
                ))}
              </div>
              <Link to={`/developers/${d._id}`} className="btn-primary mt-5 inline-block px-4 py-2 text-sm">
                View Portfolio
              </Link>
            </motion.article>
          ))}
        </motion.div>
      )}
      <div className="mt-8 flex gap-2">
        {Array.from({ length: data.pages }).map((_, i) => (
          <button key={i} type="button" onClick={() => setPage(i + 1)} className={`rounded-full px-3 py-1 text-sm font-bold ${page === i + 1 ? 'bg-blush' : 'bg-sand dark:bg-white/10'}`}>
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
