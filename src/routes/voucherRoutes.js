// src/routes/voucherRoutes.js
const { Router } = require('express');
const VoucherController = require('../controllers/VoucherController');
const { validateVoucher, validateId } = require('../middlewares/validators');

const router     = Router();
const controller = new VoucherController();

router.get('/crear',              (req, res, next) => controller.showCreateForm(req, res, next));
router.get('/:id/editar', validateId, (req, res, next) => controller.showEditForm(req, res, next));
router.get('/',                   (req, res, next) => controller.getAll(req, res, next));
router.get('/:id',        validateId, (req, res, next) => controller.getById(req, res, next));
router.post('/',  validateVoucher,   (req, res, next) => controller.create(req, res, next));
router.put('/:id',        validateId, (req, res, next) => controller.update(req, res, next));
router.delete('/:id',     validateId, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
