const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery';
    console.log(`📦 Connecting to MongoDB at: ${mongoUri}`);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('📌 Ensure MongoDB is running: mongod');
    console.error('📌 Or set MONGODB_URI env var to your Atlas connection string');
    process.exit(1);
  }
};

module.exports = connectDB;
