import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDb connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection failed: ", err);
    process.exit(1);
  }
};

export default connectDB;
