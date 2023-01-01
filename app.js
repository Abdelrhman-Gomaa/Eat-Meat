require('dotenv').config();
const express = require('express');
const app = express();

// Connect to MongoDB 
require('./startup/DB')();

// call routers
require('./startup/router')(app);

// Open Localhost Port || 3000
const port = process.env.PORT || 3000;
app.listen(port , ()=>{
    console.log(`Server Listening on port ${port}`)
});