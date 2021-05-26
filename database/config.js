//Importando moongoose
const mongoose = require('mongoose');


//Conexion a la base de datos
const dbConexion = async()=>{
    try {
        await mongoose.connect(process.env.DB_CN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB ONLINE');
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo conectar a la base de datos')
    }

}

module.exports = {
    dbConexion
}