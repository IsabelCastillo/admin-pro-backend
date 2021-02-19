const jwt = require('jsonwebtoken');

// Función que retorna una promesa en la cual puedousar el await y esperar el token

const generarJWT = (uid) => {

    return new Promise( (resolve, reject) => {
        // El payload debe tener información que no sea sensible 
    const payload = {
        uid
    };

    // El sign es para crearlo
    // El JWT_SECRET viene del archivo .env
    // El segundo argumento va relacionado a la duración del Token
    // Luego de las opciones viene un callback
    jwt.sign(payload, process.env.JWT_SECRET, {
        // que expire en 12 horas
        expiresIn:'12h'
    }, (err, token) => {
        if(err){
            console.log(err);
            reject('No se pudo generar el JWT');
        } else{
            resolve(token);
        }
    });
    });
}

module.exports = {
    generarJWT
}