import Employer from '../models/Employer.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

export const getDashboard = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const apps = await Application.find({ job: { $in: jobIds } });
    res.json({
      stats: {
        activeJobs: jobs.filter((j) => j.isActive).length,
        totalApplicants: apps.length,
        shortlisted: apps.filter((a) => a.status === 'Shortlisted' || a.status === 'Interview Scheduled').length,
        selected: apps.filter((a) => a.status === 'Selected').length,
        rejected: apps.filter((a) => a.status === 'Rejected').length,
      },
      recentJobs: jobs.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

export const getCompany = async (req, res, next) => {
  try {
    let employer = await Employer.findOne({ user: req.user._id }).populate('company');
    if (!employer) {
      const company = await Company.create({ owner: req.user._id, name: req.user.name });
      employer = await Employer.create({ user: req.user._id, company: company._id });
      employer.company = company;
    }
    res.json(employer.company);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const employer = await Employer.findOne({ user: req.user._id });
    const company = await Company.findById(employer.company);
    ['name', 'description', 'website', 'location'].forEach((k) => {
      if (req.body[k] !== undefined) company[k] = req.body[k];
    });
    if (req.file) company.logo = `/uploads/${req.file.filename}`;
    await company.save();
    res.json(company);
  } catch (error) {
    next(error);
  }
};

export const listCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};
