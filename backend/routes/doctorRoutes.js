const express = require('express');
const router = express.Router();
const { readDoctors, writeDoctors, extractFirstName } = require('../utils/doctorUtils');

// POST /api/doctor/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }

  const doctors = readDoctors();
  const doctor = doctors.find(
    (doc) => doc.contact?.email?.toLowerCase().trim() === email.toLowerCase().trim()
  );

  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found.' });
  }

  const expectedPassword = `${extractFirstName(doctor.name)}_doc101`;

  if (password !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Incorrect password.' });
  }

  return res.json({ success: true, doctor });
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

// GET /api/doctor/all
router.get('/all', (req, res) => {
  try {
    const doctors = readDoctors();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load doctors.' });
  }
});

module.exports = router;
