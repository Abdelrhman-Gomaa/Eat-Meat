const { date } = require('joi');
const { now } = require('lodash');
const mongoose = require('mongoose')

const busketModel = mongoose.model('Busket', mongoose.Schema({
    userName: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    // itemName , SalaryAfterSale
    item: [{
        meatType :  {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'MeatType'
        },
        count:{
            type: Number,
            required: true,
        }
    }],
    salary: [ 
        {
        type: Number,
        required: true
    }
    ],
    date: { 
        type: Date,
        default: Date.now
    },
    totalSalary: [ 
    {
       type: Number,
        required: true
    }
    ],
    payment:{
        type: Number,
        required: true
    },
    paid:{
        type: Number,
        required: true
    },
    refund:{
        type: Number,
        required: true
    },
    paidAfterRefund:{
        type: Number,
        required: true
    }
}));


exports.Busket = busketModel