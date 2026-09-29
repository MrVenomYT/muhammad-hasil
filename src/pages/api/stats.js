import { 
  getProjects, 
  getProducts, 
  getInquiries, 
  getReviews, 
  getServices, 
  getProfile 
} from '../../lib/server-store';
import { connectToDatabase } from '../../lib/mongodb';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectToDatabase().catch(() => {});
    const isMongoConnected = mongoose.connection.readyState === 1;

    const [projects, products, inquiries, reviews, services, profile] = await Promise.all([
      getProjects(),
      getProducts(),
      getInquiries(),
      getReviews(),
      getServices(),
      getProfile()
    ]);

    const totalViews = projects.reduce((acc, p) => acc + (p.views || 0), 0) + 1420;
    const totalSales = products.reduce((acc, p) => acc + (p.salesCount || 0), 0);
    const unreadInquiries = inquiries.filter(i => i.status === 'new').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalProjects: projects.length,
        totalProducts: products.length,
        totalInquiries: inquiries.length,
        unreadInquiries,
        totalReviews: reviews.length,
        totalServices: services.length,
        totalViews,
        totalSales,
        dbStatus: isMongoConnected ? 'connected' : 'local-persistent',
        profile
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
