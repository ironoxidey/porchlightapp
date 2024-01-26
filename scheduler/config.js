module.exports = {
    hostDigest: {
        frequency: '0 11 * * *', //everyday at 11:00AM
        // frequency: '45 00 * * *', //everyday at 2:01AM
        handler: __dirname + '/handlers/hostEmailDigest',
    },
    hostSignedUp: {
        frequency: '0 8-20 * * *', //At minute 0 past every hour from 8 through 20
        //frequency: '07 23 * * *', //everyday at 11:07AM
        handler: __dirname + '/handlers/hostSignedUp',
    },
};
