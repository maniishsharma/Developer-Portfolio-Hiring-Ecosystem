import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    techStack: [{ type: String }],
    githubLink: { type: String, default: '' },
    liveDemo: { type: String, default: '' },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
