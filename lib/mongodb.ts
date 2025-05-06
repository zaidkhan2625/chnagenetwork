// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://zaidkhan262523:1234Khan@cluster0.ewljkrr.mongodb.net/rbms?retryWrites=true&w=majority";

// To prevent multiple connections in development (especially with hot reload)
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "rbms",
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
