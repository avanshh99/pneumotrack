const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  area: { type: String },
  xrayDate: { type: Date, required: true },

  xrayReport: {
    type: {
      data: Buffer,
      contentType: String,
    },
    required: true,
  },
  xrayImage: {
    type: {
      data: Buffer,
      contentType: String,
    },
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Resolved'],
    default: 'Pending', // Default status when a record is created
  },
  doctorFeedback: {
    type: String, // Doctor's feedback or comments
  },

  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Record', recordSchema);
