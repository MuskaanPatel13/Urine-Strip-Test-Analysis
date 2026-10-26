const mongoose = require('mongoose');

const parameterItemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    name: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String, default: '' },
    normalRange: { type: String, default: '' },
    status: { type: String, enum: ['Normal', 'Flagged'], default: 'Normal' },
    description: { type: String, default: '' }
  },
  { _id: false }
);

const urineTestSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required']
    },
    patientId: {
      type: String,
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    conductedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    conductorName: {
      type: String,
      default: 'Hospital Staff'
    },
    testDate: {
      type: Date,
      default: Date.now
    },
    reactionWaitSeconds: {
      type: Number,
      default: 120 // KJS-HC-03 specified incubation period
    },
    analysisMode: {
      type: String,
      enum: ['Preset Simulation', 'Manual Entry', 'Optical Strip Image (Simulated Colorimetry)'],
      default: 'Optical Strip Image (Simulated Colorimetry)'
    },
    stripImage: {
      filename: { type: String, default: '' },
      originalName: { type: String, default: '' },
      url: { type: String, default: '' },
      mimetype: { type: String, default: '' },
      size: { type: Number, default: 0 },
      hasImage: { type: Boolean, default: false }
    },
    parameters: {
      glucose: { type: parameterItemSchema, required: true },
      protein: { type: parameterItemSchema, required: true },
      ph: { type: parameterItemSchema, required: true },
      ketones: { type: parameterItemSchema, required: true },
      blood: { type: parameterItemSchema, required: true },
      bilirubin: { type: parameterItemSchema, required: true },
      urobilinogen: { type: parameterItemSchema, required: true },
      nitrite: { type: parameterItemSchema, required: true },
      leucocytes: { type: parameterItemSchema, required: true },
      specificGravity: { type: parameterItemSchema, required: true }
    },
    overallStatus: {
      type: String,
      enum: ['Normal', 'Flagged'],
      default: 'Normal'
    },
    flagCount: {
      type: Number,
      default: 0
    },
    clinicalRemarks: {
      type: String,
      trim: true,
      default: ''
    },
    educationalNotice: {
      type: String,
      default:
        'DISCLAIMER: Developed for Mini-Project KJS-HC-03 (Point-of-Care Colorimetry Strip Reader). Values represent simulated / digital demo readings. All findings require clinical correlation by a registered medical practitioner.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('UrineTest', urineTestSchema);
