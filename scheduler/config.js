module.exports = {
    hostDigest: {
        frequency: '0 11 * * *', //everyday at 11:00AM
        handler: __dirname + '/handlers/hostEmailDigest',
    },
};
