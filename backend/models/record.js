const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  pincode: { type: String, required: true },
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

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Record', recordSchema);
