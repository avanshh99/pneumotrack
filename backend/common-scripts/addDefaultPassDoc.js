// const mongoose = require('mongoose');
// const Doctor = require('../models/doctor'); // your doctor model

// require('dotenv').config(); // Load .env

// const MONGO_URI = `mongodb+srv://shubhamjha70491:${process.env.DB_PASSWORD}@cluster0.ofxueji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// async function updateDoctorsWithPassword() {
//     await mongoose.connect(MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });

//     const doctors = await Doctor.find();

//     for (const doc of doctors) {
//         if (!doc.password) {
//             const words = doc.name.split(" ");
//             const plainPassword = words[words.length - 1] + "@123"; // Example: Rai@123
//             doc.password = plainPassword;
//             await doc.save();
//         }
//     }

//     console.log('Plaintext passwords added to existing doctors (for testing).');
//     mongoose.disconnect();
// }

// updateDoctorsWithPassword();
console.log("Passwords are added so commented the file");
// todo use bycrypt to hash the password and save it in the database and use that password for login and also update the login route to use this password instead of the default one.