// const mongoose = require('mongoose');
// const fs = require('fs');
// const Doctor = require('../models/doctor');

// require('dotenv').config(); // Load .env

// // 🔗 Replace with your actual Atlas connection string
// const MONGO_URI = `mongodb+srv://shubhamjha70491:${process.env.DB_PASSWORD}@cluster0.ofxueji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// mongoose.connect(MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(async () => {
//   console.log('✅ Connected to MongoDB Atlas');

//   // Read the doctors.json file
//   const data = JSON.parse(fs.readFileSync('../data/doctors.json', 'utf8'));

//   // Insert into MongoDB
//   await Doctor.insertMany(data);
//   console.log('🩺 Doctors inserted successfully!');

//   mongoose.disconnect();
// })
// .catch((err) => {
//   console.error('❌ Error connecting or inserting:', err);
// });
console.log("import was already done so this file has no use now.");
