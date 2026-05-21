// src/schemas/productSchema.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre:      { type: String, required: true },
    descripcion: { type: String },
    precio:      { type: Number, required: true, min: 0 },
    stock:       { type: Number, required: true, min: 0 },
    proveedorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productSchema);
