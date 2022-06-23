const express = require('express');
//const request = require('request'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
const config = !process.env.NODE_ENV ? require('config') : process.env;
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, body } = require('express-validator');
const mailchimp = require('@mailchimp/mailchimp_marketing');
//const crypto = require('crypto'); //for hashing the host's email before sending to MailChimp
const md5 = require('md5'); //for hashing the host's email before sending to MailChimp

const addressGeocode = require('../../utils/maps/geocoding');
const addressTimezone = require('../../utils/maps/timezone');

const User = require('../../models/User');
const Host = require('../../models/Host');

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

function firstInt(inputString) {
    const ints = String(inputString).match(/\d+/g); //returns an array of numbers
    //console.log('hosts route - ints:', ints);
    if (ints && ints.length > 0) {
        return ints[0];
    } else {
        return 0;
    }
}

// @route    GET api/hosts/me
// @desc     Get current user's host profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        //console.log(req.user);
        const host = await Host.findOne({
            email: req.user.email,
        }); //.select('-hadMeeting -sentFollowUp -notes');
        if (!host) {
            return res.json({
                email: req.user.email,
                msg:
                    'There is no host profile yet for ' +
                    req.user.email +
                    '. No worries, we’ll make one!',
            });
        }

        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/hosts/admin-update
// @desc     Batch create or update hosts
// @access   Private
router.post('/admin-update', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.user);
    let numHostsUpdated = 0;
    if (req.body instanceof Array) {
        await Promise.all(
            req.body.map(async (hostFields) => {
                hostFields.stageName && hostFields.stageName.length > 0
                    ? (hostFields.slug = convertToSlug(hostFields.stageName))
                    : '';

                if (hostFields.numDraw) {
                    //console.log('hostFields.numDraw', hostFields.numDraw);
                    const numDraw = firstInt(hostFields.numDraw);
                    if (numDraw && numDraw > 0) {
                        hostFields.numDraw = numDraw;
                    } else {
                        delete hostFields.numDraw;
                    }
                }
                if (hostFields.numHostedBefore) {
                    // console.log(
                    //     'hostFields.numHostedBefore',
                    //     hostFields.numHostedBefore
                    // );
                    const numHostedBefore = firstInt(
                        hostFields.numHostedBefore
                    );
                    if (numHostedBefore && numHostedBefore > 0) {
                        hostFields.numHostedBefore = numHostedBefore;
                    } else {
                        delete hostFields.numHostedBefore;
                    }
                }
                if (hostFields.maxNumAttendees) {
                    // console.log(
                    //     'hostFields.maxNumAttendees',
                    //     hostFields.maxNumAttendees
                    // );

                    const maxNumAttendees = firstInt(
                        hostFields.maxNumAttendees
                    );
                    if (maxNumAttendees && maxNumAttendees > 0) {
                        hostFields.maxNumAttendees = maxNumAttendees;
                    } else {
                        delete hostFields.maxNumAttendees;
                    }
                }

                //if (req.user.role === 'ADMIN' && hostFields.email !== '') {
                if (
                    req.user.role &&
                    req.user.role.indexOf('ADMIN') != -1 &&
                    hostFields.email !== ''
                ) {
                    //console.log("User is ADMIN and has authority to update all other users.");
                    try {
                        //console.log(hostFields);
                        // Using upsert option (creates new doc if no match is found):

                        // let host = await Host.findOneAndUpdate(
                        //     { email: hostFields.email.toLowerCase() },
                        //     { $set: hostFields },
                        //     { new: true, upsert: true }
                        // );

                        //const hosts = await Host.find();

                        const geocodedAddress = await addressGeocode(
                            hostFields.streetAddress +
                                ' ' +
                                hostFields.city +
                                ', ' +
                                hostFields.state +
                                ' ' +
                                hostFields.zipCode
                        );
                        console.log(
                            hostFields.firstName +
                                ' ' +
                                hostFields.lastName +
                                '’s geocodedAddress is: ',
                            geocodedAddress
                        );
                        hostFields.latLong = {
                            type: 'Point',
                            coordinates: geocodedAddress,
                        };
                        hostFields.geocodedStreetAddress =
                            hostFields.streetAddress;
                        hostFields.geocodedCity = hostFields.city;
                        hostFields.geocodedState = hostFields.state;
                        hostFields.geocodedZipCode = hostFields.zipCode;
                        hostFields.mailChimped = true;

                        console.log('hostFields', hostFields);

                        const session = await Host.startSession();

                        let host = {};
                        await session.withTransaction(async () => {
                            // Creates one document with the given session. Note the `[]`!
                            host = await Host.create([{ ...hostFields }], {
                                session,
                            });
                        });

                        //let host = await Host.create([{ hostFields }]);
                        numHostsUpdated++;
                        res.json(host);
                    } catch (err) {
                        console.error(err.message);
                        //res.status(500).send('Server Error: ' + err.message);
                    }
                } else {
                    console.error(
                        "You don't have authority to make these changes."
                    );
                    res.status(500).send(
                        'User does not have authority to make these changes.'
                    );
                }
            })
        );
    }
    console.log('numHostsUpdated:', await numHostsUpdated);
});

// @route    POST api/hosts/updateMe
// @desc     Create or update my host profile (copy of /batch)
// @access   Private
router.post('/updateMe', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    if (req.body instanceof Array) {
        let hostCount = 0;
        await Promise.all(
            req.body.map(async (hostFields) => {
                //if (req.user.role === 'ADMIN' && hostFields.email !== '') {
                if (
                    req.user.role &&
                    req.user.role.indexOf('ADMIN') != -1 &&
                    hostFields.email !== '' &&
                    req.user.email.toLowerCase() !==
                        hostFields.email.toLowerCase() //AND not ADMIN trying to update their own account
                ) {
                    //console.log("User is ADMIN and has authority to update all other users.");
                    try {
                        //console.log(hostFields);
                        // Using upsert option (creates new doc if no match is found):
                        if (
                            req.user.email.toLowerCase() ===
                            hostFields.email.toLowerCase()
                        ) {
                            hostFields.user = req.user.id;
                        }

                        let host = await Host.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            { $set: hostFields },
                            { new: true, upsert: true }
                        ); //.select('-hadMeeting -sentFollowUp -notes');
                        let user = await User.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            {
                                $addToSet: { role: 'HOST' },
                                $set: { hostProfile: host.id },
                            },
                            { new: true }
                        ).select('-password');
                        hostCount++;
                        //res.json(host);
                        res.json({ host: host, user: user });
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error: ' + err.message);
                    }
                } else if (
                    req.user.email.toLowerCase() ===
                    hostFields.email.toLowerCase()
                ) {
                    //if the request user email matches the host email they have authority to edit their own profile
                    try {
                        hostFields.user = req.user.id;
                        //console.log('hostFields', hostFields);

                        let locationChanged = false;
                        //IF THERE'S A DIFFERENCE BETWEEN THE hostFields.streetAddress AND THE hostFields.geocodedStreetAddress THEN THE HOST UPDATED THEIR LOCATION, AND A NEW LATLONG NEEDS TO BE GENERATED
                        if (
                            hostFields.streetAddress !==
                                hostFields.geocodedStreetAddress ||
                            hostFields.city !== hostFields.geocodedCity ||
                            hostFields.state !== hostFields.geocodedState ||
                            hostFields.zipCode !== hostFields.geocodedZipCode
                        ) {
                            locationChanged = true;
                            //geocode with Google Maps API
                            const hostAddress =
                                hostFields.streetAddress +
                                ' ' +
                                hostFields.city +
                                ', ' +
                                hostFields.state +
                                ' ' +
                                hostFields.zipCode;
                            const geocodedAddress = await addressGeocode(
                                hostAddress
                            );
                            const timezoneAddress = await addressTimezone(
                                geocodedAddress
                            );
                            // console.log(
                            //     host.firstName +
                            //         ' ' +
                            //         host.lastName +
                            //         '’s geocodedAddress is: ',
                            //     geocodedAddress
                            // );
                            hostFields.latLong = {
                                type: 'Point',
                                coordinates: geocodedAddress,
                            };
                            hostFields.timezone = timezoneAddress.timeZoneId;
                            hostFields.timezoneOffset =
                                timezoneAddress.rawOffset / 3600; //rawOffset is the offset from UTC (in seconds) for the given location. dividing rawOffset by 3600 you can get the GMT time of your requested time zone
                            hostFields.geocodedStreetAddress =
                                hostFields.streetAddress;
                            hostFields.geocodedCity = hostFields.city;
                            hostFields.geocodedState = hostFields.state;
                            hostFields.geocodedZipCode = hostFields.zipCode;
                        }

                        // Using upsert option (creates new doc if no match is found):
                        let host = await Host.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            { $set: hostFields },
                            { new: true, upsert: true, rawResult: true } //https://mongoosejs.com/docs/tutorials/findoneandupdate.html#raw-result
                        ); //.select('-hadMeeting -sentFollowUp -notes');

                        //console.log('host returned', host);

                        //ADD HOST TO MAILCHIMP
                        mailchimp.setConfig({
                            apiKey: config['mailChimpApiKey'],
                            server: 'us8',
                        });
                        if (
                            hostFields.completedProfileForm === true && //if the host has completed the form
                            hostFields.streetAddress &&
                            hostFields.city &&
                            hostFields.state && //and provided city, state, and zip, and phone
                            hostFields.zipCode &&
                            hostFields.phone &&
                            (host.lastErrorObject.updatedExisting === false || //and if it did not update an existing object, then it's new //https://mongoosejs.com/docs/tutorials/findoneandupdate.html#raw-result
                                hostFields.mailChimped == false || //or if this host hasn't been mailChimped
                                locationChanged === true) //OR their location changed
                        ) {
                            const sendToMailChimp = async () => {
                                try {
                                    const hostEmail =
                                        hostFields.email.toLowerCase();
                                    //const hashedEmail = crypto.createHash('md5').update(hostEmail).digest('hex');
                                    const hashedEmail = md5(hostEmail);

                                    console.log(
                                        'sending ' +
                                            hostEmail +
                                            ' (' +
                                            hashedEmail +
                                            ') to MailChimp.'
                                    );

                                    const response =
                                        await mailchimp.lists.setListMember(
                                            '57439ec968',
                                            hashedEmail,
                                            {
                                                email_address: hostEmail,
                                                status_if_new: 'pending',
                                                merge_fields: {
                                                    FNAME: hostFields.firstName,
                                                    LNAME: hostFields.lastName,
                                                    ADDRESS: {
                                                        addr1: hostFields.streetAddress,
                                                        city: hostFields.city,
                                                        state: hostFields.state,
                                                        zip: hostFields.zipCode.toString(),
                                                    },
                                                    PHONE: hostFields.phone,
                                                },
                                            }
                                        );
                                    // console.log(
                                    //     'mailChimp response:',
                                    //     response
                                    // );
                                } catch (err) {
                                    console.log('mailChimp error:', err);
                                }
                            };
                            sendToMailChimp();
                            host = await Host.findOneAndUpdate(
                                { email: hostFields.email.toLowerCase() },
                                {
                                    mailChimped: true,
                                },
                                { new: true, rawResult: true }
                            );
                        }

                        let user = await User.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            {
                                $addToSet: { role: 'HOST' },
                                $set: { hostProfile: host.value.id },
                            },
                            { new: true }
                        ).select('-password');
                        hostCount++;
                        res.json({ host: host.value, user: user });
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error');
                    }
                } else {
                    console.error(
                        req.user.email +
                            " doesn't have authority to make these changes."
                    );
                    res.status(500).send(
                        'User does not have authority to make these changes.'
                    );
                }
            })
        );
        //res.json(hostCount + " host(s) submitted to the database."); //eventually remove this
    }
});

// @route    GET api/hosts
// @desc     Get all active hosts' city State Zip
// @access   Public
router.get('/', async (req, res) => {
    try {
        const hosts = await Host.find().select(['city', 'state', 'zipCode']);
        res.json(hosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/hosts/edit
// @desc     [ADMIN] Get all hosts for editing (everything)
// @access   Private
router.get('/edit', [auth], async (req, res) => {
    //if (req.user.role === 'ADMIN') {
    if (req.user.role && req.user.role.indexOf('ADMIN') != -1) {
        //must be an ADMIN to get into all of this!
        try {
            const hosts = await Host.find();

            // hosts.forEach(host => {
            //   //if no time exists in host.zoomDate {
            //   if (host.zoomDate == null){
            //     //async hit up Calendly for Scheduled events with host.email as the invitee_email {

            //       //store collection[collection.length()-1].start_time in host.zoomDate

            //   }
            // });

            res.json(hosts);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(500).send('Only ADMINs can edit all hosts.');
    }
});

// @route    GET api/hosts/getAllHostLatLong
// @desc     [ADMIN] Get all hosts for editing (everything)
// @access   Private
router.get('/getAllHostLatLong', [auth], async (req, res) => {
    //if (req.user.role === 'ADMIN') {
    if (req.user.role && req.user.role.indexOf('ADMIN') > -1) {
        //must be an ADMIN to get into all of this!
        try {
            //https://masteringjs.io/tutorials/mongoose/update#using-documentupdateone
            const hosts = await Host.find();

            //console.log('hosts', hosts);
            hosts.forEach(async (host) => {
                //if !latLong {
                if (
                    host.firstName &&
                    host.lastName &&
                    host.streetAddress &&
                    host.city &&
                    host.state &&
                    host.zipCode &&
                    host.latLong.coordinates.length <= 0
                ) {
                    //geocode with Google Maps API
                    const geocodedAddress = await addressGeocode(
                        host.streetAddress +
                            ' ' +
                            host.city +
                            ', ' +
                            host.state +
                            ' ' +
                            host.zipCode
                    );
                    // console.log(
                    //     host.firstName +
                    //         ' ' +
                    //         host.lastName +
                    //         '’s geocodedAddress is: ',
                    //     geocodedAddress
                    // );
                    host.latLong.coordinates = geocodedAddress;
                    // host.longitude = geocodedAddress[0];
                    // host.latitude = geocodedAddress[1];
                    host.markModified('latLong');
                    //save in host doc
                    await host.save();
                }
                if (
                    host.latLong.coordinates.length > 0 &&
                    (!host.timezone || !host.timezoneOffset)
                ) {
                    const timezoneAddress = await addressTimezone(
                        host.latLong.coordinates
                    );
                    host.timezone = timezoneAddress.timeZoneId;
                    host.timezoneOffset = timezoneAddress.rawOffset / 3600; //rawOffset is the offset from UTC (in seconds) for the given location. dividing rawOffset by 3600 you can get the GMT time of your requested time zone

                    console.log(
                        host.firstName +
                            ' ' +
                            host.lastName +
                            '’s timezone is: ',
                        timezoneAddress
                    );
                    await host.save();
                }
            });

            res.json(hosts);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(500).send('Only ADMINs can edit all hosts.');
    }
});

// @route    DELETE api/hosts
// @desc     Delete host, user & posts
// @access   Private
// router.delete('/', auth, async (req, res) => {
//   try {
//     // Remove user posts
//     await Post.deleteMany({ user: req.user.id });
//     // Remove host
//     await Host.findOneAndRemove({ user: req.user.id });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.user.id });

//     res.json({ msg: 'User deleted' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
