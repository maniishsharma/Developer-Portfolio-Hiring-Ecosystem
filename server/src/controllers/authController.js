import User from '../models/User.js';
import Student from '../models/Student.js';
import Employer from '../models/Employer.js';
import Company from '../models/Company.js';
import Profile from '../models/Profile.js';
import { generateToken } from '../utils/generateToken.js';

const packUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  token: generateToken(user._id),
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }
    if (!['student', 'employer'].includes(role)) {
      res.status(400);
      throw new Error('Role must be student or employer');
    }
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error('Email already registered');
    }

    const user = await User.create({ name, email, password, role });

    if (role === 'student') {
      const student = await Student.create({ user: user._id, avatar: '' });
      await Profile.create({ user: user._id, student: student._id, displayName: name, isPublic: true });
    } else {
      const company = await Company.create({
        owner: user._id,
        name: companyName || `${name}'s Company`,
      });
      await Employer.create({ user: user._id, company: company._id });
    }

    res.status(201).json(packUser(user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }
    res.json(packUser(user));
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  res.json(req.user);
};
