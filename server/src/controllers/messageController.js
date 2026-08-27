import Message from '../models/Message.js';
import User from '../models/User.js';
import { conversationIdFor } from '../socket/index.js';

export const history = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const conversationId = conversationIdFor(req.user._id, userId);
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).populate('sender', 'name avatar');
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const conversations = async (req, res, next) => {
  try {
    const me = String(req.user._id);
    const messages = await Message.find({ $or: [{ sender: me }, { receiver: me }] }).sort({ createdAt: -1 });
    const map = new Map();
    messages.forEach((m) => {
      const other = String(m.sender) === me ? String(m.receiver) : String(m.sender);
      if (!map.has(other)) map.set(other, m);
    });
    const users = await User.find({ _id: { $in: [...map.keys()] } }).select('name avatar role isOnline lastSeen');
    res.json(
      users.map((u) => ({
        user: u,
        lastMessage: map.get(String(u._id)),
      }))
    );
  } catch (error) {
    next(error);
  }
};

export const directory = async (req, res, next) => {
  try {
    const role = req.user.role === 'student' ? 'employer' : 'student';
    const users = await User.find({ role }).select('name avatar role isOnline lastSeen');
    res.json(users);
  } catch (error) {
    next(error);
  }
};
