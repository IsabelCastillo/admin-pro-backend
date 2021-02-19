const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config')

// crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body (debe esta antes de sus rutas)
app.use(express.json());

// Base de datos
dbConnection();
// console.log(process.env)

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'))


 
// para levantarlo
app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto: ' + process.env.PORT);
});

// usuario:mean_user
// contraseña: OaMe1umso8gEbGbB