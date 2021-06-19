//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const prestamoSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        // required: true
    },
    userAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        // required: true
    },
    libro: {
        type: Schema.Types.ObjectId,
        ref: 'Libro',
        // required: true
    },
    fechaRetiro: {
        type: String,
        required: true
    },
    fechaDevolucion: {
        type: String,
        required: true
    },
    devolucion: {
        type: Boolean,
        require: true
    },
    observaciones: {
        type: String
    }
})

//Editandop el schema
prestamoSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.idPrestamo = _id;
    return object;
})

//exportando el modelo
module.exports = model('Prestamo', prestamoSchema)