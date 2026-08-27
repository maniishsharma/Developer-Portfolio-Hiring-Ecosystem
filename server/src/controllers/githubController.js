import Student from '../models/Student.js';
import { fetchGithubProfile } from '../services/githubService.js';

export const connectGithub = async (req, res, next) => {
  try {
    const username = req.body.username || req.query.username;
    if (!username) {
      res.status(400);
      throw new Error('GitHub username is required');
    }
    const profile = await fetchGithubProfile(username);
    if (req.user.role === 'student') {
      await Student.findOneAndUpdate({ user: req.user._id }, { githubUsername: username, 'socialLinks.github': `https://github.com/${username}` });
    }
    res.json(profile);
  } catch (error) {
    error.message = error.response?.status === 404 ? 'GitHub user not found' : error.message;
    next(error);
  }
};
