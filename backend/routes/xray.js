const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// POST endpoint to handle file upload and forward to 3rd-party API
router.post('/upload-xray', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Prepare the file for the 3rd-party API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file.path), file.originalname);

    // Send the file to the 3rd-party API
    const response = await axios.post(
      'https://pneumonia-detection-api-f5ws.onrender.com/predict',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Clean up the uploaded file from the server
    fs.unlinkSync(file.path);

    // Send the 3rd-party API response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error processing the file:', error);

    // Send error response
    res.status(500).json({ error: 'Failed to process the file' });
  }
});

module.exports = router;
