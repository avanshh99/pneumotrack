const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Signup Route (No hashing)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, age, gender } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone already exists' });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password, // plain text for now ( dangerous in prod) //todo bcrypt
      age,
      gender,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

// 🔑 Login Route (No hashing)
// POST /login - User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const user = await User.findOne({ email});
  
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  });
  
  module.exports = router;

module.exports = router;
//todo bcrypt 