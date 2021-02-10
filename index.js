const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config')

// crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Base de datos
dbConnection();
// console.log(process.env)

// Rutas
app.get('/', (req, res) =>{
    res.status(200).json({
        ok:true,
        msg:'Hola Mundo'
    })
});
 
// para levantarlo
app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto: ' + process.env.PORT);
});

// usuario:mean_user
// contraseña: OaMe1umso8gEbGbB