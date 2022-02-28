const express = require('express');
const router = express.Router();
const request = require('request');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = !process.env
    ? require('config')
    : require('../../porchlight-config'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const sendEmail = require('../../utils/email/sendEmail');

const User = require('../../models/User');

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

        const { name, email, role, password } = req.body;

        try {
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
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };
            jwt.sign(
                payload,
                config['jwtSecret'], //config.get('jwtSecret'),
                { expiresIn: 360000 }, //eventually change this to 3600
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
            //console.log(req.body);
            //console.log("You should be seeing this right before the findOne()");
            // await User.findOne({ email }).then(userDoc => {
            //     const payload = {
            //       user: {
            //         id: userDoc.id
            //       },
            //     };
            //     const resetToken = jwt.sign(
            //       payload,
            //       config.get('resetPasswordKey'),
            //       { expiresIn: '20m' }, //20 minutes
            //     );
            //     const link = `http://reviewthearts.com/reset-password?token=${resetToken}`;

            //     userDoc.resetLink = resetToken;

            //     userDoc.markModified('resetLink');

            //     userDoc.save(err => console.log(err));

            //     res.send('An email should get sent now.');
            //     sendEmail(email,"Password Reset Request",{name: userDoc.name.trim().split(' ')[0], link: link,},"./template/requestResetPassword.handlebars");

            // }).clone();

            let userDoc = await User.findOne({ email });

            if (!userDoc) {
                //console.log("Could not find a user associated with "+email);
                return res.status(400).json({
                    errors: [
                        { msg: 'User with this email address does not exist.' },
                    ],
                });
            } else {
                const userID = userDoc.id;
                const userName = userDoc.name;

                //console.log("userID: "+userID+" | userName: " + userName);

                const payload = {
                    user: {
                        id: userID,
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
                                errors: [{ msg: 'reset password link error' }],
                            });
                        } else {
                            //console.log('The email will try to send now- userName: '+userName.trim().split(' ')[0]);
                            sendEmail(email, {
                                name: userName.trim().split(' ')[0],
                                link: link,
                            });
                            //console.log('The email should have been sent now');
                        }
                    }
                ).clone();
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
            res.status(500).send('Server error');
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
