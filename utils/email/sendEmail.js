const config = !process.env.NODE_ENV ? require('config') : process.env;

// Install with: npm install @trycourier/courier
// const { CourierClient } = require('@trycourier/courier');

// const courier = CourierClient({
//     authorizationToken: 'dk_prod_GK12EN67ST45AYHV2XV9ZEN0YN2R',
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
            Authorization: 'Bearer dk_prod_GK12EN67ST45AYHV2XV9ZEN0YN2R',
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
