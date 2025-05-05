import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String, // URL or Cloudinary
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin/Manager
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', productSchema);
