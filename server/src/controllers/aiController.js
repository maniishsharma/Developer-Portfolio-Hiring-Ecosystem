import Student from '../models/Student.js';
import Project from '../models/Project.js';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';
import { analyzeResume, matchSkills, recommendCareer, callPythonAI } from '../services/aiService.js';

export const resumeAnalyzer = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const projectCount = await Project.countDocuments({ student: student._id });
    const hasResume = Boolean(await Resume.exists({ student: student._id }));
    const payload = {
      skills: student.skills,
      about: student.about,
      experienceCount: student.experience?.length || 0,
      projectCount,
      hasResume,
    };
    const result = (await callPythonAI('/ai/resume', payload)) || analyzeResume(payload);
    student.resumeScore = result.score;
    await student.save();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const skillMatch = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const job = await Job.findById(req.body.jobId);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    const payload = { studentSkills: student.skills, requiredSkills: job.requiredSkills };
    const result = (await callPythonAI('/ai/match', payload)) || matchSkills(student.skills, job.requiredSkills);
    res.json({ ...result, jobTitle: job.title });
  } catch (error) {
    next(error);
  }
};

export const career = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const result = (await callPythonAI('/ai/career', { skills: student.skills })) || recommendCareer(student.skills);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
