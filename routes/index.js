const router = require('express').Router();

//Definimos el comportamiento raiz del endpoint

router.get('/',(req,res) =>{
    res.send('Bienvenidos a ITTLATECA, aqui iniciamos con nuestro servidor')
});


//Definimos las rutas a nuestras collecciones
router.use('/auth', require('./auth'));
router.use('/books', require('./books'));
router.use('/prestamos', require('./prestamo'))

module.exports = router;