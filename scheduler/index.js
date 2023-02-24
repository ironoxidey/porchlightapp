const cron = require('node-cron');
const { resolve } = require('path');

module.exports = {
    initCrons: (config) => {
        Object.keys(config).forEach((key) => {
            if (cron.validate(config[key].frequency)) {
                cron.schedule(config[key].frequency, () => {
                    console.log(key + ' cron triggered.');
                    // console.log(
                    //     'resolve(config[key].handler)',
                    //     resolve(config[key].handler)
                    // );
                    const handler = require(resolve(config[key].handler));
                    //const handler = config[key].handler;
                    handler();
                });
            } else {
                console.log('INVALID CRON FREQUENCY');
            }
        });
    },
};
