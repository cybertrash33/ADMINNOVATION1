const express = require('express');
const router = express.Router();
const estadisticasCtrl = require('../controllers/estadisticas.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware);
router.use(roleMiddleware('Administrador/Empleado'));

router.get('/', estadisticasCtrl.getEstadisticas);

module.exports = router;