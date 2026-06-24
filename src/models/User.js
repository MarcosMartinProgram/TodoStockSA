const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  usuario: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  nombre: {
    type: String,
    required: true
  },

rol: {
  type: String,
  enum: ['ADMIN', 'VENTAS', 'COMPRAS'],
  default: 'VENTAS'
},  

  activo: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);