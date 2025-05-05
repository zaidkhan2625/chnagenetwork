// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://zaidkhan262523:1234Khan@cluster0.ewljkrr.mongodb.net/rbms";

// Global is used here to cache the connection across hot reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
