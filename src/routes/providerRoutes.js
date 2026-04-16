// src/routes/providerRoutes.js
// Rutas del módulo Proveedores.
// Flujo: Routes -> Middleware de validación -> Controller -> Model

const { Router } = require('express');
const ProviderController = require('../controllers/ProviderController');
const { validateProvider, validateId } = require('../middlewares/validators');

const router = Router();
const controller = new ProviderController();

// --- Rutas de vistas (HTML) ---
// GET /proveedores/crear -> Formulario de creación (debe ir ANTES de /:id)
router.get('/crear', (req, res, next) => controller.showCreateForm(req, res, next));

// GET /proveedores/:id/editar -> Formulario de edición
router.get('/:id/editar', validateId, (req, res, next) => controller.showEditForm(req, res, next));

// --- Rutas CRUD ---
// GET /proveedores -> Listar todos
router.get('/', (req, res, next) => controller.getAll(req, res, next));

// GET /proveedores/:id -> Detalle de un proveedor
router.get('/:id', validateId, (req, res, next) => controller.getById(req, res, next));

// POST /proveedores -> Crear proveedor
router.post('/', validateProvider, (req, res, next) => controller.create(req, res, next));

// PUT /proveedores/:id -> Actualizar proveedor
router.put('/:id', validateId, (req, res, next) => controller.update(req, res, next));

// DELETE /proveedores/:id -> Eliminar proveedor (con validación de dependencias)
router.delete('/:id', validateId, (req, res, next) => controller.delete(req, res, next));

module.exports = router;
