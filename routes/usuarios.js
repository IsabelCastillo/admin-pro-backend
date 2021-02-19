 /*
 Ruta: /api/usuarios
*/

 const {check} = require('express-validator');
 const {validarCampos} = require('../middlewares/validar-campos')

 const {Router} = require('express');
 const {getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuarios} = require('../controllers/usuarios');
 const { validarJWT } = require('../middlewares/validar-jwt');
 const router = Router();

 router.get('/', validarJWT ,getUsuarios );

 router.post('/',
 [
     // Aqui indicamos que el campo no debe estar vacío.
     // El segundo argumento es el mensaje de error.
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('password', 'La contraseña es obligatoria').not().isEmpty(),
     check('email', 'El correo es obligatorio').isEmail(),
     // Siempre se debe llamar despues de llamar los checks
     validarCampos
 ]
  ,crearUsuarios);

// Tenemos que mandar el id del usuario que queremos actualizar
router.put('/:id',
 [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').isEmail(), 
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos,
 ]
,actualizarUsuario );

router.delete('/:id',validarJWT, borrarUsuarios)

 module.exports = router; 