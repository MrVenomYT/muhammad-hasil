import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: 'Digital Product',
  },
  price: {
    type: String,
    default: 'Free / Contact',
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
    default: '/assets/muhammad-hasil.png',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
