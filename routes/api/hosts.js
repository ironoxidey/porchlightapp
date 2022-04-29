const express = require('express');
//const request = require('request'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
//const config = require('../../../porchlight-config/default.json');//require('config'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, body } = require('express-validator');

const addressGeocode = require('../../utils/maps/geocoding');

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
                    console.log(
                        'hostFields.numHostedBefore',
                        hostFields.numHostedBefore
                    );
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
                        let host = await Host.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            { $set: hostFields },
                            { new: true, upsert: true }
                        );
                        //const hosts = await Host.find();
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
    //console.log('numHostsUpdated:', await numHostsUpdated);
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
                    hostFields.email !== ''
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
                        // Using upsert option (creates new doc if no match is found):
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
                        res.json({ host: host, user: user });
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

// @route    GET api/hosts/edit
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
