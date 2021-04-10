// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../.env` });

const cors = require('cors');
const express = require('express');
const db = require('./lib/db');
const auth = require('./middlewares/auth');
const parserRoutes = require('./routes/parser');
const userRoutes = require('./routes/user');

// connect to mongo
db.connect();

// create express app
const app = express();

// add middlewares
app.use(cors()); // enable CORS for all origins
app.use(express.json()); // accept JSON for POST and other request types

// API routes without authorization
app.use('/user', userRoutes);

// API routes with authorization
app.use(auth.restrict); // check "Authorization" for valid API token
app.use('/parser', parserRoutes);

// home route
app.get('/', (req, res) => {
  	res.send('It works!')
});

// run server
app.listen(process.env.BACKEND_PORT, () => {
  	console.log(`Balleilo backend listening at http://localhost:${process.env.BACKEND_PORT}`)
});
