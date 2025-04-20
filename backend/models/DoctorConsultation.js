const mongoose = require('mongoose');

const doctorConsultationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
  },
  recordIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Record', // Reference to the Record model (each record holds a userId)
    required: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const DoctorConsultation = mongoose.model('DoctorConsultation', doctorConsultationSchema);

module.exports = DoctorConsultation;