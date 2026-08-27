import Student from '../models/Student.js';
import Project from '../models/Project.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';
import Job from '../models/Job.js';
import { calcProfileCompletion } from '../utils/profileCompletion.js';

const getMine = async (userId) => {
  let student = await Student.findOne({ user: userId });
  if (!student) student = await Student.create({ user: userId });
  return student;
};

export const getDashboard = async (req, res, next) => {
  try {
    const student = await getMine(req.user._id);
    const [apps, interviews, resume, projects] = await Promise.all([
      Application.find({ student: student._id }),
      Interview.find({ student: student._id, status: 'Scheduled' }),
      Resume.findOne({ student: student._id }).sort({ createdAt: -1 }),
      Project.countDocuments({ student: student._id }),
    ]);

    const statusCount = apps.reduce((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      student,
      stats: {
        profileCompletion: student.profileCompletion,
        resumeScore: resume?.score || student.resumeScore || 0,
        applications: apps.length,
        interviews: interviews.length,
        profileViews: student.profileViews,
        projects,
        statusCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const student = await getMine(req.user._id);
    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const student = await getMine(req.user._id);
    const fields = [
      'headline',
      'about',
      'skills',
      'education',
      'experience',
      'certifications',
      'socialLinks',
      'githubUsername',
    ];
    fields.forEach((key) => {
      if (req.body[key] !== undefined) student[key] = req.body[key];
    });
    if (req.file) student.avatar = `/uploads/${req.file.filename}`;
    student.profileCompletion = calcProfileCompletion({ ...student.toObject(), avatar: student.avatar || req.user.avatar });
    await student.save();
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { displayName: req.user.name, bio: student.about, skills: student.skills, student: student._id },
      { upsert: true }
    );
    res.json(student);
  } catch (error) {
    next(error);
  }
};

export const toggleSaveJob = async (req, res, next) => {
  try {
    const student = await getMine(req.user._id);
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const idx = student.savedJobs.findIndex((id) => String(id) === String(jobId));
    if (idx >= 0) student.savedJobs.splice(idx, 1);
    else student.savedJobs.push(jobId);
    await student.save();
    res.json({ savedJobs: student.savedJobs });
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (req, res, next) => {
  try {
    const student = await getMine(req.user._id);
    await student.populate({ path: 'savedJobs', populate: { path: 'company', select: 'name logo location' } });
    res.json(student.savedJobs);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const student = await getMine(req.user._id);
    const apps = await Application.find({ student: student._id }).populate('job', 'title');
    const interviews = await Interview.find({ student: student._id });

    const byMonth = {};
    apps.forEach((a) => {
      const key = a.createdAt.toISOString().slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + 1;
    });

    res.json({
      applicationsByMonth: Object.entries(byMonth).map(([month, count]) => ({ month, count })),
      statusBreakdown: ['Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map((status) => ({
        status,
        count: apps.filter((a) => a.status === status).length,
      })),
      skills: student.skills.map((name, i) => ({ name, value: Math.min(40 + i * 12, 95) })),
      profileViews: student.profileViews,
      interviews: interviews.length,
    });
  } catch (error) {
    next(error);
  }
};

export const publicDevelopers = async (req, res, next) => {
  try {
    const { skill, q, page = 1, limit = 9 } = req.query;
    const filter = {};
    if (skill) filter.skills = { $regex: skill, $options: 'i' };
    if (q) filter.$or = [{ headline: { $regex: q, $options: 'i' } }, { about: { $regex: q, $options: 'i' } }];
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Student.find(filter).populate('user', 'name avatar').skip(skip).limit(Number(limit)).sort({ profileViews: -1 }),
      Student.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (error) {
    next(error);
  }
};

export const publicPortfolio = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name email avatar');
    if (!student) {
      res.status(404);
      throw new Error('Developer not found');
    }
    student.profileViews += 1;
    await student.save();
    const projects = await Project.find({ student: student._id }).sort({ createdAt: -1 });
    res.json({ student, projects });
  } catch (error) {
    next(error);
  }
};

export const searchCandidates = async (req, res, next) => {
  try {
    const { skills, education, experience, q, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (skills) {
      const list = String(skills)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (list.length) filter.skills = { $in: list.map((s) => new RegExp(s, 'i')) };
    }
    if (education) filter['education.degree'] = { $regex: education, $options: 'i' };
    if (experience) filter['experience.title'] = { $regex: experience, $options: 'i' };
    if (q) {
      filter.$or = [{ headline: { $regex: q, $options: 'i' } }, { about: { $regex: q, $options: 'i' } }, { skills: { $regex: q, $options: 'i' } }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Student.find(filter).populate('user', 'name email avatar').skip(skip).limit(Number(limit)),
      Student.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (error) {
    next(error);
  }
};
