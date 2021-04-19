const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

//Create server express
const app = express();

//DB
dbConnection();

//CORS
app.use(cors());

//Public directory
app.use(express.static('public'));

//Listening and body parser
app.use(express.json());

//Routes
//auth, create, login, renew
app.use('/api/auth', require('./routes/auth'));
//CRUD: Events
app.use('/api/events', require('./routes/envents'));

//Listening
app.listen(process.env.PORT, () => {
  console.log(`Server running in port: ${process.env.PORT}`);
});
