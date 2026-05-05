const mongoose = require('mongoose');

const pqrsSchema = new mongoose.Schema({
    numeroRadicado: {
        type: String,
        unique: true,
        sparse: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['peticion', 'queja', 'reclamo', 'sugerencia']
    },
    asunto: {
        type: String,
        required: true,
        max: 200
    },
    descripcion: {
        type: String,
        required: true
    },
    bloque: {
        type: String
    },
    numeroApartamento: {
        type: String
    },
    usuarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: String,
        default: 'pendiente',
        enum: ['pendiente', 'en_proceso', 'resuelto', 'cerrado', 'rechazado']
    },
    prioridad: {
        type: String,
        default: 'media',
        enum: ['baja', 'media', 'alta', 'urgente']
    },
    notasInternas: [{
        nota: String,
        fecha: Date,
        autor: String
    }],
    historialEstados: [{
        estado: String,
        fecha: Date,
        autor: String
    }],
    respuesta: String,
    fechaRespuesta: Date,
    archivo: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Pqrs', pqrsSchema);