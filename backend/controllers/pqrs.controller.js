const Pqrs = require('../models/pqrs');

console.log('✓ Modelo PQRS cargado:', typeof Pqrs);



const pqrsCtrl = {};



pqrsCtrl.getPqrs = async (req, res) => {

    console.log('🔍 GET /api/pqrs ejecutándose...');

    try {

        const pqrs = await Pqrs.find().populate('usuarioId', 'nombre email');

        console.log('✓ PQRS encontrados:', pqrs.length);

        res.json(pqrs);

    } catch (error) {

        console.log('✗ Error en getPqrs:', error.message);

        res.status(500).json({ error: error.message });

    }

};



pqrsCtrl.createPqrs = async (req, res) => {

    console.log('--- CREANDO NUEVA PQRS ---');

    console.log('Datos recibidos:', req.body);

    try {

        const ultimaPqrs = await Pqrs.findOne().sort({ numeroRadicado: -1 });
        let nuevoNumero = 1;
        if (ultimaPqrs && ultimaPqrs.numeroRadicado) {
            const numeroAnterior = parseInt(ultimaPqrs.numeroRadicado.replace(/\D/g, ''), 10);
            nuevoNumero = isNaN(numeroAnterior) ? 1 : numeroAnterior + 1;
        }
        const numeroRadicado = 'PQ-' + String(nuevoNumero).padStart(4, '0');

        const nuevaPqrs = new Pqrs({
            ...req.body,
            numeroRadicado
        });

        await nuevaPqrs.save();
        console.log('✅ PQRS creada exitosamente:', numeroRadicado);
        res.json({ status: 'PQRS radicada con éxito', pqrs: nuevaPqrs });

    } catch (error) {

        console.log('✗ Error al crear PQRS:', error.message);
        res.status(500).json({ error: error.message });

    }

};



pqrsCtrl.getPqrsByUsuario = async (req, res) => {

    try {

        const pqrs = await Pqrs.find({ usuarioId: req.params.usuarioId });

        res.json(pqrs);

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



pqrsCtrl.updateEstadoPqrs = async (req, res) => {

    try {

        const pqrs = await Pqrs.findById(req.params.id);

        if (!pqrs) {

            return res.status(404).json({ error: 'PQRS no encontrada' });

        }

        pqrs.historialEstados.push({

            estado: req.body.estado,

            fecha: new Date(),

            autor: req.body.autor || 'Administrador'

        });

        pqrs.estado = req.body.estado;

        await pqrs.save();

        res.json({ status: 'Estado de PQRS actualizado' });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



pqrsCtrl.eliminarPqrs = async (req, res) => {

    try {

        await Pqrs.findByIdAndDelete(req.params.id);

        res.json({ status: 'PQRS eliminada' });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



pqrsCtrl.agregarNotaInterna = async (req, res) => {

    try {

        const pqrs = await Pqrs.findById(req.params.id);

        if (!pqrs) {

            return res.status(404).json({ error: 'PQRS no encontrada' });

        }

        pqrs.notasInternas.push({

            nota: req.body.nota,

            fecha: new Date(),

            autor: req.body.autor || 'Administrador'

        });

        await pqrs.save();

        res.json({ status: 'Nota agregada' });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



pqrsCtrl.responderPqrs = async (req, res) => {

    try {

        const pqrs = await Pqrs.findById(req.params.id);

        if (!pqrs) {

            return res.status(404).json({ error: 'PQRS no encontrada' });

        }

        pqrs.respuesta = req.body.respuesta;

        pqrs.fechaRespuesta = new Date();

        await pqrs.save();

        res.json({ status: 'Respuesta agregada' });

    } catch (error) {

        res.status(500).json({ error: error.message });

    }

};



module.exports = pqrsCtrl;