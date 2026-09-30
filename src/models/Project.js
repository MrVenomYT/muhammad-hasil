import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  category: {
    type: String,
    default: 'fullstack react',
    index: true,
  },
  pill: {
    type: String,
    default: 'Full Stack Web App',
  },
  description: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    default: '',
  },
  liveDemoUrl: {
    type: String,
    default: '#',
  },
  githubUrl: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '/assets/thumbnail.png',
  },
  technologies: {
    type: [String],
    default: ['React', 'Next.js', 'Node.js', 'Tailwind CSS'],
  },
  projectType: {
    type: String,
    default: 'Web',
    index: true,
  },
  tags: {
    type: [String],
    default: ['Web', 'Full-Stack'],
  },
  featured: {
    type: Boolean,
    default: true,
    index: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.index({ createdAt: -1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
