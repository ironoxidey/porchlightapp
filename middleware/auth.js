const jwt = require('jsonwebtoken');
const config = !process.env.NODE_ENV ? require('config') : process.env; //if there's no NODE_ENV then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
console.log('(auth.js) process.env: ', process.env);

module.exports = function (req, res, next) {
    // Get the token from header
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, config['jwtSecret']);
        //const decoded = jwt.verify(token, process.env.jwtSecret);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};
