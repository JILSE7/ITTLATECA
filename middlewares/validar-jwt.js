const {response} = require('express');

const jwt = require('jsonwebtoken');

const validarjwt = (req, res = response, next)=>{

    const token = req.header('x-token');//extrae el token de los headers
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const payload = jwt.verify(token,process.env.SECRET_JWT);
        req.uid = payload.uid;
        req.name = payload.name
        req.type = payload.type
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }

    next();
}

module.exports = {
    validarjwt
}