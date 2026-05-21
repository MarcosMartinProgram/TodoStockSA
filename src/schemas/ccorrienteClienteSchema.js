// src/schemas/accountSchema.js
// Representa cada movimiento de la cuenta corriente de un cliente.
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    clienteId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    fecha:          { type: Date, required: true },
    // debito  = el cliente nos debe más (facturas, notas de débito)
    // credito = el cliente nos debe menos (pagos, notas de crédito)
    tipo:           { type: String, required: true, enum: ['debito', 'credito'] },
    concepto:       { type: String, required: true },
    importe:        { type: Number, required: true, min: 0.01 },
    // Referencia polimórfica al documento origen
    origenModelo:   { type: String, required: true, enum: ['Comprobante', 'Pago'] },
    origenId:       { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'origenModelo' }
  },
  { timestamps: true }
);

// Índice para acelerar consultas por cliente ordenadas por fecha
accountSchema.index({ clienteId: 1, fecha: 1 });

module.exports = mongoose.model('MovimientoCuenta', accountSchema);
