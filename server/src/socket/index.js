import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { createNotification } from '../services/notify.js';

const onlineUsers = new Map();

export const conversationIdFor = (a, b) => [String(a), String(b)].sort().join('_');

export const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Auth token required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = String(socket.user._id);
    onlineUsers.set(userId, socket.id);
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    io.emit('online_users', [...onlineUsers.keys()]);

    socket.join(userId);

    socket.on('send_message', async ({ receiverId, text }) => {
      if (!receiverId || !text?.trim()) return;
      const conversationId = conversationIdFor(userId, receiverId);
      const message = await Message.create({
        conversationId,
        sender: userId,
        receiver: receiverId,
        text: text.trim(),
      });
      const payload = await message.populate('sender', 'name avatar role');
      io.to(userId).to(String(receiverId)).emit('receive_message', payload);
      await createNotification({
        user: receiverId,
        title: 'New message',
        message: `${socket.user.name} sent you a message`,
        type: 'message',
        link: '/chat',
      });
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
      io.emit('online_users', [...onlineUsers.keys()]);
    });
  });
};
