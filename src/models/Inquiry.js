import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    default: 'General Inquiry',
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    default: 'Flexible / To Discuss',
  },
  timeline: {
    type: String,
    default: 'Flexible',
  },
  serviceType: {
    type: String,
    default: 'Full-Stack Development',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'in_progress', 'replied', 'archived'],
    default: 'new',
    index: true,
  },
  starred: {
    type: Boolean,
    default: false,
    index: true,
  },
  notes: {
    type: String,
    default: '',
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

InquirySchema.index({ createdAt: -1 });

export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
