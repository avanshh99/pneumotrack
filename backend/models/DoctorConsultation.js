const mongoose = require('mongoose');

const doctorConsultationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recordIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DoctorConsultation = mongoose.model(
  'DoctorConsultation',
  doctorConsultationSchema
);

module.exports = DoctorConsultation;
