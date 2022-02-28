const express = require('express');
const request = require('request');
const config = !process.env
    ? require('config')
    : require('../../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, body } = require('express-validator');

const Artist = require('../../models/Artist');

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

// @route    POST api/typeform/artist-application
// @desc     Batch create or update artists
// @access   Private
router.post('/artist-application', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (req.body instanceof Array) {
        let artistCount = 0;
        await Promise.all(
            req.body.map(async (artistFields) => {
                const {
                    email,
                    firstName,
                    lastName,
                    stageName,
                    medium,
                    genre,
                    repLink,
                    helpKind,
                    typeformDate,
                    hadMeeting,
                    sentFollowUp,
                    active,
                    notes,

                    phone,
                    hometown,
                    costStructure,
                    namedPrice,
                    bookingWhenWhere,
                    setLength,
                    schedule,
                    overnight,
                    openers,
                    companionTravelers,
                    hangout,
                    merchTable,
                    allergies,
                    allowKids,
                    soundSystem,
                    wideImg,
                    squareImg,
                    covidPrefs,
                    artistNotes,
                    financialHopes,
                    onboardDate,
                } = artistFields;

                artistFields.slug = convertToSlug(stageName);

                try {
                    // Using upsert option (creates new doc if no match is found):
                    let artist = await Artist.findOneAndUpdate(
                        { email: email.toLowerCase() },
                        { $set: artistFields },
                        { new: true, upsert: true }
                    );
                    artistCount++;
                } catch (err) {
                    console.error(err.message);
                    res.status(500).send('Server Error');
                }
            })
        );
        res.json(artistCount + ' artists submitted to the database.'); //eventually remove this
    }
});

// @route    GET api/artists
// @desc     Get all artists
// @access   Public
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.find({ active: true }).select(
            '-companionTravelers -artistNotes -schedule'
        );
        res.json(artists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/artists/edit
// @desc     Get all artists for editing (everything)
// @access   Private
router.get('/edit', [auth], async (req, res) => {
    try {
        const artists = await Artist.find();

        artists.forEach((artist) => {
            //if no time exists in artist.zoomDate {
            if (artist.zoomDate == null) {
                //async hit up Calendly for Scheduled events with artist.email as the invitee_email {
                //store collection[collection.length()-1].start_time in artist.zoomDate
            }
        });

        res.json(artists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/artists/slugs
// @desc     Get just artists slugs
// @access   Public
router.get('/slugs', [auth], async (req, res) => {
    try {
        const artists = await Artist.find({}).select('slug');
        res.json(artists);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/artists/:slug
// @desc     Get artist by user ID
// @access   Public
router.get('/:slug', async (req, res) => {
    try {
        const artist = await Artist.findOne({
            slug: req.params.slug,
        }); //ADD .select('-field'); to exclude [field] from the response

        if (!artist) return res.status(400).json({ msg: 'Artist not found' });

        res.json(artist);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Artist not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/artists
// @desc     Delete artist, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user.id });
        // Remove artist
        await Artist.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
