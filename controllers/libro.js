const {response} = require('express');
//Importando el modelo de libros
const Libro = require('../models/Libro');


//OBTENER TODOS LOS LIBROS
const getLibros = async(req, res = response) =>{
    const libros = await Libro.find().populate({path: 'prestamos', select: "user", populate:{path: 'user', select: '_id numeroC nombre apellidos fechaDevolucion devolucion' ,model: 'Usuario'}}  )
    //.populate({path: 'comments', populate:{path: 'user', select:'_id userName profilePhoto' ,model: 'User'}})
                                    
    res.json({
        ok: true,
        libros
    })
}

//BUSCAR LIBROS POR SU ID
const getLibroSearchById = async(req, res = response) =>{ 
    //capturando el parametro
    const search = req.params.search   //string = true , number = false
    console.log(search);
    if(!search){
        return res.status(404).json({
            ok:false,
            msg: 'Peticion vacia'
        })
    };     

    try {
            //Consulta
        const searchById = await Libro.findById(search)
                                                    .populate({path: 'prestamos', select: "user", populate:{path: 'user', select: '_id numeroC nombre apellidos fechaDevolucion devolucion' ,model: 'Usuario'}}  );
        console.log(searchById);
        
        if(searchById){
            return res.status(200).json({
                ok: true,
                libros: searchById
            });
        }else{
            return res.status(404).json({
                ok:false,
                msg: 'No se encontro ningun libro con ese ID'
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error interno, Verifique el ID e intente de nuevo, de lo contrario pongase en contacto con la administracion'
        })
    }
    
        
        
}
    
    
//BUSCAR LIBROS POR SU NOMBRE
const getLibroSearchByName = async(req, res = response) => {
    const search = req.params.search;
    
    if(!search){
        return res.status(404).json({
            ok:false,
            msg: 'Peticion vacia'
        })
    };

    try {
        //Primera busqueda
        let libros = await Libro.find({"nombreLibro": {'$regex': search}});
        console.log(libros);
        //Segunda busqueda con la letra capitalizada
        if(libros.length <= 0){
            console.log('Busqueda Capitalizada');
            const searchC = search[0].toUpperCase()+search.substring(1); //Capitalizando la busqueda
            librosC = await Libro.find({"nombreLibro": {'$regex': searchC}});
            //Si encontro algun libro con la letra capitalizada, retornalo
            if(librosC.length >=1){
    
                return res.status(200).json({
                    ok: true,
                    libros: librosC
                });
            }
            
        }
        
        //SI de plano no encontramos nada, retorna una respuesta notfound
        if(libros.length<=0){
            return res.status(404).json({
                ok:false,
                msg: 'No existen libros con este nombre'
            })
        }else{ //Si si encontramos algun libro retornalos
            return res.status(200).json({
                ok: true,
                libros
            });
        } 
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error interno, intente de nuevo, de lo contrario pongase en contacto con la administracion'
        })
    }
    
}


//BUSCAR LIBROS POR SU CATEGORIA
const getLibroSearchByCategory = async(req, res= response)=> {

        const categoria = req.params.search;
        console.log('categoria',categoria);

        if(!categoria){
            return res.status(404).json({
                ok:false,
                msg: 'Busqueda Vacia'
            })
        };

        try {
            
            const searchByCategory = await Libro.find({"categoria" : {"$regex" : categoria }})
            console.log('busqueda',searchByCategory);
    
             //Segunda busqueda con la letra capitalizada
            if(searchByCategory.length <= 0){
                console.log('Busqueda Capitalizada');
                const categoryC = categoria[0].toUpperCase()+categoria.substring(1); //Capitalizando la busqueda
                searchByCategoryC = await Libro.find({"categoria": {'$regex': categoryC}});
                //Si encontro algun libro con la letra capitalizada, retornalo
                if(searchByCategoryC.length >=1){
    
                    return res.status(200).json({
                        ok: true,
                        libros: searchByCategoryC
                        });
                    }
            }
    
            //SI de plano no encontramos nada, retorna una respuesta notfound
                if(searchByCategory.length<=0){
                    return res.status(404).json({
                        ok:false,
                        msg: 'No existen libros con este nombre'
                    })
                }else{ //Si si encontramos algun libro retornalos
                    return res.status(200).json({
                        ok: true,
                        libros: searchByCategory
                    });
                } 
        } catch (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Error interno, intente de nuevo, de lo contrario pongase en contacto con la administracion'
            })
        }

}
    
    
    
//AGREGAR UN NUEVO LIBRO
const addLibro = async(req, res = response) =>{
        
    //Valudacion de administrador
    const type = req.type;
    console.log(type);

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
            msg: 'Error al grabar en la base, intente de nuevo o pongase en contacto con el administrador'
        })
    }
}

//ACTUALIZAR UN LIBRO POR ID
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


//ELIMINAR UN LIBRO POR ID
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
    getLibroSearchById,
    getLibroSearchByName,
    getLibroSearchByCategory,
    addLibro,
    updateLibro,
    deleteLibro
}


