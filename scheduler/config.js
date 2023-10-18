module.exports = {
    hostDigest: {
        frequency: '0 11 * * *', //everyday at 11:00AM
        // frequency: '01 14 * * *', //everyday at 2:01AM
        handler: __dirname + '/handlers/hostEmailDigest',
    },
};
