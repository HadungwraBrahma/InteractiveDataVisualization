import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`
      🚀 MongoDB Connected Successfully
      ----------------------------------
      Host: ${connection.connection.host}
      Database: ${connection.connection.db.databaseName}
      State: Connected
    `);

    return connection;
  } catch (error) {
    console.error(`
      ❌ MongoDB Connection Error
      ----------------------------------
      Error Details: ${error.message}
    `);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;