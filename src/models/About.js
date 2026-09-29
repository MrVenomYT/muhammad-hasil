import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  period: { type: String, default: '2024 - Present' },
  description: { type: String, default: '' },
  certificationLink: { type: String, default: '' },
});

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, default: '2024 - Present' },
  description: { type: String, default: '' },
  projectLink: { type: String, default: '' },
});

const CertificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, default: '2025' },
  link: { type: String, default: '' },
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, default: 90, min: 1, max: 100 },
  category: { type: String, default: 'Full-Stack' },
});

const AboutSchema = new mongoose.Schema({
  headline: {
    type: String,
    default: 'Clean web experiences with personality and purpose.',
  },
  subtext: {
    type: String,
    default: 'I am Muhammad Hasil, a full-stack developer who builds clean portfolio websites, interactive dashboards, scalable backend APIs, and responsive project experiences.',
  },
  ctaText: {
    type: String,
    default: 'Hire me on Fiverr',
  },
  ctaLink: {
    type: String,
    default: 'https://pro.fiverr.com/users/venomdesigne613/',
  },
  skills: [SkillSchema],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  certifications: [CertificationSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.About || mongoose.model('About', AboutSchema);
