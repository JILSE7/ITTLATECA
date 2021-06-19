const {response} = require('express');
const Libro = require('../models/Libro');
//Importando el modelo de prestamo
const Prestamo = require('../models/Prestamo')
const Usuario = require('../models/Usuario');


const getPrestamos = async(req, res = response) =>{     

    try {
        const prestamos = await Prestamo.find()//Relacion
                                                .populate('user userAdmin', 'nombre apellidos numeroC carrera telefono')
                                                .populate('libro', '_id nombreLibro autor editorial existencias disponibles ubicacion')
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

     try{

        const {user, libro: libroId}  = req.body; //Extrayendo usuario y libro de la peticion
        
        //Verificando que no se dupliquen los prestamos
        const prestamoV = await Prestamo.find({"user": user, "libro" :libroId, "devolucion": false});
        console.log(prestamoV);
        if(prestamoV.length>0){
            return res.status(401).json({
                ok: false,
                msg: 'Este usuario ya ha retirado este libro'
            })
        }


        //Extrayendo las existencias del libro
        const libroB = await Libro.findById(libroId);
        //EXtrayendo los prestamos del usuario
        const {prestamos: prestamosUsuario} = await Usuario.findById(user).select('prestamos')
        
        if(!libroB){
            return res.status(404).json({
                ok:false,
                msg: 'Libro no encontrado, verifique el Id del libro'
            })
        }else if(libroB.disponibles == 0 || libroB.existencias == 0){
            return res.status(400).json({
                ok:false,
                msg: 'Lo sentimos, ya no quedan libros disponibles de este titulo'
            })
        }
        
        
  
        //Nueva instancia del prestamo
        const prestamo = new Prestamo(req.body);

        //prestamo.userAdmin = req.uid;
        //Grabando el prestamo en la bd
        const nuevoPrestamo = await prestamo.save();
        //actualizando los libros disponibles del libro
        await Libro.findByIdAndUpdate(libroId,{"disponibles": String(Number(libroB.disponibles) - 1)},{useFindAndModify:true})
        await Usuario.findByIdAndUpdate(user, {prestamos: [...prestamosUsuario, nuevoPrestamo._id]})
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

        const prestamo = await Prestamo.findById(prestamoId); //buscando el prestamo
        if(!prestamo){//si no existe el prestamo
             return res.status(404).json({
                 ok: false,
                 msg: "Este prestamo no esta registrado en la base de datos, favor de verificar el id"
             })
         }

         //NUevo prestamo actualizado
         const nuevoPrestamo = {
             ...req.body
            }


            //EXtrayendo los prestamos del usuario
            const {prestamos: prestamosUsuario} = await Usuario.findById(prestamo.user).select('prestamos')
            console.log('prestamos del usuario', prestamosUsuario); 
            
            
            //Si se quiere realizar la devolucion del libro
            if(nuevoPrestamo.devolucion){
                
                //Extrayendo info del libro
                const libro = await Libro.findById(prestamo.libro);
                const {disponibles, existencias} = libro;
                
                
                if(disponibles == 0 || disponibles >= existencias){ //Si ya no hay mas
                    return res.status(404).json({
                        ok: false,
                        msg: "Ya no puedes realizar mas devoluciones, porque ya no tienes mas existencias de este titulo"
                    })
                }
                //Devolviendo libro
                await Libro.findByIdAndUpdate(prestamo.libro,{ "disponibles": String(Number(disponibles) + 1)});
                
            //Quitando el prestamo al usuario
            const newPrestamosUsuario = prestamosUsuario.filter(prestamo => prestamo != prestamoId);
            
            await Usuario.findByIdAndUpdate(prestamo.user, {prestamos: newPrestamosUsuario});
        } 


        //ACTUALIZANDO EL PRESTAMO
        const prestamoActualizado = await Prestamo.findByIdAndUpdate(prestamoId,nuevoPrestamo, {new: true, useFindAndModify: true})
        console.log('prestamoActualizado', prestamoActualizado);
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


