const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  company: String,
  status: { 
    type: String, 
    enum: ['lead', 'prospect', 'customer', 'inactive'],
    default: 'lead'
  },
  notes: [{ 
    text: String, 
    date: { type: Date, default: Date.now },
    author: String
  }],
  interactions: [{
    type: { type: String, enum: ['call', 'email', 'sms', 'meeting'] },
    date: { type: Date, default: Date.now },
    duration: Number, // in minutes
    summary: String,
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
    recording_url: String
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);
