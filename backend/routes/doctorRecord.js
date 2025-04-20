const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DoctorConsultation = require('../models/DoctorConsultation'); // MongoDB model
const Record = require('../models/record'); // Record model 

// POST route to assign a record to a doctor
router.post('/assignRecord', async (req, res) => {
  const { doctorId, recordId } = req.body;

  if (!doctorId || !recordId) {
    return res.status(400).json({ message: 'doctorId and recordId are required' });
  }

  try {
    const validDoctorId = new mongoose.Types.ObjectId(doctorId);
    const validRecordId = new mongoose.Types.ObjectId(recordId);

    let doctorMap = await DoctorConsultation.findOne({ doctorId: validDoctorId });

    if (!doctorMap) {
      doctorMap = new DoctorConsultation({
        doctorId: validDoctorId,
        recordIds: [validRecordId],
      });
    } else {
      if (!doctorMap.recordIds.includes(validRecordId)) {
        doctorMap.recordIds.push(validRecordId);
      }
    }

    await doctorMap.save();
    res.status(200).json({ message: 'Record assigned successfully', doctorMap });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning record', error: error.message });
  }
});

// 🆕 GET route to fetch all records assigned to a doctor
router.get('/records/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  try {
    const validDoctorId = new mongoose.Types.ObjectId(doctorId);

    const doctorMap = await DoctorConsultation.findOne({ doctorId: validDoctorId });

    if (!doctorMap || doctorMap.recordIds.length === 0) {
      return res.status(404).json({ message: 'No records found for this doctor.' });
    }

    const records = await Record.find({ _id: { $in: doctorMap.recordIds } });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving records', error: error.message });
  }
});

// DELETE route to remove a record from a doctor's list
router.delete('/removeRecord', async (req, res) => {
    const { doctorId, recordId } = req.body;
  
    if (!doctorId || !recordId) {
      return res.status(400).json({ message: 'doctorId and recordId are required' });
    }
  
    try {
      const validDoctorId = new mongoose.Types.ObjectId(doctorId);
      const validRecordId = new mongoose.Types.ObjectId(recordId);
  
      const updated = await DoctorConsultation.findOneAndUpdate(
        { doctorId: validDoctorId },
        { $pull: { recordIds: validRecordId } }, // Remove the recordId
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: 'Doctor consultation mapping not found' });
      }
  
      res.status(200).json({ message: 'Record removed successfully', updated });
    } catch (error) {
      res.status(500).json({ message: 'Error removing record', error: error.message });
    }
  });
  

module.exports = router;
