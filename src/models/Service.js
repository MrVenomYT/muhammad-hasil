import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'Development',
    index: true,
  },
  icon: {
    type: String,
    default: 'Code',
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: [String],
    default: [],
  },
  deliverables: {
    type: [String],
    default: [],
  },
  startingPrice: {
    type: String,
    default: '$500',
  },
  deliveryTime: {
    type: String,
    default: '3-7 Days',
  },
  active: {
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

ServiceSchema.index({ order: 1, createdAt: -1 });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
