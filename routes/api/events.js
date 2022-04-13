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

// @route    GET api/events/myEventsOfferedToHost
// @desc     Get current user's events they've offered to host
// @access   Private
router.get('/myEventsOfferedToHost', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        console.log(req.user);
        const offeredToBookEvents = await Event.find({
            hostsOfferingToBook: req.user.email,
        })
            .select('-artistEmail -hostsOfferingToBook')
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes'
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

// @route    POST api/events/admin-update
// @desc     Batch create or update events
// @access   Private
// router.post('/admin-update', [auth], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     //console.log(req.user);
//     if (req.body instanceof Array) {
//         await Promise.all(
//             req.body.map(async (eventFields) => {
//                 eventFields.stageName && eventFields.stageName.length > 0
//                     ? (eventFields.slug = convertToSlug(eventFields.stageName))
//                     : '';

//                 if (eventFields.numDraw) {
//                     const numDraw = firstInt(eventFields.numDraw);
//                     if (numDraw && numDraw > 0) {
//                         eventFields.numDraw = numDraw;
//                     } else {
//                         delete eventFields.numDraw;
//                     }
//                 }
//                 if (eventFields.numEventedBefore) {
//                     const numEventedBefore = firstInt(
//                         eventFields.numEventedBefore
//                     );
//                     if (numEventedBefore && numEventedBefore > 0) {
//                         eventFields.numEventedBefore = numEventedBefore;
//                     } else {
//                         delete eventFields.numEventedBefore;
//                     }
//                 }
//                 if (eventFields.maxNumAttendees) {
//                     const maxNumAttendees = firstInt(
//                         eventFields.maxNumAttendees
//                     );
//                     if (maxNumAttendees && maxNumAttendees > 0) {
//                         eventFields.maxNumAttendees = maxNumAttendees;
//                     } else {
//                         delete eventFields.maxNumAttendees;
//                     }
//                 }

//                 //if (req.user.role === 'ADMIN' && eventFields.email !== '') {
//                 if (
//                     req.user.role &&
//                     req.user.role.indexOf('ADMIN') != -1 &&
//                     eventFields.email !== ''
//                 ) {
//                     //console.log("User is ADMIN and has authority to update all other users.");
//                     try {
//                         //console.log(eventFields);
//                         // Using upsert option (creates new doc if no match is found):
//                         let event = await Event.findOneAndUpdate(
//                             { email: eventFields.email.toLowerCase() },
//                             { $set: eventFields },
//                             { new: true, upsert: true }
//                         );
//                         //const events = await event.find();
//                         res.json(event);
//                     } catch (err) {
//                         console.error(err.message);
//                         //res.status(500).send('Server Error: ' + err.message);
//                     }
//                 } else {
//                     console.error(
//                         "You don't have authority to make these changes."
//                     );
//                     res.status(500).send(
//                         'User does not have authority to make these changes.'
//                     );
//                 }
//             })
//         );
//     }
// });

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
            console.log(eventFields);
            let host = await Host.findOne({ email: req.user.email });

            let eventDetails = await Event.findOneAndUpdate(
                {
                    artist: eventFields.artist._id,
                    bookingWhen: eventFields.bookingWhen,
                },
                {
                    $addToSet: {
                        hostsOfferingToBook: req.user.email,
                        offersFromHosts: { host: host._id },
                    },
                },
                { new: true }
            )
                .select('-artistEmail -agreeToPayAdminFee -payoutHandle')
                .populate(
                    'artist',
                    '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes'
                );
            //res.json(event);
            console.log('eventDetails', eventDetails);
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
                artistEmail: 0,
                agreeToPayAdminFee: 0,
                payoutHandle: 0,
                hostsOfferingToBook: 0,
                'travelingCompanions.email': 0,
            }
        ).sort({ bookingWhen: 1 }); //.select('-artistEmail -agreeToPayAdminFee -payoutHandle'); //.select(['city', 'state', 'zipCode']); //https://www.mongodb.com/docs/manual/reference/method/cursor.sort/#:~:text=Ascending%2FDescending%20Sort,ascending%20or%20descending%20sort%20respectively.&text=When%20comparing%20values%20of%20different,MinKey%20(internal%20type)
        res.json(events);
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
        console.log(req.user);
        const myArtistEvents = await Event.find({
            artistEmail: req.user.email,
            'offersFromHosts.0': { $exists: true }, //checks to see if the first index of hostsOfferingToBook exists //https://www.mongodb.com/community/forums/t/is-there-a-way-to-query-array-fields-with-size-greater-than-some-specified-value/54597
        })
            .select('-artistEmail -hostsOfferingToBook')
            .populate(
                'offersFromHosts.host',
                '-user -email -phone -streetAddress -latitude -longitude -connectionToUs -specificBand -venueStreetAddress -specialNavDirections -lastLogin'
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

// @route    GET api/events/edit
// @desc     [ADMIN] Get all events for editing (everything)
// @access   Private
router.get('/edit', [auth], async (req, res) => {
    //if (req.user.role === 'ADMIN') {
    if (req.user.role && req.user.role.indexOf('ADMIN') != -1) {
        //must be an ADMIN to get into all of this!
        try {
            const eventDetails = await Event.find();

            // events.forEach(event => {
            //   //if no time exists in event.zoomDate {
            //   if (event.zoomDate == null){
            //     //async hit up Calendly for Scheduled events with event.email as the invitee_email {

            //       //store collection[collection.length()-1].start_time in event.zoomDate

            //   }
            // });

            res.json(eventDetails);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    } else {
        res.status(500).send('Only ADMINs can edit all events.');
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
