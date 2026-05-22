// src/schemas/voucherSchema.js
const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
  {
    receptorTipo: {
      type: String,
      enum: ['cliente', 'consumidor_final'],
      default: 'cliente'
    },
    clienteId:   {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required() {
        return this.receptorTipo === 'cliente';
      }
    },
    receptorNombre: { type: String, default: '' },
    tipo:        {
      type: String,
      required: true,
      enum: ['factura', 'nota_credito', 'nota_debito']
    },
    numero:      { type: String, required: true },
    fecha:       { type: Date, required: true },
    descripcion: { type: String },
    importe:     { type: Number, required: true, min: 0.01 },
    items: [
      {
        productoId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
        productoNombre: { type: String, required: true },
        cantidad:       { type: Number, required: true, min: 1 },
        precioUnitario: { type: Number, required: true, min: 0 },
        subtotal:       { type: Number, required: true, min: 0 }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comprobante', voucherSchema);
