const {response} = require('express');
//Importando el modelo de libros
const Libro = require('../models/Libro');


//Obtener todos los libros
const getLibros = async(req, res = response) =>{
    const libros = await Libro.find().populate('users', 'nombre apellidos numeroC carrera telefono type')
    res.json({
        ok: true,
        libros
    })
}

//Obtener libros por id o por nombre
const getLibroSearch = async(req, res = response) =>{ 
    //capturando el parametro
    const search = req.params.search   //string = true , number = false
    if(!search){
        return res.status(404).json({
            ok:false,
            msg: 'Peticion vacia'
        })
    }     
    
                    //Posibles consultas
        // const searchById = await Libro.findById(search);
        // console.log(searchById);

        // const serachByName = await Libro.find({nombreLibro: search})
        // console.log(serachByName);


        // const searchByCategory = await Libro.find({categoria: 'didácticos'})
        // console.log(searchByCategory);
    
}


const addLibro = async(req, res = response) =>{
    
    //Valudacion de administrador
    const type = req.type;

    if(type === "USUARIO"){
        return res.status(401).json({
            ok: false,
            msg: "No estas autorizado para realizar acciones de administrador"
        })
    };
    
    
    //Nueva instancia del libro
    const libro = new Libro(req.body);

    try {
        const nuevoLibro = await libro.save();
        res.status(201).json({
            ok: true,
            libro: nuevoLibro
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Pongase en contacto con el administrador'
        })
    }
}


const updateLibro = async(req, res = response) =>{

     //Valudacion de administrador
     const type = req.type;

     if(type === "USUARIO"){
         return res.status(401).json({
             ok: false,
             msg: "No estas autorizado para realizar acciones de administrador"
         })
     };

    const libroId = req.params.id;
    console.log(libroId);

    try {
        let libro = await Libro.findById(libroId)

        if(!libro){
            return res.status(404).json({
                ok: false,
                msg: 'El libro no esta registrado en la base de datos'
            })
        }

        const libroActualizado = {
            ...req.body,
        }
        console.log('no actulizado', libro);
        console.log('actulizado',libroActualizado);
        const actualizacion = await Libro.findByIdAndUpdate(libroId,libroActualizado, {new: true, useFindAndModify: false})

        res.status(200).json({
            ok: true,
            libro: actualizacion
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: "Acerquese a administracion"
        })
    }

}


const deleteLibro = async(req, res = response) =>{
    const libroId = req.params.id;

    //Valudacion de administrador
    const type = req.type;

    if(type === "USUARIO"){
        return res.status(401).json({
            ok: false,
            msg: "No estas autorizado para realizar acciones de administrador"
        })
    };

    try {
        const libro = await Libro.findById(libroId);

        if(!libro){
            return res.status(404).json({
                ok: false,
                msg: 'El libro no esta registrado en la base de datos'
            })
        };

        await Libro.findByIdAndDelete(libro._id);

        res.status(200).json({
            ok: true,
            msg: `El Libro ${libro.nombreLibro} con id ${libro._id} ha sido eliminado`
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
    getLibros,
    getLibroSearch,
    addLibro,
    updateLibro,
    deleteLibro
}


