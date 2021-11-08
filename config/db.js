const mongoose = require('mongoose');
const config = require('../../porchlight-config/default.json'); //require('config');
const db = config['mongoURI'];

const connectDB = async () => {
  try {
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
