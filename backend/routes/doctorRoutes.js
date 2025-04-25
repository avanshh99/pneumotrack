const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Doctor = require('../models/doctor');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required.' });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

// Utility to extract last name
const extractLastName = (fullName) => {
  const nameParts = fullName.trim().split(' ');
  return nameParts[nameParts.length - 1].toLowerCase(); // Get the last part of the name
};

// POST /api/doctor/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: 'Email and password required.' });
  }

  try {
    const doctor = await Doctor.findOne({ 'contact.email': email.toLowerCase().trim() });

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'Doctor not found.' });
    }

    // For existing doctors, their password should already be in the format lastName + "@123"
    // We can directly compare the provided password with the stored one
    if (password !== doctor.password) {
      return res
        .status(401)
        .json({ success: false, message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { id: doctor._id, email: doctor.contact.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpirationTime }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      doctorInfo: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.contact.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error.' });
  }
});

// POST /api/doctor/apply
router.post('/apply', async (req, res) => {
  try {
    const newDoctorData = req.body;

    const existingDoctor = await Doctor.findOne({
      $or: [
        { 'contact.email': newDoctorData.contact.email },
        { 'contact.phone': newDoctorData.contact.phone },
      ],
    });

    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor with this email or phone already exists.' });
    }

    const newDoctor = new Doctor({
      ...newDoctorData,
      years_of_experience: Number(newDoctorData.years_of_experience),
      consultation_fee: Number(newDoctorData.consultation_fee),
      location: {
        area: newDoctorData.location.area,
        latitude: parseFloat(newDoctorData.location.latitude),
        longitude: parseFloat(newDoctorData.location.longitude),
      },
    });

    // Generate password using lastName + "@123"
    const lastName = extractLastName(newDoctor.name);
    newDoctor.password = `${lastName}@123`;

    await newDoctor.save();

    res.status(201).json({
      message: 'Application submitted successfully!',
      password: newDoctor.password, // No need to return doctorId since it's not used in the password
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
});

// GET /api/doctor/all - Protected route, requires JWT token
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const doctors = await Doctor.find({}, '-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load doctors.' });
  }
});

// GET /api/doctor/getDoctors - Protected route
router.get('/getDoctors', authenticateToken, async (req, res) => {
  const { age, location } = req.query;

  if (!age || !location) {
    return res.status(400).json({ message: 'Age and location are required.' });
  }

  try {
    const ageNum = parseInt(age);
    const doctors = await Doctor.find({}, '-password');

    const matchedDoctors = doctors.filter(doctor => {
      const matchesAgeGroup = doctor.age_groups.some(group => {
        if (group === 'Child' && ageNum <= 12) return true;
        if (group === 'Adult' && ageNum > 12 && ageNum <= 60) return true;
        if (group === 'Senior' && ageNum > 60) return true;
        return false;
      });

      const matchesLocation = doctor.location.area.toLowerCase().includes(location.toLowerCase());
      return matchesAgeGroup && matchesLocation;
    });

    res.json(matchedDoctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Failed to fetch doctors.' });
  }
});

module.exports = router;

