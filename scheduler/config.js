module.exports = {
    hostDigest: {
        frequency: '0 11 * * *', //everyday at 11:00AM
        // frequency: '44 12 * * *', //everyday at 12:44AM
        handler: __dirname + '/handlers/hostEmailDigest',
    },
};
