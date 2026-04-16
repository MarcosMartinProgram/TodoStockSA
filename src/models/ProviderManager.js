// src/models/ProviderManager.js
// Modelo que gestiona la lógica de negocio de Proveedores.
// Utiliza FileSystemManager para la persistencia en JSON.

const FileSystemManager = require('../services/FileSystemManager');

class ProviderManager {
  constructor() {
    this.fileManager = new FileSystemManager('proveedores.json');
  }

  /**
   * Obtiene todos los proveedores.
   * @returns {Promise<Array>} Lista de proveedores.
   */
  async getAll() {
    return await this.fileManager.readAll();
  }

  /**
   * Busca un proveedor por su ID.
   * @param {number} id - ID del proveedor.
   * @returns {Promise<Object|null>} Proveedor encontrado o null.
   */
  async getById(id) {
    const providers = await this.getAll();
    return providers.find(p => p.id === id) || null;
  }

  /**
   * Crea un nuevo proveedor con ID autoincremental.
   * @param {Object} providerData - Datos del proveedor (sin ID).
   * @returns {Promise<Object>} Proveedor creado con su ID asignado.
   */
  async create(providerData) {
    const providers = await this.getAll();

    // Genera el siguiente ID basado en el máximo existente
    const nextId = providers.length > 0
      ? Math.max(...providers.map(p => p.id)) + 1
      : 1;

    const newProvider = { id: nextId, ...providerData };
    providers.push(newProvider);
    await this.fileManager.writeAll(providers);
    return newProvider;
  }

  /**
   * Actualiza un proveedor existente.
   * @param {number} id - ID del proveedor a actualizar.
   * @param {Object} providerData - Nuevos datos del proveedor.
   * @returns {Promise<Object|null>} Proveedor actualizado o null si no existe.
   */
  async update(id, providerData) {
    const providers = await this.getAll();
    const index = providers.findIndex(p => p.id === id);

    if (index === -1) return null;

    // Mantiene el ID original y actualiza el resto de campos
    providers[index] = { ...providers[index], ...providerData, id };
    await this.fileManager.writeAll(providers);
    return providers[index];
  }

  /**
   * Elimina un proveedor por su ID.
   * @param {number} id - ID del proveedor a eliminar.
   * @returns {Promise<Object|null>} Proveedor eliminado o null si no existe.
   */
  async delete(id) {
    const providers = await this.getAll();
    const index = providers.findIndex(p => p.id === id);

    if (index === -1) return null;

    const [deleted] = providers.splice(index, 1);
    await this.fileManager.writeAll(providers);
    return deleted;
  }
}

module.exports = ProviderManager;
