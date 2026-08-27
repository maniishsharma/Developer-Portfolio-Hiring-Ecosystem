import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import { fadeUp, stagger } from '../../animations/variants';
import Skeleton from '../../components/Skeleton';

export default function StudentHome() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/student/dashboard').then((r) => setData(r.data)).catch(() => {});
  }, []);

  if (!data) return <Skeleton className="h-40" />;

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="space-y-6">
      <motion.h1 variants={fadeUp} className="text-4xl font-black">
        Dashboard
      </motion.h1>
      <div className="h-3 overflow-hidden rounded-full bg-sand dark:bg-white/10">
        <div className="h-full rounded-full bg-blush" style={{ width: `${data.stats.profileCompletion}%` }} />
      </div>
      <p className="text-sm font-semibold">Profile {data.stats.profileCompletion}% complete</p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Profile" value={`${data.stats.profileCompletion}%`} />
        <StatCard label="Resume score" value={data.stats.resumeScore} />
        <StatCard label="Applications" value={data.stats.applications} />
        <StatCard label="Interviews" value={data.stats.interviews} />
        <StatCard label="Portfolio views" value={data.stats.profileViews} />
      </div>
    </motion.div>
  );
}
