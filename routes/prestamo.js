//importando el router de express para autoayuda
const router = require('express').Router();
//validacion del JWT
const {validarjwt} = require('../middlewares/validar-jwt');
//Middleware check
const {check} = require('express-validator');
//Middleware validar campos
const {validarCampos} = require('../middlewares/validarCampos')

//Importando el controller
const {
getPrestamos,
getPrestamoById,
addPrestamo,
updatePrestamo,
deletePrestamo
} = require('../controllers/prestamo');

//todos los endpoints tienen que pasar por validarjwt
router.use(validarjwt)

//Validacion de fecha
const {isDate} = require('../helpers/isDate');



//Obtener todos los prestamos
router.get('/', getPrestamos);

//Obtener un prestamo por id
router.get('/:id', getPrestamoById);

router.post('/', [
    check('user', 'El solicitante no puede ir vacio').notEmpty(),
    check('userAdmin', 'El administrador no puede ir vacio').notEmpty(),
    check('libro','libro no puede ir vacio').notEmpty(),
    check('fechaRetiro', 'La fecha de retiro es obligatoria').notEmpty(),
    check('fechaDevolucion', 'La fecha de devolucion no puede ir vacia').notEmpty(),
    check('devolucion', 'Boleano Devolucion').notEmpty(),
    validarCampos
], addPrestamo);

router.put('/:id', updatePrestamo);

router.delete('/:id', deletePrestamo);

module.exports = router;