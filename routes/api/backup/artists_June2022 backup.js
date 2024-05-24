// const express = require('express');
// //const request = require('request'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
// //const config = require('../../../porchlight-config/default.json');//require('config'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
// const router = express.Router();
// const auth = require('../../middleware/auth');
// const { check, validationResult, body } = require('express-validator');

// const User = require('../../models/User');
// const Artist = require('../../models/Artist');
// const Event = require('../../models/Event');

// const addressGeocode = require('../../utils/maps/geocoding');

// function convertToSlug(Text) {
//     return Text.toLowerCase()
//         .replace(/ /g, '-')
//         .replace(/[^\w-]+/g, '');
// }

// // @route    GET api/artists/me
// // @desc     Get current user's artist profile
// // @access   Private
// router.get('/me', auth, async (req, res) => {
//     try {
//         // const thisUser = await User.findOne({
//         //   id: req.user.id,
//         // });
//         //console.log(req.user);
//         const artist = await Artist.findOne({
//             email: req.user.email,
//         }).select('-hadMeeting -sentFollowUp -notes');
//         if (!artist) {
//             return res.json({
//                 email: req.user.email,
//                 msg:
//                     'There is no artist profile yet for ' +
//                     req.user.email +
//                     '. No worries, we’ll make one!',
//             });
//         }

//         res.json(artist);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route    GET api/artists/me
// // @desc     Get current users artist
// // @access   Private
// router.get('/my-avatar', auth, async (req, res) => {
//     try {
//         // const thisUser = await User.findOne({
//         //   id: req.user.id,
//         // });
//         //console.log(req.user);
//         const artist = await Artist.findOne({
//             email: req.user.email,
//         }).select('squareImg');
//         if (!artist) {
//             return res
//                 .status(400)
//                 .json({ msg: 'There is no artist for this user' });
//         }

//         res.json(artist);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route    POST api/artists
// // @desc     Create or update artist
// // @access   Private
// router.post(
//     '/',
//     [auth, [check('email', 'Please include a valid email').isEmail()]],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const {
//             email,
//             firstName,
//             lastName,
//             stageName,
//             medium,
//             genre,
//             repLink,
//             helpKind,
//             typeformDate,
//             hadMeeting,
//             sentFollowUp,
//             active,
//             notes,
//         } = req.body;

//         // Build artist object
//         const artistFields = {};
//         artistFields.email = email;
//         if (firstName) artistFields.firstName = firstName;
//         if (lastName) artistFields.lastName = lastName;
//         if (stageName) artistFields.stageName = stageName;
//         if (medium) artistFields.medium = medium;
//         if (genre) artistFields.genre = genre;
//         if (repLink) artistFields.repLink = repLink;
//         if (helpKind) artistFields.helpKind = helpKind;
//         if (typeformDate) artistFields.typeformDate = typeformDate;
//         if (hadMeeting) artistFields.hadMeeting = hadMeeting;
//         if (sentFollowUp) artistFields.sentFollowUp = sentFollowUp;
//         if (active) artistFields.active = active;
//         if (notes) artistFields.notes = notes;

//         try {
//             // Using upsert option (creates new doc if no match is found):
//             let artist = await Artist.findOneAndUpdate(
//                 { email: email.toLowerCase() },
//                 { $set: artistFields },
//                 { new: true, upsert: true }
//             );
//             res.json(artist); //eventually remove this
//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server Error');
//         }
//     }
// );

// // @route    POST api/artists/batch
// // @desc     Batch create or update artists
// // @access   Private
// router.post('/batch', [auth], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     //console.log('api/artists/batch');
//     //console.log(req.user);
//     if (req.body instanceof Array) {
//         let artistCount = 0;
//         await Promise.all(
//             req.body.map(async (artistFields) => {
//                 artistFields.stageName && artistFields.stageName.length > 0
//                     ? (artistFields.slug = convertToSlug(
//                           artistFields.stageName
//                       ))
//                     : '';

//                 //if (req.user.role === 'ADMIN' && artistFields.email !== '') {
//                 if (
//                     req.user.role &&
//                     req.user.role.indexOf('ADMIN') != -1 &&
//                     artistFields.email !== ''
//                 ) {
//                     //console.log("User is ADMIN and has authority to update all other users.");
//                     try {
//                         //console.log(artistFields);
//                         // Using upsert option (creates new doc if no match is found):
//                         delete artistFields.artistUpdated;
//                         delete artistFields.updatedAt;
//                         delete artistFields.typeformDate;
//                         delete artistFields._id;
//                         delete artistFields.onboardDate;
//                         delete artistFields.user;

//                         let artist = await Artist.findOneAndUpdate(
//                             { email: artistFields.email.toLowerCase() },
//                             { $setOnInsert: artistFields },
//                             { new: true, upsert: true }
//                         );
//                         if (artist) {
//                             let user = await User.findOneAndUpdate(
//                                 { email: artistFields.email.toLowerCase() },
//                                 { $set: { artistProfile: artist._id } }
//                             );

//                             artistCount++;
//                         }
//                         res.json(artistCount);
//                     } catch (err) {
//                         console.error(err.message);
//                         res.status(500).send('Server Error: ' + err.message);
//                     }
//                 }
//                 // else if (
//                 //     req.user.email === artistFields.email.toLowerCase()
//                 // ) {
//                 //     //if the request user email matches the artist email they have authority to edit their own profile, removing admin things
//                 //     try {
//                 //         delete artistFields.active;
//                 //         console.log(artistFields);
//                 //         // Using upsert option (creates new doc if no match is found):
//                 //         let artist = await Artist.findOneAndUpdate(
//                 //             { email: artistFields.email.toLowerCase() },
//                 //             { $set: artistFields },
//                 //             { new: true, upsert: true }
//                 //         );
//                 //         let user = await User.findOneAndUpdate(
//                 //             { email: artistFields.email.toLowerCase() },
//                 //             { $set: { artistProfile: artist._id } }
//                 //         );
//                 //         artistCount++;
//                 //         res.json(artistFields);
//                 //     } catch (err) {
//                 //         console.error(err.message);
//                 //         res.status(500).send('Server Error');
//                 //     }
//                 // }
//                 else {
//                     console.error(
//                         "You don't have authority to make these changes."
//                     );
//                     res.status(500).send(
//                         'User does not have authority to make these changes.'
//                     );
//                 }
//             })
//         );
//         res.json(artistCount + ' artist(s) submitted to the database.'); //eventually remove this
//     }
// });

// // @route    POST api/artists/admin-update
// // @desc     Batch create or update artists
// // @access   Private
// router.post('/admin-update', [auth], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     //console.log(req.user);
//     if (req.body instanceof Array) {
//         await Promise.all(
//             req.body.map(async (artistFields) => {
//                 artistFields.stageName && artistFields.stageName.length > 0
//                     ? (artistFields.slug = convertToSlug(
//                           artistFields.stageName
//                       ))
//                     : '';

//                 //if (req.user.role === 'ADMIN' && artistFields.email !== '') {
//                 if (
//                     req.user.role &&
//                     req.user.role.indexOf('ADMIN') > -1 &&
//                     artistFields.email !== ''
//                 ) {
//                     //console.log("User is ADMIN and has authority to update all other users.");
//                     try {
//                         //console.log(artistFields);
//                         // Using upsert option (creates new doc if no match is found):
//                         let artist = await Artist.findOneAndUpdate(
//                             { email: artistFields.email.toLowerCase() },
//                             { $set: artistFields },
//                             { new: true, upsert: true }
//                         );
//                         let user = await User.findOneAndUpdate(
//                             { email: artistFields.email.toLowerCase() },
//                             { $set: { artistProfile: artist._id } }
//                         );
//                         const artists = await Artist.find();
//                         res.json(artists);
//                     } catch (err) {
//                         console.error(err.message);
//                         res.status(500).send('Server Error: ' + err.message);
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

// // @route    POST api/artists/updateMe
// // @desc     Create or update my artist profile (copy of /batch)
// // @access   Private
// router.post('/updateMe', [auth], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     //if req.user.role.indexOf turns up -1 (no indexes found) for ARTIST and ADMIN, then {return}, don't proceed
//     if (
//         req.user.role &&
//         req.user.role.indexOf('ARTIST') === -1 &&
//         req.user.role.indexOf('ADMIN') === -1
//     ) {
//         console.error(
//             req.user.email + " doesn't have authority to make these changes."
//         );
//         return res
//             .status(500)
//             .send('User does not have authority to make these changes.');
//     }
//     if (req.body instanceof Array) {
//         let artistCount = 0;
//         await Promise.all(
//             req.body.map(async (artistFields) => {
//                 artistFields.stageName && artistFields.stageName.length > 0
//                     ? (artistFields.slug = convertToSlug(
//                           artistFields.stageName
//                       ))
//                     : (artistFields.slug = convertToSlug(req.user.id));

//                 if (
//                     (req.user.role &&
//                         req.user.role.indexOf('ADMIN') != -1 &&
//                         artistFields.email !== '') ||
//                     req.user.email.toLowerCase() ===
//                         artistFields.email.toLowerCase()
//                 ) {
//                     //if requesting user is ADMIN and has authority to update all other users OR if the requesting user has the same email as the artist they're trying to edit;
//                     try {
//                         //console.log(artistFields);
//                         if (
//                             req.user.email.toLowerCase() ===
//                                 artistFields.email.toLowerCase() &&
//                             req.user.role &&
//                             req.user.role.indexOf('ADMIN') === -1
//                         ) {
//                             //if the user is not an ADMIN, but does have the right to edit their own profile
//                             delete artistFields.active; //to prevent someone from being able to change their active status
//                             artistFields.user = req.user.id;
//                         }

//                         // Using upsert option (creates new doc if no match is found):
//                         let artist = await Artist.findOneAndUpdate(
//                             { email: artistFields.email.toLowerCase() },
//                             { $set: artistFields },
//                             { new: true, upsert: true }
//                         ).select('-hadMeeting -sentFollowUp -notes');

//                         let user = await User.findOneAndUpdate(
//                             { email: artistFields.email.toLowerCase() },
//                             { $set: { artistProfile: artist._id } }
//                         );

//                         let artistEvents = await Event.find({
//                             artistEmail: artistFields.email.toLowerCase(),
//                             status: 'PENDING',
//                         });

//                         artistEventsDates = artistEvents.map((artistEvent) => {
//                             return artistEvent.bookingWhen;
//                         });

//                         //console.log('artistEventsDates', artistEventsDates);

//                         if (
//                             artistFields.bookingWhenWhere &&
//                             artistFields.bookingWhenWhere.length > 0
//                         ) {
//                             const artistBookingDates = await Promise.all(
//                                 artistFields.bookingWhenWhere.map(
//                                     async (bookingInfo) => {
//                                         if (
//                                             bookingInfo.where &&
//                                             bookingInfo.where != ''
//                                         ) {
//                                             // geocoding like this seems too expensive! Maybe geocode them when they're pull from the database, only if they don't have latLong.coordinates
//                                             // const address =
//                                             //     bookingInfo.where.city +
//                                             //     ', ' +
//                                             //     bookingInfo.where.state +
//                                             //     ' ' +
//                                             //     bookingInfo.where.zip;
//                                             // const geocodedAddress =
//                                             //     await addressGeocode(address);
//                                             // console.log(
//                                             //     address + ' => ',
//                                             //     geocodedAddress
//                                             // );

//                                             let event =
//                                                 await Event.findOneAndUpdate(
//                                                     {
//                                                         artistEmail:
//                                                             artistFields.email.toLowerCase(),
//                                                         bookingWhen:
//                                                             bookingInfo.when,
//                                                     },
//                                                     {
//                                                         $set: artistFields,
//                                                         artist: artist.id,
//                                                         artistSlug: artist.slug,
//                                                         artistUser: user.id,
//                                                         artistEmail:
//                                                             artistFields.email,
//                                                         bookingWhen:
//                                                             bookingInfo.when,
//                                                         bookingWhere:
//                                                             bookingInfo.where,
//                                                     },
//                                                     { new: true, upsert: true }
//                                                 );

//                                             //Geocode the event — pulled from events.js line 399 ~ June 4th,2022
//                                             if (
//                                                 ((event.latLong &&
//                                                     event.latLong.coordinates &&
//                                                     event.latLong.coordinates
//                                                         .length == 0) || //if there is no latLong OR
//                                                     !event.geocodedBookingWhere || //if there is no geocodedBookingWhere OR
//                                                     (event.geocodedBookingWhere && //if there IS a geocodedBookingWhere AND
//                                                         event.bookingWhere
//                                                             .zip !==
//                                                             event
//                                                                 .geocodedBookingWhere
//                                                                 .zip)) && // the zip doesn't match the bookingWhere.zip, then the location has changed since last geocoded
//                                                 event.bookingWhere &&
//                                                 event.bookingWhere.city &&
//                                                 event.bookingWhere.state &&
//                                                 event.bookingWhere.zip
//                                             ) {
//                                                 //if the event doesn't yet have a latLong attached to it, make one based on just the city, state zip they selected
//                                                 const address =
//                                                     event.bookingWhere.city +
//                                                     ', ' +
//                                                     event.bookingWhere.state +
//                                                     ' ' +
//                                                     event.bookingWhere.zip;
//                                                 const geocodedAddress =
//                                                     await addressGeocode(
//                                                         address
//                                                     );
//                                                 // console.log(
//                                                 //     updatedEvents +
//                                                 //         ') ' +
//                                                 //         event.artist.stageName +
//                                                 //         ' wants to play a concert near ' +
//                                                 //         address +
//                                                 //         ': ',
//                                                 //     geocodedAddress
//                                                 // );

//                                                 let hostsInReach =
//                                                     await Host.find({
//                                                         latLong: {
//                                                             $near: {
//                                                                 $maxDistance:
//                                                                     event.hostReachRadius *
//                                                                     1609.35, //the distance is in meters, 1609.35m = 1 mile;
//                                                                 $geometry: {
//                                                                     type: 'Point',
//                                                                     coordinates:
//                                                                         geocodedAddress,
//                                                                 },
//                                                             },
//                                                         },
//                                                     });
//                                                 //console.log(await hostsInReach);
//                                                 const hostsIDInReach =
//                                                     hostsInReach.map(
//                                                         (hostInReach) => {
//                                                             //console.log('hostInReach._id', hostInReach._id);
//                                                             return {
//                                                                 host: hostInReach._id,
//                                                             };
//                                                         }
//                                                     );

//                                                 let savedDetails =
//                                                     await event.updateOne(
//                                                         {
//                                                             hostsInReach:
//                                                                 hostsIDInReach,
//                                                             'latLong.coordinates':
//                                                                 geocodedAddress,
//                                                             geocodedBookingWhere:
//                                                                 event.bookingWhere,
//                                                         },
//                                                         { new: true }
//                                                     );
//                                                 // if (savedDetails) {
//                                                 //     console.log(
//                                                 //         'savedDetails:',
//                                                 //         savedDetails
//                                                 //     );
//                                                 // }
//                                             }
//                                             //end geocoding

//                                             return new Date(
//                                                 bookingInfo.when
//                                             ).toISOString();
//                                         }
//                                     }
//                                 )
//                             );

//                             // console.log(
//                             //     'artistBookingDates',
//                             //     artistBookingDates
//                             // );
//                             leftOverArtistEventsDates =
//                                 artistEventsDates.filter(function (eventDate) {
//                                     if (
//                                         artistBookingDates.indexOf(
//                                             new Date(eventDate).toISOString()
//                                         ) === -1
//                                     ) {
//                                         //return eventDates only if they don't match a date in the artistBookingDates---later we'll remove any dates from the Events collection that are still in this array
//                                         return eventDate;
//                                     }
//                                 });
//                             // console.log(
//                             //     'leftOverArtistEventsDates',
//                             //     leftOverArtistEventsDates
//                             // );

//                             leftOverArtistEventsDates.forEach(
//                                 async (leftOverEventDate) => {
//                                     let removeEvent = await Event.deleteOne({
//                                         artistEmail:
//                                             artistFields.email.toLowerCase(),
//                                         bookingWhen: leftOverEventDate,
//                                         status: 'PENDING',
//                                     });
//                                 }
//                             );
//                         } else if (artistEventsDates.length > 0) {
//                             //if there aren't any bookingWhenWheres, delete any PENDING event dates for that artist
//                             artistEventsDates.forEach(
//                                 async (leftOverEventDate) => {
//                                     let removeEvent = await Event.deleteOne({
//                                         artistEmail:
//                                             artistFields.email.toLowerCase(),
//                                         bookingWhen: leftOverEventDate,
//                                         status: 'PENDING',
//                                     });
//                                 }
//                             );
//                         }

//                         artistCount++;
//                         res.json(artist);
//                     } catch (err) {
//                         console.error(err.message);
//                         res.status(500).send('Server Error: ' + err.message);
//                     }
//                 }
//                 // else if (
//                 //     req.user.email.toLowerCase() ===
//                 //     artistFields.email.toLowerCase()
//                 // ) {
//                 //     //if the request user email matches the artist email they have authority to edit their own profile, removing admin things
//                 //     try {
//                 //         delete artistFields.active; //to prevent someone from being able to change their active status
//                 //         artistFields.user = req.user.id;
//                 //         console.log(artistFields);
//                 //         // Using upsert option (creates new doc if no match is found):
//                 //         let artist = await Artist.findOneAndUpdate(
//                 //             { email: artistFields.email.toLowerCase() },
//                 //             { $set: artistFields },
//                 //             { new: true, upsert: true }
//                 //         ).select('-hadMeeting -sentFollowUp -notes');

//                 //         let user = await User.findOneAndUpdate(
//                 //             { email: artistFields.email.toLowerCase() },
//                 //             { $set: { artistProfile: artist._id } }
//                 //         );

//                 //         let artistEvents = await Event.find({
//                 //             artistEmail: artistFields.email.toLowerCase(),
//                 //             status: 'PENDING',
//                 //         });

//                 //         console.log('artistEvents', artistEvents);

//                 //         if (
//                 //             artistFields.bookingWhenWhere &&
//                 //             artistFields.bookingWhenWhere.length > 0
//                 //         ) {
//                 //             artistFields.bookingWhenWhere.map(
//                 //                 async (bookingInfo) => {
//                 //                     //TODO: create a new Event for each bookingWhenWhere, and then figure out how to delete them
//                 //                     let event = await Event.findOneAndUpdate(
//                 //                         {
//                 //                             artistEmail:
//                 //                                 artistFields.email.toLowerCase(),
//                 //                             bookingWhen: bookingInfo.when,
//                 //                         },
//                 //                         {
//                 //                             $set: artistFields,
//                 //                             artist: artist.id,
//                 //                             artistUser: user.id,
//                 //                             artistEmail: artistFields.email,
//                 //                             bookingWhen: bookingInfo.when,
//                 //                             bookingWhere: bookingInfo.where,
//                 //                         },
//                 //                         { new: true, upsert: true }
//                 //                     );
//                 //                 }
//                 //             );
//                 //         }

//                 //         artistCount++;
//                 //         res.json(artist);
//                 //     } catch (err) {
//                 //         console.error(err.message);
//                 //         res.status(500).send('Server Error');
//                 //     }
//                 // }
//                 else {
//                     console.error(
//                         req.user.email +
//                             " doesn't have authority to make these changes."
//                     );
//                     res.status(500).send(
//                         'User does not have authority to make these changes.'
//                     );
//                 }
//             })
//         );
//         //res.json(artistCount + " artist(s) submitted to the database."); //eventually remove this
//     }
// });

// // @route    GET api/artists
// // @desc     Get all active artists
// // @access   Public
// router.get('/', async (req, res) => {
//     try {
//         const artists = await Artist.find({ active: true })
//             .select(
//                 '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes'
//             )
//             .sort({ updatedAt: -1 });
//         res.json(artists);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route    GET api/artists/edit
// // @desc     [ADMIN] Get all artists for editing (everything)
// // @access   Private
// router.get('/edit', [auth], async (req, res) => {
//     //if (req.user.role === 'ADMIN') {
//     if (req.user.role && req.user.role.indexOf('ADMIN') != -1) {
//         try {
//             const artists = await Artist.find();

//             // artists.forEach(artist => {
//             //   //if no time exists in artist.zoomDate {
//             //   if (artist.zoomDate == null){
//             //     //async hit up Calendly for Scheduled events with artist.email as the invitee_email {

//             //       //store collection[collection.length()-1].start_time in artist.zoomDate

//             //   }
//             // });

//             res.json(artists);
//         } catch (err) {
//             console.error(err.message);
//             res.status(500).send('Server Error');
//         }
//     } else {
//         res.status(500).send('Only ADMINs can edit all artists.');
//     }
// });

// // @route    GET api/artists/slugs
// // @desc     Get just artists slugs
// // @access   Public
// router.get('/slugs', [auth], async (req, res) => {
//     try {
//         const artists = await Artist.find({}).select('slug');
//         res.json(artists);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

// // @route    GET api/artists/:slug
// // @desc     Get artist by slug
// // @access   Public
// router.get('/:slug', async (req, res) => {
//     try {
//         const artist = await Artist.findOne({
//             slug: req.params.slug,
//         }).select(
//             '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes'
//         ); //ADD .select('-field'); to exclude [field] from the response

//         if (!artist) return res.status(400).json({ msg: 'Artist not found' });

//         res.json(artist);
//     } catch (err) {
//         console.error(err.message);
//         if (err.kind == 'ObjectId') {
//             return res.status(400).json({ msg: 'Artist not found' });
//         }
//         res.status(500).send('Server Error');
//     }
// });
// // @route    POST api/artists/by-email
// // @desc     POST artist slug by email
// // @access   Private
// router.post('/by-email', [auth], async (req, res) => {
//     try {
//         const artistSlug = await Artist.findOne({
//             email: req.body.email,
//         }).select('slug stageName'); //ADD .select('-field'); to exclude [field] from the response

//         // this just loads up the console with 404 not founds
//         // if (!artistSlug)
//         //     return res.status(404).json({
//         //         msg: 'No artist found with email:' + req.body.email,
//         //     });

//         res.json(artistSlug);
//     } catch (err) {
//         console.error(err.message);
//         if (err.kind == 'ObjectId') {
//             return res.status(404).json({ msg: 'Artist not found' });
//         }
//         res.status(500).send('Server Error');
//     }
// });

// // @route    DELETE api/artists
// // @desc     Delete artist, user & posts
// // @access   Private
// // router.delete('/', auth, async (req, res) => {
// //   try {
// //     // Remove user posts
// //     await Post.deleteMany({ user: req.user.id });
// //     // Remove artist
// //     await Artist.findOneAndRemove({ user: req.user.id });
// //     // Remove user
// //     await User.findOneAndRemove({ _id: req.user.id });

// //     res.json({ msg: 'User deleted' });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server Error');
// //   }
// // });

// module.exports = router;
