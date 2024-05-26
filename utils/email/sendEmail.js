// const config = !process.env.NODE_ENV ? require('config') : process.env;
const config =
    process.env.HOME !== '/root'
        ? //DEV
          require('config')
        : //PRODUCTION
          require('../../../porchlight-config/default.json'); // if there's no !process.env.HOME !== '/root' then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main

// Install with: npm install @trycourier/courier
// const { CourierClient } = require('@trycourier/courier');

// const courier = CourierClient({
//     authorizationToken: config['courierApiKey'],
// });

// Dependencies to install:
// $ npm install node-fetch --save

const fetch = require('node-fetch');

const sendEmail = async (email, payload) => {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config['courierApiKey']}`,
        },
        body: JSON.stringify({
            message: {
                brand_id: 'NK705MB72F4RXKQETMZE65SW4BS7',
                // routing: {
                //     method: 'single',
                //     channels: ['email'],
                // },
                channels: {
                    email: {
                        providers: ['smtp'],
                    },
                },
                providers: {},
                metadata: {
                    event: payload.event, //'FORGOT_PASSWORD',
                },
                to: {
                    //preferences: {},
                    email: email,
                },
                template: payload.template, //'WH46YVMBJ0MHFTGTP7T4CN7J1JQE',

                data: {
                    ...payload,
                },
            },
        }),
    };

    fetch('https://api.courier.com/send', options)
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
};

module.exports = sendEmail;
