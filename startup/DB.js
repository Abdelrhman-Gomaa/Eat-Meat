const mongoose = require('mongoose');


module.exports = () => {
    mongoose
        .connect(
            process.env.DB_PATH,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then( () => console.log('connect to mongoDB Atlas'))
        .catch(err => console.error('Cannot Connect to mongoDB x x x',err));
}