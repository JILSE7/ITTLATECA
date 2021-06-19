const moment = require('moment');

const isDate = (value) =>{
    //Verificando si el valor de la fecha existe
    if(!value)return false;
    const fecha = moment(value);
    console.log(fecha);
    //Evalua si la fecha es valida
    if(fecha.isValid()){
        return true;

    }else{
        return false
    }
}


//const fecha = new Date();
//console.log(fecha.setDate(fecha.getDate() + 2));
//console.log(moment(1624220242169).format('LL'));


module.exports = {isDate}