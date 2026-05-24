// src/controllers/ComprobanteClienteController.js
const ComprobanteClienteManager = require('../models/ComprobanteClienteManager');
const ClientManager  = require('../models/ClientManager');
const ProductManager = require('../models/ProductManager');

class ComprobanteClienteController {
  constructor() {
    this.voucherManager = new ComprobanteClienteManager();
    this.clientManager  = new ClientManager();
    this.productManager = new ProductManager();
  }

  async getAll(req, res, next) {
    try {
      const comprobantes = await this.voucherManager.getAll();
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(comprobantes);
      }
      res.render('comprobantecliente/index', { title: 'Comprobantes', comprobantes });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const comprobante = await this.voucherManager.getById(req.params.id);
      if (!comprobante) return res.status(404).json({ error: `Comprobante con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(comprobante);
      }
      res.render('comprobantecliente/detail', { title: `Comprobante ${comprobante.numero}`, comprobante });
    } catch (error) { next(error); }
  }

  async showCreateForm(req, res, next) {
    try {
      const clientes = await this.clientManager.getAll();
      const productos = await this.productManager.getAll();
      // Si viene ?clienteId en la query, pre-seleccionar ese cliente
      const clienteIdPresel = req.query.clienteId || null;
      res.render('comprobantecliente/create', {
        title: 'Nuevo Comprobante',
        clientes,
        productos,
        clienteIdPresel
      });
    } catch (error) { next(error); }
  }

  parseItemsFromBody(body) {
    const productoIds = Array.isArray(body.productoId) ? body.productoId : [body.productoId];
    const cantidades = Array.isArray(body.cantidad) ? body.cantidad : [body.cantidad];

    return productoIds
      .map((productoId, index) => ({
        productoId: (productoId || '').trim(),
        cantidad: Number(cantidades[index])
      }))
      .filter(item => item.productoId && Number.isFinite(item.cantidad) && item.cantidad > 0);
  }

  async create(req, res, next) {
    try {
      const {
        clienteId,
        receptorTipo,
        receptorNombre,
        tipo,
        numero,
        fecha,
        descripcion,
        importe
      } = req.body;

      const items = this.parseItemsFromBody(req.body);
      const nuevoComprobante = await this.voucherManager.create({
        receptorTipo: receptorTipo || 'cliente',
        clienteId,
        receptorNombre,
        tipo,
        numero:      numero.trim(),
        fecha:       new Date(fecha),
        descripcion: descripcion ? descripcion.trim() : '',
        importe:     Number(importe),
        items
      });
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(201).json(nuevoComprobante);
      }

      if (nuevoComprobante.receptorTipo === 'cliente' && nuevoComprobante.clienteId) {
        return res.redirect(`/clientes/${nuevoComprobante.clienteId}`);
      }

      res.redirect('/comprobantes');
    } catch (error) { next(error); }
  }

  async showEditForm(req, res, next) {
    try {
      const comprobante = await this.voucherManager.getById(req.params.id);
      if (!comprobante) return res.status(404).render('error', { title: 'Error 404', statusCode: 404, message: 'Comprobante no encontrado.' });
      const clientes = await this.clientManager.getAll();
      res.render('comprobantecliente/edit', { title: 'Editar Comprobante', comprobante, clientes });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const { tipo, numero, fecha, descripcion, importe } = req.body;
      const updateData = {};
      if (tipo        !== undefined) updateData.tipo        = tipo;
      if (numero      !== undefined) updateData.numero      = numero.trim();
      if (fecha       !== undefined) updateData.fecha       = new Date(fecha);
      if (descripcion !== undefined) updateData.descripcion = descripcion.trim();
      if (importe     !== undefined) updateData.importe     = Number(importe);

      const actualizado = await this.voucherManager.update(req.params.id, updateData);
      if (!actualizado) return res.status(404).json({ error: `Comprobante con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(actualizado);
      }
      res.redirect('/comprobantes');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const eliminado = await this.voucherManager.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ error: `Comprobante con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ mensaje: 'Comprobante eliminado correctamente.', comprobante: eliminado });
      }
      res.redirect('/comprobantes');
    } catch (error) { next(error); }
  }
}

module.exports = ComprobanteClienteController;
