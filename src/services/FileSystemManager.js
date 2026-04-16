// src/services/FileSystemManager.js
// Clase encargada de la persistencia en archivos JSON.
// Centraliza las operaciones de lectura/escritura para facilitar
// una futura migración a base de datos (ej. MongoDB).

const fs = require('fs').promises;
const path = require('path');

class FileSystemManager {
  /**
   * @param {string} filename - Nombre del archivo JSON (ej: 'productos.json')
   */
  constructor(filename) {
    this.filePath = path.join(__dirname, '..', 'data', filename);
  }

  /**
   * Lee y parsea el contenido del archivo JSON.
   * @returns {Promise<Array>} Array de objetos del archivo.
   */
  async readAll() {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Sobreescribe el archivo JSON con los datos proporcionados.
   * @param {Array} data - Array de objetos a persistir.
   */
  async writeAll(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }
}

module.exports = FileSystemManager;
