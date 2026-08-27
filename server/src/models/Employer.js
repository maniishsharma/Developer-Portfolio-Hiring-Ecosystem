import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    designation: { type: String, default: 'HR / Recruiter' },
  },
  { timestamps: true }
);

export default mongoose.model('Employer', employerSchema);
