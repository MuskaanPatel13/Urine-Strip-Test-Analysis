const User = require('../models/User');
const Patient = require('../models/Patient');
const UrineTest = require('../models/UrineTest');
const { evaluateParameters, SIMULATION_PRESETS } = require('./parameterReference');

const seedDatabase = async () => {
  try {
    // 1. Check or create default staff user
    let user = await User.findOne({ email: 'staff@hospital.edu' });
    if (!user) {
      user = await User.create({
        name: 'Dr. Nikhil (Biomedical Staff)',
        email: 'staff@hospital.edu',
        password: 'password123', // will be hashed automatically by pre-save
        staffRole: 'Lab Technician',
        department: 'Biomedical & Point-of-Care Testing (KJS-HC-03)',
        hospitalId: 'KJS-POC-LAB-01'
      });
      console.log('[Seeder] Default staff account created: staff@hospital.edu / password123');
    }

    // 2. Clear existing demo patients if none exist or if forced
    const patientCount = await Patient.countDocuments();
    if (patientCount === 0) {
      console.log('[Seeder] Seeding initial sample patients and clinical urine test records...');

      const samplePatients = [
        {
          patientId: 'PAT-1001',
          name: 'Aarav Sharma',
          age: 28,
          gender: 'Male',
          contact: '+91 98201 11223',
          email: 'aarav.sharma@example.com',
          bloodGroup: 'B+',
          address: 'Andheri West, Mumbai',
          medicalHistory: 'Annual preventive occupational health checkup. Non-smoker.',
          referringDoctor: 'Dr. S. Mehta (General Medicine)',
          registeredBy: user._id
        },
        {
          patientId: 'PAT-1002',
          name: 'Priya Patel',
          age: 34,
          gender: 'Female',
          contact: '+91 98199 44556',
          email: 'priya.patel@example.com',
          bloodGroup: 'O+',
          address: 'Borivali East, Mumbai',
          medicalHistory: 'Dysuria, increased urinary urgency and frequency for 48 hours.',
          referringDoctor: 'Dr. A. Kulkarni (Urology)',
          registeredBy: user._id
        },
        {
          patientId: 'PAT-1003',
          name: 'Ramesh Gupta',
          age: 58,
          gender: 'Male',
          contact: '+91 97690 77889',
          email: 'ramesh.gupta@example.com',
          bloodGroup: 'A+',
          address: 'Thane West, Maharashtra',
          medicalHistory: 'Type 2 Diabetes Mellitus x 8 years, hypertension, erratic glycaemic compliance.',
          referringDoctor: 'Dr. N. Roy (Endocrinology)',
          registeredBy: user._id
        },
        {
          patientId: 'PAT-1004',
          name: 'Sunita Verma',
          age: 49,
          gender: 'Female',
          contact: '+91 98210 33445',
          email: 'sunita.v@example.com',
          bloodGroup: 'AB+',
          address: 'Dadar, Mumbai',
          medicalHistory: 'Bilateral pedal edema, secondary membranous glomerulopathy follow-up.',
          referringDoctor: 'Dr. P. Deshmukh (Nephrology)',
          registeredBy: user._id
        },
        {
          patientId: 'PAT-1005',
          name: 'Kavita Nair',
          age: 52,
          gender: 'Female',
          contact: '+91 98330 99881',
          email: 'kavita.nair@example.com',
          bloodGroup: 'O-',
          address: 'Vashi, Navi Mumbai',
          medicalHistory: 'Icterus, right hypochondriac dull pain, pale stools, suspected choledocholithiasis.',
          referringDoctor: 'Dr. V. Iyer (Gastroenterology)',
          registeredBy: user._id
        }
      ];

      const insertedPatients = await Patient.insertMany(samplePatients);

      // Now create matching realistic Urine Tests
      const testDefs = [
        {
          patientIndex: 0,
          testId: 'URN-2026-0001',
          presetKey: 'NORMAL',
          remarks: 'All 10 parameters clear. Routine baseline within normal limits.',
          minutesAgo: 60 * 24 * 3 // 3 days ago
        },
        {
          patientIndex: 1,
          testId: 'URN-2026-0002',
          presetKey: 'UTI',
          remarks: 'Gram-negative bacterial pyuria detected. Positive Nitrite with 3+ Leucocytes. Advised antibiotic sensitivity test and urine culture.',
          minutesAgo: 60 * 24 * 2 // 2 days ago
        },
        {
          patientIndex: 2,
          testId: 'URN-2026-0003',
          presetKey: 'DIABETES',
          remarks: 'Pronounced glucosuria (3+) with moderate ketonuria (40 mg/dL). High risk of diabetic ketoacidosis. Urgent physician review advised.',
          minutesAgo: 60 * 24 * 1 // 1 day ago
        },
        {
          patientIndex: 3,
          testId: 'URN-2026-0004',
          presetKey: 'RENAL',
          remarks: 'Significant proteinuria (3+ 300 mg/dL) with microscopic hematuria. Consistent with glomerular barrier compromise.',
          minutesAgo: 60 * 8 // 8 hours ago
        },
        {
          patientIndex: 4,
          testId: 'URN-2026-0005',
          presetKey: 'HEPATIC',
          remarks: 'Gross bilirubinuria (3+) with marked urobilinogen (8.0 mg/dL). Indicative of obstructive post-hepatic cholestasis.',
          minutesAgo: 60 * 2 // 2 hours ago
        },
        {
          patientIndex: 0,
          testId: 'URN-2026-0006',
          presetKey: 'NORMAL',
          remarks: 'Repeat checkup after hydration. Completely unremarkable normal urinalysis.',
          minutesAgo: 30 // 30 minutes ago
        }
      ];

      for (const t of testDefs) {
        const patient = insertedPatients[t.patientIndex];
        const preset = SIMULATION_PRESETS[t.presetKey];
        const evaluated = evaluateParameters(preset.data);
        const testDate = new Date(Date.now() - t.minutesAgo * 60 * 1000);

        await UrineTest.create({
          testId: t.testId,
          patient: patient._id,
          patientId: patient.patientId,
          patientName: patient.name,
          conductedBy: user._id,
          conductorName: `${user.name} (${user.staffRole})`,
          testDate,
          reactionWaitSeconds: 120,
          analysisMode: 'Optical Strip Image (Simulated Colorimetry)',
          stripImage: {
            filename: 'demo-strip-sample.png',
            originalName: 'kjs-hc-03-test-strip.png',
            url: '',
            hasImage: false
          },
          parameters: evaluated.parameters,
          overallStatus: evaluated.overallStatus,
          flagCount: evaluated.flagCount,
          clinicalRemarks: t.remarks
        });
      }

      console.log('[Seeder] Seeded 5 demo patients and 6 urinalysis records successfully.');
    }
  } catch (err) {
    console.error('[Seeder Error]:', err.message);
  }
};

module.exports = seedDatabase;
