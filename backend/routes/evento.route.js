const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const eventoCtrl = require('../controllers/evento.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', eventoCtrl.getEventos);

router.post('/',
    roleMiddleware('Administrador/Empleado'),
    body('titulo').notEmpty().withMessage('El título es obligatorio').trim().isLength({ max: 200 }),
    body('tipo').isIn(['maintenance', 'meeting', 'announcement']).withMessage('Tipo de evento inválido'),
    body('fechaInicio').isISO8601().withMessage('Fecha de inicio inválida'),
    body('fechaFin').isISO8601().withMessage('Fecha de fin inválida'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    eventoCtrl.createEvento
);

router.get('/:id', param('id').isMongoId(), (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, eventoCtrl.getEventoById);

router.put('/:id',
    roleMiddleware('Administrador/Empleado'),
    param('id').isMongoId().withMessage('ID inválido'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    eventoCtrl.editarEvento
);

router.delete('/:id',
    roleMiddleware('Administrador/Empleado'),
    param('id').isMongoId().withMessage('ID inválido'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    eventoCtrl.eliminarEvento
);

module.exports = router;