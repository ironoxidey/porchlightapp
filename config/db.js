const mongoose = require('mongoose');
const config =
    !process.env.HOME !== '/root'
        ? //DEV
          require('config')
        : //PRODUCTION
          require('../../porchlight-config/default.json'); // if there's no !process.env.HOME !== '/root' then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main

//: require('../../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
const db = config['mongoURI'];

console.log(`Database URI: ${db}`);
console.log(`process.env.HOME: ${process.env.HOME}`);

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true, //deprecated
            // useFindAndModify: false, //deprecated
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
