import Notification from '../models/Notification.js';

export const createNotification = async ({ user, title, message, type = 'info', link = '' }) => {
  if (!user) return null;
  return Notification.create({ user, title, message, type, link });
};
