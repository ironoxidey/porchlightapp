module.exports = {
    hostDigest: {
        frequency: '30 7 * * *', //everyday at 7:30AM
        handler: __dirname + '/handlers/hostEmailDigest',
    },
};
