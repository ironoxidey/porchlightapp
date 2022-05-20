const express = require('express');
const router = express.Router();
const request = require('request');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = !process.env.NODE_ENV ? require('config') : process.env;
//: require('../../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const sendEmail = require('../../utils/email/sendEmail');

const User = require('../../models/User');
const Referral = require('../../models/Referral');
const Artist = require('../../models/Artist');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check(
            'password',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, referralKey } = req.body;
        //console.log('register req.body', req.body);

        try {
            var referredBy, role;

            if (referralKey) {
                const decoded = jwt.verify(
                    referralKey,
                    config['resetPasswordKey']
                );
                try {
                    let referral = await Referral.findOneAndUpdate(
                        {
                            key: referralKey,
                        },
                        { $push: { usedBy: email }, $inc: { numUsed: 1 } }
                    );

                    if (referral && referral.setToRole === decoded.setToRole) {
                        referredBy = referral.user;
                        role = referral.setToRole;
                    }
                } catch (err) {
                    console.log(err.message);
                }
            }
            //console.log('referredBy', referredBy, 'role', role);

            let user = await User.findOne({ email });

            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'User already exists' }] });
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            });

            user = new User({
                name,
                email,
                role,
                avatar,
                password,
                referredBy,
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            };
            jwt.sign(
                payload,
                config['jwtSecret'], //config.get('jwtSecret'),
                { expiresIn: 3600 }, //eventually change this to 3600 - 1 hour
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

// @route   GET api/users/edit
// @desc    [ADMIN] Get all users
// @access  Private
router.get('/edit', [auth], async (req, res) => {
    if (req.user.role.indexOf('ADMIN') != -1) {
        try {
            const users = await User.find()
                .select('-password -calendly -resetLink')
                .populate('artistProfile');
            res.json(users);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error.');
        }
    } else {
        res.status(500).send('Only ADMINs can view registered users.');
    }
});

// @route   PUT api/users/forgot-password
// @desc    Forgot Password
// @access  Public
router.put(
    '/forgot-password',
    [check('email', 'Please include a valid email').isEmail()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email } = req.body;

        try {
            let userDoc = await User.findOne({ email });

            if (!userDoc) {
                console.log('Could not find a user associated with ' + email);
                return res
                    .status(400)
                    .json('User with this email address does not exist.');
            } else {
                const userID = userDoc.id;
                const userName = userDoc.name;

                //console.log('userID: ' + userID + ' | userName: ' + userName);

                const payload = {
                    user: {
                        id: userID,
                        //didn't always include email and role... not sure if this might break something ~March 10, 2022
                        email: userDoc.email,
                        role: userDoc.role,
                    },
                };

                const resetToken = jwt.sign(
                    payload,
                    config['resetPasswordKey'], //config.get('resetPasswordKey'),
                    { expiresIn: '20m' } //20 minutes
                );

                //const link = `localhost:3000/reset-password?token=${resetToken}`;
                const link = `app.porchlight.art/reset-password?token=${resetToken}`;

                //console.log(link);

                //return User.updateOne({resetLink: resetToken}, (err, success) => {
                await User.findOneAndUpdate(
                    { email: email },
                    { $set: { resetLink: resetToken } },
                    (err) => {
                        if (err) {
                            return res.status(400).json({
                                errors: [{ msg: 'Reset Password Link Error.' }],
                            });
                        } else {
                            // console.log(
                            //     'The email will try to send now- userName: ' +
                            //         userName.trim().split(' ')[0]
                            // );
                            sendEmail(email, {
                                event: 'FORGOT_PASSWORD',
                                template: 'WH46YVMBJ0MHFTGTP7T4CN7J1JQE',
                                name: userName.trim().split(' ')[0],
                                link: link,
                            });
                            //console.log('The email should have been sent now');
                        }
                    }
                ).clone();
                return res.json('A verification email has been sent.');
            }

            // return user.updateOne({resetLink: resetToken}, (err, success) => {
            //   if (err) {
            //     return res
            //       .status(400)
            //       .json({ errors: [{ error: 'reset password link error' }] });
            //   }
            //   else {
            //     //res.status(500).send('An email should get sent now.');
            //     res.send('An email should get sent now.');
            //     sendEmail(email,"Password Reset Request",{name: user.name.trim().split(' ')[0], link: link,},"./template/requestResetPassword.handlebars");
            //   }
            // });
        } catch (err) {
            console.log(err.message);
            return res.status(500).send('Server error');
        }
    }
);

// @route   PUT api/users/reset-password
// @desc    Reset Password
// @access  Public
router.put(
    '/reset-password',
    [
        check('resetLink', 'resetLink needs to be supplied').not().isEmpty(),
        check(
            'newPass',
            'Please enter a password with 6 or more characters'
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { resetLink, newPass } = req.body;

        try {
            jwt.verify(
                resetLink,
                config['resetPasswordKey'], //config.get('resetPasswordKey'),
                async (err, decodedData) => {
                    if (err) {
                        return res.status(401).json({
                            error: 'Incorrect or expired token.',
                        });
                    } else {
                        try {
                            let user = await User.findOne({ resetLink });

                            if (!user) {
                                return res.status(400).json({
                                    errors: [{ error: 'User does not exist.' }],
                                });
                            } else {
                                const salt = await bcrypt.genSalt(10);
                                const hashedNewPass = await bcrypt.hash(
                                    newPass,
                                    salt
                                );

                                const passObj = {
                                    password: hashedNewPass,
                                    resetLink: '',
                                };

                                user = await User.findOneAndUpdate(
                                    { resetLink },
                                    { $set: passObj }
                                );
                                res.json(user.email);
                            }
                        } catch (err) {
                            console.log(err.message);
                            res.status(500).send(
                                'Something went wrong updating your password'
                            );
                        }
                    }
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route   POST api/users/create-referral
// @desc    Create Referral
// @access  Private
router.post('/create-referral', [auth], async (req, res) => {
    //const { setToRole } = req.body;
    const setToRole = 'ARTIST'; //eventually I might let this be passed in, but I want to be very careful that someone couldn't hack this, and make an ADMIN referral

    if (req.user.role && req.user.role.indexOf('ADMIN') === -1) {
        //if requesting user is not an ADMIN
        return res.status(400).json({
            errors: [
                {
                    msg: 'Only ADMINs have the authority to create referrals.',
                },
            ],
        });
    } else {
        try {
            //console.log('req.user: ', req.user);
            const payload = {
                id: req.user.id,
                //didn't always include email and role... not sure if this might break something ~March 10, 2022
                email: req.user.email,
                setToRole: setToRole,
            };

            const referralKey = jwt.sign(
                payload,
                config['resetPasswordKey'] //config.get('resetPasswordKey'),
            );

            //const link = `localhost:3000/reset-password?token=${resetToken}`;
            const link = `https://app.porchlight.art/register?referralKey=${referralKey}`;

            //console.log(link);

            let referral = new Referral({
                user: req.user.id,
                userEmail: req.user.email,
                setToRole: setToRole,
                key: referralKey,
            });

            await referral.save();
            return res.json({ link });
        } catch (err) {
            console.log(err.message);
            return res.status(500).send('Server error');
        }
    }
});

// @route   PUT api/users/update-avatar
// @desc    Update Avatar
// @access  Private
router.put(
    '/update-avatar',
    [auth, [check('avatar', 'Please include an avatar URL').not().isEmpty()]],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { avatar } = req.body;
        const userFields = {};
        if (avatar) userFields.avatar = avatar;
        try {
            let user = await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: userFields },
                { new: true, upsert: true }
            );
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route   PUT api/users/update-role
// @desc    Update Role
// @access  Private
router.put(
    '/update-role',
    [auth, [check('role', 'Please include a user role').not().isEmpty()]],
    async (req, res) => {
        if (req.user.role.indexOf('ADMIN') !== -1) {
            //if the requesting user is an ADMIN--only ADMINs can change a user's roles
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { role, userID } = req.body;
            const userFields = {};
            if (role) userFields.role = role;
            console.log('userID: ', userID, ' is now set to ', role);
            try {
                let user = await User.findOneAndUpdate(
                    { _id: userID },
                    { $set: userFields },
                    { new: true, upsert: true }
                ).select('-password -calendly -resetLink');
                res.json(user);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        } else {
            res.status(401).send('Requesting user is not an admin.');
        }
    }
);

// @route   POST api/users/calendlyAuth
// @desc    Authenticate Calendly
// @access  Private
router.post(
    '/calendlyAuth',
    [
        auth,
        [
            check(
                'calendlyAuthCode',
                'Please include a Calendly auth code from the response URL variable'
            )
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { calendlyAuthCode } = req.body;

        //hit up Calendly for Access Token and Refresh Token with Auth Code
        const options = {
            method: 'POST',
            url: 'https://auth.calendly.com/oauth/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            form: {
                grant_type: 'authorization_code',
                client_id: config['calendlyID'],
                client_secret: config['calendlySecret'],
                code: calendlyAuthCode,
                redirect_uri: 'http://localhost:3000',
            },
        };

        request(options, async (error, response, body) => {
            if (error) throw new Error(error);

            const userFields = {};
            userFields.calendly = {};

            //userFields.user = req.user.id; //I don't think I'm actually using this — 'user' is not in the Users Mongoose schema model

            const {
                access_token,
                refresh_token,
                owner,
                organization,
                created_at,
                expires_in,
            } = JSON.parse(body);

            if (calendlyAuthCode)
                userFields.calendly.authCode = calendlyAuthCode;
            if (access_token) userFields.calendly.accessToken = access_token;
            if (refresh_token) userFields.calendly.refreshToken = refresh_token;
            if (owner) userFields.calendly.owner = owner;
            if (organization) userFields.calendly.organization = organization;
            if (created_at) userFields.calendly.createdAt = created_at;
            if (expires_in) userFields.calendly.expiresIn = expires_in;

            try {
                let user = await User.findOneAndUpdate(
                    { _id: req.user.id },
                    { $set: userFields },
                    { new: true, upsert: true }
                );
                res.json(user);
            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error');
            }
        });
    }
);

// @route   POST api/users/calendlyRefresh
// @desc    Calendly Authentication
// @access  Private
router.post('/calendlyRefresh', [auth], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //get refresh token from database
    const dbCalendlyAuth = await User.findOne({
        user: req.user.id,
    }).select('calendly');

    //console.log("Refresh Token: "+dbCalendlyAuth.calendly.refreshToken);

    const { refreshToken } = dbCalendlyAuth.calendly;

    //hit up Calendly for new Access Tokens with old Refresh Token
    const options = {
        method: 'POST',
        url: 'https://auth.calendly.com/oauth/token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        form: {
            client_id: config['calendlyID'],
            client_secret: config['calendlySecret'],
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        },
    };

    request(options, async (error, response, body) => {
        if (error) throw new Error(error);

        const userFields = {};
        userFields.calendly = {};

        const {
            access_token,
            refresh_token,
            created_at,
            expires_in,
            owner,
            organization,
        } = JSON.parse(body);

        if (access_token) userFields.calendly.accessToken = access_token;
        if (refresh_token) userFields.calendly.refreshToken = refresh_token;
        if (created_at) userFields.calendly.createdAt = created_at;
        if (expires_in) userFields.calendly.expiresIn = expires_in;
        if (owner) userFields.calendly.owner = owner;
        if (organization) userFields.calendly.organization = organization;

        //console.log(userFields);

        try {
            let user = await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: userFields },
                { new: true, upsert: true }
            );
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });
});

router.get('/calendly', auth, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.user.id,
        }).populate('calendly', ['accessToken']);

        if (!user) {
            return res.status(400).json({ msg: 'There is no user' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
