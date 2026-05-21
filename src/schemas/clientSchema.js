// src/schemas/clientSchema.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    nombre:        { type: String, required: true },
    cuit:          { type: String, required: true, unique: true },
    email:         { type: String, required: true },
    telefono:      { type: String },
    direccion:     { type: String },
    condicionIva:  {
      type: String,
      enum: ['responsable_inscripto', 'monotributista', 'consumidor_final', 'exento'],
      default: 'consumidor_final'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cliente', clientSchema);
