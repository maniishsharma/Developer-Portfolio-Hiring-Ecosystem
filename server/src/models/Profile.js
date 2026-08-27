import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    displayName: String,
    bio: String,
    skills: [String],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
