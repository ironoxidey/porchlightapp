const express = require('express');
var session = require('express-session');
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

router.use(
    session({
        secret: 'I hope this doesnt need to be too super secure... Im only planning to store driveFolderIDs in here',
        resave: false,
        saveUninitialized: true,
        // unset: 'destroy',
    })
);

const createFolderMiddleWare = async (req, res, next) => {
    const hostMe = await Host.findOne({
        email: req.user.email,
    }); //ADD .select('-field'); to exclude [field] from the response
    if (!hostMe) {
        return res.status(400).json({ msg: 'There is no host for this email' });
    }
    console.log('hostMe.firstName: ' + hostMe.firstName);
    const theEvent = await Event.findOne({
        _id: req.body.thisEvent,
        confirmedHost: hostMe._id, // I don't think we need this again, if it already passed before
    })
        .populate('artist')
        .populate('confirmedArtist');

    // if (!req.session.driveFolderID) {
    if (!theEvent.driveFolderID) {
        await createFolder(req, theEvent, hostMe);
    }
    next();
};

const createFolder = async (req, theEvent, hostMe) => {
    // console.log('createFolder req', req);
    // const hostMe = await Host.findOne({
    //     email: req.user.email,
    // }); //ADD .select('-field'); to exclude [field] from the response
    // if (!hostMe) {
    //     return res.status(400).json({ msg: 'There is no host for this email' });
    // }
    // console.log('hostMe.firstName: ' + hostMe.firstName);
    // const theEvent = await Event.findOne({
    //     _id: req.body.thisEvent,
    //     confirmedHost: hostMe._id, // I don't think we need this again, if it already passed before
    // })
    //     .populate('artist')
    //     .populate('confirmedArtist');
    // console.log(
    //     'theEvent.bookingWhen:',
    //     theEvent.bookingWhen,
    //     theEvent.artist?.stageName || theEvent.confirmedArtist?.stageName,
    //     theEvent.bookingWhere.city + ', ' + theEvent.bookingWhere.state
    // );

    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    const uploadFolderName =
        theEvent?.bookingWhen.toISOString().substring(0, 10) +
        ' — ' +
        // 'Concert' +
        (theEvent?.artist?.stageName || theEvent?.confirmedArtist?.stageName) +
        ' in ' +
        theEvent?.bookingWhere?.city +
        ', ' +
        theEvent?.bookingWhere?.state;

    //https://developers.google.com/drive/api/guides/search-files
    const googleDriveFolderSearch = await drive.files.list({
        q: `'1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${uploadFolderName}' and trashed = false`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });
    console.log(
        'googleDriveFolderSearch.data.files',
        googleDriveFolderSearch.data.files
    );
    try {
        if (googleDriveFolderSearch.data.files.length > 0) {
            //there's a folder in the Google Drive
            theEvent.driveFolderID =
                googleDriveFolderSearch.data.files[
                    googleDriveFolderSearch.data.files.length - 1
                ].id;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            req.session.driveFolderID =
                googleDriveFolderSearch.data.files[
                    googleDriveFolderSearch.data.files.length - 1
                ].id;
            req.session.save(function (err) {
                // session saved
            });
        } else {
            //there's no folder in the Google Drive
            // delete req.session.driveFolderID;
            if (theEvent.driveFolderID) {
                delete theEvent.driveFolderID;
            }

            const uploadFolder = await drive.files.create({
                resource: {
                    name: uploadFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: ['1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o'], //Porchlight App Uploads
                },
                fields: 'id',
            });
            req.session.driveFolderID = uploadFolder.data.id;
            req.session.save(function (err) {
                // session saved
            });
            // driveFolderID = uploadFolder.data.id;
            theEvent.driveFolderID = uploadFolder.data.id;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            // console.log(
            //     'uploadFolder.config.data.name',
            //     uploadFolder.config.data.name,
            //     'uploadFolder.data.id',
            //     uploadFolder.data.id
            // );
        }
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }
};

async function uploadFile(authClient, req, theEvent, drive, filesIndex) {
    // console.log('uploadFile authClient', authClient);
    const file = req.files[filesIndex];
    // console.log('uploadFile file', file);
    const fileToUpload = file.buffer;
    // console.log('fileToUpload', fileToUpload);
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    // const drive = google.drive({ version: 'v3', auth: authClient });

    // console.log(
    //     'uploadFile req.session.driveFolderID',
    //     req.session.driveFolderID
    // );
    return new Promise((resolve, rejected) => {
        drive.files.create(
            {
                resource: {
                    name: file.originalname,
                    parents: [theEvent.driveFolderID], //should be inside Porchlight App Uploads on Google Drive
                    // parents: [req.session.driveFolderID], //should be inside Porchlight App Uploads on Google Drive
                },
                media: {
                    body: bufferStream,
                    mimeType: file.mimeType,
                },
                fields: 'id,name',
            },
            function (err, file) {
                if (err) {
                    console.log('error', err);
                    rejected(err);
                } else {
                    console.log(
                        'file.data.name:',
                        file.data.name,
                        ' file.data.id:',
                        file.data.id
                    );
                    resolve(file);
                }
            }
        );
    });
}

// //Image Upload stuff - https://www.geeksforgeeks.org/node-js-image-upload-processing-and-resizing-using-sharp-package/
// //AND https://www.bezkoder.com/node-js-express-file-upload/#Define_Route_for_uploading_file

// @route    POST api/uploads/upload
// @desc     Upload File
// @access   Private
router.post(
    '/upload',
    auth,
    upload.array('imageUpload'),
    createFolderMiddleWare,
    async (req, res) => {
        console.log('initial req.files: ', req.files);

        if (req.files && req.files.length > 0) {
            const promises = req.files.map(async (theFile, filesIndex) => {
                try {
                    if (theFile == undefined) {
                        return res
                            .status(400)
                            .json({ msg: 'Please upload a file!' });
                    }
                    console.log('upload initiating...');
                    // console.log(
                    //     `req.session.driveFolderID`,
                    //     req.session.driveFolderID
                    // );

                    const hostMe = await Host.findOne({
                        email: req.user.email,
                    }); //ADD .select('-field'); to exclude [field] from the response
                    if (!hostMe) {
                        return res
                            .status(400)
                            .json({ msg: 'There is no host for this email' });
                    }
                    console.log('hostMe.firstName: ' + hostMe.firstName);

                    const theEvent = await Event.findOne({
                        _id: req.body.thisEvent,
                        confirmedHost: hostMe._id,
                    })
                        .populate('artist')
                        .populate('confirmedArtist');

                    console.log('theEvent.bookingWhen: ', theEvent.bookingWhen);
                    // console.log(
                    //     `req.session.driveFolderID`,
                    //     req.session.driveFolderID
                    // );

                    const uploadFolderName =
                        theEvent?.bookingWhen.toISOString().substring(0, 10) +
                        ' — ' +
                        // 'Concert' +
                        (theEvent?.artist?.stageName ||
                            theEvent?.confirmedArtist?.stageName) +
                        ' in ' +
                        theEvent?.bookingWhere?.city +
                        ', ' +
                        theEvent?.bookingWhere?.state;

                    // const theArtist = await Artist.findOne({
                    //     _id: req.body.artist,
                    // });
                    // req.body.artist = theArtist; //replace the artistID with the whole artist document

                    if (theEvent.bookingWhen) {
                        const googleDriveUpload = authorize()
                            .then(async (authClient) => {
                                const drive = google.drive({
                                    version: 'v3',
                                    auth: authClient,
                                });
                                if (
                                    theFile &&
                                    theFile.buffer &&
                                    theEvent.driveFolderID
                                    // &&
                                    // req.session.driveFolderID
                                ) {
                                    // console.log('req.file', req.file);
                                    const uploadRes = await uploadFile(
                                        authClient,
                                        req,
                                        theEvent,
                                        drive,
                                        filesIndex
                                    ).then((result) => {
                                        // console.log(
                                        //     'uploadFile result.data',
                                        //     result.data
                                        // );
                                        return result.data;
                                    });
                                    console.log(
                                        'uploadFile uploadRes.name and id',
                                        uploadRes.name,
                                        uploadRes.id
                                    );

                                    if (uploadRes.id !== undefined) {
                                        uploadRes.url = `https://drive.usercontent.google.com/download?id=${uploadRes.id}`;
                                        uploadRes.driveID = uploadRes.id;
                                        theEvent.uploadedImages.push(uploadRes);
                                        theEvent.markModified('uploadedImages');
                                        await theEvent.save();
                                    }
                                    return uploadRes;
                                }
                            })
                            .catch('error');
                        return googleDriveUpload;
                    }
                } catch (err) {
                    //console.log('Upload error: ' + err);
                    if (err.code == 'LIMIT_FILE_SIZE') {
                        return res.status(500).json({
                            msg: 'File size should not be larger than 50MB.',
                        });
                    }
                    console.log(`Could not upload the file. ${err}`);
                    res.status(500).json({
                        msg: `Could not upload the file. ${err}`,
                    });
                }
            });

            Promise.all(promises)
                .then((results) => {
                    console.log(`Uploaded ${results.length} files):`, results);

                    res.status(200).json({
                        url: results[0].url, //it wants a url here...
                        msg: `Uploaded ${results.length} files successfully!`, //+ req.file.originalname,
                        files: results,
                    });
                })
                .catch((err) => {
                    console.log(`Could not upload the files. ${err}`);
                    res.status(500).json({
                        msg: `Could not upload the files. ${err}`,
                    });
                });
            // uploadedImages = results.filter((result) => result !== undefined);
        } else {
            res.status(500).json({
                msg: `No files found in req. ${err}`,
            });
        }
    }
);

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
