// src/routes/ventasRoutes.js
const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
  res.render('ventas/index', { title: 'Ventas' });
});

module.exports = router;
