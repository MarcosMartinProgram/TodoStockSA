// app.js - Punto de entrada de la aplicación TodoStock S.A.
// Configura Express, Pug como motor de vistas, rutas y manejo de errores.

require('dotenv').config();

const express = require('express');
const path = require('path');

// Importar rutas
const productRoutes = require('./src/routes/productRoutes');
const providerRoutes = require('./src/routes/providerRoutes');

// Importar middleware de errores
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuración del motor de plantillas ---
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src', 'views'));

// --- Middlewares globales ---
// Parseo de JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override: permite usar PUT y DELETE desde formularios HTML
// Los formularios envían POST con ?_method=PUT o ?_method=DELETE
app.use((req, res, next) => {
  if (req.query._method) {
    req.method = req.query._method.toUpperCase();
  }
  next();
});

// Conversión de tipos numéricos desde formularios HTML
// (los formularios envían todo como string, este middleware convierte campos numéricos)
app.use((req, res, next) => {
  if (req.body) {
    if (req.body.precio !== undefined) req.body.precio = Number(req.body.precio);
    if (req.body.stock !== undefined) req.body.stock = Number(req.body.stock);
    if (req.body.proveedorId !== undefined) req.body.proveedorId = Number(req.body.proveedorId);
  }
  next();
});

// --- Ruta principal ---
app.get('/', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

// --- Montaje de rutas de módulos ---
app.use('/productos', productRoutes);
app.use('/proveedores', providerRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Error 404',
    statusCode: 404,
    message: 'La página solicitada no fue encontrada.'
  });
});

// --- Middleware global de errores ---
app.use(errorHandler);

// --- Inicio del servidor ---
app.listen(PORT, () => {
  console.log(`[TodoStock S.A.] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[TodoStock S.A.] Entorno: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
