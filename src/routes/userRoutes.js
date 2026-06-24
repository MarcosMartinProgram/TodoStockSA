const { Router } = require('express');
const UserController = require('../controllers/UserController');

const router = Router();
const controller = new UserController();

router.get(
  '/crear',
  (req, res, next) =>
    controller.showCreateForm(req, res, next)
);

router.get(
  '/:id/editar',
  (req, res, next) =>
    controller.showEditForm(req, res, next)
);

router.get(
  '/',
  (req, res, next) =>
    controller.getAll(req, res, next)
);

router.post(
  '/',
  (req, res, next) =>
    controller.create(req, res, next)
);

router.put(
  '/:id',
  (req, res, next) =>
    controller.update(req, res, next)
);

router.delete(
  '/:id',
  (req, res, next) =>
    controller.delete(req, res, next)
);

module.exports = router;