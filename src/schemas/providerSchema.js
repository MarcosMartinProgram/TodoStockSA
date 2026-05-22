const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  contacto: { type: String, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true },
  direccion: { type: String }
});

module.exports = mongoose.model('Proveedor', providerSchema);