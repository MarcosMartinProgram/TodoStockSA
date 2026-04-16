// src/models/ProductManager.js
// Modelo que gestiona la lógica de negocio de Productos.
// Interactúa con ProviderManager para validaciones cruzadas.

const FileSystemManager = require('../services/FileSystemManager');
const ProviderManager = require('./ProviderManager');

class ProductManager {
  constructor() {
    this.fileManager = new FileSystemManager('productos.json');
    this.providerManager = new ProviderManager();
  }

  /**
   * Obtiene todos los productos.
   * @returns {Promise<Array>} Lista de productos.
   */
  async getAll() {
    return await this.fileManager.readAll();
  }

  /**
   * Obtiene todos los productos con la información de su proveedor asociado.
   * @returns {Promise<Array>} Lista de productos enriquecidos con datos del proveedor.
   */
  async getAllWithProvider() {
    const [products, providers] = await Promise.all([
      this.getAll(),
      this.providerManager.getAll()
    ]);

    return products.map(product => {
      const proveedor = providers.find(p => p.id === product.proveedorId) || null;
      return { ...product, proveedor };
    });
  }

  /**
   * Busca un producto por su ID.
   * @param {number} id - ID del producto.
   * @returns {Promise<Object|null>} Producto encontrado o null.
   */
  async getById(id) {
    const products = await this.getAll();
    return products.find(p => p.id === id) || null;
  }

  /**
   * Busca un producto por ID e incluye datos del proveedor.
   * @param {number} id - ID del producto.
   * @returns {Promise<Object|null>} Producto con proveedor o null.
   */
  async getByIdWithProvider(id) {
    const product = await this.getById(id);
    if (!product) return null;

    const proveedor = await this.providerManager.getById(product.proveedorId);
    return { ...product, proveedor };
  }

  /**
   * Crea un nuevo producto. Valida que el proveedor exista.
   * @param {Object} productData - Datos del producto (sin ID).
   * @returns {Promise<Object>} Producto creado.
   * @throws {Error} Si el proveedor no existe.
   */
  async create(productData) {
    // Validación de dependencia: el proveedor debe existir
    const provider = await this.providerManager.getById(productData.proveedorId);
    if (!provider) {
      const error = new Error(`El proveedor con ID ${productData.proveedorId} no existe.`);
      error.statusCode = 400;
      throw error;
    }

    const products = await this.getAll();

    const nextId = products.length > 0
      ? Math.max(...products.map(p => p.id)) + 1
      : 1;

    const newProduct = { id: nextId, ...productData };
    products.push(newProduct);
    await this.fileManager.writeAll(products);
    return newProduct;
  }

  /**
   * Actualiza un producto existente. Valida proveedor si se modifica.
   * @param {number} id - ID del producto a actualizar.
   * @param {Object} productData - Nuevos datos del producto.
   * @returns {Promise<Object|null>} Producto actualizado o null.
   * @throws {Error} Si el proveedor no existe.
   */
  async update(id, productData) {
    // Si se intenta cambiar el proveedor, validar que exista
    if (productData.proveedorId !== undefined) {
      const provider = await this.providerManager.getById(productData.proveedorId);
      if (!provider) {
        const error = new Error(`El proveedor con ID ${productData.proveedorId} no existe.`);
        error.statusCode = 400;
        throw error;
      }
    }

    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    products[index] = { ...products[index], ...productData, id };
    await this.fileManager.writeAll(products);
    return products[index];
  }

  /**
   * Elimina un producto por su ID.
   * @param {number} id - ID del producto a eliminar.
   * @returns {Promise<Object|null>} Producto eliminado o null.
   */
  async delete(id) {
    const products = await this.getAll();
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return null;

    const [deleted] = products.splice(index, 1);
    await this.fileManager.writeAll(products);
    return deleted;
  }

  /**
   * Verifica si existen productos asociados a un proveedor.
   * Útil para la validación de dependencias al eliminar proveedores.
   * @param {number} proveedorId - ID del proveedor.
   * @returns {Promise<Array>} Productos vinculados al proveedor.
   */
  async getByProviderId(proveedorId) {
    const products = await this.getAll();
    return products.filter(p => p.proveedorId === proveedorId);
  }
}

module.exports = ProductManager;
