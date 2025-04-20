const mongoose = require('mongoose');
require('dotenv').config(); // Load .env

const MONGO_URI = `mongodb+srv://shubhamjha70491:${process.env.DB_PASSWORD}@cluster0.ofxueji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
