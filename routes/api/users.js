const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

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
        config.get('jwtSecret'),
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
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      console.log("You should be seeing this right before the findOne()");
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
        return res
          .status(400)
          .json({ errors: [{ error: 'User with this email address does not exist.' }] });
      }

      const payload = {
        user: {
          id: userDoc.id
        },
      };
      const resetToken = jwt.sign(
        payload,
        config.get('resetPasswordKey'),
        { expiresIn: '20m' }, //20 minutes
      );

      //const link = `localhost:3000/reset-password?token=${resetToken}`;
      const link = `http://reviewthearts.com/reset-password?token=${resetToken}`;
      
      //return User.updateOne({resetLink: resetToken}, (err, success) => {
      userDoc = await User.findOneAndUpdate({ email: email },{ $set: { resetLink: resetToken }}, (err) => {
          if (err) {
            return res
              .status(400)
              .json({ errors: [{ error: 'reset password link error' }] });
          }
          else {
            //res.status(500).send('An email should get sent now.');
            sendEmail(email,"Password Reset Request",{name: userDoc.name.trim().split(' ')[0], link: link,},"./template/requestResetPassword.handlebars");
            res.send('An email should get sent now.');
          }
      }).clone();

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
        config.get('resetPasswordKey'),
        async (err, decodedData) => {
            if(err){
              return res.status(401).json({
                error: "Incorrect or expired token."
              })
            }
            else {
              try {
                let user = await User.findOne({ resetLink });

                if (!user) {
                  return res
                    .status(400)
                    .json({ errors: [{ error: 'User does not exist.' }] });
                }
                else {

                  const salt = await bcrypt.genSalt(10);
                  const hashedNewPass = await bcrypt.hash(newPass, salt);
                  
                  const passObj = {
                    password: hashedNewPass,
                    resetLink: ''
                  }

                  user = await User.findOneAndUpdate({ resetLink }, { $set: passObj } );
                  res.json(user.email);
                }
              }
              catch (err) {
                console.log(err.message);
                res.status(500).send('Something went wrong updating your password');
    
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

module.exports = router;
