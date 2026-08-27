import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    field: String,
    startYear: String,
    endYear: String,
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    title: String,
    startDate: String,
    endDate: String,
    description: String,
  },
  { _id: true }
);

const certSchema = new mongoose.Schema(
  {
    name: String,
    issuer: String,
    year: String,
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    headline: { type: String, default: '' },
    about: { type: String, default: '' },
    avatar: { type: String, default: '' },
    skills: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    certifications: [certSchema],
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    githubUsername: { type: String, default: '' },
    resumeScore: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    profileCompletion: { type: Number, default: 10 },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

export default mongoose.model('Student', studentSchema);
