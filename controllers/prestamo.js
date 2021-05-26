const {response} = require('express');
//Importando el modelo de prestamo
const Prestamo = require('../models/Prestamo')
const Usuario = require('../models/Usuario');


const getPrestamos = async(req, res = response) =>{     

    try {
        const prestamos = await Prestamo.find()//Relacion
                                                .populate('user userAdmin', 'nombre apellidos numeroC carrera telefono')
                                                .populate('libro', '_id nombreLibro autor editorial existencias ubicacion')
        res.status(200).json({
            ok: true,
            prestamos
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Acerque a la administracion'
        })
        
    }
}

const getPrestamoById = async(req, res = response) =>{
    console.log(req.params.id);
    const prestamo = await Prestamo.findById(req.params.id).populate('user userAdmin', 'nombre apellidos numeroC carrera telefono type')
    res.json({
        ok: true,
        prestamo
    })
}


const addPrestamo = async(req, res = response) =>{

     //Valudacion de administrador
     const type = req.type;
     if(type === "USUARIO"){
         return res.status(401).json({
             ok: false,
             msg: "No estas autorizado para realizar acciones de administrador"
         })
     };

    //Nueva instancia del libro
    const prestamo = new Prestamo(req.body);
    console.log(req.uid);
    try {
        prestamo.userAdmin = req.uid;
        
        const nuevoPrestamo = await prestamo.save();
        res.status(201).json({
            ok: true,
            prestamo: nuevoPrestamo
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Pongase en contacto con el administrador'
        })
    }
}


const updatePrestamo = async(req, res = response) =>{
    const prestamoId = req.params.id;

     //Valudacion de administrador
     const type = req.type;
     if(type === "USUARIO"){
         return res.status(401).json({
             ok: false,
             msg: "No estas autorizado para realizar acciones de administrador"
         })
     };

     try {
         const prestamo = await Prestamo.findById(prestamoId);
     
         if(!prestamo){
             return res.status(404).json({
                 ok: false,
                 msg: "Este prestamo no esta registrado en la base de datos, favor de verificar el id"
             })
         }
         const nuevoPrestamo = {
             ...req.body,
             user: prestamo.user,
             userAdmin: req.uid
         }
     
         const prestamoActualizado = await Prestamo.findOneAndUpdate(prestamoId,nuevoPrestamo, {new: true, useFindAndModify: false})
         console.log(prestamoActualizado);
         res.status(200).json({
             ok: true,
             evento: prestamoActualizado
         })
         
     } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Problema interno, Verifique el id del libro, si el problema persiste hable con el administrador'
        })
     }

}


const deletePrestamo = async(req, res = response) =>{
      const prestamoId = req.params.id;  
     //Valudacion de administrador
     const type = req.type;
     if(type === "USUARIO"){
         return res.status(401).json({
             ok: false,
             msg: "No estas autorizado para realizar acciones de administrador"
         })
     };

     try {
        const prestamo = await Prestamo.findById(prestamoId).populate('user', 'nombre');

        if(!prestamo){
            return res.status(404).json({
                ok: false,
                msg: 'Este prestamo no existe en la base de datos'
            })
        };

        await Prestamo.findByIdAndDelete(prestamo._id);

        res.status(200).json({
            ok: true,
            msg: `El prestamo del libro ${prestamo.libro} al usuario ${prestamo.user.nombre} ha sido eliminado`
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Problema interno, Verifique el id del libro, si el problema persiste hable con el administrador'
        })
    }
}


module.exports = {
    getPrestamos,
    getPrestamoById,
    addPrestamo,
    updatePrestamo,
    deletePrestamo
}


