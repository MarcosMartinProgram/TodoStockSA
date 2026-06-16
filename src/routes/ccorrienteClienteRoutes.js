// src/routes/accountRoutes.js
const { Router }   = require('express');
const CcorrienteClienteController = require('../controllers/CCorrienteClienteController');
const mongoose     = require('mongoose');

const router     = Router();
const controller = new CcorrienteClienteController();

// Valida que :clienteId sea un ObjectId válido
function validateClienteId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.clienteId)) {
    return res.status(400).json({ error: 'El ID de cliente proporcionado no es válido.' });
  }
  next();
}

// GET /cuenta/:clienteId -> Cuenta corriente de un cliente
router.get('/:clienteId', validateClienteId, (req, res, next) => controller.getByClientId(req, res, next));

module.exports = router;
