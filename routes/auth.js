const router = require('express').Router();
const {check} = require('express-validator');

const {
crearUsuario,
loginUsuario,
revalidarToken,
getUsers,
updateUser,
deleteUser
 } = require('../controllers/auth');

                            //Middlewares
 //validarCampos
 const {validarCampos} = require('../middlewares/validarCampos');
 //ValidarJWT
 const {validarjwt} = require('../middlewares/validar-jwt');

 //Obtener Usuarios
 router.get('/users', validarjwt ,getUsers);

 //Actualizar Usuarios
 router.put('/users/:id', validarjwt ,updateUser);
 //Renovar el token
 router.get('/renew', validarjwt ,revalidarToken);

 //Nuevo Usuario
router.post('/newUser',
            [   validarjwt,
                check('nombre','El nombre es obligatorio').not().isEmpty(),
                check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
                check('email', 'El email es obligatorio').isEmail(),
                check('password', 'Password debe de ser de 6 caracteres').isLength({min: 6}),
                check('telefono', 'El telefono es obligatorio').not().isEmpty(),
                check('numeroC', 'Numero de control obligatorio').not().isEmpty(),
                check('carrera', 'Campo carrera no puede estar vacio').not().isEmpty(),
                check('type', 'El tipo de usuario es forzoso').not().isEmpty(),
                validarCampos
            ],
            crearUsuario 
);


//Login Usuario
router.post('/', 
            [
                check('numeroC', 'Porfavor el numero de control es obligatorio para iniciar sesion').not().isEmpty(),
                check('password', 'La contraseña no puede estar vacia').not().isEmpty(),
                check('password', 'La contraseña debe de ser de almenos 6 caracteres').isLength({min:6}),
                validarCampos
            ],
            loginUsuario
);

router.delete('/users/:id',validarjwt,deleteUser)

module.exports = router;