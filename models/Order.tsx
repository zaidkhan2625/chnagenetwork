import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customerName: String,
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  status: {
    type: String,
    enum: ['Pending', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  placedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Employee
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
