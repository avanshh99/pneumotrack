// routes/doctorMap.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const mapFilePath = path.join(__dirname, '../data/doctorPatientMap.json');

// Ensure JSON file exists
if (!fs.existsSync(mapFilePath)) {
  fs.writeFileSync(mapFilePath, '{}');
}

router.post('/assignPatient', (req, res) => {
    // console.log('Request body:', req.body); // Log the request body for debugging
  const { doctorId, userId } = req.body;

  if (!doctorId || !userId) {
    return res.status(400).json({ message: 'doctorId and userId are required' });
  }

  try {
    const rawData = fs.readFileSync(mapFilePath);
    const mapping = JSON.parse(rawData);

    // Initialize if doctor not in map
    if (!mapping[doctorId]) {
      mapping[doctorId] = [];
    }

    // Avoid duplicates
    if (!mapping[doctorId].includes(userId)) {
      mapping[doctorId].push(userId);
    }

    fs.writeFileSync(mapFilePath, JSON.stringify(mapping, null, 2));

    res.status(200).json({ message: 'Patient assigned successfully', mapping });
  } catch (err) {
    res.status(500).json({ message: 'Error updating mapping', error: err.message });
  }
});

module.exports = router;
