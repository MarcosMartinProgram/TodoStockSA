// src/models/ComprobanteClienteManager.js
const Comprobante       = require('../schemas/comprobanteClienteSchema');
const MovimientoCuenta  = require('../schemas/ccorrienteClienteSchema');
const ClientManager     = require('./ClientManager');

class ComprobanteClienteManager {
  constructor() {
    this.clientManager = new ClientManager();
  }

  async getAll() {
    return await Comprobante.find().populate('clienteId').sort({ fecha: -1 });
  }

  async getByClientId(clienteId) {
    return await Comprobante.find({ clienteId }).sort({ fecha: -1 });
  }

  async getById(id) {
    return await Comprobante.findById(id).populate('clienteId');
  }

  /**
   * Crea el comprobante y genera automáticamente el movimiento en cuenta corriente.
   * - factura / nota_debito → DÉBITO (el cliente nos debe más)
   * - nota_credito          → CRÉDITO (el cliente nos debe menos)
   */
  async create(voucherData) {
    const client = await this.clientManager.getById(voucherData.clienteId);
    if (!client) {
      const error = new Error(`El cliente con ID ${voucherData.clienteId} no existe.`);
      error.statusCode = 400;
      throw error;
    }

    const newVoucher = new Comprobante(voucherData);
    await newVoucher.save();

    // Determinar tipo de movimiento según el tipo de comprobante
    const tipoMovimiento =
      voucherData.tipo === 'nota_credito' ? 'credito' : 'debito';

    const tipoLabel = {
      factura:      'Factura',
      nota_credito: 'Nota de Crédito',
      nota_debito:  'Nota de Débito'
    };

    const movimiento = new MovimientoCuenta({
      clienteId:    voucherData.clienteId,
      fecha:        voucherData.fecha,
      tipo:         tipoMovimiento,
      concepto:     `${tipoLabel[voucherData.tipo]} Nro. ${voucherData.numero}${voucherData.descripcion ? ' - ' + voucherData.descripcion : ''}`,
      importe:      voucherData.importe,
      origenModelo: 'Comprobante',
      origenId:     newVoucher._id
    });
    await movimiento.save();

    return newVoucher;
  }

  async update(id, voucherData) {
    return await Comprobante.findByIdAndUpdate(id, voucherData, { returnDocument: 'after' });
  }

  /**
   * Elimina el comprobante y su movimiento en cuenta corriente asociado.
   */
  async delete(id) {
    const deleted = await Comprobante.findByIdAndDelete(id);
    if (deleted) {
      await MovimientoCuenta.deleteOne({ origenId: id, origenModelo: 'Comprobante' });
    }
    return deleted;
  }
}

module.exports = ComprobanteClienteManager;
