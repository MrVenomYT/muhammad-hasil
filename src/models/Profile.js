import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: 'Muhammad Hasil',
  },
  tagline: {
    type: String,
    default: 'Full Stack Developer & UI/UX Designer',
  },
  bio: {
    type: String,
    default: 'Dedicated full-stack software engineer and creative interface designer crafting modern web applications with React, Next.js, Node.js, and MongoDB.',
  },
  yearsExperience: {
    type: Number,
    default: 4,
  },
  projectsCompleted: {
    type: Number,
    default: 35,
  },
  happyClients: {
    type: Number,
    default: 28,
  },
  hoursCoded: {
    type: Number,
    default: 3200,
  },
  availableForHire: {
    type: Boolean,
    default: true,
  },
  availabilityText: {
    type: String,
    default: 'Available for freelance & full-stack contract roles',
  },
  skills: [
    {
      name: String,
      category: String,
      level: Number,
    }
  ],
  socials: {
    github: { type: String, default: 'https://github.com' },
    linkedin: { type: String, default: 'https://www.linkedin.com/in/muhammad-hasil/' },
    fiverr: { type: String, default: 'https://pro.fiverr.com/users/venomdesigne613/' },
    patreon: { type: String, default: 'https://www.patreon.com/MrVenomYT' },
    email: { type: String, default: 'esp.hasil.insight@gmail.com' },
    twitter: { type: String, default: '' },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
