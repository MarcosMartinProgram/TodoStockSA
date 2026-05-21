// src/controllers/PaymentController.js
const PaymentManager = require('../models/PaymentManager');
const ClientManager  = require('../models/ClientManager');

class PaymentController {
  constructor() {
    this.paymentManager = new PaymentManager();
    this.clientManager  = new ClientManager();
  }

  async getAll(req, res, next) {
    try {
      const pagos = await this.paymentManager.getAll();
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(pagos);
      }
      res.render('payments/index', { title: 'Pagos', pagos });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const pago = await this.paymentManager.getById(req.params.id);
      if (!pago) return res.status(404).json({ error: `Pago con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(pago);
      }
      res.render('payments/detail', { title: 'Detalle de Pago', pago });
    } catch (error) { next(error); }
  }

  async showCreateForm(req, res, next) {
    try {
      const clientes = await this.clientManager.getAll();
      const clienteIdPresel = req.query.clienteId || null;
      res.render('payments/create', { title: 'Registrar Pago', clientes, clienteIdPresel });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const { clienteId, fecha, importe, medioPago, observaciones } = req.body;
      const nuevoPago = await this.paymentManager.create({
        clienteId,
        fecha:         new Date(fecha),
        importe:       Number(importe),
        medioPago,
        observaciones: observaciones ? observaciones.trim() : ''
      });
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(201).json(nuevoPago);
      }
      res.redirect(`/clientes/${clienteId}`);
    } catch (error) { next(error); }
  }

  async showEditForm(req, res, next) {
    try {
      const pago = await this.paymentManager.getById(req.params.id);
      if (!pago) return res.status(404).render('error', { title: 'Error 404', statusCode: 404, message: 'Pago no encontrado.' });
      const clientes = await this.clientManager.getAll();
      res.render('payments/edit', { title: 'Editar Pago', pago, clientes });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const { fecha, importe, medioPago, observaciones } = req.body;
      const updateData = {};
      if (fecha         !== undefined) updateData.fecha         = new Date(fecha);
      if (importe       !== undefined) updateData.importe       = Number(importe);
      if (medioPago     !== undefined) updateData.medioPago     = medioPago;
      if (observaciones !== undefined) updateData.observaciones = observaciones.trim();

      const actualizado = await this.paymentManager.update(req.params.id, updateData);
      if (!actualizado) return res.status(404).json({ error: `Pago con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(actualizado);
      }
      res.redirect('/pagos');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const eliminado = await this.paymentManager.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ error: `Pago con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ mensaje: 'Pago eliminado correctamente.', pago: eliminado });
      }
      res.redirect('/pagos');
    } catch (error) { next(error); }
  }
}

module.exports = PaymentController;
