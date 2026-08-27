import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Student from '../models/Student.js';
import Interview from '../models/Interview.js';
import { createNotification } from '../services/notify.js';
import { matchSkills } from '../services/aiService.js';

export const applyJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const existing = await Application.findOne({ job: job._id, student: student._id });
    if (existing) {
      res.status(400);
      throw new Error('You already applied to this job');
    }
    const application = await Application.create({
      job: job._id,
      student: student._id,
      employer: job.employer,
      coverLetter: req.body.coverLetter || '',
    });
    await createNotification({
      user: job.employer,
      title: 'New applicant',
      message: `${req.user.name} applied for ${job.title}`,
      type: 'applicant',
      link: '/employer/applications',
    });
    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const myApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const apps = await Application.find({ student: student._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name logo location' } })
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    next(error);
  }
};

export const employerApplications = async (req, res, next) => {
  try {
    const { status, jobId } = req.query;
    const filter = { employer: req.user._id };
    if (status) filter.status = status;
    if (jobId) filter.job = jobId;
    const apps = await Application.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email avatar' } })
      .populate('job', 'title requiredSkills location')
      .sort({ createdAt: -1 });

    const mapped = apps.map((a) => {
      const match = matchSkills(a.student?.skills || [], a.job?.requiredSkills || []);
      return { ...a.toObject(), matchPercent: match.percent };
    });
    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, employer: req.user._id }).populate('job', 'title').populate('student');
    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }
    app.status = req.body.status;
    await app.save();
    const studentUser = app.student.user;
    await createNotification({
      user: studentUser,
      title: 'Application update',
      message: `Your application for ${app.job.title} is now ${app.status}`,
      type: 'application',
      link: '/student/applications',
    });
    res.json(app);
  } catch (error) {
    next(error);
  }
};

export const scheduleInterview = async (req, res, next) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, employer: req.user._id }).populate('job', 'title').populate('student');
    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }
    const interview = await Interview.create({
      application: app._id,
      employer: req.user._id,
      student: app.student._id,
      scheduledAt: req.body.scheduledAt,
      mode: req.body.mode || 'Online',
      notes: req.body.notes || '',
    });
    app.status = 'Interview Scheduled';
    await app.save();
    await createNotification({
      user: app.student.user,
      title: 'Interview scheduled',
      message: `Interview scheduled for ${app.job.title}`,
      type: 'interview',
      link: '/student',
    });
    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
};
