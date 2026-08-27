import Job from '../models/Job.js';
import Employer from '../models/Employer.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import { matchSkills } from '../services/aiService.js';

export const listJobs = async (req, res, next) => {
  try {
    const { q, location, jobType, skill, page = 1, limit = 8 } = req.query;
    const filter = { isActive: true };
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (jobType) filter.jobType = jobType;
    if (skill) filter.requiredSkills = { $regex: skill, $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Job.find(filter).populate('company', 'name logo location').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    let studentSkills = [];
    if (req.user?.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      studentSkills = student?.skills || [];
    }

    const withMatch = items.map((job) => {
      const match = matchSkills(studentSkills, job.requiredSkills);
      return { ...job.toObject(), matchPercent: studentSkills.length ? match.percent : null };
    });

    res.json({ items: withMatch, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name logo location website description');
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    const job = await Job.create({
      ...req.body,
      requiredSkills: Array.isArray(req.body.requiredSkills)
        ? req.body.requiredSkills
        : String(req.body.requiredSkills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
      employer: req.user._id,
      company: employer?.company,
    });
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, employer: req.user._id });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    Object.assign(job, req.body);
    if (req.body.requiredSkills && !Array.isArray(req.body.requiredSkills)) {
      job.requiredSkills = String(req.body.requiredSkills)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    await job.save();
    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user._id });
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    await Application.deleteMany({ job: job._id });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    next(error);
  }
};

export const myJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).populate('company', 'name logo').sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};
