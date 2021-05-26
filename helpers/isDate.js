const moment = require('moment');

const isDate = (value) =>{
    //Verificando si el valor de la fecha existe
    if(!value)return false;
    const fecha = moment(value);
    console.log(fecha);
    //Evalua si la fecha es valida
    if(fecha.isValid()){
        return true
    }else{
        return false
    }
}

module.exports = {isDate}