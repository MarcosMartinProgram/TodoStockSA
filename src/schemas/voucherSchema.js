// src/schemas/voucherSchema.js
const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    clienteId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    tipo:        {
      type: String,
      required: true,
      enum: ['factura', 'nota_credito', 'nota_debito']
    },
    numero:      { type: String, required: true },
    fecha:       { type: Date, required: true },
    descripcion: { type: String },
    importe:     { type: Number, required: true, min: 0.01 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comprobante', voucherSchema);
