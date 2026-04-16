// src/routes/productRoutes.js
// Rutas del módulo Productos.
// Flujo: Routes -> Middleware de validación -> Controller -> Model

const { Router } = require('express');
const ProductController = require('../controllers/ProductController');
const { validateProduct, validateId } = require('../middlewares/validators');

const router = Router();
const controller = new ProductController();

// --- Rutas de vistas (HTML) ---
// GET /productos/crear -> Formulario de creación (debe ir ANTES de /:id)
router.get('/crear', (req, res, next) => controller.showCreateForm(req, res, next));

// GET /productos/:id/editar -> Formulario de edición
router.get('/:id/editar', validateId, (req, res, next) => controller.showEditForm(req, res, next));

// --- Rutas CRUD ---
// GET /productos -> Listar todos (JSON o HTML según Accept header)
router.get('/', (req, res, next) => controller.getAll(req, res, next));

// GET /productos/:id -> Detalle de un producto
router.get('/:id', validateId, (req, res, next) => controller.getById(req, res, next));

// POST /productos -> Crear producto (con validación de campos y proveedor)
router.post('/', validateProduct, (req, res, next) => controller.create(req, res, next));

// PUT /productos/:id -> Actualizar producto
router.put('/:id', validateId, (req, res, next) => controller.update(req, res, next));

// DELETE /productos/:id -> Eliminar producto
router.delete('/:id', validateId, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
