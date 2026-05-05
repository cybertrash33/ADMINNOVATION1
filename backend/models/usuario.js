const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { 
        type:String, required: true, max: 100 
    },
    tipoDocumento: {
        type:String, required: true, max: 100 
    },
    numeroDocumento: {
        type:String, required: true, max: 100 
    }, 
    email: {
        type:String, required: true, max: 100 
    },     
    telefono: {
        type:String, required: true, max: 100 
    },
    tipoUsuario: {
        type:String, required: true, max: 100 
    },
    tipoResidente: {
        type:String, required: true, max: 100 
    },
    conjuntoResidencial: {
        type:String, required: true, max: 100 
    },
    numeroBloque: {
        type:String, required: true, max: 100 
    },
    numeroApartamento: {
        type:String, required: true, max: 100 
    },
    password: {
        type:String, required: true, max: 100
    },
    foto: {
        type: String, required: false
    },
    // id_de_usuario: {
    //     type:String, required: true, max: 100
    // },
}, {
    timestamps: true,            
});

// Asegúrate de que esta línea esté EXACTAMENTE así:
module.exports = mongoose.model('Usuario', usuarioSchema);



