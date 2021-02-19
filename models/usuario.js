const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: true

    },
    email:{
        type: String,
        required: [true, 'El email es requerido'],
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    img:{
        type: String
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google:{
        type: Boolean,
        default: false
    }
});

// Configuración para cambiar como se muestra el id, en lugar de _id

// 1. sobre escribimos el metodo y buscamos el toJSON
// 2. Extraemos las propiedades de la instancia del objeto actual, hasta aqui, si lo probamos en postman, desaparece el id
// 3. como necesitamos el id, lo definimos 
// Es una configuracion en el esquema, global, todas las instancias de usuario tendran esa configuración, si pasan por el .toJSON
// Es para fines visuales, no afecta la base de datos
UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);