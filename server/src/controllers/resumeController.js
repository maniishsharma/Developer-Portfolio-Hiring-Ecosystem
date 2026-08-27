import Resume from '../models/Resume.js';
import Student from '../models/Student.js';
import Project from '../models/Project.js';
import { analyzeResume, callPythonAI } from '../services/aiService.js';
import fs from 'fs';
import path from 'path';

export const getResume = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const resume = await Resume.findOne({ student: student._id }).sort({ createdAt: -1 });
    res.json(resume);
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a PDF');
    }
    const student = await Student.findOne({ user: req.user._id });
    const projectCount = await Project.countDocuments({ student: student._id });
    const payload = {
      skills: student.skills,
      about: student.about,
      experienceCount: student.experience?.length || 0,
      projectCount,
      hasResume: true,
    };
    const remote = await callPythonAI('/ai/resume', payload);
    const analysis = remote || analyzeResume(payload);
    const resume = await Resume.create({
      student: student._id,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      score: analysis.score,
      analysis: {
        missingSkills: analysis.missingSkills,
        suggestions: analysis.suggestions,
        strengths: analysis.strengths,
      },
    });
    student.resumeScore = analysis.score;
    await student.save();
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const resume = await Resume.findOne({ student: student._id }).sort({ createdAt: -1 });
    if (!resume) {
      res.status(404);
      throw new Error('No resume found');
    }
    // remove file if exists on disk
    if (resume.fileUrl && resume.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), resume.fileUrl);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) {
        // ignore file removal errors
      }
    }
    await Resume.deleteOne({ _id: resume._id });
    // reset student's resume score
    student.resumeScore = 0;
    await student.save();
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};
