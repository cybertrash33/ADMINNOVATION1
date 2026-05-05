const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const pqrsCtrl = require('../controllers/pqrs.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', pqrsCtrl.getPqrs);

router.post('/',
    body('tipo').isIn(['peticion', 'queja', 'reclamo', 'sugerencia']).withMessage('Tipo de PQRS inválido'),
    body('asunto').notEmpty().withMessage('El asunto es obligatorio').trim().isLength({ max: 200 }),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('usuarioId').isMongoId().withMessage('ID de usuario inválido'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    pqrsCtrl.createPqrs
);

router.get('/usuario/:usuarioId', param('usuarioId').isMongoId(), (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, pqrsCtrl.getPqrsByUsuario);

router.patch('/:id',
    param('id').isMongoId().withMessage('ID inválido'),
    body('estado').isIn(['pendiente', 'en_proceso', 'resuelto', 'cerrado', 'rechazado']).withMessage('Estado inválido'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    pqrsCtrl.updateEstadoPqrs
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
    pqrsCtrl.eliminarPqrs
);

router.patch('/:id/nota',
    param('id').isMongoId().withMessage('ID inválido'),
    body('nota').notEmpty().withMessage('La nota es obligatoria'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    pqrsCtrl.agregarNotaInterna
);

router.patch('/:id/responder',
    param('id').isMongoId().withMessage('ID inválido'),
    body('respuesta').notEmpty().withMessage('La respuesta es obligatoria'),
    (req, res, next) => {
        const errors = require('express-validator').validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    pqrsCtrl.responderPqrs
);

module.exports = router;