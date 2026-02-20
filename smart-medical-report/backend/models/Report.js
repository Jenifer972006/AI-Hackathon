const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  sessionId: { type: String },
  reportType: { type: String, enum: ['digital', 'handwritten'], default: 'digital' },
  originalFileName: { type: String },
  fileType: { type: String },
  extractedText: { type: String },
  language: { type: String, default: 'English' },

  // Report 1: Disease Analysis
  diseaseAnalysis: {
    diagnosedConditions: [String],
    causes: { type: String },
    earlySymptoms: { type: String },
    stages: { type: String },
    futureSymptoms: { type: String },
    prevention: { type: String },
    whatToEat: { type: String },
    whatToAvoid: { type: String },
    howToCure: { type: String },
    healthyLifestyle: { type: String }
  },

  // Report 2: Medication Analysis
  medicationAnalysis: {
    medications: [{
      name: String,
      whyGiven: String,
      benefits: String,
      dosage: String,
      timing: String,
      beforeOrAfterFood: String
    }]
  },

  // Translated versions
  translatedReports: {
    type: Map,
    of: {
      report1: String,
      report2: String
    }
  },

  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'processing' },
  error: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
