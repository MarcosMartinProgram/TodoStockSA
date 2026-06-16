// app.js - Punto de entrada de la aplicación TodoStock S.A.
// Configura Express, Pug como motor de vistas, rutas y manejo de errores.

require('dotenv').config();

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const connectDB = require('./src/config/db');

// Importar rutas
const loginRoutes    = require('./src/routes/loginRoutes');
const ventasRoutes   = require('./src/routes/ventasRoutes');
const productRoutes  = require('./src/routes/productRoutes');
const providerRoutes = require('./src/routes/providerRoutes');
const clientRoutes   = require('./src/routes/clientRoutes');
const voucherRoutes  = require('./src/routes/comprobanteClienteRoutes');
const paymentRoutes  = require('./src/routes/pagosClienteRoutes');
const accountRoutes  = require('./src/routes/ccorrienteClienteRoutes');

// Importar middleware de errores
const errorHandler = require('./src/middlewares/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// --- Configuración del motor de plantillas ---
app.set('view engine', 'pug');

const viewsPathCandidates = [
  path.join(__dirname, 'src', 'views'),
  path.join(process.cwd(), 'src', 'views')
];
const resolvedViewsPath = viewsPathCandidates.find((candidate) => fs.existsSync(candidate))
  || viewsPathCandidates[0];

app.set('views', resolvedViewsPath);

// --- Middlewares globales ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method Override: permite usar PUT y DELETE desde formularios HTML
app.use((req, res, next) => {
  if (req.query._method) {
    req.method = req.query._method.toUpperCase();
  }
  next();
});

// Conversión de tipos numéricos desde formularios HTML
app.use((req, res, next) => {
  if (req.body) {
    if (req.body.precio  !== undefined) req.body.precio  = Number(req.body.precio);
    if (req.body.stock   !== undefined) req.body.stock   = Number(req.body.stock);
    if (req.body.importe !== undefined) req.body.importe = Number(req.body.importe);
  }
  next();
});

// --- Login ---
app.use('/login', loginRoutes);

// --- Ruta principal --- redirige al login como entrada al sistema ---
app.get('/', (req, res) => res.redirect('/login'));

// Evita errores por solicitud automática de favicon cuando no hay archivo estático.
app.get('/favicon.ico', (_req, res) => res.status(204).end());

// --- Menú principal (post-login) ---
app.get('/inicio', (req, res) => {
  res.render('index', { title: 'Inicio' });
});

// --- Montaje de rutas de módulos ---
app.use('/ventas',       ventasRoutes);
app.use('/productos',    productRoutes);
app.use('/proveedores',  providerRoutes);
app.use('/clientes',     clientRoutes);
app.use('/comprobantes', voucherRoutes);
app.use('/pagos',        paymentRoutes);
app.use('/cuenta',       accountRoutes);

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

// --- Inicio del servidor (solo local) / inicializacion DB (serverless) ---
if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[TodoStock S.A.] Servidor corriendo en http://localhost:${PORT}`);
      console.log(`[TodoStock S.A.] Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  });
} else {
  connectDB().catch((error) => {
    console.error('Error al inicializar MongoDB en entorno serverless:', error.message);
  });
}

module.exports = app;