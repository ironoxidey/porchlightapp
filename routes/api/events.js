const express = require('express');
const request = require('request'); //for eventBrite
const _ = require('lodash');
const { DateTime } = require('luxon'); //for sending dateTimes in the right timezone to eventBrite
const config = !process.env.NODE_ENV ? require('config') : process.env;
var mongoose = require('mongoose');
//const request = require('request'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
//const config = require('../../../porchlight-config/default.json');//require('config'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, body } = require('express-validator');

const User = require('../../models/User');
const Event = require('../../models/Event');
const Host = require('../../models/Host');

const sendEmail = require('../../utils/email/sendEmail');
const addressGeocode = require('../../utils/maps/geocoding');

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

function firstInt(inputString) {
    const ints = inputString.match(/\d+/g); //returns an array of numbers
    //console.log('events route - ints:', ints);
    if (ints && ints.length > 0) {
        return ints[0];
    } else {
        return 0;
    }
}

// @route    POST api/events/
// @desc     Create or Update an event based on bookingWhen, and who created it
// @access   Private
router.post('/', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let eventFields = req.body;

    let userRole = req.user.role;

    if (userRole && userRole.indexOf('HOST') === -1) {
        //if the requesting user doesn't have the HOST role, check the database for the requesting user and see if they have the HOST user role there (this can happen if they just filled out the "Sign Up to Host" form but haven't relogged-in to update their auth token with the new HOST role)
        let user = await User.findOne({ email: req.user.email }).select('role');
        //console.log('User has these roles: ', user);
        userRole = user.role;
    }
    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (
        userRole &&
        userRole.indexOf('HOST') > -1 &&
        eventFields.createdBy === 'HOST' &&
        eventFields.bookingWhen &&
        eventFields.bookingWhere
    ) {
        //console.log("User is HOST and can raise their hand to book shows.");
        try {
            //console.log('eventFields', eventFields);

            let host = await Host.findOne({
                email: req.user.email.toLowerCase(),
            });

            let event = await Event.findOneAndUpdate(
                {
                    confirmedHost: host._id,
                    bookingWhen: eventFields.bookingWhen,
                    createdBy: 'HOST',
                },
                {
                    bookingWhen: eventFields.bookingWhen,
                    bookingWhere: eventFields.bookingWhere,
                    createdBy: 'HOST',
                    confirmedHost: host._id,
                    $addToSet: {
                        hostsOfferingToBook: req.user.email,
                        offersFromHosts: {
                            ...eventFields.theOffer,
                            host: host._id,
                        },
                    },
                },
                { new: true, upsert: true }
            );

            //Geocode the event
            if (
                ((event.latLong &&
                    event.latLong.coordinates &&
                    event.latLong.coordinates.length == 0) || //if there is no latLong OR
                    !event.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
                    (event.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
                        event.bookingWhere.zip !==
                            event.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
                event.bookingWhere &&
                event.bookingWhere.city &&
                event.bookingWhere.state &&
                event.bookingWhere.zip
            ) {
                //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
                const address =
                    event.bookingWhere.city +
                    ', ' +
                    event.bookingWhere.state +
                    ' ' +
                    event.bookingWhere.zip;
                const geocodedAddress = await addressGeocode(address);
                // console.log(
                //     updatedEvents +
                //         ') ' +
                //         event.artist.stageName +
                //         ' wants to play a concert near ' +
                //         address +
                //         ': ',
                //     geocodedAddress
                // );

                let savedDetails = await event.updateOne(
                    {
                        'latLong.coordinates': geocodedAddress,
                        geocodedBookingWhere: event.bookingWhere,
                    },
                    { new: true }
                );
                // if (savedDetails) {
                //     console.log(
                //         'savedDetails:',
                //         savedDetails
                //     );
                // }
            }
            //end geocoding

            //res.json(event);
            //console.log('event', event);
            res.json(event);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else if (
        userRole &&
        userRole.indexOf('ARTIST') > -1 &&
        eventFields.createdBy === 'ARTIST' &&
        eventFields.bookingWhen &&
        eventFields.bookingWhere
    ) {
        //if eventFields.createdBy === 'ARTIST', delete "preferredArtists" because it could carry-over from an event they proposed as a HOST
        delete eventFields.preferredArtists;

        try {
            console.log('eventFields', eventFields);
            let artist = await Artist.findOne({
                email: req.user.email.toLowerCase(),
            }).select('-hadMeeting -sentFollowUp -notes');

            if (artist.active || userRole.indexOf('ADMIN') > -1) {
                //only active artists OR ADMINs (mostly for development testing)
                let event = await Event.findOneAndUpdate(
                    {
                        artistEmail: req.user.email.toLowerCase(),
                        bookingWhen: eventFields.bookingWhen,
                        createdBy: 'ARTIST',
                    },
                    {
                        $set: eventFields,
                        artist: artist.id,
                        artistSlug: artist.slug,
                        artistUser: req.user.id,
                        artistEmail: req.user.email.toLowerCase(),
                        bookingWhen: eventFields.bookingWhen,
                        bookingWhere: eventFields.bookingWhere,
                        createdBy: 'ARTIST',
                    },
                    { new: true, upsert: true }
                );

                //Geocode the event
                if (
                    ((event.latLong &&
                        event.latLong.coordinates &&
                        event.latLong.coordinates.length == 0) || //if there is no latLong OR
                        !event.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
                        (event.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
                            event.bookingWhere.zip !==
                                event.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
                    event.bookingWhere &&
                    event.bookingWhere.city &&
                    event.bookingWhere.state &&
                    event.bookingWhere.zip
                ) {
                    //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
                    const address =
                        event.bookingWhere.city +
                        ', ' +
                        event.bookingWhere.state +
                        ' ' +
                        event.bookingWhere.zip;
                    const geocodedAddress = await addressGeocode(address);
                    // console.log(
                    //     updatedEvents +
                    //         ') ' +
                    //         event.artist.stageName +
                    //         ' wants to play a concert near ' +
                    //         address +
                    //         ': ',
                    //     geocodedAddress
                    // );

                    let hostsInReach = await Host.find({
                        latLong: {
                            $near: {
                                $maxDistance: event.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                $geometry: {
                                    type: 'Point',
                                    coordinates: geocodedAddress,
                                },
                            },
                        },
                    });
                    console.log('hostsInReach', await hostsInReach);
                    const hostsIDInReach = hostsInReach.map((hostInReach) => {
                        //console.log('hostInReach._id', hostInReach._id);
                        return {
                            host: hostInReach._id,
                        };
                    });

                    let savedDetails = await event.updateOne(
                        {
                            hostsInReach: hostsIDInReach,
                            'latLong.coordinates': geocodedAddress,
                            geocodedBookingWhere: event.bookingWhere,
                        },
                        { new: true }
                    );
                    // if (savedDetails) {
                    //     console.log(
                    //         'savedDetails:',
                    //         savedDetails
                    //     );
                    // }
                }
                //end geocoding

                //res.json(event);
                //console.log('event', event);
                res.json(event);
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else {
        console.error(req.user.email + ' cannot create or update this event.');
        res.status(500).send(
            'User does not have authority to make these changes.'
        );
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    POST api/events/hostEvent
// @desc     Create or Update a host event based on bookingWhen
// @access   Private
router.post(
    '/hostEvent',
    [auth, [check('bookingWhen', 'Must provide a date.').exists()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let eventFields = req.body;
        // console.log('eventFields', eventFields);

        let userRole = req.user.role;

        if (userRole && userRole.indexOf('HOST') === -1) {
            //if the requesting user doesn't have the HOST role, check the database for the requesting user and see if they have the HOST user role there (this can happen if they just filled out the "Sign Up to Host" form but haven't relogged-in to update their auth token with the new HOST role)
            let user = await User.findOne({ email: req.user.email }).select(
                'role'
            );
            //console.log('User has these roles: ', user);
            userRole = user.role;
        }
        //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
        if (
            userRole &&
            userRole.indexOf('HOST') > -1 &&
            eventFields.createdBy === 'HOST' &&
            eventFields.bookingWhen &&
            eventFields.bookingWhere
        ) {
            //console.log("User is HOST and can raise their hand to book shows.");
            try {
                //console.log('eventFields', eventFields);

                let host = await Host.findOne({
                    email: req.user.email.toLowerCase(),
                });

                let event = await Event.findOneAndUpdate(
                    {
                        confirmedHost: host._id,
                        bookingWhen: eventFields.bookingWhen,
                        createdBy: 'HOST',
                    },
                    {
                        ...eventFields,
                        // bookingWhen: eventFields.bookingWhen,
                        // bookingWhere: eventFields.bookingWhere,
                        createdBy: 'HOST',
                        status: 'DRAFT',
                        confirmedHost: host._id,
                        // $addToSet: {
                        //     hostsOfferingToBook: req.user.email,
                        //     offersFromHosts: {
                        //         ...eventFields.theOffer,
                        //         host: host._id,
                        //     },
                        // },
                        // We don't want to addToSet here because the host is always the same and it should be replaced rather than duplicated
                        hostsOfferingToBook: [req.user.email],
                        offersFromHosts: [
                            {
                                ...eventFields.theOffer,
                                host: host._id,
                            },
                        ],
                        preferredArtists: eventFields.preferredArtists.map(
                            (preferredArtist) => {
                                return preferredArtist._id;
                            }
                        ),
                        hostReachRadius: 30,
                    },
                    { new: true, upsert: true }
                );

                //Geocode the event
                if (
                    ((event.latLong &&
                        event.latLong.coordinates &&
                        event.latLong.coordinates.length == 0) || //if there is no latLong OR
                        !event.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
                        (event.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
                            event.bookingWhere.zip !==
                                event.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
                    event.bookingWhere &&
                    event.bookingWhere.city &&
                    event.bookingWhere.state &&
                    event.bookingWhere.zip
                ) {
                    //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
                    const address =
                        event.bookingWhere.city +
                        ', ' +
                        event.bookingWhere.state +
                        ' ' +
                        event.bookingWhere.zip;
                    const geocodedAddress = await addressGeocode(address);
                    // console.log(
                    //     updatedEvents +
                    //         ') ' +
                    //         event.artist.stageName +
                    //         ' wants to play a concert near ' +
                    //         address +
                    //         ': ',
                    //     geocodedAddress
                    // );

                    let savedDetails = await event.updateOne(
                        {
                            'latLong.coordinates': geocodedAddress,
                            geocodedBookingWhere: event.bookingWhere,
                        },
                        { new: true }
                    );
                    // if (savedDetails) {
                    //     console.log(
                    //         'savedDetails:',
                    //         savedDetails
                    //     );
                    // }
                }
                //end geocoding

                //res.json(event);
                //console.log('event', event);

                const offeredToBookEvents = await Event.find({
                    hostsOfferingToBook: req.user.email,
                    createdBy: 'ARTIST',
                })
                    .select(
                        '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -offersFromHosts -agreeToPayAdminFee -payoutHandle'
                    )
                    .populate(
                        'artist',
                        '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
                    )
                    .populate(
                        'preferredArtists',
                        '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp '
                    )
                    .sort({ bookingWhen: 1 }); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)

                const proposedEventsToHost = await Event.find({
                    hostsOfferingToBook: req.user.email,
                    createdBy: 'HOST',
                })
                    .select(
                        '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -agreeToPayAdminFee -payoutHandle'
                    )
                    .populate(
                        'artist',
                        '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
                    )
                    .populate(
                        'preferredArtists',
                        '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
                    )
                    .sort({ bookingWhen: 1 });

                const myHostEvents = [
                    ...offeredToBookEvents,
                    ...proposedEventsToHost,
                ];

                if (!myHostEvents) {
                    return res.json({
                        email: req.user.email,
                        msg:
                            'There are no events associated with ' +
                            req.user.email,
                    });
                }

                res.json(myHostEvents);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error: ' + err.message);
            }
        } else {
            console.error(
                req.user.email + ' cannot create or update this event.'
            );
            res.status(500).send(
                'User does not have authority to make these changes.'
            );
        }

        //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
    }
);

// @route    DELETE api/events/hostEvent/:id
// @desc     Delete artist event
// @access   Private
router.delete('/hostEvent/:id', auth, async (req, res) => {
    try {
        // Remove event
        let host = await Host.findOne({
            email: req.user.email.toLowerCase(),
        });
        await Event.findOneAndRemove({
            _id: req.params.id,
            confirmedHost: host._id, //the requesting user must be the confirmedHost
            createdBy: 'HOST', //only if the host created the event
            status: 'DRAFT', //don't let people delete anything but DRAFT events
        });
        res.json(req.params.id);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/events/artistEvent
// @desc     Create or Update an artist event based on bookingWhen
// @access   Private
router.post(
    '/artistEvent',
    [auth, [check('bookingWhen', 'Must provide a date.').exists()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let eventFields = req.body;
        // console.log('eventFields', eventFields);

        let userRole = req.user.role;

        if (
            userRole &&
            userRole.indexOf('ARTIST') > -1 &&
            eventFields.bookingWhen &&
            eventFields.bookingWhere &&
            eventFields.bookingWhere.zip
        ) {
            //if eventFields.createdBy === 'ARTIST', delete "preferredArtists" because it could carry-over from an event they proposed as a HOST
            delete eventFields.preferredArtists;

            try {
                console.log('eventFields', eventFields);
                let artist = await Artist.findOne({
                    email: req.user.email.toLowerCase(),
                }).select('-hadMeeting -sentFollowUp -notes');

                if (artist.active || userRole.indexOf('ADMIN') > -1) {
                    //only active artists OR ADMINs (mostly for development testing)
                    let event = await Event.findOneAndUpdate(
                        {
                            artistEmail: req.user.email.toLowerCase(),
                            bookingWhen: eventFields.bookingWhen,
                            createdBy: 'ARTIST',
                        },
                        {
                            $set: eventFields,
                            artist: artist.id,
                            artistSlug: artist.slug,
                            artistUser: req.user.id,
                            artistEmail: req.user.email.toLowerCase(),
                            bookingWhen: eventFields.bookingWhen,
                            bookingWhere: eventFields.bookingWhere,
                            createdBy: 'ARTIST',
                        },
                        { new: true, upsert: true }
                    );

                    //Geocode the event
                    if (
                        ((event.latLong &&
                            event.latLong.coordinates &&
                            event.latLong.coordinates.length == 0) || //if there is no latLong OR
                            !event.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
                            (event.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
                                event.bookingWhere.zip !==
                                    event.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
                        event.bookingWhere &&
                        event.bookingWhere.city &&
                        event.bookingWhere.state &&
                        event.bookingWhere.zip
                    ) {
                        //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
                        const address =
                            event.bookingWhere.city +
                            ', ' +
                            event.bookingWhere.state +
                            ' ' +
                            event.bookingWhere.zip;
                        const geocodedAddress = await addressGeocode(address);
                        // console.log(
                        //     event.artist.slug +
                        //         ' wants to play a concert near ' +
                        //         address +
                        //         ': ',
                        //     geocodedAddress
                        // );

                        let hostsInReach = await Host.find({
                            latLong: {
                                $near: {
                                    $maxDistance:
                                        event.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: geocodedAddress,
                                    },
                                },
                            },
                        });
                        //console.log(await hostsInReach);
                        const hostsIDInReach = hostsInReach.map(
                            (hostInReach, i) => {
                                //console.log('hostInReach._id', hostInReach._id);
                                // console.log(
                                //     'hostInReach' + i + ': ',
                                //     hostInReach.firstName +
                                //         ' ' +
                                //         hostInReach.lastName +
                                //         ' | ' +
                                //         hostInReach.city +
                                //         ', ' +
                                //         hostInReach.state
                                // );
                                return {
                                    host: hostInReach._id,
                                };
                            }
                        );

                        let savedDetails = await event.updateOne(
                            {
                                hostsInReach: hostsIDInReach,
                                'latLong.coordinates': geocodedAddress,
                                geocodedBookingWhere: event.bookingWhere,
                            },
                            { new: true }
                        );
                        // if (savedDetails) {
                        //     console.log(
                        //         'savedDetails:',
                        //         savedDetails
                        //     );
                        // }
                    }
                    //end geocoding
                    else if (
                        event.latLong &&
                        event.latLong.coordinates &&
                        event.latLong.coordinates.length > 0 && //if there is a latLong AND
                        event.geocodedBookingWhere && //if there is geocodedBookingWhere AND
                        event.bookingWhere.zip ===
                            event.geocodedBookingWhere.zip && // the bookingWhere.zip matches the geocodedBookingWhere.zip, then the location hasn't changed since last geocoded, but we still want to find any hosts in reach, because the radius may have changed
                        event.bookingWhere &&
                        event.bookingWhere.city &&
                        event.bookingWhere.state &&
                        event.bookingWhere.zip
                    ) {
                        let hostsInReach = await Host.find({
                            latLong: {
                                $near: {
                                    $maxDistance:
                                        event.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: event.latLong.coordinates,
                                    },
                                },
                            },
                        });
                        //console.log(await hostsInReach);
                        // console.log(
                        //     'these Hosts are near ' +
                        //         event.bookingWhere.city +
                        //         ', ' +
                        //         event.bookingWhere.state
                        // );
                        const hostsIDInReach = hostsInReach.map(
                            (hostInReach, i) => {
                                //console.log('hostInReach._id', hostInReach._id);
                                // console.log(
                                //     'hostInReach' + i + ': ',
                                //     hostInReach.firstName +
                                //         ' ' +
                                //         hostInReach.lastName +
                                //         ' | ' +
                                //         hostInReach.city +
                                //         ', ' +
                                //         hostInReach.state
                                // );
                                return {
                                    host: hostInReach._id,
                                };
                            }
                        );

                        let savedDetails = await event.updateOne(
                            {
                                hostsInReach: hostsIDInReach,
                            },
                            { new: true }
                        );
                    }

                    // console.log('event', event);
                    res.json(event);

                    // const myArtistEvents = await Event.find({
                    //     artistEmail: req.user.email,
                    //     //'offersFromHosts.0': { $exists: true }, //checks to see if the first index of hostsOfferingToBook exists //https://www.mongodb.com/community/forums/t/is-there-a-way-to-query-array-fields-with-size-greater-than-some-specified-value/54597
                    // })
                    //     .select(
                    //         '-artistEmail -hostsOfferingToBook -latLong -hostsInReach'
                    //     )
                    //     .populate(
                    //         'offersFromHosts.host',
                    //         '-user -streetAddress -mailChimped -geocodedStreetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin -lastEmailed -notificationFrequency -date -createdAt'
                    //     )
                    //     .sort({ bookingWhen: 1 }); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
                    // if (!myArtistEvents) {
                    //     return res.json({
                    //         email: req.user.email,
                    //         msg:
                    //             'There are no events associated with ' +
                    //             req.user.email,
                    //     });
                    // }

                    // res.json(myArtistEvents);
                }
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error: ' + err.message);
            }
        } else {
            console.error(
                req.user.email + ' cannot create or update this event.'
            );
            res.status(500).send(
                'User does not have authority to make these changes.'
            );
        }

        //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
    }
);

// @route    DELETE api/events/artistEvent/:id
// @desc     Delete artist event
// @access   Private
router.delete('/artistEvent/:id', auth, async (req, res) => {
    try {
        // Remove event
        await Event.findOneAndRemove({
            _id: req.params.id,
            artistEmail: req.user.email, //this should ensure that someone can only delete their own events
            createdBy: 'ARTIST', //only if the artist created it
            status: 'PENDING', //don't let people delete confirmed shows
        });

        res.json(req.params.id);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/events/adminEvent/:id
// @desc     Delete artist event
// @access   Private
router.delete('/adminEvent/:id', auth, async (req, res) => {
    let eventFields = req.body;
    console.log('DELETE adminEvent eventFields: ', eventFields);

    if (
        req.user.role &&
        (req.user.role.indexOf('BOOKING') > -1 ||
            req.user.role.indexOf('ADMIN') > -1)
    ) {
        try {
            // Remove event
            await Event.findOneAndRemove({
                _id: req.params.id,
                bookingWhen: eventFields.bookingWhen,
                createdBy: eventFields.createdBy,
                status: eventFields.status,
                createdAt: eventFields.createdAt,
            });
            res.json(req.params.id);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
});

// @route    POST api/events/setupEventbrite
// @desc     Setup Eventbrite event from eventID
// @access   Private
router.post('/setupEventbrite', [auth], async (req, res) => {
    console.log('setupEventbrite req.body', req.body.eventID);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (
        req.user.role &&
        (req.user.role.indexOf('BOOKING') > -1 ||
            req.user.role.indexOf('ADMIN') > -1)
    ) {
        try {
            //console.log('setupEventbrite eventFields', eventFields);

            let event = await Event.findOne({
                _id: req.body.eventID,
            }).populate('artist confirmedHost');

            if (event) {
                //console.log('event', event);
                let emailDate = new Date(event.bookingWhen).toDateString(
                    undefined,
                    {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
                    }
                );

                const acceptedOffer = event.offersFromHosts.find((offer) => {
                    return offer.status === 'ACCEPTED';
                });

                console.log('event.bookingWhen', event.bookingWhen);
                console.log(
                    'event.bookingWhen.toDateString()',
                    event.bookingWhen.toDateString()
                );
                console.log(
                    'event.bookingWhen.toISOString()',
                    event.bookingWhen.toISOString()
                );
                console.log('acceptedOffer', acceptedOffer);
                console.log(
                    'acceptedOffer.showSchedule.startTime.split(:)[0]',
                    acceptedOffer.showSchedule.startTime.split(':')[0]
                );
                console.log(
                    'event.bookingWhen.getMonth()',
                    event.bookingWhen.getMonth()
                );

                const startTime =
                    new Date( //create a new javascript Date
                        //Luxon -- https://moment.github.io/luxon/index.html#/tour?id=create-from-an-object
                        DateTime.fromObject(
                            //create a Luxun DateTime from the object to combine the bookingWhen date and the startTime (24:00), in the host's timeZone
                            {
                                year: event.bookingWhen.getFullYear(),
                                month: event.bookingWhen.getMonth() + 1, //0-11
                                day: event.bookingWhen.getDate(),
                                hour: acceptedOffer.showSchedule.startTime.split(
                                    ':'
                                )[0], //hours
                                minute: acceptedOffer.showSchedule.startTime.split(
                                    ':'
                                )[1], //minutes
                            },
                            { zone: event.confirmedHost.timezone }
                        ).toISO({}) //still a Luxon thing -- https://moment.github.io/luxon/index.html#/tour?id=formatting-your-datetime
                    )
                        .toISOString() //convert that whole thing to a javascript ISOString
                        .split('.')[0] + 'Z'; //remove the milliseconds because EventBrite doesn't like that format for some reason

                const endTime =
                    new Date(
                        DateTime.fromObject(
                            {
                                year: event.bookingWhen.getFullYear(),
                                month: event.bookingWhen.getMonth() + 1, //0-11
                                day: event.bookingWhen.getDate(),
                                hour: acceptedOffer.showSchedule.hardWrap.split(
                                    ':'
                                )[0], //hours
                                minute: acceptedOffer.showSchedule.hardWrap.split(
                                    ':'
                                )[1], //minutes
                            },
                            { zone: event.confirmedHost.timezone }
                        )
                            // .minus({
                            //     hours: event.confirmedHost.timezoneOffset,
                            // })
                            .toISO({
                                //suppressMilliseconds: true,
                                //includeOffset: false,
                            })
                    )
                        .toISOString()
                        .split('.')[0] + 'Z'; //removes milliseconds because EventBrite doesn't like that format for some reason;

                // new Date(
                //     Date.UTC(
                //         event.bookingWhen.getFullYear(),
                //         event.bookingWhen.getMonth(),
                //         event.bookingWhen.getDate(),
                //         acceptedOffer.showSchedule.hardWrap.split(':')[0], //hours
                //         acceptedOffer.showSchedule.hardWrap.split(':')[1], //minutes
                //         0 //seconds
                //     )
                // )
                //     .toISOString()
                //     .split('.')[0] + 'Z'; //removes milliseconds because EventBrite doesn't like that format for some reason

                console.log('acceptedOffer', acceptedOffer);
                console.log('startTime', startTime);
                console.log('startTime', new Date(startTime).toString());
                console.log('endTime', endTime);

                //Eventbrite
                request(
                    {
                        method: 'POST',
                        url: 'https://www.eventbriteapi.com/v3/organizations/315915867803/events/',
                        headers: {
                            Authorization:
                                'Bearer ' + config['eventbritePrivateToken'],
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            event: {
                                name: {
                                    html: `<p>Porchlight presents ${event.artist.stageName}</p>`,
                                },
                                summary: `<p>${event.artist.stageName} House Concert • ${event.confirmedHost.city}, ${event.confirmedHost.state}</p>`,

                                start: {
                                    timezone: event.confirmedHost.timezone,
                                    utc: startTime,
                                },
                                end: {
                                    timezone: event.confirmedHost.timezone,
                                    utc: endTime,
                                },
                                currency: 'USD',

                                online_event: false,
                                // organizer_id: '',
                                listed: true,
                                shareable: true,
                                invite_only: false,
                                show_remaining: true,
                                capacity: event.confirmedHost.maxNumAttendees,
                                locale: 'en_US',
                                // ticket_class: {
                                //     name: 'General Admission',
                                //     quantity_total:
                                //         event.confirmedHost.maxNumAttendees,
                                //     cost: 'USD,' + event.namedPrice * 100,
                                // },
                                format_id: '6',
                                // format: {
                                //     resource_uri:
                                //         'https://www.eventbriteapi.com/v3/formats/6/',
                                //     id: '6',
                                //     name: 'Concert or Performance',
                                //     name_localized: 'Concert or Performance',
                                //     short_name: 'Performance',
                                //     short_name_localized: 'Performance',
                                // },
                                category_id: '103',
                                // category: {
                                //     resource_uri:
                                //         'https://www.eventbriteapi.com/v3/categories/103/',
                                //     id: '103',
                                //     name: 'Music',
                                //     name_localized: 'Music',
                                //     short_name: 'Music',
                                //     short_name_localized: 'Music',
                                //     // subcategories: [
                                //     //     event.artist.genres.map((genre) => {
                                //     //         return { name: genre };
                                //     //     }),
                                //     // ],
                                // },
                            },
                        }),
                    },
                    function (error, response, body) {
                        //console.log('Error:', error);
                        //console.log('Status:', response);
                        // console.log(
                        //     'Headers:',
                        //     JSON.stringify(response.headers)
                        // );
                        console.log('Response:', body);
                    }
                );

                res.json(event);
            } else {
                //console.log('This event is already booked.');
                res.status(500).send('Could not find event with this ID.');
            }
        } catch (err) {
            console.log('setupEventbrite err', err);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else {
        console.error(
            req.user.email +
                " doesn't have authority to setup Eventbrite events."
        );
        res.status(500).send(
            'User does not have authority to setup Eventbrite events.'
        );
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    GET api/events/getArtistBooking/:slug
// @desc     Get all events by artist slug for public profile
// @access   Public
router.get('/getArtistBooking/:slug', async (req, res) => {
    //console.log('getArtistBookingEvents req', req);
    try {
        const events = await Event.find(
            {
                artistSlug: req.params.slug,
                bookingWhen: { $gt: new Date() },
            },
            {
                latLong: 0,
                artistEmail: 0,
                agreeToPayAdminFee: 0,
                payoutHandle: 0,
                hostsOfferingToBook: 0,
                offersFromHosts: 0,
                'travelingCompanions.email': 0,
                hostsInReach: 0,
            } //don't return these fields
        )
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes' //don't return these fields
            )
            .sort({ bookingWhen: 1 }); //.select('-artistEmail -agreeToPayAdminFee -payoutHandle'); //.select(['city', 'state', 'zipCode']); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
        //console.log(events);
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/events/event/:id
// @desc     Get event by id
// @access   Public
router.get('/event/:id', async (req, res) => {
    //console.log('getArtistBookingEvents req', req);
    try {
        const event = await Event.findOne(
            {
                _id: req.params.id,
            },
            {
                latLong: 0,
                artistEmail: 0,
                agreeToPayAdminFee: 0,
                payoutHandle: 0,
                hostsOfferingToBook: 0,
                offersFromHosts: 0,
                'travelingCompanions.email': 0,
                hostsInReach: 0,
                confirmedHostEmail: 0,
                confirmedHostUser: 0,
            } //don't return these fields
        ).populate(
            'artist',
            '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes' //don't return these fields
        );
        //console.log(event);
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/events/hostRaiseHand
// @desc     Host Raises Hand to host an artist's show at a specific date and location
// @access   Private
router.post('/hostRaiseHand', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let eventFields = req.body;

    let userRole = req.user.role;

    if (userRole && userRole.indexOf('HOST') === -1) {
        //if the requesting user doesn't have the HOST role, check the database for the requesting user and see if they have the HOST user role there (this can happen if they just filled out the "Sign Up to Host" form but haven't relogged-in to update their auth token with the new HOST role)
        let user = await User.findOne({ email: req.user.email }).select('role');
        //console.log('User has these roles: ', user);
        userRole = user.role;
    }
    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (userRole && userRole.indexOf('HOST') > -1) {
        //console.log("User is HOST and can raise their hand to book shows.");
        try {
            //console.log('eventFields', eventFields);
            let host = await Host.findOne({ email: req.user.email });

            let eventDetails = await Event.findOneAndUpdate(
                {
                    artist: eventFields.artist._id,
                    bookingWhen: eventFields.bookingWhen,
                    status: 'PENDING', //only allow offers on pending booking dates
                },
                {
                    $addToSet: {
                        hostsOfferingToBook: req.user.email,
                        offersFromHosts: {
                            ...eventFields.theOffer,
                            host: host._id,
                        },
                    },
                },
                { new: true }
            )
                .select(
                    //'-artistEmail -agreeToPayAdminFee -payoutHandle -offersFromHosts -hostsOfferingToBook'
                    '-agreeToPayAdminFee -payoutHandle -hostsOfferingToBook -latLong -hostsInReach -offersFromHosts'
                )
                .populate(
                    'artist',
                    '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes'
                )
                .lean(); //.lean required to delete artistEmail later -- Documents returned from queries with the lean option enabled are plain javascript objects, not Mongoose Documents. They have no save method, getters/setters, virtuals, or other Mongoose features. https://stackoverflow.com/a/71746004/3338608

            let emailDate = new Date(
                eventDetails.bookingWhen
            ).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
            });
            const theEventDateForStacking = new Date(eventDetails.bookingWhen)
                .toDateString()
                .split(' ');
            //Send an email to the artist and then delete the artist's email address from the eventDetails object we return to the host in the app
            sendEmail(eventDetails.artistEmail, {
                event: 'HOST_OFFER',
                template: 'BXKVWA13SK4G60N1ZE1S339YPKAM',
                name: eventDetails.artist.firstName,
                hostName: host.firstName + ' ' + host.lastName,
                stageName: eventDetails.artist.stageName,
                eventDate: emailDate,
                bookingWhenFormatted: theEventDateForStacking,
                hostLocation: host.city + ', ' + host.state,
                hostImg: host.profileImg,
                artistImg: eventDetails.artist.squareImg,
            });
            delete eventDetails.artistEmail;

            //res.json(event);
            //console.log('eventDetails', eventDetails);
            res.json(eventDetails);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else {
        console.error(
            req.user.email +
                ' cannot make a hosting offer without the HOST user role.'
        );
        res.status(500).send(
            'User does not have authority to make these changes.'
        );
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    POST api/events/hostProposes
// @desc     Host Proposes a concert — update the status of the event from DRAFT to PENDING and email artists
// @access   Private
router.post('/hostProposes', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let eventFields = req.body;

    let userRole = req.user.role;

    if (userRole && userRole.indexOf('HOST') === -1) {
        //if the requesting user doesn't have the HOST role, check the database for the requesting user and see if they have the HOST user role there (this can happen if they just filled out the "Sign Up to Host" form but haven't relogged-in to update their auth token with the new HOST role)
        let user = await User.findOne({ email: req.user.email }).select('role');
        //console.log('User has these roles: ', user);
        userRole = user.role;
    }
    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (userRole && userRole.indexOf('HOST') > -1) {
        //console.log("User is HOST and can propose shows.");
        try {
            //console.log('eventFields', eventFields);
            let host = await Host.findOne({ email: req.user.email });

            let eventDetails = await Event.findOneAndUpdate(
                {
                    confirmedHost: host._id,
                    bookingWhen: eventFields.bookingWhen,
                    status: 'DRAFT', //don't update anything but DRAFTs
                    createdBy: 'HOST',
                },
                {
                    status: 'PENDING',
                },
                { new: true }
            )
                .select(
                    '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -agreeToPayAdminFee -payoutHandle'
                )
                .populate(
                    'artist',
                    '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
                )
                .populate(
                    'preferredArtists',
                    //'-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
                    '-phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
                )
                .lean(); //.lean required to delete artistEmail later -- Documents returned from queries with the lean option enabled are plain javascript objects, not Mongoose Documents. They have no save method, getters/setters, virtuals, or other Mongoose features. https://stackoverflow.com/a/71746004/3338608

            // .select(
            //     //'-artistEmail -agreeToPayAdminFee -payoutHandle -offersFromHosts -hostsOfferingToBook'
            //     '-agreeToPayAdminFee -payoutHandle -hostsOfferingToBook -latLong -hostsInReach'
            // );
            //     .populate(
            //         'artist',
            //         '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes'
            //     )
            //     .lean(); //.lean required to delete artistEmail later -- Documents returned from queries with the lean option enabled are plain javascript objects, not Mongoose Documents. They have no save method, getters/setters, virtuals, or other Mongoose features. https://stackoverflow.com/a/71746004/3338608

            let emailDate = new Date(
                eventDetails.bookingWhen
            ).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const theEventDateForStacking = new Date(eventDetails.bookingWhen)
                .toDateString()
                .split(' ');

            for (let i = 0; i < eventDetails.preferredArtists.length; i++) {
                //Send an email to the artist and then delete the artist's email address from the eventDetails object we return to the host in the app
                sendEmail(eventDetails.preferredArtists[i].email, {
                    event: 'HOST_PROPOSES',
                    template: 'N1R9V8456SM6P9KTQ7NWSFNRP08Z',
                    name: eventDetails.preferredArtists[i].firstName,
                    hostName: host.firstName + ' ' + host.lastName,
                    stageName: eventDetails.preferredArtists[i].stageName,
                    eventDate: emailDate,
                    bookingWhenFormatted: theEventDateForStacking,
                    hostLocation: host.city + ', ' + host.state,
                    hostImg: host.profileImg,
                    artistImg: eventDetails.preferredArtists[i].squareImg,
                });
                delete eventDetails.preferredArtists[i].email;
            }

            console.log('eventDetails', eventDetails);
            res.json(eventDetails);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else {
        console.error(
            req.user.email +
                ' cannot make a hosting proposal without the HOST user role.'
        );
        res.status(500).send('User does not have authority to do this.');
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    GET api/events/myEventsOfferedToHost
// @desc     Get current user's events they've offered to host, createdBy ARTIST (DON'T return offersFromHosts)
// @access   Private
router.get('/myEventsOfferedToHost', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        //console.log(req.user);
        const offeredToBookEvents = await Event.find({
            hostsOfferingToBook: req.user.email,
            createdBy: 'ARTIST',
        })
            .select(
                '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -offersFromHosts -agreeToPayAdminFee -payoutHandle'
            )
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            )
            // I don't think we need to populate preferredArtists here, because we're only getting ARTIST created events
            // .populate(
            //     'preferredArtists',
            //     '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            // )
            .sort({ bookingWhen: 1 });

        const proposedEventsToHost = await Event.find({
            hostsOfferingToBook: req.user.email,
            createdBy: 'HOST',
        })
            .select(
                '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -agreeToPayAdminFee -payoutHandle'
            )
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            )
            .populate(
                'preferredArtists',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            )
            .sort({ bookingWhen: 1 });

        // console.log(
        //     'offeredToBookEvents: ',
        //     offeredToBookEvents,
        //     'proposedEventsToHost: ',
        //     proposedEventsToHost
        // );

        const myHostEvents = [...offeredToBookEvents, ...proposedEventsToHost];

        if (!myHostEvents) {
            return res.json({
                email: req.user.email,
                msg: 'There are no events associated with ' + req.user.email,
            });
        }

        res.json(myHostEvents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/events/nearMeToHost
// @desc     Get events that current user is near to host
// @access   Private
router.get('/nearMeToHost', auth, async (req, res) => {
    try {
        const thisHost = await Host.findOne({
            email: req.user.email,
        });
        // const eventsNearMeToHost = await Event.find({
        //     hostsInReach: { $elemMatch: { host: thisHost._id } },
        //     status: 'PENDING',
        // })
        const eventsNearMeToHost = await Event.find({
            // latLong: {
            //     $near: {
            //         $maxDistance: 40 * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
            //         $geometry: {
            //             type: 'Point',
            //             coordinates: thisHost.latLong.coordinates,
            //         },
            //     },
            // },
            'hostsInReach.host': thisHost._id,
            offersFromHosts: { $not: { $elemMatch: { host: thisHost._id } } },
            status: 'PENDING',
            createdBy: { $ne: 'HOST' }, // $ne means "Not Equal" — don't show events created by HOSTs to other HOSTs as nearMeToHost events — I would've singled out events that are created by ARTISTs, but not all the events had a "createdBy" field, because I added it WAY later on
            bookingWhen: { $gt: new Date() }, // $gt means "Greater Than"
        })
            .select(
                '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -offersFromHosts -agreeToPayAdminFee -payoutHandle'
            )
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            )
            .sort({ bookingWhen: -1 });
        if (!eventsNearMeToHost) {
            console.log(
                'There are no events associated with ' + req.user.email
            );
            return res.json({
                email: req.user.email,
                msg: 'There are no events associated with ' + req.user.email,
            });
        }
        //console.log('eventsNearMeToHost ', eventsNearMeToHost);
        res.json(eventsNearMeToHost);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/events/myArtistEvents
// @desc     Get current user's events where the artistEmail matches the logged in user's
// @access   Private
router.get('/myArtistEvents', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        //console.log(req.user);

        const thisArtist = await Artist.findOne({
            email: req.user.email,
        });

        let userRole = req.user.role;

        if (userRole && userRole.indexOf('TESTING') > -1) {
            const myArtistEvents = await Event.find(
                {
                    $or: [
                        { artistEmail: req.user.email },
                        {
                            createdBy: 'HOST',
                            status: { $ne: 'DRAFT' }, //not equal to 'DRAFT'
                            preferredArtists: thisArtist._id,
                        },
                    ],
                }
                // {
                //     artistEmail: req.user.email,
                //     //'offersFromHosts.0': { $exists: true }, //checks to see if the first index of hostsOfferingToBook exists //https://www.mongodb.com/community/forums/t/is-there-a-way-to-query-array-fields-with-size-greater-than-some-specified-value/54597
                // }
            )
                .select(
                    '-artistEmail -hostsOfferingToBook -latLong -hostsInReach'
                )
                .populate(
                    'offersFromHosts.host',
                    '-user -streetAddress -mailChimped -geocodedStreetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin -lastEmailed -notificationFrequency -date -createdAt'
                )
                .sort({ bookingWhen: 1 }); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
            if (!myArtistEvents) {
                return res.json({
                    email: req.user.email,
                    msg:
                        'There are no events associated with ' + req.user.email,
                });
            }

            res.json(myArtistEvents);
        } else {
            const myArtistEvents = await Event.find(
                { artistEmail: req.user.email }
                // {
                //     artistEmail: req.user.email,
                //     //'offersFromHosts.0': { $exists: true }, //checks to see if the first index of hostsOfferingToBook exists //https://www.mongodb.com/community/forums/t/is-there-a-way-to-query-array-fields-with-size-greater-than-some-specified-value/54597
                // }
            )
                .select(
                    '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -preferredArtists'
                )
                .populate(
                    'offersFromHosts.host',
                    '-user -streetAddress -mailChimped -geocodedStreetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin -lastEmailed -notificationFrequency -date -createdAt'
                )
                .sort({ bookingWhen: 1 }); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
            if (!myArtistEvents) {
                return res.json({
                    email: req.user.email,
                    msg:
                        'There are no events associated with ' + req.user.email,
                });
            }

            res.json(myArtistEvents);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/events/myArtistEventsOffers
// @desc     Get current user's events where the hostsOfferingToBook has at least one index
// @access   Private
// router.get('/myArtistEventsOffers', auth, async (req, res) => {
//     try {
//         // const thisUser = await User.findOne({
//         //   id: req.user.id,
//         // });
//         //console.log(req.user);
//         const myArtistEvents = await Event.find({
//             artistEmail: req.user.email,
//             'offersFromHosts.0': { $exists: true }, //checks to see if the first index of hostsOfferingToBook exists //https://www.mongodb.com/community/forums/t/is-there-a-way-to-query-array-fields-with-size-greater-than-some-specified-value/54597
//         })
//             .select('-artistEmail -hostsOfferingToBook -latLong -hostsInReach')
//             .populate(
//                 'offersFromHosts.host',
//                 '-user -streetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin'
//             )
//             .sort({ bookingWhen: 1 }); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
//         if (!myArtistEvents) {
//             return res.json({
//                 email: req.user.email,
//                 msg: 'There are no events associated with ' + req.user.email,
//             });
//         }

//         res.json(myArtistEvents);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// @route    POST api/events/artistViewedHostOffer
// @desc     Artist viewed host's offer
// @access   Private
router.post('/artistViewedHostOffer', [auth], async (req, res) => {
    //console.log('artistViewedHostOffer req.body', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let eventFields = req.body;

    const thisArtist = await Artist.findOne({
        email: req.user.email,
    });

    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (req.user.role && req.user.role.indexOf('ARTIST') > -1) {
        try {
            //console.log('artistViewedHostOffer eventFields', eventFields);

            let eventDetails = await Event.findOneAndUpdate(
                //https://www.mongodb.com/docs/manual/reference/operator/projection/
                {
                    $or: [
                        { artistEmail: req.user.email },
                        {
                            createdBy: 'HOST',
                            // status: { $ne: 'DRAFT' }, //not equal to 'DRAFT'
                            preferredArtists: thisArtist._id,
                        },
                    ],
                    bookingWhen: eventFields.bookingWhen,
                    'offersFromHosts.host': eventFields.offeringHost._id,
                },
                {
                    $set: {
                        'offersFromHosts.$.artistViewedOn': new Date(),
                    },
                },
                { new: true }
            )
                .select(
                    '-artistEmail -hostsOfferingToBook -latLong -hostsInReach '
                )
                .populate(
                    'offersFromHosts.host',
                    '-user -streetAddress -mailChimped -geocodedStreetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin -lastEmailed -notificationFrequency -date -createdAt'
                );
            //console.log('eventDetails', eventDetails);
            res.json(eventDetails);
        } catch (err) {
            //console.error(err.message);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else {
        console.error(
            req.user.email + " doesn't have authority to make these changes."
        );
        res.status(500).send(
            'User does not have authority to make these changes.'
        );
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    POST api/events/artistAcceptOffer
// @desc     Artist accepted host's offer
// @access   Private
router.post('/artistAcceptOffer', [auth], async (req, res) => {
    //console.log('artistAcceptOffer req.body', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let eventFields = req.body;

    const thisArtist = await Artist.findOne({
        email: req.user.email,
    });

    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (req.user.role && req.user.role.indexOf('ARTIST') > -1) {
        try {
            // console.log('artistAcceptOffer eventFields', eventFields);

            let eventDetails = await Event.findOneAndUpdate(
                //https://www.mongodb.com/docs/manual/reference/operator/projection/
                {
                    $or: [
                        { artistEmail: req.user.email },
                        {
                            createdBy: 'HOST',
                            // status: { $ne: 'DRAFT' }, //not equal to 'DRAFT'
                            preferredArtists: thisArtist._id,
                        },
                    ],
                    bookingWhen: eventFields.bookingWhen,
                    'offersFromHosts.host': eventFields.offeringHost._id,
                    status: 'PENDING',
                },
                {
                    $set: {
                        confirmedHost: eventFields.offeringHost._id,
                        confirmedArtist: thisArtist._id,
                        confirmedDate: new Date(),
                        status: 'CONFIRMED',
                        'offersFromHosts.$.status': 'ACCEPTED',
                    },
                },
                { new: true }
            )
                .select(
                    '-artistEmail -hostsOfferingToBook -latLong -hostsInReach'
                )
                .populate(
                    'confirmedHost',
                    '_id email firstName lastName city state profileImg'
                )
                .populate('artist', 'squareImg')
                .populate(
                    'offersFromHosts.host',
                    '-user -streetAddress -mailChimped -geocodedStreetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin -lastEmailed -notificationFrequency -date -createdAt'
                )
                .lean(); //.lean required to delete email later -- Documents returned from queries with the lean option enabled are plain javascript objects, not Mongoose Documents. They have no save method, getters/setters, virtuals, or other Mongoose features. https://stackoverflow.com/a/71746004/3338608

            if (eventDetails) {
                console.log('eventDetails', eventDetails);
                let emailDate = new Date(
                    eventFields.bookingWhen
                ).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
                });
                const theEventDateForStacking = new Date(
                    eventDetails.bookingWhen
                )
                    .toDateString()
                    .split(' ');
                //Send an email to the host and then delete the host's email address from the eventDetails object we return to the artist in the app
                sendEmail(eventDetails.confirmedHost.email, {
                    event: 'ARTIST_ACCEPTS_OFFER',
                    template: 'TFJSKATYZZMWHSNEGNPZCCYM4E1B',
                    hostName:
                        eventDetails.confirmedHost.firstName +
                        ' ' +
                        eventDetails.confirmedHost.lastName,
                    stageName: thisArtist.stageName,
                    eventDate: emailDate,
                    bookingWhenFormatted: theEventDateForStacking,
                    hostLocation:
                        eventDetails.confirmedHost.city +
                        ', ' +
                        eventDetails.confirmedHost.state,
                    hostImg: eventDetails.confirmedHost.profileImg,
                    artistImg:
                        (eventDetails.artist &&
                            eventDetails.artist.squareImg) ||
                        thisArtist.squareImg,
                });
                delete eventDetails.confirmedHost.email;

                //console.log('eventDetails', eventDetails);
                res.json(eventDetails);
            } else {
                //console.log('This event is already booked.');
                res.status(500).send('This event is already booked.');
            }
        } catch (err) {
            console.log('artistAcceptOffer err', err);
            res.status(500).send('Server Error: ' + err.message);
        }
    } else {
        console.error(
            req.user.email + " doesn't have authority to make these changes."
        );
        res.status(500).send(
            'User does not have authority to make these changes.'
        );
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    GET api/events/edit
// @desc     [ADMIN, BOOKING] Get all events for editing (everything)
// @access   Private
router.get('/edit', [auth], async (req, res) => {
    //if (req.user.role === 'ADMIN') {
    if (
        (req.user.role && req.user.role.indexOf('ADMIN') > -1) ||
        req.user.role.indexOf('BOOKING') > -1
    ) {
        //must have ADMIN or BOOKING role to get into all of this!
        let updatedEvents = 0;
        // let yesterDate = new Date();
        // yesterDate.setDate(yesterDate.getDate() - 1);
        try {
            const events = await Event.find({
                // bookingWhen: { $gt: yesterDate }, //if we ask for $gte: new Date(), some of the events today won't show up because the time in the event's bookingWhen isn't the start time
            })
                .populate('artist')
                .populate('hostsInReach.host')
                .populate('offersFromHosts.host')
                .populate('confirmedHost')
                .populate('preferredArtists')
                .populate('confirmedArtist');

            events.forEach(async (eventDetails) => {
                if (
                    !eventDetails.artistSlug &&
                    eventDetails.artist &&
                    eventDetails.artist.slug
                ) {
                    eventDetails.artistSlug = eventDetails.artist.slug;
                    await eventDetails.save();
                    updatedEvents++;
                }
                if (
                    ((eventDetails.latLong &&
                        eventDetails.latLong.coordinates &&
                        (eventDetails.latLong.coordinates.length == 0 || //if there is no latLong OR
                            (eventDetails.latLong.coordinates[0] === 0 &&
                                eventDetails.latLong.coordinates[1] === 0))) || //if latLong.coordinates are default OR
                        !eventDetails.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
                        (eventDetails.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
                            eventDetails.bookingWhere.zip !==
                                eventDetails.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
                    eventDetails.bookingWhere &&
                    eventDetails.bookingWhere.city &&
                    eventDetails.bookingWhere.state &&
                    eventDetails.bookingWhere.zip
                ) {
                    //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
                    const address =
                        eventDetails.bookingWhere.city +
                        ', ' +
                        eventDetails.bookingWhere.state +
                        ' ' +
                        eventDetails.bookingWhere.zip;
                    const geocodedAddress = await addressGeocode(address);

                    eventDetails.createdBy &&
                        eventDetails.createdBy == 'ARTIST' &&
                        console.log(
                            eventDetails.artist.stageName +
                                ' wants to play a concert near ' +
                                address +
                                ': ',
                            geocodedAddress
                        );
                    eventDetails.createdBy &&
                        eventDetails.createdBy == 'HOST' &&
                        console.log(
                            eventDetails.confirmedHost.firstName +
                                ' ' +
                                eventDetails.confirmedHost.lastName +
                                ' wants to host a concert near ' +
                                address +
                                ': ',
                            geocodedAddress
                        );

                    // Commented out on May 24, 2022, because I think the updateOne on line 457 is handling this now.
                    // eventDetails.geocodedBookingWhere =
                    //     eventDetails.bookingWhere;
                    // eventDetails.latLong.coordinates = geocodedAddress;
                    // eventDetails.markModified('latLong');

                    let hostsInReach = await Host.find({
                        latLong: {
                            $near: {
                                $maxDistance:
                                    eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                $geometry: {
                                    type: 'Point',
                                    coordinates: geocodedAddress,
                                },
                            },
                        },
                    });
                    //console.log(await hostsInReach);
                    const hostsIDInReach = hostsInReach.map((hostInReach) => {
                        //console.log('hostInReach._id', hostInReach._id);
                        return { host: hostInReach._id };
                    });
                    // Commented out on May 24, 2022, because I think the updateOne on line 457 is handling this now.
                    //eventDetails.hostsInReach = hostsIDInReach;
                    //console.log('hostsIDInReach', await hostsIDInReach);

                    //let savedDetails = await eventDetails.save();
                    let savedDetails = await eventDetails.updateOne(
                        {
                            hostsInReach: hostsIDInReach,
                            'latLong.coordinates': geocodedAddress,
                            geocodedBookingWhere: eventDetails.bookingWhere,
                        },
                        { new: true }
                    );
                    if (savedDetails) {
                        //console.log('savedDetails:', savedDetails);
                        updatedEvents++;
                    }
                }
                if (
                    eventDetails.latLong &&
                    eventDetails.latLong.coordinates &&
                    eventDetails.latLong.coordinates.length > 0 &&
                    eventDetails.latLong.coordinates[0] !== 0 && //don't look for hostsInReach if eventDetails.latLong.coordinates are [0,0]
                    eventDetails.latLong.coordinates[1] !== 0
                    // &&
                    // eventDetails.hostReachRadius &&
                    // (!eventDetails.hostsInReach ||
                    //     eventDetails.hostsInReach.length <= 0)
                ) {
                    let hostsInReach = await Host.find({
                        latLong: {
                            $near: {
                                $maxDistance:
                                    eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
                                $geometry: {
                                    type: 'Point',
                                    coordinates:
                                        eventDetails.latLong.coordinates,
                                },
                            },
                        },
                    });
                    //console.log(await hostsInReach);
                    const hostsIDInReach = hostsInReach.map((hostInReach) => {
                        //console.log('hostInReach._id', hostInReach._id);
                        return { host: hostInReach._id };
                    });
                    eventDetails.hostsInReach = hostsIDInReach;
                    eventDetails.markModified('hostsInReach');
                    //console.log('hostsIDInReach', await hostsIDInReach);
                    updatedEvents++;
                    //await eventDetails.save();
                    await eventDetails.updateOne({
                        hostsInReach: hostsIDInReach,
                    });
                }
            });
            //console.log('updatedEvents:', await updatedEvents);

            res.json(events);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(500).send(
            'Only ADMINs and BOOKING coordinators can get all events like this.'
        );
    }
});

// @route    GET api/events/triggerHostEmailDigest
// @desc     [ADMIN, BOOKING] Trigger Host Email Digest
// @access   Private
// Moved this whole function into a cron job (/scheduler/handlers/hostEmailDigest.js)
// router.get('/triggerHostEmailDigest', [auth], async (req, res) => {
//     //if (req.user.role === 'ADMIN') {
//     if (
//         (req.user.role && req.user.role.indexOf('ADMIN') > -1) ||
//         req.user.role.indexOf('BOOKING') > -1
//     ) {
//         //must have ADMIN or BOOKING role to get into all of this!
//         let updatedEvents = 0;
//         let yesterDate = new Date();
//         yesterDate.setDate(yesterDate.getDate() - 1);
//         try {
//             let emailHostsCollection = [];
//             let hostsToEmailArray = []; //for checking to see if we're already emailing a host, in order to add multiple events to a hosts email digest

//             const events = await Event.find({
//                 bookingWhen: { $gt: yesterDate }, //if we ask for $gte: new Date(), some of the events today won't show up because the time in the event's bookingWhen isn't the start time
//                 createdBy: 'ARTIST', //only pull ARTIST proposed events for the host email digest
//                 status: 'PENDING', //only pull PENDING events
//             })
//                 .populate('artist')
//                 .populate('hostsInReach.host')
//                 .populate('offersFromHosts.host')
//                 .populate('confirmedHost')
//                 .sort({ bookingWhen: -1 }); //sort descending -- latest first, because hosts probably need more time to prepare, so show the most upcoming proposed concerts last

//             let loopThruEvents = new Promise((resolve, reject) => {
//                 events.forEach(async (eventDetails, index, array) => {
//                     if (
//                         !eventDetails.artistSlug &&
//                         eventDetails.artist &&
//                         eventDetails.artist.slug
//                     ) {
//                         eventDetails.artistSlug = eventDetails.artist.slug;
//                         await eventDetails.save();
//                         updatedEvents++;
//                     }
//                     if (
//                         ((eventDetails.latLong &&
//                             eventDetails.latLong.coordinates &&
//                             (eventDetails.latLong.coordinates.length == 0 || //if there is no latLong OR
//                                 (eventDetails.latLong.coordinates[0] === 0 &&
//                                     eventDetails.latLong.coordinates[1] ===
//                                         0))) || //if latLong.coordinates are default OR
//                             !eventDetails.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
//                             (eventDetails.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
//                                 eventDetails.bookingWhere.zip !==
//                                     eventDetails.geocodedBookingWhere.zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
//                         eventDetails.bookingWhere &&
//                         eventDetails.bookingWhere.city &&
//                         eventDetails.bookingWhere.state &&
//                         eventDetails.bookingWhere.zip
//                     ) {
//                         //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
//                         const address =
//                             eventDetails.bookingWhere.city +
//                             ', ' +
//                             eventDetails.bookingWhere.state +
//                             ' ' +
//                             eventDetails.bookingWhere.zip;
//                         const geocodedAddress = await addressGeocode(address);

//                         // eventDetails.createdBy &&
//                         //     eventDetails.createdBy == 'ARTIST' &&
//                         //     console.log(
//                         //         eventDetails.artist.stageName +
//                         //             ' wants to play a concert near ' +
//                         //             address +
//                         //             ': ',
//                         //         geocodedAddress
//                         //     );
//                         // eventDetails.createdBy &&
//                         //     eventDetails.createdBy == 'HOST' &&
//                         //     console.log(
//                         //         eventDetails.confirmedHost.firstName +
//                         //             ' ' +
//                         //             eventDetails.confirmedHost.lastName +
//                         //             ' wants to host a concert near ' +
//                         //             address +
//                         //             ': ',
//                         //         geocodedAddress
//                         //     );

//                         let hostsInReach = await Host.find({
//                             notificationFrequency: { $ne: 0 }, //don't email hosts who've opted out
//                             latLong: {
//                                 $near: {
//                                     $maxDistance:
//                                         eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
//                                     $geometry: {
//                                         type: 'Point',
//                                         coordinates: geocodedAddress,
//                                     },
//                                 },
//                             },
//                         });
//                         //console.log(await hostsInReach);
//                         const hostsIDInReach = hostsInReach.map(
//                             (hostInReach) => {
//                                 //console.log('hostInReach._id', hostInReach._id);
//                                 return { host: hostInReach._id };
//                             }
//                         );

//                         let savedDetails = await eventDetails.updateOne(
//                             {
//                                 hostsInReach: hostsIDInReach,
//                                 'latLong.coordinates': geocodedAddress,
//                                 geocodedBookingWhere: eventDetails.bookingWhere,
//                             },
//                             { new: true }
//                         );
//                         if (savedDetails) {
//                             //console.log('savedDetails:', savedDetails);
//                             updatedEvents++;
//                         }
//                     }
//                     if (
//                         eventDetails.latLong &&
//                         eventDetails.latLong.coordinates &&
//                         eventDetails.latLong.coordinates.length > 0 &&
//                         eventDetails.latLong.coordinates[0] !== 0 && //don't look for hostsInReach if eventDetails.latLong.coordinates are [0,0]
//                         eventDetails.latLong.coordinates[1] !== 0 &&
//                         eventDetails.hostReachRadius
//                     ) {
//                         console.log(
//                             'new Date(eventDetails.createdAt)',
//                             new Date(eventDetails.createdAt)
//                         );
//                         let hostsInReach = await Host.find({
//                             notificationFrequency: { $ne: 0 }, //don't email hosts who've opted out
//                             lastLogin: {
//                                 $lte: new Date(eventDetails.createdAt),
//                             }, //if the host logged in before this event was created, they might not have seen it yet
//                             lastEmailed: {
//                                 $lte: new Date(eventDetails.createdAt),
//                             }, //if we emailed the host before this event was created, they might not have seen it yet
//                             latLong: {
//                                 $near: {
//                                     $maxDistance:
//                                         eventDetails.hostReachRadius * 1609.35, //the distance is in meters, 1609.35m = 1 mile;
//                                     $geometry: {
//                                         type: 'Point',
//                                         coordinates:
//                                             eventDetails.latLong.coordinates,
//                                     },
//                                 },
//                             },
//                         });
//                         //console.log(await hostsInReach);
//                         const hostsIDInReach = hostsInReach.map(
//                             async (hostInReach) => {
//                                 if (
//                                     hostInReach.notificationFrequency
//                                     //&& hostInReach.lastEmailed
//                                 ) {
//                                     //this limits who we reach out to, until everyone has a "lastEmailed" ---- "notificationFrequency" defaults to 7
//                                     //hostInReach.notificationFrequency is never going to be 0, because we filtered that out in the database request
//                                     let today = new Date().getTime();
//                                     let hostLastEmailed = new Date(
//                                         hostInReach.lastEmailed ||
//                                             hostInReach.date //if !lastEmailed date just use the creation date of their profile——I think this is only going to be necessary for the first email we send to a host
//                                     ).getTime();
//                                     let differenceInDays =
//                                         (today - hostLastEmailed) /
//                                         (1000 * 3600 * 24); //to calculate the no. of days between two dates, divide the time difference of both dates by no. of milliseconds in a day (1000*60*60*24) //https://www.geeksforgeeks.org/how-to-calculate-the-number-of-days-between-two-dates-in-javascript/
//                                     // console.log(
//                                     //     hostInReach.email +
//                                     //         ' last emailed ' +
//                                     //         differenceInDays +
//                                     //         ' days ago.'
//                                     // );
//                                     if (
//                                         differenceInDays >=
//                                         hostInReach.notificationFrequency
//                                     ) {
//                                         //if it's time to email this host
//                                         const theEventDate = new Date(
//                                             eventDetails.bookingWhen
//                                         )
//                                             .toDateString()
//                                             .split(' ');
//                                         newEventDetails = {
//                                             ...eventDetails._doc,
//                                             bookingWhenFormatted: theEventDate,
//                                         };
//                                         // console.log(
//                                         //     'newEventDetails',
//                                         //     newEventDetails
//                                         // );
//                                         if (
//                                             !hostsToEmailArray.includes(
//                                                 hostInReach.email
//                                             )
//                                         ) {
//                                             //if the hostInReach's email is not already in the array, add it

//                                             const hostForCollection = {
//                                                 ...hostInReach._doc,
//                                                 createdAtGetTime: new Date(
//                                                     hostInReach.date
//                                                 ).getTime(),
//                                                 eventsForEmail: [
//                                                     newEventDetails,
//                                                 ],
//                                             };
//                                             //console.log('hostForCollection', hostForCollection);
//                                             emailHostsCollection.push(
//                                                 hostForCollection
//                                             );
//                                             hostsToEmailArray.push(
//                                                 hostInReach.email
//                                             );
//                                         } else {
//                                             //if the hostInReach's email IS already in the array, append this event to the host's eventsForEmail
//                                             _.map(
//                                                 emailHostsCollection,
//                                                 (host) => {
//                                                     if (
//                                                         host.email ===
//                                                         hostInReach.email
//                                                     ) {
//                                                         _.assign(host, {
//                                                             eventsForEmail: [
//                                                                 ...host.eventsForEmail,
//                                                                 newEventDetails,
//                                                             ],
//                                                         });
//                                                     }
//                                                     return host;
//                                                 }
//                                             );
//                                         }
//                                     }
//                                 }

//                                 //console.log('hostInReach._id', hostInReach._id);
//                                 return { host: hostInReach._id };
//                             }
//                         );

//                         eventDetails.hostsInReach = hostsIDInReach;
//                         eventDetails.markModified('hostsInReach');
//                         //console.log('hostsIDInReach', await hostsIDInReach);
//                         updatedEvents++;
//                         //await eventDetails.save();
//                         await eventDetails.updateOne({
//                             hostsInReach: hostsIDInReach,
//                         });
//                     }
//                     if (index === array.length - 1) resolve(); //so that we can return the results
//                 });
//             });
//             //console.log('updatedEvents:', await updatedEvents);

//             loopThruEvents.then(() => {
//                 //console.log('hostsToEmailArray', hostsToEmailArray);
//                 //console.log('emailHostsCollection:', emailHostsCollection);
//                 // console.log(
//                 //     'emailHostsCollection.length',
//                 //     emailHostsCollection.length
//                 // );

//                 let loopThruHosts = new Promise((resolve, reject) => {
//                     emailHostsCollection.forEach(
//                         async (hostToEmail, index, array) => {
//                             console.log(
//                                 'sending to ' +
//                                     hostToEmail.email +
//                                     ': ' +
//                                     hostToEmail.firstName +
//                                     ' ' +
//                                     hostToEmail.lastName +
//                                     ' (' +
//                                     hostToEmail.eventsForEmail.length +
//                                     ' events)'
//                             );
//                             sendEmail(hostToEmail.email, {
//                                 event: 'HOST_EMAIL_DIGEST',
//                                 template: '5VAZYQK9RAM506GYRGYMMJ8X3D55',
//                                 ...hostToEmail,
//                             });
//                             let updatedHost = await Host.findOneAndUpdate(
//                                 //Update the Host's lastEmailed field, so that we can check it when we trigger the host email digest next time, to know if the host is ready for their next one
//                                 { _id: hostToEmail._id },
//                                 { $set: { lastEmailed: new Date() } },
//                                 {
//                                     new: true, //return the new document (after the update) . . . the default is to return the original document before the update
//                                     rawResult: true,
//                                 } //https://mongoosejs.com/docs/tutorials/findoneandupdate.html#raw-result
//                             ); //.select('-hadMeeting -sentFollowUp -notes');

//                             if (index === array.length - 1) resolve(); //so that we can return the results
//                         }
//                     );
//                 });

//                 loopThruHosts.then(() => {
//                     console.log(
//                         'Sending an email to ' +
//                             emailHostsCollection.length +
//                             (emailHostsCollection.length > 1
//                                 ? ' hosts'
//                                 : ' host') +
//                             ' of the Porchlight Network.'
//                     );
//                     res.json(
//                         'Sending an email to ' +
//                             emailHostsCollection.length +
//                             (emailHostsCollection.length > 1
//                                 ? ' hosts'
//                                 : ' host') +
//                             ' of the Porchlight Network.'
//                     );
//                     //res.json(emailHostsCollection);
//                 });
//                 if (emailHostsCollection.length === 0) {
//                     console.log(
//                         "There aren't any hosts to email at this time."
//                     );
//                     res.json("There aren't any hosts to email at this time.");
//                 }
//             });
//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server Error');
//         }
//     } else {
//         res.status(500).send(
//             'Only ADMINs and BOOKING coordinators can get all events like this.'
//         );
//     }
// });

module.exports = router;
