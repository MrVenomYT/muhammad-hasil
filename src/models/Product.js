import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    trim: true,
    index: true,
  },
  customId: {
    type: String,
    trim: true,
    index: true,
  },
  linkedProjectId: {
    type: String,
    trim: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  slug: {
    type: String,
    trim: true,
    index: true,
  },
  category: {
    type: String,
    default: 'Web Apps',
    index: true,
  },
  price: {
    type: String,
    default: '$29',
  },
  originalPrice: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: 'Featured',
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '/assets/thumbnail.png',
  },
  buyUrl: {
    type: String,
    default: '#',
  },
  demoUrl: {
    type: String,
    default: '#',
  },
  features: {
    type: [String],
    default: [],
  },
  salesCount: {
    type: Number,
    default: 0,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  isPublished: {
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
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  strict: false,
  timestamps: true
});

ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ slug: 1, id: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
