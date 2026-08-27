import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch {
    /* ignore invalid token for public pages */
  }
  next();
};
