const jwt = require('jsonwebtoken');

const generarToken = (uid, name, type)=>{
    return new Promise((resolve, reject) =>{

        const payload = {uid, name, type};
        jwt.sign(payload, process.env.SECRET_JWT,{
            expiresIn: '2h'
        },(err, token)=>{
            if(err){
                console.log(err);
                reject('No se pudo firmar el token');
            }
            resolve(token);
        })

    })

    
}


module.exports = {
    generarToken
}