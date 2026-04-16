// src/controllers/ProductController.js
// Controlador de Productos - Clase que gestiona las peticiones HTTP
// y delega la lógica de negocio al modelo ProductManager.

const ProductManager = require('../models/ProductManager');

class ProductController {
  constructor() {
    this.productManager = new ProductManager();
  }

  /**
   * GET /productos
   * Lista todos los productos con datos del proveedor.
   * Soporta respuesta JSON y vista HTML.
   */
  async getAll(req, res, next) {
    try {
      const productos = await this.productManager.getAllWithProvider();

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(productos);
      }

      res.render('products/index', { title: 'Productos', productos });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /productos/:id
   * Obtiene un producto por ID con datos del proveedor.
   */
  async getById(req, res, next) {
    try {
      const producto = await this.productManager.getByIdWithProvider(req.params.id);

      if (!producto) {
        return res.status(404).json({ error: `Producto con ID ${req.params.id} no encontrado.` });
      }

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(producto);
      }

      res.render('products/detail', { title: producto.nombre, producto });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /productos/crear
   * Muestra el formulario de creación de producto.
   */
  async showCreateForm(req, res, next) {
    try {
      const proveedores = await this.productManager.providerManager.getAll();
      res.render('products/create', { title: 'Nuevo Producto', proveedores });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /productos
   * Crea un nuevo producto. Valida que el proveedor exista.
   */
  async create(req, res, next) {
    try {
      const { nombre, descripcion, precio, stock, proveedorId } = req.body;

      const nuevoProducto = await this.productManager.create({
        nombre: nombre.trim(),
        descripcion: descripcion ? descripcion.trim() : '',
        precio,
        stock,
        proveedorId
      });

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(201).json(nuevoProducto);
      }

      res.redirect('/productos');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /productos/:id/editar
   * Muestra el formulario de edición de producto.
   */
  async showEditForm(req, res, next) {
    try {
      const producto = await this.productManager.getById(req.params.id);
      if (!producto) {
        return res.status(404).render('error', {
          title: 'Error 404',
          statusCode: 404,
          message: 'Producto no encontrado.'
        });
      }

      const proveedores = await this.productManager.providerManager.getAll();
      res.render('products/edit', { title: 'Editar Producto', producto, proveedores });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /productos/:id
   * Actualiza un producto existente.
   */
  async update(req, res, next) {
    try {
      const { nombre, descripcion, precio, stock, proveedorId } = req.body;

      const updateData = {};
      if (nombre !== undefined) updateData.nombre = nombre.trim();
      if (descripcion !== undefined) updateData.descripcion = descripcion.trim();
      if (precio !== undefined) updateData.precio = precio;
      if (stock !== undefined) updateData.stock = stock;
      if (proveedorId !== undefined) updateData.proveedorId = proveedorId;

      const actualizado = await this.productManager.update(req.params.id, updateData);

      if (!actualizado) {
        return res.status(404).json({ error: `Producto con ID ${req.params.id} no encontrado.` });
      }

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json(actualizado);
      }

      res.redirect('/productos');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /productos/:id
   * Elimina un producto.
   */
  async delete(req, res, next) {
    try {
      const eliminado = await this.productManager.delete(req.params.id);

      if (!eliminado) {
        return res.status(404).json({ error: `Producto con ID ${req.params.id} no encontrado.` });
      }

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ mensaje: 'Producto eliminado correctamente.', producto: eliminado });
      }

      res.redirect('/productos');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
