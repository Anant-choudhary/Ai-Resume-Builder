import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
//require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB..." , process.env.MONGODB_URI);
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new ApiError(500, "MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ai_resume_builder",
      // Additional recommended options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    throw new ApiError(500, "Database connection failed", [], err.stack);
  }
};

export { connectDB };