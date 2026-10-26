const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: [true, 'Patient ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Patient age is required'],
      min: 0,
      max: 125
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other']
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown'
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    medicalHistory: {
      type: String,
      trim: true,
      default: 'None reported'
    },
    referringDoctor: {
      type: String,
      default: 'Dr. R. Sharma (OPD-2)'
    },
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for test count
patientSchema.virtual('tests', {
  ref: 'UrineTest',
  localField: '_id',
  foreignField: 'patient'
});

patientSchema.set('toObject', { virtuals: true });
patientSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);
