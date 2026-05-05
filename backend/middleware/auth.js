const { verifyToken } = require('../helpers/auth');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    req.user = decoded;
    next();
}

function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'No autenticado.' });
        }

        if (allowedRoles.length === 0) {
            return next();
        }

        if (!allowedRoles.includes(req.user.tipoUsuario)) {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
        }

        next();
    };
}

module.exports = { authMiddleware, roleMiddleware };