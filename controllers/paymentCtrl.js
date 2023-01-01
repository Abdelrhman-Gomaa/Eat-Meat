const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getPage = (req, res, next) =>{
    try{
        res.render('Payment',{
            key: process.env.STRIPE_PUBLISH_KEY
        })
    }catch(error){
        next(error)
    }
};

exports.pay = (req, res, next) => {
    try{
        stripe.customers.create({
            email: req.body.stripeEmail,    
            source: req.body.stripeToken,
            name: 'Payement Method',
            address: {
                line1: 'Cairo - Egypt',
                postal_code: '110092',
                city: 'New Naser',
                state: 'Cairo',
                country: 'Egypt',
            }
        })
        .then((customer) => {
            return stripe.charges.create({
                amount: 7000, // Charing Rs 25
                description: 'Web Development Product',
                currency: 'USD',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send(`Success ${charge}`) // If no error occurs
        })
        .catch((err) => {
            res.send(err.message) // If some error occurs
        });
    }catch(error){
        next(error)
    }
};
