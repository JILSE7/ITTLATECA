const {response} = require('express');
const {validationResult} = require('express-validator');

const validarCampos = (req, res = response, next) =>{
    //manejo de errores
    const errors = validationResult(req);
    //si hay errores
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped() //aqui vienen los errores
        })
    }

    next();
}

module.exports = {
    validarCampos
}