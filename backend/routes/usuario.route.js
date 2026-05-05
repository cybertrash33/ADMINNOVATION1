const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const usuarioCtrl = require('../controllers/usuario.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const validarRegistro = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio').trim().isLength({ max: 100 }),
    body('email').isEmail().withMessage('Debe ser un correo válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener mínimo 6 caracteres'),
    body('tipoDocumento').notEmpty().withMessage('El tipo de documento es obligatorio'),
    body('numeroDocumento').notEmpty().withMessage('El número de documento es obligatorio').trim(),
    body('telefono').notEmpty().withMessage('El teléfono es obligatorio').trim(),
    body('tipoUsuario').notEmpty().withMessage('El tipo de usuario es obligatorio'),
    body('tipoResidente').notEmpty().withMessage('El tipo de residente es obligatorio'),
    body('conjuntoResidencial').notEmpty().withMessage('El conjunto residencial es obligatorio').trim(),
    body('numeroBloque').notEmpty().withMessage('El número de bloque es obligatorio').trim(),
    body('numeroApartamento').notEmpty().withMessage('El número de apartamento es obligatorio').trim()
];

const validarLogin = [
    body('email').isEmail().withMessage('Debe ser un correo válido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

router.post('/login', validarLogin, (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usuarioCtrl.loginUsuario);

router.post('/', validarRegistro, (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usuarioCtrl.createUsuarios);

router.use(authMiddleware);

router.get('/', usuarioCtrl.getUsuarios);

router.get('/:id', param('id').isMongoId().withMessage('ID inválido'), (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usuarioCtrl.getUnicoUsuario);

router.put('/:id', param('id').isMongoId().withMessage('ID inválido'), (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usuarioCtrl.editarUsuario);

router.patch('/:id/foto', param('id').isMongoId().withMessage('ID inválido'), (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, usuarioCtrl.actualizarFoto);

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
    usuarioCtrl.eliminarUsuario
);

module.exports = router;