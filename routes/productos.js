const express = require('express');
const router = express.Router();
const controller = require('../controllers/productosController');

router.get('/productos', controller.listarProductos);
router.get('/productos/:id', controller.obtenerProductoPorId);
router.post('/productos', controller.crearProducto);
router.put('/productos/:id', controller.actualizarProducto);
router.delete('/productos/:id', controller.eliminarProducto);

router.get('/stats', controller.obtenerStats);
router.get('/categorias', controller.obtenerCategorias);

module.exports = router;