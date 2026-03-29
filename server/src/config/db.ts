import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = async (): Promise<void> => {
  if (!ENV.MONGODB_URI) {
    console.warn("⚠️  MONGODB_URI missing. Starting server without database.");
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      dbName: "internportal",
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connection event listeners
mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

export default connectDB;
