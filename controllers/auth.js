//Mantenemos el intelligence
const {response} = require('express');
//bcryptjs
const bcrypt = require('bcryptjs');
//Importancion del modelo
const Usuario = require('../models/Usuario');
//JWT
const {generarToken}= require('../helpers/jwt');



const getUsers = async(req, res = response) =>{
     //Valudacion de administrador
     const type = req.type;

     if(type === "USUARIO"){
         return res.status(401).json({
             ok: false,
             msg: "No estas autorizado para realizar acciones de administrador"
         })
     };

    try {
        const users = await Usuario.find().populate('prestamos', "fechaRetiro fechaDevolucion devolucion");
        res.status(200).json({
            ok: true,
            users
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con la administracion'
        })
    }
};


const updateUser = async(req, res= response) =>{ //PENDIENTE CAMBIAR EL PASSWORD
    //Valudacion de administrador
    const type = req.type;

    if(type === "USUARIO"){
        return res.status(401).json({
            ok: false,
            msg: "No estas autorizado para realizar acciones de administrador"
        })
    };

    const userId = req.params.id; //Obteniendo el id de la URL
    
    
    try {
        const user = await Usuario.findById(userId); //Buscando el usuario por el id

        if(!user){//si el usuario no existe
            return res.status(404).json({
                ok: false,
                msg:"El usuario no esta registrando en la base de datos"
            })
        }


        const nuevoUsuario = {//remplazando el usuario
            ...req.body,
            _id: userId,
        }

        if(req.body.password){
            //Encriptado la contraseña
            const salt = bcrypt.genSaltSync(); //por defecto tiene dies vueltas de seguridad
            nuevoUsuario.password = bcrypt.hashSync(req.body.password, salt);
        };

        const usuarioActualizado = await Usuario.findByIdAndUpdate(userId,nuevoUsuario,{new : true, useFindAndModify: false}); //Actualizando el usuario

        res.status(200).json({//mandando al nuevo usuario
            ok: true,
            user: usuarioActualizado
        });

    } catch (error) {//si falla la peticion
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Acerquese a administracion"
        })
    }
};

const crearUsuario = async(req,res = response) =>{
    //Valudacion de administrador
    const type = req.type;
    if(type === "USUARIO"){
        return res.status(401).json({
            ok: false,
            msg: "No estas autorizado para realizar acciones de administrador"
        })
    };

    const {email, numeroC, password} = req.body
    try {

        let usuario = await Usuario.findOne({email: email});

        //Validando si existe el correo
        if(usuario){
            res.status(400).json({
                ok: false,
                msg: 'Correo electronico duplicado , un usuario cuenta con esta informacion'
            })
        }

        //Validando si el numero de control existe
        usuario = await Usuario.findOne({numeroC});

        if(usuario){
            res.status(400).json({
                ok: false,
                msg: 'Numero de control duplicado, un usuario cuenta con este numero de control'
            })
        }

        
        //Nueva instancia de usuario
        usuario = new Usuario(req.body)

        //Encriptado la contraseña
        const salt = bcrypt.genSaltSync(); //por defecto tiene dies vueltas de seguridad
        usuario.password = bcrypt.hashSync(password, salt);


        //guardando en la base
        await usuario.save();

        //Generando JWT
        const token = await generarToken(usuario.id, usuario.nombre, usuario.type);

        //Respuesta
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.nombre,
            lastName: usuario.apellidos,
            numeroC: usuario.numeroC,
            token
        })    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Acerquese a los administradores para resolver el problema'
        })
    }
};

const deleteUser = async(req, res =response) =>{
    const userId = req.params.id,
            type = req.type;
    
    //Valudacion de administrador
    if(type === "USUARIO"){
        return res.status(401).json({
            ok: false,
            msg: "No estas autorizado para realizar acciones de administrador"
        })
    }

    try {
        //Buscando al usuario
        const usuario = await Usuario.findById(userId);
        if(!usuario){
            return res.status(404).json({
                ok: false,
                msg: 'El usuario que quiere eliminar no existe en la base de datos'
            })
        };

        console.log(usuario._id);
        //Eliminando Usuario
        await Usuario.findByIdAndDelete(usuario._id);
            
        res.status(200).json({
            ok: true,
            msg: `El usuario ${usuario.nombre} con id ${usuario._id} ha sido eliminado`
        })
                
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Problema interno, intentelo de nuevo porfavor, si el problema persiste hable con el administrador'
                })
            }
    
}


const loginUsuario = async(req, res= response) =>{
    const {numeroC, password} = req.body
    try {

        let usuario = await Usuario.findOne({numeroC});
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningun usuario con el este numero de control'
            })
        }

        //confirmar las contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password)


        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            })
        };

        //Generar nuestro JWT
        const token = await generarToken(usuario.id, usuario.nombre, usuario.type);

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            name: usuario.nombre,
            lastName: usuario.apellidos,
            numeroC: usuario.numeroC,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Acerquese a los administradores para resolver el problema'
        })
        
    }
};

const revalidarToken = async(req, res = response) => {
    const {uid, name} = req;
    

    //Generar nuevo Token
    const token = await generarToken(uid,name)
    res.json({
        ok: true,
        token
    })
};


module.exports={
    crearUsuario,
    updateUser,
    getUsers,
    deleteUser,
    loginUsuario,
    revalidarToken
};