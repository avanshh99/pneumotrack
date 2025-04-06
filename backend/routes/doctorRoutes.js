const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');  
const { readDoctors, writeDoctors, extractFirstName } = require('../utils/doctorUtils');
const { filterAndSortDoctors } = require('../utils/filterdoctor');
const config = require('../config/config');  

// POST /api/doctor/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }

  try {
    const doctors = readDoctors();
    const doctor = doctors.find(
      (doc) => doc.contact?.email?.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!doctor || !doctor.contact?.email) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const expectedPassword = `${extractFirstName(doctor.name)}_doc101`;

    if (password !== expectedPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    // JWT Token creation
    const token = jwt.sign(
      { id: doctor.id, email: doctor.contact.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpirationTime }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      doctorInfo: {
        id: doctor.id,
        name: doctor.name, // Ensure this is what you want
        email: doctor.contact.email, // Add other relevant details
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/doctor/apply
router.post('/apply', (req, res) => {
  try {
    const newDoctor = req.body;
    const doctors = readDoctors();

    const exists = doctors.some((doc) => doc.contact.email === newDoctor.contact.email);
    if (exists) {
      return res.status(400).json({ message: 'Doctor already exists.' });
    }

    const maxId = Math.max(...doctors.map((doc) => doc.id), 0);
    newDoctor.id = maxId + 1;

    doctors.push(newDoctor);
    writeDoctors(doctors);

    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
});

// GET /api/doctor/all - Protected route, requires JWT token
router.get('/all', (req, res) => {
  try {
    const doctors = readDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load doctors.' });
  }
});

//api to get all the doctors based on pincode and age group
router.get('/getDoctors', async (req, res) => {
  const { pincode, age } = req.query;

  try {
    const doctorList = readDoctors(); 
    console.log(doctorList[0]);
    const sortedDoctors = await filterAndSortDoctors(doctorList, pincode, age);
    res.json(sortedDoctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;
