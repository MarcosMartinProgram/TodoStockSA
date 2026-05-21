// src/schemas/paymentSchema.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    clienteId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    fecha:        { type: Date, required: true },
    importe:      { type: Number, required: true, min: 0.01 },
    medioPago:    {
      type: String,
      required: true,
      enum: ['efectivo', 'transferencia', 'cheque', 'tarjeta', 'otro']
    },
    observaciones: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pago', paymentSchema);
