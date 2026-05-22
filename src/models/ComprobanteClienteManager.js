// src/models/ComprobanteClienteManager.js
const Comprobante       = require('../schemas/comprobanteClienteSchema');
const MovimientoCuenta  = require('../schemas/ccorrienteClienteSchema');
const Producto          = require('../schemas/productSchema');
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

  async buildItems(items = []) {
    if (!Array.isArray(items) || items.length === 0) {
      return [];
    }

    const normalized = [];

    for (const item of items) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) {
        const error = new Error(`El producto con ID ${item.productoId} no existe.`);
        error.statusCode = 400;
        throw error;
      }

      const cantidad = Number(item.cantidad);
      if (!Number.isFinite(cantidad) || cantidad <= 0) {
        const error = new Error(`Cantidad inválida para el producto ${producto.nombre}.`);
        error.statusCode = 400;
        throw error;
      }

      if (producto.stock < cantidad) {
        const error = new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}.`);
        error.statusCode = 400;
        throw error;
      }

      const precioUnitario = Number(producto.precio);
      const subtotal = Number((precioUnitario * cantidad).toFixed(2));

      normalized.push({
        productoId: producto._id,
        productoNombre: producto.nombre,
        cantidad,
        precioUnitario,
        subtotal
      });
    }

    return normalized;
  }

  async descontarStock(items = []) {
    for (const item of items) {
      await Producto.findByIdAndUpdate(item.productoId, {
        $inc: { stock: -item.cantidad }
      });
    }
  }

  /**
   * Crea el comprobante y genera automáticamente el movimiento en cuenta corriente.
   * - factura / nota_debito → DÉBITO (el cliente nos debe más)
   * - nota_credito          → CRÉDITO (el cliente nos debe menos)
   */
  async create(voucherData) {
    const receptorTipo = voucherData.receptorTipo || 'cliente';
    let client = null;

    if (receptorTipo === 'cliente') {
      client = await this.clientManager.getById(voucherData.clienteId);
      if (!client) {
        const error = new Error(`El cliente con ID ${voucherData.clienteId} no existe.`);
        error.statusCode = 400;
        throw error;
      }
    }

    const items = await this.buildItems(voucherData.items);
    const importeCalculado = Number(items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2));
    const importeFinal = items.length > 0
      ? importeCalculado
      : Number(voucherData.importe);

    if (!Number.isFinite(importeFinal) || importeFinal <= 0) {
      const error = new Error('El importe del comprobante debe ser mayor a 0.');
      error.statusCode = 400;
      throw error;
    }

    const receiverName = receptorTipo === 'consumidor_final'
      ? (voucherData.receptorNombre || 'Consumidor Final')
      : client.nombre;

    const newVoucher = new Comprobante({
      receptorTipo,
      clienteId: receptorTipo === 'cliente' ? voucherData.clienteId : undefined,
      receptorNombre: receiverName,
      tipo: voucherData.tipo,
      numero: voucherData.numero,
      fecha: voucherData.fecha,
      descripcion: voucherData.descripcion,
      importe: importeFinal,
      items
    });
    await newVoucher.save();

    if (newVoucher.tipo === 'factura' && items.length > 0) {
      await this.descontarStock(items);
    }

    // Determinar tipo de movimiento según el tipo de comprobante
    const tipoMovimiento =
      voucherData.tipo === 'nota_credito' ? 'credito' : 'debito';

    const tipoLabel = {
      factura:      'Factura',
      nota_credito: 'Nota de Crédito',
      nota_debito:  'Nota de Débito'
    };

    if (receptorTipo === 'cliente') {
      const movimiento = new MovimientoCuenta({
        clienteId:    voucherData.clienteId,
        fecha:        voucherData.fecha,
        tipo:         tipoMovimiento,
        concepto:     `${tipoLabel[voucherData.tipo]} Nro. ${voucherData.numero}${voucherData.descripcion ? ' - ' + voucherData.descripcion : ''}`,
        importe:      importeFinal,
        origenModelo: 'Comprobante',
        origenId:     newVoucher._id
      });
      await movimiento.save();
    }

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
