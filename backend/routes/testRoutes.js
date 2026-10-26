const express = require('express');
const router = express.Router();
const {
  createTest,
  getTests,
  getTestById,
  getPatientHistory,
  getDashboardStats
} = require('../controllers/testController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { PARAMETER_DEFINITIONS, SIMULATION_PRESETS } = require('../utils/parameterReference');

// Expose reference ranges and simulation presets publicly or under protection
router.get('/reference-definitions', (req, res) => {
  res.json({
    success: true,
    definitions: PARAMETER_DEFINITIONS,
    presets: SIMULATION_PRESETS
  });
});

// Protected routes
router.use(protect);

router.get('/stats/dashboard', getDashboardStats);
router.get('/patient/:patientId', getPatientHistory);

router.route('/')
  .post(upload.single('stripImage'), createTest)
  .get(getTests);

router.route('/:id')
  .get(getTestById);

module.exports = router;
