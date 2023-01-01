const mongoose = require('mongoose')

const meatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picName: {
        type: String
    },
    url: {
        type: String
    },
    categId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    salary: {
        type: Number,
        required: true,
    },
    sale: {
        type: Number,
        required: true,
    },
    salaryAfterSale: {
        type: Number,
        required: true,
    },
    TotalSalary: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
});

const meatTypeModel = mongoose.model('MeatType', meatSchema);

exports.meatSchema = meatSchema
exports.MeatType = meatTypeModel