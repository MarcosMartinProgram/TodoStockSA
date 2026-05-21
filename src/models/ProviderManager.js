// src/models/ProviderManager.js
// Modelo que gestiona la lógica de negocio de Proveedores.
// Utiliza Mongoose para la persistencia en MongoDB.

const Proveedor = require('../schemas/providerSchema');

class ProviderManager {

  async getAll() {
    return await Proveedor.find();
  }

  async getById(id) {
    return await Proveedor.findById(id);
  }

  async create(providerData) {
    const newProvider = new Proveedor(providerData);
    return await newProvider.save();
  }

  async update(id, providerData) {
    return await Proveedor.findByIdAndUpdate(id, providerData, { new: true });
  }

  async delete(id) {
    return await Proveedor.findByIdAndDelete(id);
  }
}

module.exports = ProviderManager;