// src/controllers/CcorrienteClienteController.js
const CcorrienteClienteManager = require('../models/CcorrienteClienteManager');
const ClientManager  = require('../models/ClientManager');

class CcorrienteClienteController {
  constructor() {
    this.accountManager = new CcorrienteClienteManager();
    this.clientManager  = new ClientManager();
  }

  /**
   * GET /cuenta/:clienteId
   * Muestra la cuenta corriente completa de un cliente.
   */
  async getByClientId(req, res, next) {
    try {
      const cliente = await this.clientManager.getById(req.params.clienteId);
      if (!cliente) return res.status(404).json({ error: `Cliente con ID ${req.params.clienteId} no encontrado.` });

      const movimientos = await this.accountManager.getByClientId(req.params.clienteId);
      const saldo = movimientos.length > 0
        ? movimientos[movimientos.length - 1].saldoAcumulado
        : 0;

      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ cliente, movimientos, saldo });
      }
      res.render('ccorrientecliente/index', {
        title: `Cuenta Corriente - ${cliente.nombre}`,
        cliente,
        movimientos,
        saldo
      });
    } catch (error) { next(error); }
  }
}

module.exports = CcorrienteClienteController;
