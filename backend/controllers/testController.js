const UrineTest = require('../models/UrineTest');
const Patient = require('../models/Patient');
const { evaluateParameters, SIMULATION_PRESETS } = require('../utils/parameterReference');

// Helper to generate next unique test ID like URN-2026-0001
const generateTestId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await UrineTest.countDocuments();
  const sequence = String(count + 1).padStart(4, '0');
  let candidate = `URN-${currentYear}-${sequence}`;
  while (await UrineTest.findOne({ testId: candidate })) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    candidate = `URN-${currentYear}-${rand}`;
  }
  return candidate;
};

// @desc    Record a new urine test with 10 parameters and optional strip image
// @route   POST /api/tests
// @access  Private
exports.createTest = async (req, res) => {
  try {
    let {
      patientId,
      parameters,
      clinicalRemarks,
      analysisMode,
      reactionWaitSeconds,
      simulationPresetId
    } = req.body;

    // If parameters arrived as string (from FormData multipart), parse it
    if (typeof parameters === 'string') {
      try {
        parameters = JSON.parse(parameters);
      } catch (e) {
        parameters = {};
      }
    }

    // If a preset was selected and parameters wasn't explicitly populated
    if (simulationPresetId && SIMULATION_PRESETS[simulationPresetId] && (!parameters || Object.keys(parameters).length === 0)) {
      parameters = SIMULATION_PRESETS[simulationPresetId].data;
    }

    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient selection is required to record a test.'
      });
    }

    // Find the patient
    let patient = null;
    if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(patientId);
    }
    if (!patient) {
      patient = await Patient.findOne({ patientId: patientId.toUpperCase() });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient not found for ID: ${patientId}`
      });
    }

    // Evaluate parameters against medical reference ranges
    const evaluation = evaluateParameters(parameters || {});

    // Generate unique test ID
    const testId = await generateTestId();

    // Prepare image metadata if file was uploaded
    let stripImage = {
      filename: '',
      originalName: '',
      url: '',
      mimetype: '',
      size: 0,
      hasImage: false
    };

    if (req.file) {
      stripImage = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size,
        hasImage: true
      };
    }

    const test = await UrineTest.create({
      testId,
      patient: patient._id,
      patientId: patient.patientId,
      patientName: patient.name,
      conductedBy: req.user ? req.user._id : null,
      conductorName: req.user ? `${req.user.name} (${req.user.staffRole})` : 'Hospital Staff',
      testDate: new Date(),
      reactionWaitSeconds: reactionWaitSeconds ? Number(reactionWaitSeconds) : 120,
      analysisMode: analysisMode || (req.file ? 'Optical Strip Image (Simulated Colorimetry)' : 'Manual Entry'),
      stripImage,
      parameters: evaluation.parameters,
      overallStatus: evaluation.overallStatus,
      flagCount: evaluation.flagCount,
      clinicalRemarks: clinicalRemarks || ''
    });

    res.status(201).json({
      success: true,
      data: test,
      message: 'Urine test results successfully recorded.'
    });
  } catch (error) {
    console.error('[Create Test Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record test: ' + error.message
    });
  }
};

// @desc    Get all urine tests with filters, search, and sorting
// @route   GET /api/tests
// @access  Private
exports.getTests = async (req, res) => {
  try {
    const { search, status, sortBy = 'date_desc' } = req.query;
    let query = {};

    // Status filter: 'Normal', 'Flagged', or 'All'
    if (status && status !== 'All') {
      query.overallStatus = status;
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { testId: searchRegex },
        { patientName: searchRegex },
        { patientId: searchRegex }
      ];
    }

    let sortOptions = { testDate: -1 };
    if (sortBy === 'date_asc') sortOptions = { testDate: 1 };
    if (sortBy === 'flag_desc') sortOptions = { flagCount: -1, testDate: -1 };

    const tests = await UrineTest.find(query)
      .populate('patient', 'patientId name age gender contact bloodGroup')
      .sort(sortOptions);

    res.json({
      success: true,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test records: ' + error.message
    });
  }
};

// @desc    Get single urine test by ID
// @route   GET /api/tests/:id
// @access  Private
exports.getTestById = async (req, res) => {
  try {
    const test = await UrineTest.findById(req.params.id)
      .populate('patient', 'patientId name age gender contact bloodGroup medicalHistory referringDoctor address')
      .populate('conductedBy', 'name staffRole department hospitalId');

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Urine test record not found.'
      });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test details: ' + error.message
    });
  }
};

// @desc    Get all tests for a specific patient
// @route   GET /api/tests/patient/:patientId
// @access  Private
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    let patient = null;

    if (patientId.match(/^[0-9a-fA-F]{24}$/)) {
      patient = await Patient.findById(patientId);
    }
    if (!patient) {
      patient = await Patient.findOne({ patientId: patientId.toUpperCase() });
    }

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }

    const tests = await UrineTest.find({ patient: patient._id }).sort({ testDate: -1 });

    res.json({
      success: true,
      patient,
      count: tests.length,
      data: tests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient test history: ' + error.message
    });
  }
};

// @desc    Get dashboard statistics, counts, and parameter distribution
// @route   GET /api/tests/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalTests = await UrineTest.countDocuments();
    const normalTests = await UrineTest.countDocuments({ overallStatus: 'Normal' });
    const flaggedTests = await UrineTest.countDocuments({ overallStatus: 'Flagged' });

    // Recent 5 tests
    const recentTests = await UrineTest.find()
      .populate('patient', 'patientId name age gender')
      .sort({ testDate: -1 })
      .limit(5);

    // Calculate parameter flag frequencies across all tests
    const allTests = await UrineTest.find().select('parameters testDate overallStatus');
    const parameterFlagCounts = {
      glucose: 0,
      protein: 0,
      ph: 0,
      ketones: 0,
      blood: 0,
      bilirubin: 0,
      urobilinogen: 0,
      nitrite: 0,
      leucocytes: 0,
      specificGravity: 0
    };

    allTests.forEach((t) => {
      if (t.parameters) {
        for (const [key, param] of Object.entries(t.parameters)) {
          if (param && param.status === 'Flagged' && parameterFlagCounts[key] !== undefined) {
            parameterFlagCounts[key]++;
          }
        }
      }
    });

    const parameterBreakdown = [
      { name: 'Glucose', count: parameterFlagCounts.glucose, code: 'GLU' },
      { name: 'Protein', count: parameterFlagCounts.protein, code: 'PRO' },
      { name: 'pH', count: parameterFlagCounts.ph, code: 'pH' },
      { name: 'Ketones', count: parameterFlagCounts.ketones, code: 'KET' },
      { name: 'Blood', count: parameterFlagCounts.blood, code: 'BLO' },
      { name: 'Bilirubin', count: parameterFlagCounts.bilirubin, code: 'BIL' },
      { name: 'Urobilinogen', count: parameterFlagCounts.urobilinogen, code: 'URO' },
      { name: 'Nitrite', count: parameterFlagCounts.nitrite, code: 'NIT' },
      { name: 'Leucocytes', count: parameterFlagCounts.leucocytes, code: 'LEU' },
      { name: 'Specific Gravity', count: parameterFlagCounts.specificGravity, code: 'SG' }
    ];

    // Status breakdown for pie chart
    const statusDistribution = [
      { name: 'Normal', value: normalTests, color: '#10b981' },
      { name: 'Flagged', value: flaggedTests, color: '#ef4444' }
    ];

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalTests,
        normalTests,
        flaggedTests,
        recentTests,
        parameterBreakdown,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('[Dashboard Stats Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics: ' + error.message
    });
  }
};
