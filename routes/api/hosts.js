const express = require('express');
//const request = require('request'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
//const config = require('../../../porchlight-config/default.json');//require('config'); //I don't theink I need this. Maybe carried over from profile.js for github stuff ~ Jan 5th, 2022
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, body } = require('express-validator');

const User = require('../../models/User');
const Host = require('../../models/Host');

function convertToSlug(Text) {
    return Text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
}

// @route    GET api/hosts/me
// @desc     Get current user's host profile
// @access   Private
router.get('/me', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        console.log(req.user);
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

// @route    GET api/hosts/me
// @desc     Get current users host
// @access   Private
router.get('/my-avatar', auth, async (req, res) => {
    try {
        // const thisUser = await User.findOne({
        //   id: req.user.id,
        // });
        console.log(req.user);
        const host = await Host.findOne({
            email: req.user.email,
        }).select('squareImg');
        if (!host) {
            return res
                .status(400)
                .json({ msg: 'There is no host for this user' });
        }

        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/hosts
// @desc     Create or update host
// @access   Private
router.post(
    '/',
    [auth, [check('email', 'Please include a valid email').isEmail()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
        } = req.body;

        // Build host object
        const hostFields = {};
        hostFields.email = email;
        if (firstName) hostFields.firstName = firstName;
        if (lastName) hostFields.lastName = lastName;
        if (stageName) hostFields.stageName = stageName;
        if (medium) hostFields.medium = medium;
        if (genre) hostFields.genre = genre;
        if (repLink) hostFields.repLink = repLink;
        if (helpKind) hostFields.helpKind = helpKind;
        if (typeformDate) hostFields.typeformDate = typeformDate;
        if (hadMeeting) hostFields.hadMeeting = hadMeeting;
        if (sentFollowUp) hostFields.sentFollowUp = sentFollowUp;
        if (active) hostFields.active = active;
        if (notes) hostFields.notes = notes;

        try {
            // Using upsert option (creates new doc if no match is found):
            let host = await Host.findOneAndUpdate(
                { email: email.toLowerCase() },
                { $set: hostFields },
                { new: true, upsert: true }
            );
            res.json(host); //eventually remove this
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    POST api/hosts/batch
// @desc     Batch create or update hosts
// @access   Private
router.post('/batch', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.user);
    if (req.body instanceof Array) {
        let hostCount = 0;
        await Promise.all(
            req.body.map(async (hostFields) => {
                // const {
                //     email,
                //     firstName,
                //     lastName,
                //     stageName,
                //     medium,
                //     genre,
                //     repLink,
                //     helpKind,
                //     typeformDate,
                //     hadMeeting,
                //     sentFollowUp,
                //     active,
                //     notes,

                //     phone,
                //     hometown,
                //     costStructure,
                //     namedPrice,
                //     bookingWhenWhere,
                //     setLength,
                //     schedule,
                //     overnight,
                //     openers,
                //     companionTravelers,
                //     hangout,
                //     merchTable,
                //     allergies,
                //     familyFriendly,
                //     soundSystem,
                //     wideImg,
                //     squareImg,
                //     covidPrefs,
                //     hostNotes,
                //     financialHopes,
                //     onboardDate,
                // } = hostFields;

                hostFields.stageName && hostFields.stageName.length > 0
                    ? (hostFields.slug = convertToSlug(hostFields.stageName))
                    : '';

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
                        hostCount++;
                        res.json(hostFields);
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error: ' + err.message);
                    }
                } else if (req.user.email === hostFields.email.toLowerCase()) {
                    //if the request user email matches the host email they have authority to edit their own profile, removing admin things
                    try {
                        delete hostFields.active;
                        console.log(hostFields);
                        // Using upsert option (creates new doc if no match is found):
                        let host = await Host.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            { $set: hostFields },
                            { new: true, upsert: true }
                        );
                        hostCount++;
                        res.json(hostFields);
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error');
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
        //res.json(hostCount + " host(s) submitted to the database."); //eventually remove this
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
    if (req.body instanceof Array) {
        await Promise.all(
            req.body.map(async (hostFields) => {
                hostFields.stageName && hostFields.stageName.length > 0
                    ? (hostFields.slug = convertToSlug(hostFields.stageName))
                    : '';

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
                        const hosts = await Host.find();
                        res.json(hosts);
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error: ' + err.message);
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
                hostFields.stageName && hostFields.stageName.length > 0
                    ? (hostFields.slug = convertToSlug(hostFields.stageName))
                    : (hostFields.slug = convertToSlug(req.user.id));

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
                        ).select('-hadMeeting -sentFollowUp -notes');
                        hostCount++;
                        res.json(host);
                    } catch (err) {
                        console.error(err.message);
                        res.status(500).send('Server Error: ' + err.message);
                    }
                } else if (
                    req.user.email.toLowerCase() ===
                    hostFields.email.toLowerCase()
                ) {
                    //if the request user email matches the host email they have authority to edit their own profile, removing admin things
                    try {
                        delete hostFields.active; //to prevent someone from being able to change their active status
                        hostFields.user = req.user.id;
                        console.log(hostFields);
                        // Using upsert option (creates new doc if no match is found):
                        let host = await Host.findOneAndUpdate(
                            { email: hostFields.email.toLowerCase() },
                            { $set: hostFields },
                            { new: true, upsert: true }
                        ).select('-hadMeeting -sentFollowUp -notes');
                        hostCount++;
                        res.json(host);
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
// @desc     Get all active hosts
// @access   Public
router.get('/', async (req, res) => {
    try {
        const hosts = await Host.find({ active: true }).select(
            '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -hostNotes'
        );
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

// @route    GET api/hosts/slugs
// @desc     Get just hosts slugs
// @access   Public
router.get('/slugs', [auth], async (req, res) => {
    try {
        const hosts = await Host.find({}).select('slug');
        res.json(hosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/hosts/:slug
// @desc     Get host by user ID
// @access   Public
router.get('/:slug', async (req, res) => {
    try {
        const host = await Host.findOne({
            slug: req.params.slug,
        }).select(
            '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -hostNotes'
        ); //ADD .select('-field'); to exclude [field] from the response

        if (!host) return res.status(400).json({ msg: 'Host not found' });

        res.json(host);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Host not found' });
        }
        res.status(500).send('Server Error');
    }
});
// @route    POST api/hosts/by-email
// @desc     POST host slug by email
// @access   Private
router.post('/by-email', [auth], async (req, res) => {
    try {
        const hostSlug = await Host.findOne({
            email: req.body.email,
        }).select('slug stageName'); //ADD .select('-field'); to exclude [field] from the response

        // this just loads up the console with 404 not founds
        // if (!hostSlug)
        //     return res.status(404).json({
        //         msg: 'No host found with email:' + req.body.email,
        //     });

        res.json(hostSlug);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'Host not found' });
        }
        res.status(500).send('Server Error');
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
