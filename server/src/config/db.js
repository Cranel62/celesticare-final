import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI?.startsWith('mongodb+srv://')) {
      throw new Error('MONGO_URI must be a MongoDB Atlas SRV connection string.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Connection Error]: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;