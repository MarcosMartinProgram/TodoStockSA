// src/models/ClientManager.js
const Cliente = require('../schemas/clientSchema');

class ClientManager {
  async getAll() {
    return await Cliente.find().sort({ nombre: 1 });
  }

  async getById(id) {
    return await Cliente.findById(id);
  }

  async create(clientData) {
    // Verificar CUIT duplicado
    const existing = await Cliente.findOne({ cuit: clientData.cuit });
    if (existing) {
      const error = new Error(`Ya existe un cliente con el CUIT ${clientData.cuit}.`);
      error.statusCode = 400;
      throw error;
    }
    const newClient = new Cliente(clientData);
    return await newClient.save();
  }

  async update(id, clientData) {
    // Si se actualiza el CUIT, verificar que no exista en otro cliente
    if (clientData.cuit) {
      const existing = await Cliente.findOne({ cuit: clientData.cuit, _id: { $ne: id } });
      if (existing) {
        const error = new Error(`Ya existe un cliente con el CUIT ${clientData.cuit}.`);
        error.statusCode = 400;
        throw error;
      }
    }
    return await Cliente.findByIdAndUpdate(id, clientData, { returnDocument: 'after' });
  }

  async delete(id) {
    return await Cliente.findByIdAndDelete(id);
  }
}

module.exports = ClientManager;
