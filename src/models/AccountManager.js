// src/models/AccountManager.js
const MovimientoCuenta = require('../schemas/accountSchema');

class AccountManager {
  /**
   * Devuelve todos los movimientos de un cliente ordenados por fecha,
   * con el saldo acumulado calculado en cada fila.
   */
  async getByClientId(clienteId) {
    const movimientos = await MovimientoCuenta.find({ clienteId })
      .sort({ fecha: 1, createdAt: 1 });

    let saldoAcumulado = 0;
    return movimientos.map(mov => {
      if (mov.tipo === 'debito') {
        saldoAcumulado += mov.importe;
      } else {
        saldoAcumulado -= mov.importe;
      }
      return {
        ...mov.toObject(),
        saldoAcumulado
      };
    });
  }

  /**
   * Devuelve solo el saldo final del cliente (deuda actual).
   * Positivo = el cliente nos debe; Negativo = saldo a favor del cliente.
   */
  async getSaldoByClientId(clienteId) {
    const movimientos = await MovimientoCuenta.find({ clienteId });
    let saldo = 0;
    for (const mov of movimientos) {
      saldo += mov.tipo === 'debito' ? mov.importe : -mov.importe;
    }
    return saldo;
  }
}

module.exports = AccountManager;
