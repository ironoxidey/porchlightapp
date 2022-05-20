const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = !process.env.NODE_ENV ? require('config') : process.env;
//: require('../../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Artist = require('../../models/Artist');

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error.');
    }
});

// @route   POST api/auth
// @desc    Authenticate User & get token
// @access  Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            let artist = user.artistProfile;
            let userUpdates = { lastLogin: new Date() };
            if (!artist) {
                //if we don't see an artist profile in the returned user, let's check for one in the artist profiles and add it
                artist = await Artist.findOne({ email }).select('_id');
                if (artist) {
                    userUpdates.artistProfile = artist;
                }
            }
            //console.log('artist', artist);

            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin || new Date(),
                    artistProfile: artist,
                },
            };

            let lastLogin = await User.updateOne(
                { _id: user.id },
                {
                    $set: userUpdates,
                }
            );

            jwt.sign(
                payload,
                config['jwtSecret'], //config.get('jwtSecret'),
                { expiresIn: 3600 }, //eventually change this to 3600
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

module.exports = router;
