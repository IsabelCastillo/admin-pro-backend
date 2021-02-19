const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {

    // Obtener el email y paswword del body
    const {password, email} = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});

        // Verificar email
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'No existe un usuario con ese email'
            })
        }

        // Verificar contraseña

        // Esto regresa un "true", si hacen match o "false" si no coinciden
        // trata de hashear el paswword que mandamos por body para comparar los passwords
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        console.log(validPassword, 'Comparación');

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar el TOKEN - JWT

        const token = await generarJWT(usuarioDB.id);


        res.status(200).json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Algo salio mal'
        })
        
    }
}

module.exports = {
    login
}

