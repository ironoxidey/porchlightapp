const express = require('express');
const router = express.Router();
//const controller = require("../../controller/file.controller");

const config = !process.env
    ? require('config')
    : require('../../../porchlight-config/default.json'); //if there's no process.env then it's 'development', otherwise it will be 'production' and it will need to look outside of the app directory because the Github action runner overwrites it every time we push to main

const auth = require('../../middleware/auth');
const Artist = require('../../models/Artist');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
    secure: true,
});
const apiSecret = config.cloudinary_api_secret;
const apiKey = config.cloudinary_api_key;

// Server-side function used to sign an Upload Widget upload.
router.post('/upload-signature', auth, async (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        const signature = await cloudinary.utils.api_sign_request(
            {
                public_id: req.body.public_id,
                source: 'uw',
                tags: req.body.tags,
                timestamp: timestamp,
                upload_preset: req.body.uploadPreset,
            },
            apiSecret
        );

        res.json({ timestamp, signature });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
