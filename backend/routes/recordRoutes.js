const express = require('express');
const multer = require('multer');
const Record = require('../models/record');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: Add Record (both report + image required)
router.post('/addRecord', upload.fields([
  { name: 'xrayReport', maxCount: 1 },
  { name: 'xrayImage', maxCount: 1 }
]), async (req, res) => {
  const { userId, name, age, pincode, xrayDate } = req.body;

  if (!req.files['xrayReport'] || !req.files['xrayImage']) {
    return res.status(400).json({ message: 'Both xrayReport and xrayImage are required' });
  }

  const newRecord = new Record({
    userId,
    name,
    age,
    pincode,
    xrayDate,
    xrayReport: {
      data: req.files['xrayReport'][0].buffer,
      contentType: req.files['xrayReport'][0].mimetype,
    },
    xrayImage: {
      data: req.files['xrayImage'][0].buffer,
      contentType: req.files['xrayImage'][0].mimetype,
    },
  });

  try {
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET: Single record by ID
router.get('/getRecord/:id', async (req, res) => {
  console.log(req.params);
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });

    console.log(record.userId);
    const responseData = {
      userId: record.userId,
      name: record.name,
      age: record.age,
      pincode: record.pincode,
      xrayDate: record.xrayDate,
      xrayReport: record.xrayReport?.data
        ? {
            contentType: record.xrayReport.contentType,
            base64: record.xrayReport.data.toString('base64'),
          }
        : null,
      xrayImage: record.xrayImage?.data
        ? {
            contentType: record.xrayImage.contentType,
            base64: record.xrayImage.data.toString('base64'),
          }
        : null,
    };
    console.log(responseData);
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/getRecords/:userId', async (req, res) => {
    try {
      const records = await Record.find({ userId: req.params.userId }); // Fetch records by userId but I want to change this to use mongodb userid in future but sinces users collection is not created yet so I am using this for now
  
      const formattedRecords = records.map(record => ({
        _id: record._id,
        userId: record.userId,
        name: record.name,
        age: record.age,
        pincode: record.pincode,
        xrayDate: record.xrayDate,
        xrayReport: record.xrayReport?.data
          ? {
              contentType: record.xrayReport.contentType,
              base64: record.xrayReport.data.toString('base64'),
            }
          : null,
        xrayImage: record.xrayImage?.data
          ? {
              contentType: record.xrayImage.contentType,
              base64: record.xrayImage.data.toString('base64'),
            }
          : null,
      }));
  
      res.json(formattedRecords);
    } catch (error) {
      console.error("🔥 Error in getRecords:", error);
      res.status(500).json({ message: 'Server error', error: error.message || error });
    }
  });
module.exports = router;
