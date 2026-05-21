// src/controllers/ClientController.js
const ClientManager  = require('../models/ClientManager');
const CcorrienteClienteManager = require('../models/CcorrienteClienteManager');

class ClientController {
  constructor() {
    this.clientManager  = new ClientManager();
    this.accountManager = new CcorrienteClienteManager();
  }

  async getAll(req, res, next) {
    try {
      const clientes = await this.clientManager.getAll();
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(clientes);
      }
      res.render('clients/index', { title: 'Clientes', clientes });
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const cliente = await this.clientManager.getById(req.params.id);
      if (!cliente) return res.status(404).json({ error: `Cliente con ID ${req.params.id} no encontrado.` });

      const saldo = await this.accountManager.getSaldoByClientId(req.params.id);

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ ...cliente.toObject(), saldo });
      }
      res.render('clients/detail', { title: cliente.nombre, cliente, saldo });
    } catch (error) { next(error); }
  }

  async showCreateForm(req, res, next) {
    try {
      res.render('clients/create', { title: 'Nuevo Cliente' });
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const { nombre, cuit, email, telefono, direccion, condicionIva } = req.body;
      const nuevoCliente = await this.clientManager.create({
        nombre:       nombre.trim(),
        cuit:         cuit.trim(),
        email:        email.trim(),
        telefono:     telefono     ? telefono.trim()    : '',
        direccion:    direccion    ? direccion.trim()   : '',
        condicionIva: condicionIva || 'consumidor_final'
      });
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(201).json(nuevoCliente);
      }
      res.redirect('/clientes');
    } catch (error) { next(error); }
  }

  async showEditForm(req, res, next) {
    try {
      const cliente = await this.clientManager.getById(req.params.id);
      if (!cliente) return res.status(404).render('error', { title: 'Error 404', statusCode: 404, message: 'Cliente no encontrado.' });
      res.render('clients/edit', { title: 'Editar Cliente', cliente });
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const { nombre, cuit, email, telefono, direccion, condicionIva } = req.body;
      const updateData = {};
      if (nombre       !== undefined) updateData.nombre       = nombre.trim();
      if (cuit         !== undefined) updateData.cuit         = cuit.trim();
      if (email        !== undefined) updateData.email        = email.trim();
      if (telefono     !== undefined) updateData.telefono     = telefono.trim();
      if (direccion    !== undefined) updateData.direccion    = direccion.trim();
      if (condicionIva !== undefined) updateData.condicionIva = condicionIva;

      const actualizado = await this.clientManager.update(req.params.id, updateData);
      if (!actualizado) return res.status(404).json({ error: `Cliente con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(actualizado);
      }
      res.redirect('/clientes');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const eliminado = await this.clientManager.delete(req.params.id);
      if (!eliminado) return res.status(404).json({ error: `Cliente con ID ${req.params.id} no encontrado.` });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ mensaje: 'Cliente eliminado correctamente.', cliente: eliminado });
      }
      res.redirect('/clientes');
    } catch (error) { next(error); }
  }
}

module.exports = ClientController;
