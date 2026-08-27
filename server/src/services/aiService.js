/**
 * Modular AI layer.
 * Replace these functions with FastAPI calls later:
 *   POST http://localhost:8000/ai/resume
 *   POST http://localhost:8000/ai/match
 *   POST http://localhost:8000/ai/career
 */

const HOT_SKILLS = [
  'React',
  'Node.js',
  'MongoDB',
  'Express',
  'JavaScript',
  'TypeScript',
  'Python',
  'SQL',
  'Git',
  'REST API',
  'Docker',
  'AWS',
];

const ROLE_MAP = [
  { role: 'MERN Stack Developer', need: ['React', 'Node.js', 'MongoDB', 'Express'] },
  { role: 'Frontend Developer', need: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind'] },
  { role: 'Backend Developer', need: ['Node.js', 'Express', 'MongoDB', 'SQL'] },
  { role: 'Data Analyst', need: ['Python', 'SQL', 'Excel', 'Power BI'] },
  { role: 'Full Stack Intern', need: ['HTML', 'CSS', 'JavaScript', 'Git'] },
];

const normalize = (list = []) => list.map((s) => String(s).trim()).filter(Boolean);

export const analyzeResume = ({ skills = [], about = '', experienceCount = 0, projectCount = 0, hasResume = false }) => {
  const skillSet = new Set(normalize(skills).map((s) => s.toLowerCase()));
  const missingSkills = HOT_SKILLS.filter((s) => !skillSet.has(s.toLowerCase())).slice(0, 5);

  let score = 40;
  if (hasResume) score += 15;
  if (about?.length > 80) score += 10;
  score += Math.min(skills.length * 4, 20);
  score += Math.min(experienceCount * 5, 10);
  score += Math.min(projectCount * 5, 10);
  score = Math.min(score, 98);

  const suggestions = [];
  if (!hasResume) suggestions.push('Upload a PDF resume so recruiters can download it.');
  if (about?.length < 80) suggestions.push('Write a longer About section with your career goal.');
  if (projectCount < 2) suggestions.push('Add at least 2 projects with GitHub and live demo links.');
  if (missingSkills.length) suggestions.push(`Learn in-demand skills: ${missingSkills.join(', ')}.`);
  if (!suggestions.length) suggestions.push('Your profile looks strong. Keep applying to matching roles.');

  const strengths = [];
  if (skills.length >= 5) strengths.push('Good skill coverage');
  if (projectCount >= 2) strengths.push('Project portfolio present');
  if (experienceCount >= 1) strengths.push('Work/internship experience listed');

  return { score, missingSkills, suggestions, strengths };
};

export const matchSkills = (studentSkills = [], requiredSkills = []) => {
  const student = normalize(studentSkills).map((s) => s.toLowerCase());
  const required = normalize(requiredSkills).map((s) => s.toLowerCase());
  if (!required.length) return { percent: 100, matched: studentSkills, missing: [] };

  const matched = required.filter((r) => student.includes(r));
  const missing = required.filter((r) => !student.includes(r));
  const percent = Math.round((matched.length / required.length) * 100);

  return {
    percent,
    matched: matched.map((m) => requiredSkills.find((s) => s.toLowerCase() === m) || m),
    missing: missing.map((m) => requiredSkills.find((s) => s.toLowerCase() === m) || m),
  };
};

export const recommendCareer = (skills = []) => {
  const lower = normalize(skills).map((s) => s.toLowerCase());
  const roles = ROLE_MAP.map((item) => {
    const hit = item.need.filter((n) => lower.includes(n.toLowerCase())).length;
    const percent = Math.round((hit / item.need.length) * 100);
    return { role: item.role, percent, missing: item.need.filter((n) => !lower.includes(n.toLowerCase())) };
  }).sort((a, b) => b.percent - a.percent);

  const skillsToLearn = [...new Set(roles.flatMap((r) => r.missing))].slice(0, 6);
  const improvement = [
    'Complete 2 more GitHub projects with README files.',
    'Practice DSA for 30 minutes daily.',
    'Add measurable results in your experience (numbers, impact).',
  ];

  return {
    suitableRoles: roles.slice(0, 3),
    skillsToLearn,
    improvementAreas: improvement,
  };
};

export const callPythonAI = async (path, payload) => {
  const base = process.env.AI_SERVICE_URL;
  if (!base) return null;
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
};
