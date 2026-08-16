import { connectToDatabase } from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  const { method } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    console.error('MongoDB connection error in API:', e);
  }

  switch (method) {
    case 'GET':
      try {
        if (Product.db && Product.db.readyState === 1) {
          const products = await Product.find({}).sort({ createdAt: -1 });
          return res.status(200).json({ success: true, data: products });
        } else {
          return res.status(200).json({ success: true, data: [], source: 'fallback' });
        }
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        if (Product.db && Product.db.readyState === 1) {
          const newProduct = await Product.create(req.body);
          return res.status(201).json({ success: true, data: newProduct });
        } else {
          return res.status(201).json({ success: true, data: { ...req.body, id: Date.now().toString() } });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
