const mongoose = require('mongoose');

const residenteSchema = new mongoose.Schema({
nombre: { 
        type:String, required: true, max: 100 
    },
    tipo_de_usuario: {
        type:String, required: true, max: 100 
    },
    correo: {
        type:String, required: true, max: 100 
    },
    tipo_de_documento: {
        type:String, required: true, max: 100 
    },
    numero_de_documentacion: {
        type:String, required: true, max: 100 
    },  
    teléfono: {
        type:String, required: true, max: 100 
    },
    tipo_de_residente: {
        type:String, required: true, max: 100 
    },
    contraseña: {
        type:String, required: true, max: 100 
    },
    id_de_usuario: {
        type:String, required: true, max: 100 
    },      
}, {
    timestamps: true,            
});

// Asegúrate de que esta línea esté EXACTAMENTE así:
module.exports = mongoose.model('Residente', residenteSchema);