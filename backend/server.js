// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../.env` });

const express = require('express');
const userRoutes = require('./routes/user');

// create express app
const app = express();

// add middlewares
app.use(express.json()); // accept JSON for POST and other request types

// connect API routes
app.use('/user', userRoutes);

// home route
app.get('/', (req, res) => {
  	res.send('It works!')
})

// run server
app.listen(process.env.BACKEND_PORT, () => {
  	console.log(`Balleilo backend listening at http://localhost:${process.env.BACKEND_PORT}`)
});
