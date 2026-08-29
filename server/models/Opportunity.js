const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  requirements: [{
    type: String,
    required: [true, 'At least one requirement is required']
  }],
  skills: [{
    type: String,
    required: [true, 'At least one skill is required']
  }],
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  type: {
    type: String,
    enum: ['attachment', 'internship', 'both'],
    default: 'attachment'
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Company is required']
  },
  applications: [{
    student: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'accepted', 'rejected'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    coverLetter: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
opportunitySchema.index({ title: 'text', description: 'text', skills: 'text' });

// Update the updatedAt field before saving
opportunitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
