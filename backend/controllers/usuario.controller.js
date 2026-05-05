const Usuario = require('../models/usuario');
const { hashPassword, comparePassword, generateToken } = require('../helpers/auth');

const usuarioCtrl = {};

usuarioCtrl.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

usuarioCtrl.createUsuarios = async (req, res) => {
    try {
        const { nombre, tipoDocumento, numeroDocumento, email, telefono,
                tipoUsuario, tipoResidente, conjuntoResidencial,
                numeroBloque, numeroApartamento, password } = req.body;

        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const existingDoc = await Usuario.findOne({ numeroDocumento });
        if (existingDoc) {
            return res.status(400).json({ message: 'El número de documento ya está registrado.' });
        }

        const hashedPassword = hashPassword(password);

        const nuevoUsuario = new Usuario({
            nombre, tipoDocumento, numeroDocumento, email, telefono,
            tipoUsuario, tipoResidente, conjuntoResidencial,
            numeroBloque, numeroApartamento, password: hashedPassword
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

usuarioCtrl.getUnicoUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-password');
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

usuarioCtrl.editarUsuario = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.password) {
            updateData.password = hashPassword(updateData.password);
        }

        const usuario = await Usuario.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado', usuario });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

usuarioCtrl.eliminarUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

usuarioCtrl.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const uBD = await Usuario.findOne({ email });
        if (!uBD) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }

        const passwordValida = comparePassword(password, uBD.password);
        if (!passwordValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = generateToken({
            id: uBD._id,
            nombre: uBD.nombre,
            email: uBD.email,
            tipoUsuario: uBD.tipoUsuario
        });

        res.json({
            token,
            id: uBD._id,
            usuario: {
                nombre: uBD.nombre,
                email: uBD.email,
                tipoUsuario: uBD.tipoUsuario,
                tipoDocumento: uBD.tipoDocumento,
                numeroDocumento: uBD.numeroDocumento,
                telefono: uBD.telefono,
                tipoResidente: uBD.tipoResidente,
                numeroBloque: uBD.numeroBloque,
                numeroApartamento: uBD.numeroApartamento,
                foto: uBD.foto
            }
        });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

usuarioCtrl.actualizarFoto = async (req, res) => {
    try {
        const { foto } = req.body;

        if (!foto) {
            return res.status(400).json({ message: 'No se recibió la foto' });
        }

        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            { foto },
            { new: true }
        ).select('-password');

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Foto actualizada', usuario });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

usuarioCtrl.registrarUsuario = async (req, res) => {
    try {
        const {
            nombre, email, password, tipoUsuario,
            tipoDocumento, numeroDocumento, telefono,
            tipoResidente, conjuntoResidencial, numeroBloque, numeroApartamento
        } = req.body;

        const existingUser = await Usuario.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
        }

        const hashedPassword = hashPassword(password);

        const nuevoUsuario = new Usuario({
            nombre, email, password: hashedPassword, tipoUsuario,
            tipoDocumento, numeroDocumento, telefono,
            tipoResidente, conjuntoResidencial, numeroBloque, numeroApartamento
        });

        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = usuarioCtrl;