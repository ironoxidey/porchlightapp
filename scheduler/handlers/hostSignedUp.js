const sendEmail = require('../../utils/email/sendEmail');
const addressGeocode = require('../../utils/maps/geocoding');

const User = require('../../models/User');
const Event = require('../../models/Event');
const Host = require('../../models/Host');

module.exports = async () => {
    try {
        const hosts = await Host.find({
            adminEmailedForFollowUp: { $ne: true }, // $ne means "Not Equal" — I'm not sure every host has an "adminEmailedForFollowUp" field
            adminActive: { $ne: true }, // $ne means "Not Equal" — I'm not sure every host has an "adminActive" field
        });

        if (hosts.length > 0) {
            console.log(
                hosts.length +
                    (hosts.length > 1 ? ' new hosts' : ' new host') +
                    ' signed up.'
            );

            sendEmail('russellhein@gmail.com', {
                event: 'ADMIN_HOST_SIGNED_UP',
                template: 'TN2MJTQX0EM4C9K0YHJ89D243DVJ',
                hosts: [...hosts],
            });

            hosts.forEach(async (host) => {
                host.adminEmailedForFollowUp = true;
                host.markModified('adminEmailedForFollowUp');
                await host.save();
            });
        }
    } catch (err) {
        console.error(err.message);
        // res.status(500).send('Server Error');
    }
};
