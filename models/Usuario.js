//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }, 
    telefono: {
        type: String,
        required: true
    },
    numeroC:{
        type: String,
        required: true,
        unique: true
    },
    carrera: {
        type: String,
        required: true,
        enum: ['INDUSTRIAL', 'ELECTRICA', 'ELECTROMECANICA', 'GE', 'TICS', 'MECANICA', 'MECATRONICA', 'DOCENTE', 'OTRO']
    },
    type: {
        type: String,
        enum: ['USUARIO', "ADMINISTRADOR"],
        required: true
    },
    activo: {
        type: Boolean,
        required:true
    },
    prestamos:{
        type: [Schema.Types.ObjectId],
        ref: 'Prestamo'
    }
})

//Editandop el schema
usuarioSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.idUsuario = _id;
    return object;
})

//exportando el modelo
module.exports = model('Usuario', usuarioSchema)