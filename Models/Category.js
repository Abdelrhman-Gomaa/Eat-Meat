const mongoose = require('mongoose')

const categorySchema =  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picName: {
        type: String
    },
    url : {
        type: String
    }
});

const Category = mongoose.model('Category', categorySchema);

exports.categorySchema = categorySchema
exports.Category = Category