// Install with: npm install @trycourier/courier
// const { CourierClient } = require('@trycourier/courier');

// const courier = CourierClient({
//     authorizationToken: 'dk_prod_GK12EN67ST45AYHV2XV9ZEN0YN2R',
// });

// Dependencies to install:
// $ npm install node-fetch --save

const fetch = require('node-fetch');

const sendEmail = async (email, payload) => {
    // const { messageId } = await courier.send({
    //   brand: "NK705MB72F4RXKQETMZE65SW4BS7",
    //   eventId: "WH46YVMBJ0MHFTGTP7T4CN7J1JQE",
    //   recipientId: "727c26ba-3499-4e9c-bee4-0bbee6a17f3d",
    //   profile: {
    //     email: email,
    //   },
    //   data: {
    //     name: payload.name,
    //     link: payload.link,
    //   },
    //   override: {
    //   },
    // });

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
                routing: {
                    method: 'single',
                    channels: [],
                },
                channels: {
                    email: {
                        providers: ['smtp'],
                    },
                },
                providers: {},
                metadata: {
                    event: 'FORGOT_PASSWORD',
                },
                to: {
                    preferences: {},
                    email: email,
                },
                template: 'WH46YVMBJ0MHFTGTP7T4CN7J1JQE',

                data: {
                    name: payload.name,
                    link: payload.link,
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
