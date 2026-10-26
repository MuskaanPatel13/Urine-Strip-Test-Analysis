const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const UrineTest = require('../models/UrineTest');
const seedDatabase = require('../utils/seedData');
const { protect } = require('../middleware/auth');

router.post('/reset-and-seed', protect, async (req, res) => {
  try {
    await UrineTest.deleteMany({});
    await Patient.deleteMany({});
    await seedDatabase();
    res.json({
      success: true,
      message: 'Demo dataset successfully refreshed with realistic test cases.'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to reset demo dataset: ' + err.message
    });
  }
});

module.exports = router;
