import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../hooks/useToast';

export default function StudentResume() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const toast = useToast();

  const load = () => api.get('/resume').then((r) => setResume(r.data));
  useEffect(() => {
    load().catch(() => {});
  }, []);

  const analyze = async () => {
    try {
      const { data } = await api.get('/ai/resume');
      setResume((r) => ({ ...(r || {}), score: data.score, analysis: data.analysis }));
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const upload = async () => {
    if (!file) return toast('Choose a PDF', 'error');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      await api.post('/resume', fd);
      toast('Resume uploaded & scored');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-black">Resume</h1>
      <div className="glass-card mt-6 rounded-[28px] p-6">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <button type="button" className="btn-primary mt-4 px-5 py-3" onClick={upload}>
          Upload PDF
        </button>
        <button type="button" className="btn-ghost mt-4 ml-3 px-5 py-3" onClick={analyze}>
          Analyze resume
        </button>
        {resume && (
          <div className="mt-6">
            <p className="text-3xl font-black">Score {resume.score}</p>
            <a className="mt-2 inline-block font-bold" href={resume.fileUrl} target="_blank" rel="noreferrer">
              View / Download
            </a>
            <button type="button" className="ml-4 text-sm font-bold text-red-600" onClick={async () => { if (!confirm('Delete resume?')) return; try { await api.delete('/resume'); toast('Resume deleted'); setResume(null); } catch (e) { toast(e.message, 'error'); } }}>
              Delete
            </button>
            <p className="mt-4 text-sm font-bold">Suggestions</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-ink/70 dark:text-cream/70">
              {(resume.analysis?.suggestions || []).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
