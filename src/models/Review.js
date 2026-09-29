import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
  authorRole: {
    type: String,
    default: 'Client',
  },
  company: {
    type: String,
    default: '',
  },
  authorAvatar: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
  badge: {
    type: String,
    default: 'Verified Client',
  },
  quote: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ createdAt: -1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
