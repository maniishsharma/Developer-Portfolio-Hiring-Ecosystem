import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    score: { type: Number, default: 0 },
    analysis: {
      missingSkills: [{ type: String }],
      suggestions: [{ type: String }],
      strengths: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
