import { connectToDatabase } from '../../../lib/mongodb';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  try {
    await connectToDatabase();
  } catch (e) {
    console.error('MongoDB connection error in API [id]:', e);
  }

  switch (method) {
    case 'PUT':
      try {
        if (Product.db && Product.db.readyState === 1) {
          const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
          return res.status(200).json({ success: true, data: updatedProduct });
        } else {
          return res.status(200).json({ success: true, data: { ...req.body, _id: id } });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    case 'DELETE':
      try {
        if (Product.db && Product.db.readyState === 1) {
          await Product.findByIdAndDelete(id);
          return res.status(200).json({ success: true, data: {} });
        } else {
          return res.status(200).json({ success: true, data: {} });
        }
      } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
