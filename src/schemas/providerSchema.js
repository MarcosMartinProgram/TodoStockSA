const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  contacto: {
    type: String,
    required: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Provider', providerSchema);