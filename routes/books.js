//Importando el router de express
const router = require('express').Router();
//Validacion del JWT
const {validarjwt} = require('../middlewares/validar-jwt');
//Middleware check
const {check} = require('express-validator');

//importando el controller
const {
    getLibros,
    getLibroSearch,
    addLibro,
    updateLibro,
    deleteLibro
} = require('../controllers/libro');
const { validarCampos } = require('../middlewares/validarCampos');

//todos los endpoints tienen que pasar por validarjwt
router.use(validarjwt)


//Obtener libros
router.get('/', getLibros);

//Obtener libros
router.get('/:search', getLibroSearch);

//agregar un libro
router.post('/',
[
    check('nombreLibro', 'El nombre del libro no puede estar vacio').not().isEmpty(),
    check('editorial', 'El nombre del libro no puede estar vacio').not().isEmpty(),
    check('autor', 'El nombre del libro no puede estar vacio').not().isEmpty(),
    check('existencias', 'El nombre del libro no puede estar vacio').not().isEmpty(),
    check('ubicacion', 'El nombre del libro no puede estar vacio').not().isEmpty(),
    validarCampos
]
,addLibro);

//actualizar libro
router.put('/:id',updateLibro);

//Borrar libro
router.delete('/:id',deleteLibro);

module.exports = router