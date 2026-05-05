const Evento = require('../models/evento');

console.log('✓ Modelo Evento cargado:', typeof Evento);

const eventoCtrl = {};

eventoCtrl.getEventos = async (req, res) => {
    console.log('🔍 GET /api/eventos ejecutándose...');
    try {
        const eventos = await Evento.find().populate('usuarioId', 'nombre email');
        console.log('✓ Eventos encontrados:', eventos.length);
        res.json(eventos);
    } catch (error) {
        console.log('✗ Error en getEventos:', error.message);
        res.status(500).json({ error: error.message });
    }
};

eventoCtrl.getEventoById = async (req, res) => {
    try {
        const evento = await Evento.findById(req.params.id).populate('usuarioId', 'nombre email');
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        res.json(evento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

eventoCtrl.createEvento = async (req, res) => {
    console.log('--- CREANDO NUEVO EVENTO ---');
    console.log('Datos recibidos:', req.body);
    try {
        const nuevoEvento = new Evento(req.body);
        await nuevoEvento.save();
        console.log('✅ Evento creado exitosamente');
        res.json({ status: 'Evento creado con éxito', evento: nuevoEvento });
    } catch (error) {
        console.log('✗ Error al crear evento:', error.message);
        res.status(500).json({ error: error.message });
    }
};

eventoCtrl.editarEvento = async (req, res) => {
    try {
        const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!evento) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        res.json({ status: 'Evento actualizado', evento });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

eventoCtrl.eliminarEvento = async (req, res) => {
    try {
        await Evento.findByIdAndDelete(req.params.id);
        res.json({ status: 'Evento eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = eventoCtrl;
