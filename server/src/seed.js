import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Student from './models/Student.js';
import Employer from './models/Employer.js';
import Company from './models/Company.js';
import Job from './models/Job.js';
import Project from './models/Project.js';
import Profile from './models/Profile.js';
import Skill from './models/Skill.js';
import { connectDB } from './config/db.js';

const skillsCatalog = [
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Express', category: 'Backend' },
  { name: 'Python', category: 'Data Science' },
  { name: 'JavaScript', category: 'Frontend' },
];

await connectDB();
await mongoose.connection.dropDatabase();

await Skill.insertMany(skillsCatalog);

const studentUser = await User.create({
  name: 'Aarav Sharma',
  email: 'student@devconnect.ai',
  password: 'password123',
  role: 'student',
});

const student = await Student.create({
  user: studentUser._id,
  headline: 'MERN Stack Developer | MCA Student',
  about: 'MCA final-year student building full-stack products with React, Node.js and a bit of AI.',
  skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'Tailwind'],
  education: [{ school: 'University College', degree: 'MCA', field: 'Computer Applications', startYear: '2024', endYear: '2026' }],
  experience: [{ company: 'Campus Tech Club', title: 'Web Lead', startDate: '2025', endDate: 'Present', description: 'Mentored juniors on MERN projects.' }],
  certifications: [{ name: 'JavaScript Algorithms', issuer: 'freeCodeCamp', year: '2025' }],
  socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com', website: '' },
  githubUsername: '',
  resumeScore: 78,
  profileViews: 128,
  profileCompletion: 85,
});

await Profile.create({
  user: studentUser._id,
  student: student._id,
  displayName: studentUser.name,
  bio: student.about,
  skills: student.skills,
});

await Project.create({
  student: student._id,
  title: 'Campus Event Hub',
  description: 'Event listing and registration app for college clubs.',
  techStack: ['React', 'Express', 'MongoDB'],
  githubLink: 'https://github.com',
  liveDemo: '',
});

const employerUser = await User.create({
  name: 'Neha Kapoor',
  email: 'employer@devconnect.ai',
  password: 'password123',
  role: 'employer',
});

const company = await Company.create({
  owner: employerUser._id,
  name: 'NovaHire Labs',
  description: 'Product studio hiring student developers for internships and full-time roles.',
  website: 'https://novahire.example',
  location: 'Bengaluru',
});

await Employer.create({ user: employerUser._id, company: company._id, designation: 'Talent Partner' });

const extra = [
  {
    name: 'Isha Patel',
    email: 'isha@devconnect.ai',
    headline: 'Frontend Engineer',
    about: 'Design-minded React developer who loves motion and clean UI systems.',
    skills: ['React', 'Tailwind', 'Framer Motion', 'JavaScript'],
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan@devconnect.ai',
    headline: 'Python + Web Developer',
    about: 'Building data-aware web apps and exploring ML for career tools.',
    skills: ['Python', 'Node.js', 'SQL', 'React'],
  },
];

for (const person of extra) {
  const u = await User.create({ name: person.name, email: person.email, password: 'password123', role: 'student' });
  const s = await Student.create({
    user: u._id,
    headline: person.headline,
    about: person.about,
    skills: person.skills,
    education: [{ school: 'MCA College', degree: 'MCA', field: 'CS', startYear: '2024', endYear: '2026' }],
    profileViews: 40 + Math.floor(Math.random() * 80),
    profileCompletion: 70,
    resumeScore: 64,
  });
  await Profile.create({ user: u._id, student: s._id, displayName: person.name, bio: person.about, skills: person.skills });
  await Project.create({
    student: s._id,
    title: `${person.name.split(' ')[0]}'s Portfolio`,
    description: 'Personal projects and intern work.',
    techStack: person.skills.slice(0, 3),
  });
}

await Job.create([
  {
    employer: employerUser._id,
    company: company._id,
    title: 'Junior MERN Developer',
    description: 'Build dashboards and REST APIs with React and Node.js.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express'],
    experience: '0-1 years',
    salary: '4-6 LPA',
    location: 'Bengaluru / Hybrid',
    jobType: 'Full-time',
  },
  {
    employer: employerUser._id,
    company: company._id,
    title: 'Frontend Intern',
    description: 'Work on UI systems with React and Tailwind CSS.',
    requiredSkills: ['React', 'JavaScript', 'Tailwind'],
    experience: 'Fresher',
    salary: 'Stipend',
    location: 'Remote',
    jobType: 'Internship',
  },
]);

console.log('Seed complete.');
console.log('Student: student@devconnect.ai / password123');
console.log('Employer: employer@devconnect.ai / password123');
await mongoose.disconnect();
process.exit(0);
