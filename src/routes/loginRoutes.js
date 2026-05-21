// src/routes/loginRoutes.js
const { Router }     = require('express');
const LoginController = require('../controllers/LoginController');

const router     = Router();
const controller = new LoginController();

router.get('/',  (req, res) => controller.showForm(req, res));
router.post('/', (req, res) => controller.login(req, res));

module.exports = router;
