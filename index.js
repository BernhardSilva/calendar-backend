const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');

//Create server express

const app = express();

//DB
dbConnection();

//Public directory
app.use(express.static('public'));

//Listening and body parser
app.use(express.json());

//Routes
app.use('/api/auth', require('./routes/auth'));
//TODO: auth, create, login, renew
//TODO: CRUD: Events

//Listening
app.listen(process.env.PORT, () => {
  console.log(`Server running in port: ${process.env.PORT}`);
});
