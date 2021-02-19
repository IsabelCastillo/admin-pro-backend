//Importación del modelo de usuarios
// La U debe ir en mayuscula porque va ser un objeto que nos va permitir crear instancias, 
// se recomienda ponerla asi porque es un modelo o una clase  
const Usuario = require('../models/usuario');

const {response} = require('express');

// paquete para encriptar contraseñas
const bcrypt = require('bcryptjs');

// Generar Token
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) =>{
    // LLaves para especificar un filtro y como segundo argumento las propiedades a mostrar
    const usuarios = await Usuario.find({}, 'nombre email role google');
    res.json({
        ok:true,
        usuarios,
        // Con esta linea podemos mostrar el id del usuario que realizo la petición
        // uid: req.uid
    });
}

const crearUsuarios = async (req, res = response) =>{

    // ¿Cómo leer el body?
    // En la req esta lo que el usuario esta solicitando, la petición del usuario y ahi viene el body
    console.log(req.body)

    // Podemos extrer la información de la siguiente manera, son los campos que tenemos en nuestro modelo
    const {email, password} = req.body;

    try {

        const existeEmail = await Usuario.findOne({email});
        console.log(existeEmail, 'Existe');

        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya está registrado'
            });
        }
    // Se debe importar el modelo
    // Se crea una instancia del objeto Usuarios y le mandamos como argumentos el req.body

    const usuario = new  Usuario(req.body);

    console.log(usuario, 'Usuario = Model')

    // si lo queremos grabar en la BD solo escribimos esto
    // el await se usa para que espere a que se resuelva la promesa para poder seguir, 
    // por lo cual en la funcion debemos llamar el async para poder usar el await
    
    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    

    // Guardar usuario
    await usuario.save();

    // Generar el TOKEN - JWT
       const token = await generarJWT(usuario.id);

    res.json({
        ok:true,
        usuario,
        token
    });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado... revisar logs',
            // cont: {
            //     error: Object.keys(error).length === 0 ? error.message : error
            // }
        });

    } 
}

const actualizarUsuario = async (req, res = response) => {
  // TODO: validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try {

        const usuarioBD = await Usuario.findById(uid);

        if(!usuarioBD){
            return res.status(400).json({
                ok:false,
                msg: 'No existe un usuario con ese id'
            })
        }

        // Actualización
        const {password, google, email, ...campos} = req.body;

        console.log(usuarioBD.email, 'usuarioBD');
        console.log(email, 'email. body');

        if(usuarioBD.email !== email){
            const existeEmail = await Usuario.findOne ({email});

            console.log(existeEmail, 'ya esta')

            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        console.log(usuarioActualizado, 'se actualizo')

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuarios = async(req, res = response) =>{

    const uid =  req.params.id;
    console.log(uid)
   
    try {

        // Buscar si el usuario existe
        const usuarioBD = await Usuario.findById(uid);
        if(!usuarioBD){
            return res.status(400).json({
                ok:false,
                msg: 'No existe un usuario con ese id'
            })
        }

        // Si lo encuentra lo va eliminar
        await Usuario.findByIdAndDelete( uid);
       
        res.status(200).json({
            ok:true,
            msg: 'Usuario eliminado'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:' Error inesperado'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuarios
}