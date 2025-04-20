const mongoose = require('mongoose');
const { type } = require('os');
const { union } = require('zod');

const doctorSchema = new mongoose.Schema({
  id: {
    type: Number, 
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password:{
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
    trim: true,
  },
  years_of_experience: {
    type: Number,
    required: true,
    min: 0,
  },
  age_groups: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length > 0,
      message: 'At least one age group must be specified.'
    }
  },
  location: {
    area: {
      type: String,
      required: true,
      trim: true
    },
    latitude: {
      type: Number,
      // required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      // required: true,
      min: -180,
      max: 180
    }
  },
  contact: {
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
      unique: true,
    }
  },
  hospital: {
    type: String,
    required: true,
    trim: true
  },
  consultation_fee: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length > 0,
      message: 'At least one availability day must be provided.'
    }
  }
});

module.exports = mongoose.model('Doctor', doctorSchema,"doctors");
