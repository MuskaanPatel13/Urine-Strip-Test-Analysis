const Patient = require('../models/Patient');
const UrineTest = require('../models/UrineTest');

// Helper to generate next unique patient ID like PAT-1001
const generatePatientId = async () => {
  const count = await Patient.countDocuments();
  const nextNumber = 1001 + count;
  let candidate = `PAT-${nextNumber}`;
  // Ensure uniqueness
  while (await Patient.findOne({ patientId: candidate })) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    candidate = `PAT-${rand}`;
  }
  return candidate;
};

// @desc    Register a new patient
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, email, address, bloodGroup, medicalHistory, referringDoctor, patientId } = req.body;

    if (!name || age === undefined || !gender || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Name, age, gender, and contact are required fields.'
      });
    }

    let finalPatientId = patientId ? patientId.trim().toUpperCase() : await generatePatientId();

    const existing = await Patient.findOne({ patientId: finalPatientId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Patient ID ${finalPatientId} already exists. Please choose a different ID.`
      });
    }

    const patient = await Patient.create({
      patientId: finalPatientId,
      name,
      age: Number(age),
      gender,
      contact,
      email: email || '',
      address: address || '',
      bloodGroup: bloodGroup || 'Unknown',
      medicalHistory: medicalHistory || 'None reported',
      referringDoctor: referringDoctor || 'Dr. R. Sharma (OPD-2)',
      registeredBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      data: patient,
      message: 'Patient registered successfully.'
    });
  } catch (error) {
    console.error('[Create Patient Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient: ' + error.message
    });
  }
};

// @desc    Get all patients with search filter
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query = {
        $or: [{ name: searchRegex }, { patientId: searchRegex }, { contact: searchRegex }]
      };
    }

    const patients = await Patient.find(query).sort({ createdAt: -1 });

    // Also get test count for each patient
    const patientsWithCounts = await Promise.all(
      patients.map(async (p) => {
        const testCount = await UrineTest.countDocuments({ patient: p._id });
        return {
          ...p.toObject(),
          testCount
        };
      })
    );

    res.json({
      success: true,
      count: patientsWithCounts.length,
      data: patientsWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients: ' + error.message
    });
  }
};

// @desc    Get single patient details by ID with previous test records
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found.'
      });
    }

    const tests = await UrineTest.find({ patient: patient._id }).sort({ testDate: -1 });

    res.json({
      success: true,
      data: {
        patient,
        tests
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient profile: ' + error.message
    });
  }
};

// @desc    Update patient information
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found.'
      });
    }

    const { name, age, gender, contact, email, address, bloodGroup, medicalHistory, referringDoctor } = req.body;

    if (name) patient.name = name;
    if (age !== undefined) patient.age = Number(age);
    if (gender) patient.gender = gender;
    if (contact) patient.contact = contact;
    if (email !== undefined) patient.email = email;
    if (address !== undefined) patient.address = address;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;
    if (referringDoctor !== undefined) patient.referringDoctor = referringDoctor;

    const updatedPatient = await patient.save();

    // If name changed, update patientName in associated urine tests as well
    if (name) {
      await UrineTest.updateMany({ patient: patient._id }, { patientName: name });
    }

    res.json({
      success: true,
      data: updatedPatient,
      message: 'Patient profile updated successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update patient: ' + error.message
    });
  }
};

// @desc    Delete patient and associated tests
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found.'
      });
    }

    // Delete associated test records
    const deleteResult = await UrineTest.deleteMany({ patient: patient._id });
    await Patient.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Patient and ${deleteResult.deletedCount} associated urine test record(s) deleted.`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient: ' + error.message
    });
  }
};
