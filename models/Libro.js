//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const libroSchema = Schema({
   nombreLibro: {
       type: String,
       required: true
   },
   autor: {
       type: String,
       required: true
   },
   editorial : {
       type: String,
       required: true
   },
   edicion: {
    type: String,
    required: false
   },
   categoria: {
       type: Array,
       required: true
   },
   existencias: {
       type: String,
       required: true
   },
   disponibles: {
        type: String,
        required: true
   },
   ubicacion: {
       type: String,
       required: true
   },
    prestamos:{//si existe algun libro prestado, mostrara quien lo tiene
       type: [Schema.Types.ObjectId],
       ref: 'Prestamo'
     }

});
//Editandop el schema
libroSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

//exportando el modelo
module.exports = model('Libro', libroSchema)