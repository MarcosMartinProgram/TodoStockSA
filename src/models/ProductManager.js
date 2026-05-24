// src/models/ProductManager.js
// Modelo que gestiona la lógica de negocio de Productos.
// Utiliza Mongoose para la persistencia en MongoDB.

const Producto = require('../schemas/productSchema');
const ProviderManager = require('./ProviderManager');

class ProductManager {
  constructor() {
    this.providerManager = new ProviderManager();
  }

  async getAll() {
    return await Producto.find();
  }

  async getAllWithProvider() {
    return await Producto.find().populate('proveedorId');
  }

  async getById(id) {
    return await Producto.findById(id);
  }

  async getByIdWithProvider(id) {
    return await Producto.findById(id).populate('proveedorId');
  }

  async create(productData) {
    const provider = await this.providerManager.getById(productData.proveedorId);
    if (!provider) {
      const error = new Error(`El proveedor con ID ${productData.proveedorId} no existe.`);
      error.statusCode = 400;
      throw error;
    }
    const newProduct = new Producto(productData);
    return await newProduct.save();
  }

  async update(id, productData) {
    if (productData.proveedorId !== undefined) {
      const provider = await this.providerManager.getById(productData.proveedorId);
      if (!provider) {
        const error = new Error(`El proveedor con ID ${productData.proveedorId} no existe.`);
        error.statusCode = 400;
        throw error;
      }
    }
    return await Producto.findByIdAndUpdate(id, productData, { new: true });
  }

  async delete(id) {
    return await Producto.findByIdAndDelete(id);
  }

  async getByProviderId(proveedorId) {
    return await Producto.find({ proveedorId });
  }
}

module.exports = ProductManager;