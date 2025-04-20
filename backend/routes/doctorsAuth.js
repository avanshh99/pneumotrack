// simple login and signup for doctors
const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor');

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, password, contact, ...rest } = req.body;

  if (!name || !password || !contact?.email || !contact?.phone) {
    return res.status(400).json({ message: 'Name, password, email, and phone are required' });
  }

  try {
    // Check for duplicate email or phone
    const existing = await Doctor.findOne({
      $or: [
        { 'contact.email': contact.email },
        { 'contact.phone': contact.phone }
      ]
    });

    if (existing) {
      return res.status(409).json({ message: 'Doctor with this email or phone already exists' });
    }

    const newDoctor = new Doctor({
      name,
      password,
      contact,
      ...rest
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor registered successfully', doctor: newDoctor });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error: error.message });
  }
});

// Login Route (using email + password)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const doctor = await Doctor.findOne({ 'contact.email': email });

    if (!doctor || doctor.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;

//todo add a middleware to get the latitude and longitude if required todo add bycrypt 