// src/middlewares/validators.js
// Middlewares de validación para verificar datos obligatorios
// en las peticiones antes de llegar al controlador.

/**
 * Valida que los campos obligatorios de un producto estén presentes.
 * Campos requeridos: nombre, precio, stock, proveedorId.
 */
function validateProduct(req, res, next) {
  const { nombre, precio, stock, proveedorId } = req.body;
  const errors = [];

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    errors.push('El campo "nombre" es obligatorio y debe ser un texto.');
  }
  if (precio === undefined || precio === null || typeof precio !== 'number' || precio < 0) {
    errors.push('El campo "precio" es obligatorio y debe ser un número positivo.');
  }
  if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) {
    errors.push('El campo "stock" es obligatorio y debe ser un número positivo.');
  }
  if (!proveedorId || typeof proveedorId !== 'number') {
    errors.push('El campo "proveedorId" es obligatorio y debe ser un número.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
  }

  next();
}

/**
 * Valida que los campos obligatorios de un proveedor estén presentes.
 * Campos requeridos: nombre, contacto, telefono, email.
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
 * Valida que el parámetro :id sea un número entero válido.
 */
function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El ID proporcionado no es válido. Debe ser un número entero positivo.' });
  }

  // Convierte a número para uso posterior en controladores
  req.params.id = id;
  next();
}

module.exports = { validateProduct, validateProvider, validateId };
