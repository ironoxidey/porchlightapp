const express = require('express');
const config = !process.env.NODE_ENV ? require('config') : process.env;

const auth = require('../../middleware/auth');

const fs = require('fs');
const { google } = require('googleapis');

const apikeys = config['googleDriveApiKey'];

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const stream = require('stream');

const router = express.Router();
const Event = require('../../models/Event');
const Artist = require('../../models/Artist');
const Host = require('../../models/Host');

async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        ['https://www.googleapis.com/auth/drive']
    );

    await jwtClient.authorize();
    console.log('authorization complete');

    return jwtClient;
}

async function uploadFile(authClient, req, theEvent) {
    // console.log('uploadFile authClient', authClient);
    const file = req.file;
    // console.log('uploadFile file', file);
    const fileToUpload = file.buffer;
    // console.log('fileToUpload', fileToUpload);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const drive = google.drive({ version: 'v3', auth: authClient });

    if (!theEvent.driveFolderID && theEvent.bookingWhen) {
        try {
            const uploadFolder = await drive.files.create({
                resource: {
                    name:
                        theEvent?.bookingWhen?.toString().slice(0, 10) +
                        ' — ' +
                        // 'Concert' +
                        (theEvent?.artist?.stageName ||
                            theEvent?.confirmedArtist?.stageName) +
                        ' in ' +
                        theEvent?.bookingWhere?.city +
                        ', ' +
                        theEvent?.bookingWhere?.state,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: ['1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o'], //Porchlight App Uploads
                },
                fields: 'id',
            });
            theEvent.driveFolderID = uploadFolder.data.id;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            console.log('uploadFolder', uploadFolder);
            if (uploadFolder && uploadFolder.data && uploadFolder.data.id) {
                return new Promise((resolve, rejected) => {
                    drive.files.create(
                        {
                            resource: {
                                name: file.originalname,
                                parents: [uploadFolder.data.id],
                            },
                            media: {
                                body: bufferStream,
                                mimeType: file.mimeType,
                            },
                            fields: 'id',
                        },
                        function (err, file) {
                            if (err) {
                                console.log('error', err);
                                rejected(err);
                            } else {
                                console.log('file', file);
                                resolve(file);
                            }
                        }
                    );
                });
            }
        } catch (err) {
            // TODO(developer) - Handle error
            console.log('error', err);
            throw err;
        }
    } else {
        return new Promise((resolve, rejected) => {
            drive.files.create(
                {
                    resource: {
                        name: file.originalname,
                        parents: [theEvent.driveFolderID], //inside Porchlight App Uploads
                    },
                    media: {
                        body: bufferStream,
                        mimeType: file.mimeType,
                    },
                    fields: 'id',
                },
                function (err, file) {
                    if (err) {
                        console.log('error', err);
                        rejected(err);
                    } else {
                        console.log('file', file);
                        resolve(file);
                    }
                }
            );
        });
    }
}

// const Artist = require('../../models/Artist');

// const fs = require('fs');
// const uploadFile = require('../../middleware/upload');

// //Image Upload stuff - https://www.geeksforgeeks.org/node-js-image-upload-processing-and-resizing-using-sharp-package/
// //AND https://www.bezkoder.com/node-js-express-file-upload/#Define_Route_for_uploading_file

// @route    POST api/uploads/upload
// @desc     Upload File
// @access   Private
router.post('/upload', auth, upload.single('imageUpload'), async (req, res) => {
    console.log('initial req: ', req);
    try {
        if (req.file == undefined) {
            return res.status(400).json({ msg: 'Please upload a file!' });
        }
        // console.log('req: ', req);

        const hostMe = await Host.findOne({
            email: req.user.email,
        }); //ADD .select('-field'); to exclude [field] from the response
        if (!hostMe) {
            return res
                .status(400)
                .json({ msg: 'There is no host for this email' });
        }
        console.log('hostMe: ' + hostMe);

        const theEvent = await Event.findOne({
            _id: req.body.thisEvent,
            confirmedHost: hostMe._id,
        })
            .populate('artist')
            .populate('confirmedArtist');

        console.log('theEvent: ', theEvent);

        // const theArtist = await Artist.findOne({
        //     _id: req.body.artist,
        // });
        // req.body.artist = theArtist; //replace the artistID with the whole artist document

        if (req.file && req.file.buffer && theEvent) {
            // console.log('req.file', req.file);
            authorize()
                .then((result) => uploadFile(result, req, theEvent))
                .catch('error');
        }

        res.status(200).json({
            msg: 'Uploaded the file successfully ', //+ req.file.originalname,
        });
    } catch (err) {
        //console.log('Upload error: ' + err);
        if (err.code == 'LIMIT_FILE_SIZE') {
            return res.status(500).json({
                msg: 'File size should not be larger than 3MB.',
            });
        }

        res.status(500).json({
            msg: `Could not upload the file. ${err}`,
        });
    }
});

// // @route    GET api/uploads/files
// // @desc     Get List of Files in User's directory
// // @access   Private
// router.get('/files', auth, async (req, res) => {
// 	const artistSlug = await Artist.findOne({
// 		email: req.user.email,
// 	}).select('slug'); //ADD .select('-field'); to exclude [field] from the response
// 	if (!artistSlug) {
// 		return res.status(400).json({ msg: 'There is no slug for this user' });
// 	}

// 	const directoryPath = `../porchlight-uploads/${artistSlug.slug}/`;

// 	//console.log(directoryPath);

// 	fs.readdir(directoryPath, function (err, files) {
// 		if (err) {
// 			res.status(500).json({
// 				msg: 'Unable to scan files!',
// 			});
// 		}

// 		let fileInfos = [];

// 		files.forEach((file) => {
// 			fileInfos.push({
// 				name: file,
// 				url: directoryPath + file,
// 			});
// 		});

// 		res.status(200).send(fileInfos);
// 	});
// });

// // @route    GET api/uploads/:slug/:name
// // @desc     Get specific file
// // @access   Public
// router.get('/:slug/:file', (req, res) => {
// 	const fileName = req.params.file;
// 	const directoryPath = `../porchlight-uploads/${req.params.slug}/`;

// 	res.download(directoryPath + fileName, fileName, (err) => {
// 		if (err) {
// 			res.status(500).json({
// 				msg: 'Could not download the file. ' + err,
// 			});
// 		}
// 	});
// });

module.exports = router;
