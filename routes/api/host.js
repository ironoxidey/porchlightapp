const express = require('express');
const request = require('request');
const config = !process.env
    ? require('config')
    : require('../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Host = require('../../models/Host');

// @route    POST api/host
// @desc     Create or update user host
// @access   Private
router.post(
    '/',
    [
        auth,
        [
            check('email', 'Please include a valid email').isEmail(),
            check('firstName', 'firstName is required').not().isEmpty(),
            check('lastName', 'lastName is required').not().isEmpty(),
            check('phone', 'phone is required').not().isEmpty(),
            check('street', 'street is required').not().isEmpty(),
            check('city', 'city is required').not().isEmpty(),
            check('state', 'state is required').not().isEmpty(),
            check('zipCode', 'zipCode is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            email,
            firstName,
            lastName,
            phone,
            street,
            city,
            state,
            zipCode,
            latitude,
            longitude,
        } = req.body;

        // Build host object
        const hostFields = {};
        hostFields.email = req.email;
        if (firstName) hostFields.firstName = firstName;
        if (lastName) hostFields.lastName = lastName;
        if (phone) hostFields.phone = phone;
        if (street) hostFields.street = street;
        if (city) hostFields.city = city;
        if (state) hostFields.state = state;
        if (zipCode) hostFields.zipCode = zipCode;
        if (latitude) hostFields.latitude = latitude;
        if (longitude) hostFields.longitude = longitude;

        try {
            // Using upsert option (creates new doc if no match is found):
            let host = await Host.findOneAndUpdate(
                { email: req.email },
                { $set: hostFields },
                { new: true, upsert: true }
            );
            res.json(host);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/host
// @desc     Get all hosts
// @access   Public
router.get('/', async (req, res) => {
    try {
        const hosts = await Host.find();
        res.json(hosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/host/:email
// @desc     Get host by user ID
// @access   Public
router.get('/:email', async (req, res) => {
    try {
        const host = await Host.findOne({
            user: req.params.email,
        });

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

// @route    DELETE api/host
// @desc     Delete host, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({ user: req.user.id });
        // Remove host
        await Host.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/host/experience
// @desc     Add host experience
// @access   Private
router.put(
    '/experience',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('company', 'Company is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, company, location, from, to, current, description } =
            req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };

        try {
            const host = await Host.findOne({ user: req.user.id });

            host.experience.unshift(newExp);

            await host.save();

            res.json(host);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/host/experience/:exp_id
// @desc     Delete experience from host
// @access   Private
// router.delete('/experience/:exp_id', auth, async (req, res) => {
//   try {
//     const host = await Host.findOne({ user: req.user.id });

//     // Get remove index
//     const removeIndex = host.experience
//       .map(item => item.id)
//       .indexOf(req.params.exp_id);

//     host.experience.splice(removeIndex, 1);

//     await host.save();

//     res.json(host);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        //const foundhost = await Host.findOneAndUpdate( { user: req.user.id },
        //  { $pull: { experience: { _id: req.params.exp_id }}},
        //  {new: true});
        const foundhost = await Host.findOne({ user: req.user.id });

        // Filter exprience array using _id (NOTE: _id is a BSON type needs to be converted to string)
        // This can also be omitted and the next line and findOneAndUpdate to be used instead (above implementation)
        foundhost.experience = foundhost.experience.filter(
            (exp) => exp._id.toString() !== req.params.exp_id
        );

        await foundhost.save();
        return res.status(200).json(foundhost);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Server error' });
    }
});

// @route    PUT api/host/education
// @desc     Add host education
// @access   Private
router.put(
    '/education',
    [
        auth,
        [
            check('school', 'School is required').not().isEmpty(),
            check('degree', 'Degree is required').not().isEmpty(),
            check('fieldofstudy', 'Field of study is required').not().isEmpty(),
            check('from', 'From date is required').not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { school, degree, fieldofstudy, from, to, current, description } =
            req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };

        try {
            const host = await Host.findOne({ user: req.user.id });

            host.education.unshift(newEdu);

            await host.save();

            res.json(host);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/host/education/:edu_id
// @desc     Delete education from host
// @access   Private
//router.delete('/education/:edu_id', auth, async (req, res) => {
//try {
//const host = await Host.findOne({ user: req.user.id });

// Get remove index
//const removeIndex = host.education
//.map(item => item.id)
//.indexOf(req.params.edu_id);
/*
    host.education.splice(removeIndex, 1);
    await host.save();
    res.json(host);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
*/

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const foundhost = await Host.findOne({ user: req.user.id });
        const eduIds = foundhost.education.map((edu) => edu._id.toString());
        // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
        const removeIndex = eduIds.indexOf(req.params.edu_id);
        if (removeIndex === -1) {
            return res.status(500).json({ msg: 'Server error' });
        } else {
            // theses console logs helped me figure it out
            /*   console.log("eduIds", eduIds);
      console.log("typeof eduIds", typeof eduIds);
      console.log("req.params", req.params);
      console.log("removed", eduIds.indexOf(req.params.edu_id));
 */ foundhost.education.splice(removeIndex, 1);
            await foundhost.save();
            return res.status(200).json(foundhost);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});
// @route    GET api/host/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: encodeURI(
                `https://api.github.com/users/${
                    req.params.username
                }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                    'githubClientId'
                )}&client_secret=${config.get('githubSecret')}`
            ),
            method: 'GET',
            headers: { 'user-agent': 'node.js' },
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github host found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
