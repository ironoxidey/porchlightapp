const express = require('express');
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

// @route    GET api/events/getArtistBooking/:slug
// @desc     Get all events by artist slug for public profile
// @access   Public
router.get('/getArtistBooking/:slug', async (req, res) => {
    try {
        const events = await Event.find(
            {
                artistSlug: req.params.slug,
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
            }
        ).sort({ bookingWhen: 1 }); //.select('-artistEmail -agreeToPayAdminFee -payoutHandle'); //.select(['city', 'state', 'zipCode']); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
        //console.log(events);
        res.json(events);
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

    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (req.user.role && req.user.role.indexOf('HOST') > -1) {
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
            });
            //Send an email to the artist and then delete the artist's email address from the eventDetails object we return to the host in the app
            sendEmail(eventDetails.artistEmail, {
                event: 'HOST_OFFER',
                template: 'BXKVWA13SK4G60N1ZE1S339YPKAM',
                name: eventDetails.artist.firstName,
                hostName: host.firstName + ' ' + host.lastName,
                stageName: eventDetails.artist.stageName,
                eventDate: emailDate,
                hostLocation: host.city + ', ' + host.state,
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
            req.user.email + " doesn't have authority to make these changes."
        );
        res.status(500).send(
            'User does not have authority to make these changes.'
        );
    }

    //res.json(eventCount + " event(s) submitted to the database."); //eventually remove this
});

// @route    GET api/events/myEventsOfferedToHost
// @desc     Get current user's events they've offered to host
// @access   Private
router.get('/myEventsOfferedToHost', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        //console.log(req.user);
        const offeredToBookEvents = await Event.find({
            hostsOfferingToBook: req.user.email,
        })
            .select(
                '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -offersFromHosts -agreeToPayAdminFee -payoutHandle'
            )
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            )
            .sort({ bookingWhen: 1 });
        if (!offeredToBookEvents) {
            return res.json({
                email: req.user.email,
                msg: 'There are no events associated with ' + req.user.email,
            });
        }

        res.json(offeredToBookEvents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/events/myArtistEvents
// @desc     Get current user's events where the hostsOfferingToBook has at least one index
// @access   Private
router.get('/myArtistEventsOffers', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        //console.log(req.user);
        const myArtistEvents = await Event.find({
            artistEmail: req.user.email,
            'offersFromHosts.0': { $exists: true }, //checks to see if the first index of hostsOfferingToBook exists //https://www.mongodb.com/community/forums/t/is-there-a-way-to-query-array-fields-with-size-greater-than-some-specified-value/54597
        })
            .select('-artistEmail -hostsOfferingToBook -latLong -hostsInReach')
            .populate(
                'offersFromHosts.host',
                '-user -email -phone -streetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin'
            )
            .sort({ bookingWhen: 1 }); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
        if (!myArtistEvents) {
            return res.json({
                email: req.user.email,
                msg: 'There are no events associated with ' + req.user.email,
            });
        }

        res.json(myArtistEvents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

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

    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (req.user.role && req.user.role.indexOf('ARTIST') > -1) {
        try {
            //console.log('artistViewedHostOffer eventFields', eventFields);

            let eventDetails = await Event.findOneAndUpdate(
                //https://www.mongodb.com/docs/manual/reference/operator/projection/
                {
                    artistEmail: req.user.email,
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
                    '-user -email -phone -streetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin'
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

    //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
    if (req.user.role && req.user.role.indexOf('ARTIST') > -1) {
        try {
            //console.log('artistAcceptOffer eventFields', eventFields);

            let eventDetails = await Event.findOneAndUpdate(
                //https://www.mongodb.com/docs/manual/reference/operator/projection/
                {
                    artistEmail: req.user.email,
                    bookingWhen: eventFields.bookingWhen,
                    'offersFromHosts.host': eventFields.offeringHost._id,
                    status: 'PENDING',
                },
                {
                    $set: {
                        confirmedHost: eventFields.offeringHost._id,
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
                    '_id email firstName lastName city state'
                )
                .populate(
                    'offersFromHosts.host',
                    '-user -email -phone -streetAddress -latLong -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -venueNickname -specialNavDirections -lastLogin'
                )
                .lean(); //.lean required to delete email later -- Documents returned from queries with the lean option enabled are plain javascript objects, not Mongoose Documents. They have no save method, getters/setters, virtuals, or other Mongoose features. https://stackoverflow.com/a/71746004/3338608

            if (eventDetails) {
                //console.log('eventDetails', eventDetails);
                let emailDate = new Date(
                    eventFields.bookingWhen
                ).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                //Send an email to the artist and then delete the artist's email address from the eventDetails object we return to the host in the app
                sendEmail(eventDetails.confirmedHost.email, {
                    event: 'ARTIST_ACCEPTS_OFFER',
                    template: 'TFJSKATYZZMWHSNEGNPZCCYM4E1B',
                    hostName:
                        eventDetails.confirmedHost.firstName +
                        ' ' +
                        eventDetails.confirmedHost.lastName,
                    stageName: eventDetails.artistSlug,
                    eventDate: emailDate,
                    hostLocation:
                        eventDetails.confirmedHost.city +
                        ', ' +
                        eventDetails.confirmedHost.state,
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
        let updatedEvents = 0;
        //must be an ADMIN to get into all of this!
        try {
            const events = await Event.find({})
                .populate('artist')
                .populate('hostsInReach.host')
                .populate('offersFromHosts.host');

            events.forEach(async (eventDetails) => {
                if (!eventDetails.artistSlug && eventDetails.artist.slug) {
                    eventDetails.artistSlug = eventDetails.artist.slug;
                    await eventDetails.save();
                    updatedEvents++;
                }
                if (
                    eventDetails.latLong &&
                    eventDetails.latLong.coordinates &&
                    eventDetails.latLong.coordinates.length <= 0 &&
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
                    // console.log(
                    //     eventDetails.artist.stageName +
                    //         ' wants to play a concert near ' +
                    //         address +
                    //         ': ',
                    //     geocodedAddress
                    // );
                    eventDetails.latLong.coordinates = geocodedAddress;
                    eventDetails.markModified('latLong');
                    await eventDetails.save();
                    updatedEvents++;
                }
                if (
                    eventDetails.latLong &&
                    eventDetails.latLong.coordinates &&
                    eventDetails.latLong.coordinates.length > 0 &&
                    eventDetails.hostReachRadius &&
                    (!eventDetails.hostsInReach ||
                        eventDetails.hostsInReach.length <= 0)
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
                    //console.log('hostsIDInReach', await hostsIDInReach);
                    await eventDetails.save();
                    updatedEvents++;
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

// @route    DELETE api/events
// @desc     Delete event, user & posts
// @access   Private
// router.delete('/', auth, async (req, res) => {
//   try {
//     // Remove user posts
//     await Post.deleteMany({ user: req.user.id });
//     // Remove event
//     await event.findOneAndRemove({ user: req.user.id });
//     // Remove user
//     await User.findOneAndRemove({ _id: req.user.id });

//     res.json({ msg: 'User deleted' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
