import Project from '../models/Project.js';
import Student from '../models/Student.js';

const mine = (userId) => Student.findOne({ user: userId });

export const listProjects = async (req, res, next) => {
  try {
    const student = await mine(req.user._id);
    const projects = await Project.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const student = await mine(req.user._id);
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);
    const techStack = Array.isArray(req.body.techStack)
      ? req.body.techStack
      : String(req.body.techStack || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    const project = await Project.create({
      student: student._id,
      title: req.body.title,
      description: req.body.description,
      techStack,
      githubLink: req.body.githubLink,
      liveDemo: req.body.liveDemo,
      images,
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const student = await mine(req.user._id);
    const project = await Project.findOne({ _id: req.params.id, student: student._id });
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    Object.assign(project, {
      title: req.body.title ?? project.title,
      description: req.body.description ?? project.description,
      githubLink: req.body.githubLink ?? project.githubLink,
      liveDemo: req.body.liveDemo ?? project.liveDemo,
    });
    if (req.body.techStack) {
      project.techStack = Array.isArray(req.body.techStack)
        ? req.body.techStack
        : String(req.body.techStack).split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (req.files?.length) {
      project.images = [...project.images, ...req.files.map((f) => `/uploads/${f.filename}`)];
    }
    await project.save();
    res.json(project);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const student = await mine(req.user._id);
    const project = await Project.findOneAndDelete({ _id: req.params.id, student: student._id });
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json({ message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
