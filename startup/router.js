const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const categories = require('../Routes/category');
const MeatType = require('../Routes/meatType');
const busket = require('../Routes/busketOperation');
const user = require('../Routes/user');
const payment = require('../Routes/payement');
const {errorHandler, serverErrorHandler} = require('../middleware/errors')

module.exports = function (app) {
    app.use(cors())
    app.use(express.json());
    
    app.use('/api/busket', busket)

    app.use(express.static('images'))
    app.use('/api/categories' , categories)
    app.use('/api/meatType' , MeatType)
    app.use('/api', user)

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use('/api', payment)

    app.use(errorHandler)
    app.use(serverErrorHandler)
}