// src/middlewares/validators.js
// Middlewares de validación para verificar datos obligatorios
// en las peticiones antes de llegar al controlador.

const mongoose = require('mongoose');

/**
 * Valida que el parámetro :id sea un ObjectId válido de MongoDB.
 * CORREGIDO: antes validaba como número entero (era para persistencia JSON).
 */
function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'El ID proporcionado no es válido.'
    });
  }
  next();
}

/**
 * Valida campos obligatorios de un producto.
 * CORREGIDO: proveedorId ahora se valida como ObjectId (no como número).
 */
function validateProduct(req, res, next) {
  const { nombre, precio, stock, proveedorId } = req.body;
  const errors = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('El campo "nombre" es obligatorio y debe ser un texto.');
  }
  if (precio === undefined || precio === null || isNaN(Number(precio)) || Number(precio) < 0) {
    errors.push('El campo "precio" es obligatorio y debe ser un número positivo.');
  }
  if (stock === undefined || stock === null || isNaN(Number(stock)) || Number(stock) < 0) {
    errors.push('El campo "stock" es obligatorio y debe ser un número positivo.');
  }
  if (!proveedorId || !mongoose.Types.ObjectId.isValid(proveedorId)) {
    errors.push('El campo "proveedorId" es obligatorio y debe ser un ID válido.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
  }
  next();
}

/**
 * Valida campos obligatorios de un proveedor.
 */
function validateProvider(req, res, next) {
  const { nombre, contacto, telefono, email } = req.body;
  const errors = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('El campo "nombre" es obligatorio y debe ser un texto.');
  }
  if (!contacto || typeof contacto !== 'string' || contacto.trim() === '') {
    errors.push('El campo "contacto" es obligatorio y debe ser un texto.');
  }
  if (!telefono || typeof telefono !== 'string' || telefono.trim() === '') {
    errors.push('El campo "telefono" es obligatorio y debe ser un texto.');
  }
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('El campo "email" es obligatorio y debe ser un texto.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
  }
  next();
}

/**
 * Valida campos obligatorios de un cliente.
 */
function validateClient(req, res, next) {
  const { nombre, cuit, email } = req.body;
  const errors = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('El campo "nombre" es obligatorio y debe ser un texto.');
  }
  if (!cuit || typeof cuit !== 'string' || cuit.trim() === '') {
    errors.push('El campo "cuit" es obligatorio.');
  }
  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push('El campo "email" es obligatorio.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
  }
  next();
}

/**
 * Valida campos obligatorios de un comprobante.
 */
function validateVoucher(req, res, next) {
  const { clienteId, tipo, numero, fecha, importe } = req.body;
  const errors = [];

  if (!clienteId || !mongoose.Types.ObjectId.isValid(clienteId)) {
    errors.push('El campo "clienteId" es obligatorio y debe ser un ID válido.');
  }

  const tiposValidos = ['factura', 'nota_credito', 'nota_debito'];
  if (!tipo || !tiposValidos.includes(tipo)) {
    errors.push('El campo "tipo" debe ser: factura, nota_credito o nota_debito.');
  }
  if (!numero || typeof numero !== 'string' || numero.trim() === '') {
    errors.push('El campo "numero" es obligatorio.');
  }
  if (!fecha) {
    errors.push('El campo "fecha" es obligatorio.');
  }
  if (importe === undefined || importe === null || isNaN(Number(importe)) || Number(importe) <= 0) {
    errors.push('El campo "importe" es obligatorio y debe ser mayor a 0.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
  }
  next();
}

/**
 * Valida campos obligatorios de un pago.
 */
function validatePayment(req, res, next) {
  const { clienteId, fecha, importe, medioPago } = req.body;
  const errors = [];

  if (!clienteId || !mongoose.Types.ObjectId.isValid(clienteId)) {
    errors.push('El campo "clienteId" es obligatorio y debe ser un ID válido.');
  }
  if (!fecha) {
    errors.push('El campo "fecha" es obligatorio.');
  }
  if (importe === undefined || importe === null || isNaN(Number(importe)) || Number(importe) <= 0) {
    errors.push('El campo "importe" es obligatorio y debe ser mayor a 0.');
  }
  if (!medioPago || typeof medioPago !== 'string' || medioPago.trim() === '') {
    errors.push('El campo "medioPago" es obligatorio.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
  }
  next();
}

module.exports = {
  validateId,
  validateProduct,
  validateProvider,
  validateClient,
  validateVoucher,
  validatePayment
};
