const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DoctorConsultation = require('../models/DoctorConsultation'); // MongoDB model
const Record = require('../models/record'); // Record model 
// 

// POST route to assign a record to a doctor
router.post('/assignRecord', async (req, res) => {
  const { doctorId, recordId } = req.body;

  // Check if fields are provided
  if (!doctorId || !recordId) {
    return res.status(400).json({ message: 'doctorId and recordId are required' });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(doctorId) || !mongoose.Types.ObjectId.isValid(recordId)) {
    return res.status(400).json({ message: 'Invalid doctorId or recordId format' });
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
    console.error('Error assigning record:', error);
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
  


  router.get('/consultations/:doctorId', async (req, res) => {
    try {
      const consultation = await DoctorConsultation.findOne({ doctorId: req.params.doctorId }).lean();
      if (!consultation) {
        return res.status(404).json({ message: 'Consultation not found' });
      }
  
      // Ensure recordIds is an array of strings (ObjectIds)
      const responseData = {
        _id: consultation._id.toString(),
        doctorId: consultation.doctorId.toString(),
        recordIds: consultation.recordIds.map(recordId => String(recordId)), // Convert ObjectIds to strings
        createdAt: consultation.createdAt.toISOString(),
      };
  
      console.log('Consultation response:', responseData);
      res.json(responseData);
    } catch (err) {
      console.error('Error fetching consultation:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  router.post('/submitFeedback', async (req, res) => {
    const { recordId, feedback } = req.body;
  
    try {
      // Validate request body
      if (!recordId || !feedback) {
        return res.status(400).json({ message: 'recordId and feedback are required' });
      }
  
      // Update the specific record's status and feedback
      const record = await Record.findById(recordId);
      if (!record) {
        return res.status(404).json({ message: 'Record not found' });
      }
  
      record.status = 'Resolved';
      record.doctorFeedback = feedback;
      await record.save();
  
      res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;
