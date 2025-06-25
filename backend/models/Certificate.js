const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  internshipTopic: {
    type: String,
    required: true
  },
  guideName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  issuerName: {
    type: String,
    required: true
  },
  issuerDesignation: {
    type: String,
    required: true
  },
  qrCodeData: {
    type: String,
    required: true
  },
  verificationUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);