// src/models/PaymentManager.js
const Pago             = require('../schemas/paymentSchema');
const MovimientoCuenta = require('../schemas/accountSchema');
const ClientManager    = require('./ClientManager');

class PaymentManager {
  constructor() {
    this.clientManager = new ClientManager();
  }

  async getAll() {
    return await Pago.find().populate('clienteId').sort({ fecha: -1 });
  }

  async getByClientId(clienteId) {
    return await Pago.find({ clienteId }).sort({ fecha: -1 });
  }

  async getById(id) {
    return await Pago.findById(id).populate('clienteId');
  }

  /**
   * Crea el pago y genera automáticamente el movimiento en cuenta corriente.
   * Los pagos siempre son CRÉDITO (reducen la deuda del cliente).
   */
  async create(paymentData) {
    const client = await this.clientManager.getById(paymentData.clienteId);
    if (!client) {
      const error = new Error(`El cliente con ID ${paymentData.clienteId} no existe.`);
      error.statusCode = 400;
      throw error;
    }

    const newPayment = new Pago(paymentData);
    await newPayment.save();

    const medioPagoLabel = {
      efectivo:      'Efectivo',
      transferencia: 'Transferencia',
      cheque:        'Cheque',
      tarjeta:       'Tarjeta',
      otro:          'Otro'
    };

    const movimiento = new MovimientoCuenta({
      clienteId:    paymentData.clienteId,
      fecha:        paymentData.fecha,
      tipo:         'credito',
      concepto:     `Pago - ${medioPagoLabel[paymentData.medioPago]}${paymentData.observaciones ? ' - ' + paymentData.observaciones : ''}`,
      importe:      paymentData.importe,
      origenModelo: 'Pago',
      origenId:     newPayment._id
    });
    await movimiento.save();

    return newPayment;
  }

  async update(id, paymentData) {
    return await Pago.findByIdAndUpdate(id, paymentData, { returnDocument: 'after' });
  }

  /**
   * Elimina el pago y su movimiento en cuenta corriente asociado.
   */
  async delete(id) {
    const deleted = await Pago.findByIdAndDelete(id);
    if (deleted) {
      await MovimientoCuenta.deleteOne({ origenId: id, origenModelo: 'Pago' });
    }
    return deleted;
  }
}

module.exports = PaymentManager;
