import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Employee'],
    default: 'Employee',
  },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Only for Employees
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
