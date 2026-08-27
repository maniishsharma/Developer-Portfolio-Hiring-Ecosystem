import { useEffect, useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { fadeUp } from '../../animations/variants';

export default function StudentAI() {
  const [report, setReport] = useState(null);
  const [career, setCareer] = useState(null);

  const load = async () => {
    try {
      const r1 = await api.get('/ai/resume');
      setReport(r1.data);
    } catch (e) {
      // ignore
    }
    try {
      const r2 = await api.get('/ai/career');
      setCareer(r2.data);
    } catch (e) {}
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp} className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-2xl font-black">AI Labs</h2>
        <p className="mt-3 text-sm text-ink/70">Resume analysis, skill matching and career recommendations (modular).</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-black">Resume Analyzer</h3>
          {report ? (
            <div className="mt-4">
              <p className="text-3xl font-black">Score {report.score}</p>
              <p className="mt-2 text-sm font-bold">Suggestions</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink/70">
                {(report.analysis?.suggestions || []).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/60">No analysis available yet. Upload resume and click Analyze.</p>
          )}
          <div className="mt-4">
            <button onClick={load} className="btn-primary px-4 py-2">Analyze resume</button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-black">Career Recommendation</h3>
          {career ? (
            <div className="mt-4">
              <p className="font-bold">Suggested Roles</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink/70">
                {(career.suitableRoles || []).map((r) => (
                  <li key={r.role}>{r.role} — {r.percent}%</li>
                ))}
              </ul>
              <p className="mt-3 font-bold">Skills to learn</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(career.skillsToLearn || []).map((s) => (
                  <span key={s} className="rounded-full bg-sand px-3 py-1 text-xs font-bold">{s}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink/60">No recommendations yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
