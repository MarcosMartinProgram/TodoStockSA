// src/routes/loginRoutes.js
const { Router }     = require('express');
const LoginController = require('../controllers/LoginController');

const router     = Router();
const controller = new LoginController();

router.get('/',  (req, res) => controller.showForm(req, res));
router.post('/', (req, res) => controller.login(req, res));

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

module.exports = router;
