// src/controllers/ProviderController.js
// Controlador de Proveedores - Clase que gestiona las peticiones HTTP
// y delega la lógica de negocio al modelo ProviderManager.

const ProviderManager = require('../models/ProviderManager');
const ProductManager = require('../models/ProductManager');

class ProviderController {
  constructor() {
    this.providerManager = new ProviderManager();
    this.productManager = new ProductManager();
  }

  /**
   * GET /proveedores
   * Lista todos los proveedores.
   */
  async getAll(req, res, next) {
    try {
      const proveedores = await this.providerManager.getAll();

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(proveedores);
      }

      res.render('providers/index', { title: 'Proveedores', proveedores });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /proveedores/:id
   * Obtiene un proveedor por ID.
   */
  async getById(req, res, next) {
    try {
      const proveedor = await this.providerManager.getById(req.params.id);

      if (!proveedor) {
        return res.status(404).json({ error: `Proveedor con ID ${req.params.id} no encontrado.` });
      }

      // Incluye los productos asociados al proveedor
      const productosAsociados = await this.productManager.getByProviderId(req.params.id);

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ ...proveedor, productos: productosAsociados });
      }

      res.render('providers/detail', {
        title: proveedor.nombre,
        proveedor,
        productosAsociados
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /proveedores/crear
   * Muestra el formulario de creación de proveedor.
   */
  async showCreateForm(req, res, next) {
    try {
      res.render('providers/create', { title: 'Nuevo Proveedor' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /proveedores
   * Crea un nuevo proveedor.
   */
  async create(req, res, next) {
    try {
      const { nombre, contacto, telefono, email, direccion } = req.body;

      const nuevoProveedor = await this.providerManager.create({
        nombre: nombre.trim(),
        contacto: contacto.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        direccion: direccion ? direccion.trim() : ''
      });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(201).json(nuevoProveedor);
      }

      res.redirect('/proveedores');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /proveedores/:id/editar
   * Muestra el formulario de edición de proveedor.
   */
  async showEditForm(req, res, next) {
    try {
      const proveedor = await this.providerManager.getById(req.params.id);
      if (!proveedor) {
        return res.status(404).render('error', {
          title: 'Error 404',
          statusCode: 404,
          message: 'Proveedor no encontrado.'
        });
      }

      res.render('providers/edit', { title: 'Editar Proveedor', proveedor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /proveedores/:id
   * Actualiza un proveedor existente.
   */
  async update(req, res, next) {
    try {
      const { nombre, contacto, telefono, email, direccion } = req.body;

      const updateData = {};
      if (nombre !== undefined) updateData.nombre = nombre.trim();
      if (contacto !== undefined) updateData.contacto = contacto.trim();
      if (telefono !== undefined) updateData.telefono = telefono.trim();
      if (email !== undefined) updateData.email = email.trim();
      if (direccion !== undefined) updateData.direccion = direccion.trim();

      const actualizado = await this.providerManager.update(req.params.id, updateData);

      if (!actualizado) {
        return res.status(404).json({ error: `Proveedor con ID ${req.params.id} no encontrado.` });
      }

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(actualizado);
      }

      res.redirect('/proveedores');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /proveedores/:id
   * Elimina un proveedor. Impide la eliminación si tiene productos asociados.
   */
  async delete(req, res, next) {
    try {
      // Validación de dependencias: verificar productos asociados
      const productosAsociados = await this.productManager.getByProviderId(req.params.id);

      if (productosAsociados.length > 0) {
        const error = new Error(
          `No se puede eliminar el proveedor. Tiene ${productosAsociados.length} producto(s) asociado(s).`
        );
        error.statusCode = 400;
        throw error;
      }

      const eliminado = await this.providerManager.delete(req.params.id);

      if (!eliminado) {
        return res.status(404).json({ error: `Proveedor con ID ${req.params.id} no encontrado.` });
      }

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ mensaje: 'Proveedor eliminado correctamente.', proveedor: eliminado });
      }

      res.redirect('/proveedores');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProviderController;
