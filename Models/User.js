const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    picName: {
        type: String
    },
    url: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100
    },
    location: {
        type: String,
        required: true
    },
    phoneNum: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    codeVerifing: {
        type: String,
        required: false,
    }
});

const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema
exports.User = User