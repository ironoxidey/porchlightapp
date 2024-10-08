const jwt = require('jsonwebtoken');
// const config = !process.env.NODE_ENV ? require('config') : process.env;
const config =
    process.env.HOME !== '/root'
        ? //DEV
          require('config')
        : //PRODUCTION
          require('../../porchlight-config/default.json'); // if there's no !process.env.HOME !== '/root' then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main

//: require('../../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
//console.log('(auth.js) process.env: ', process.env);

module.exports = function (req, res, next) {
    // Get the token from header
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        // console.log('No token, authorization denied.');
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config['jwtSecret']);
        //const decoded = jwt.verify(token, process.env.jwtSecret);

        req.user = decoded.user;
        // console.log('Access granted');
        next();
    } catch (err) {
        // console.log('Token is not valid.');
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};
