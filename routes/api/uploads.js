const express = require('express');
// const cors = require('cors');
// var session = require('express-session');
const config = !process.env.NODE_ENV ? require('config') : process.env;

const auth = require('../../middleware/auth');

const fs = require('fs');
const { google } = require('googleapis');

const apikeys = config['googleDriveApiKey'];

// const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
const stream = require('stream');

const router = express.Router();
const Event = require('../../models/Event');
// const Artist = require('../../models/Artist');
const Host = require('../../models/Host');

const { Server, EVENTS } = require('@tus/server');
const { FileStore } = require('@tus/file-store');

const { Metadata, ERRORS } = require('@tus/utils');

const tusServer = new Server({
    path: '/api/uploads/file',
    datastore: new FileStore({ directory: './uploads' }),

    // https://www.npmjs.com/package/@tus/server#example-validate-metadata-when-an-upload-is-created
    async onUploadCreate(req, res, upload) {
        console.log('tusServer setup onUploadCreate req.body', req.body);
        console.log('tusServer setup onUploadCreate upload', upload);
        return { res, metadata: { ...upload.metadata } };
        // You can optionally return metadata to override the upload metadata,
        // such as `{ storagePath: "/upload/123abc..." }`
        // const extraMeta = {}

        // return { res, metadata: { ...upload.metadata, ...extraMeta } };
    },
    // async onUploadCreate(req, res, upload) {
    //     const { ok, expected, received } = validateMetadata(upload); // your logic
    //     if (!ok) {
    //         const body = `Expected "${expected}" in "Upload-Metadata" but received "${received}"`;
    //         throw { status_code: 500, body }; // if undefined, falls back to 500 with "Internal server error".
    //     }
    //     // You can optionally return metadata to override the upload metadata,
    //     // such as `{ storagePath: "/upload/123abc..." }`
    //     const extraMeta = getExtraMetadata(req); // your logic
    //     return { res, metadata: { ...upload.metadata, ...extraMeta } };
    // },
    // https://www.npmjs.com/package/@tus/server#example-access-control
    // async onIncomingRequest(req, res) {
    //     const token = req.headers.authorization

    //     if (!token) {
    //       throw {status_code: 401, body: 'Unauthorized'}
    //     }

    //     try {
    //       const decodedToken = await jwt.verify(token, 'your_secret_key')
    //       req.user = decodedToken
    //     } catch (error) {
    //       throw {status_code: 401, body: 'Invalid token'}
    //     }

    //     if (req.user.role !== 'admin') {
    //       throw {status_code: 403, body: 'Access denied'}
    //     }
    //   },
});

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

// router.use(cors());

// router.use(
//     session({
//         secret: 'I hope this doesnt need to be too super secure... Im only planning to store driveFolderIDs in here',
//         resave: false,
//         saveUninitialized: true,
//         // unset: 'destroy',
//     })
// );

const createFolderMiddleWare = async (req, res, next) => {
    // const reqHeaders = req.header('upload-metadata');
    // console.log('createFolderMiddleWare req', req);
    // // const upload_metadata = req.headers['upload-metadata'];

    const uploadMetadataHeaderIndex = req.rawHeaders.indexOf('upload-metadata');
    if (uploadMetadataHeaderIndex > 0) {
        const uploadMetadataHeaderValue =
            req.rawHeaders[uploadMetadataHeaderIndex + 1];
        if (uploadMetadataHeaderValue) {
            const decodedMetadata = uploadMetadataHeaderValue
                .split(',')
                .reduce((acc, item) => {
                    const [key, value] = item.split(' ');
                    try {
                        acc[key] = Buffer.from(value, 'base64').toString(
                            'utf-8'
                        );
                    } catch {
                        console.log('error parsing upload metadata');
                        throw ERRORS.INVALID_METADATA;
                    }
                    return acc;
                }, {});

            console.log(
                'createFolderMiddleWare decodedMetadata',
                decodedMetadata
            );
            req.body = decodedMetadata;
        }
    }

    if (req.body?.thisEvent) {
        const hostMe = await Host.findOne({
            email: req.user.email,
        }); //ADD .select('-field'); to exclude [field] from the response
        if (!hostMe) {
            return res
                .status(400)
                .json({ msg: 'There is no host for this email' });
        }
        console.log('hostMe.firstName: ' + hostMe.firstName);
        console.log('req.body', req.body);

        await setTimeout(async () => {
            const theEvent = await Event.findOne({
                _id: req.body.thisEvent,
                confirmedHost: hostMe._id, // I don't think we need this again, if it already passed before
            })
                .populate('artist')
                .populate('confirmedArtist');

            // if (!req.session.driveFolderID) {
            if (!theEvent.driveFolderID) {
                console.log(
                    '**** createFolder for event on',
                    theEvent?.bookingWhen.toISOString().substring(0, 10)
                );
                req.body.driveFolderID = await createFolder(
                    req,
                    theEvent,
                    hostMe
                );
            } else {
                req.body.driveFolderID = theEvent.driveFolderID;
            }
        }, Math.random() * 1000); //I need it to check at different times, so that hopefully it won't create multiple folders at the same time
    } else {
        console.log('No event found at req.body.thisEvent');
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
    const drive = google.drive({
        version: 'v3',
        auth: authClient,
        // protocol: 'resumable',
        upload_protocol: 'resumable',
        uploadType: 'multipart',
    });

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
        let theFolderIdToReturn;
        if (googleDriveFolderSearch.data.files.length > 0) {
            //there's a folder in the Google Drive
            const theDriveFolderId =
                googleDriveFolderSearch.data.files[
                    googleDriveFolderSearch.data.files.length - 1
                ].id;
            // req.body.driveFolderID = theDriveFolderId;
            theFolderIdToReturn = theDriveFolderId;
            theEvent.driveFolderID = theDriveFolderId;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            console.log('driveFolderId: ' + theDriveFolderId);
            // req.session.driveFolderID =
            //     googleDriveFolderSearch.data.files[
            //         googleDriveFolderSearch.data.files.length - 1
            //     ].id;
            // req.session.save(function (err) {
            //     // session saved
            // });
        } else {
            //there's no folder in the Google Drive
            // delete req.session.driveFolderID;
            // if (theEvent.driveFolderID) {
            //     delete theEvent.driveFolderID;
            // }

            const uploadFolder = await drive.files.create({
                resource: {
                    name: uploadFolderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: ['1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o'], //Porchlight App Uploads
                },
                fields: 'id',
            });
            // req.session.driveFolderID = uploadFolder.data.id;
            // req.session.save(function (err) {
            //     // session saved
            // });
            // driveFolderID = uploadFolder.data.id;
            // req.body.driveFolderID = uploadFolder.data.id;
            theFolderIdToReturn = uploadFolder.data.id;
            theEvent.driveFolderID = uploadFolder.data.id;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            console.log('driveFolderId: ' + uploadFolder.data.id);
            // console.log(
            //     'uploadFolder.config.data.name',
            //     uploadFolder.config.data.name,
            //     'uploadFolder.data.id',
            //     uploadFolder.data.id
            // );
        }
        return theFolderIdToReturn;
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }
};

async function uploadFile(req, res, upload, theEvent) {
    // console.log('uploadFile authClient', authClient);
    // console.log('uploadFile file', file);
    console.log('uploadFile req.body', req.body);
    console.log('uploadFile res', res);

    // console.log('upload', upload);
    // const bufferStream = new stream.PassThrough();
    // bufferStream.end(file.buffer);
    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });

    // console.log(
    //     'uploadFile req.session.driveFolderID',
    //     req.session.driveFolderID
    // );
    return new Promise((resolve, rejected) => {
        drive.files.create(
            {
                resource: {
                    name: upload.metadata.filename,
                    parents: [req.body.driveFolderID], //should be inside Porchlight App Uploads on Google Drive
                    // parents: [req.session.driveFolderID], //should be inside Porchlight App Uploads on Google Drive
                },
                media: {
                    body: fs.createReadStream(`./uploads/${upload.id}`),
                    mimeType: upload.metadata.filetype,
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

// Endpoint for TUS uploads
// router.all('/upload', auth, createFolderMiddleWare, (req, res) => {
//     tusServer.handle(req, res);
//     // console.log('tussing req.rawHeaders: ', req.rawHeaders);
//     // handler(req, res);
//     // console.log('tussing handler: ', handler);
// });

// tusServer path '/api/uploads/file'
router.get('/file/:id', (req, res) => {
    console.log('get req.params.id: ', req.params.id);
    console.log('get req.body: ', req.body);
    tusServer.handle(req, res);
    // handler(req, res);
    // tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    //     console.log('get tusServer EVENTS.POST_FINISH uploaded');
    //     console.log('get tusServer upload', upload);
    // });
});
router.patch('/file/:id', auth, createFolderMiddleWare, (req, res) => {
    console.log('patch req.params.id: ', req.params.id);
    console.log('patch req.body: ', req.body);
    tusServer.handle(req, res);
    // handler(req, res);
    // tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    //     console.log('patch tusServer EVENTS.POST_FINISH uploaded');
    //     console.log('patch tusServer upload', upload);
    // });
});
router.post('/file', auth, createFolderMiddleWare, (req, res) => {
    // console.log('patch req.params.id: ', req.params.id);
    console.log('post req.body: ', req.body);
    tusServer.handle(req, res);
    // handler(req, res);
    tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
        console.log('post tusServer EVENTS.POST_FINISH uploaded');
        console.log('post tusServer upload', upload);

        uploadFile(req, res, upload);
    });
});
router.all('*', auth, createFolderMiddleWare, (req, res) => {
    // console.log('patch req.params.id: ', req.params.id);
    console.log('all req: ', req);
    //tusServer.handle(req, res);
    // handler(req, res);
    tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
        console.log('all tusServer EVENTS.POST_FINISH uploaded');
        console.log('all tusServer upload', upload);
    });
});
// router.all('*', auth, createFolderMiddleWare, async (req, res) => {
//     console.log('tussing req: ', req);
//     tusServer.handle(req, res);
//     // handler(req, res);
//     tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
//         console.log('tusServer EVENTS.POST_FINISH uploaded');
//         console.log('tusServer upload', upload);
//     });
// });

// //Image Upload stuff - https://www.geeksforgeeks.org/node-js-image-upload-processing-and-resizing-using-sharp-package/
// //AND https://www.bezkoder.com/node-js-express-file-upload/#Define_Route_for_uploading_file

// @route    POST api/uploads/upload
// @desc     Upload File
// @access   Private
// router.post(
//     '/upload-old',
//     auth,
//     upload.array('imageUpload'),
//     // createFolderMiddleWare,
//     async (req, res) => {
//         console.log('req: ', req);
//         if ((req.raw, res.raw)) {
//             tusServer.handle(req.raw, res.raw);
//             console.log('tusServer: ', tusServer);
//         }

//         // if (req.files && req.files.length > 0) {
//         //     const promises = req.files.map(async (theFile, filesIndex) => {
//         //         try {
//         //             if (theFile == undefined) {
//         //                 return res
//         //                     .status(400)
//         //                     .json({ msg: 'Please upload a file!' });
//         //             }
//         //             console.log('upload initiating...');
//         //             // console.log(
//         //             //     `req.session.driveFolderID`,
//         //             //     req.session.driveFolderID
//         //             // );

//         //             const hostMe = await Host.findOne({
//         //                 email: req.user.email,
//         //             }); //ADD .select('-field'); to exclude [field] from the response
//         //             if (!hostMe) {
//         //                 return res
//         //                     .status(400)
//         //                     .json({ msg: 'There is no host for this email' });
//         //             }
//         //             console.log('hostMe.firstName: ' + hostMe.firstName);

//         //             const theEvent = await Event.findOne({
//         //                 _id: req.body.thisEvent,
//         //                 confirmedHost: hostMe._id,
//         //             })
//         //                 .populate('artist')
//         //                 .populate('confirmedArtist');

//         //             console.log('theEvent.bookingWhen: ', theEvent.bookingWhen);
//         //             // console.log(
//         //             //     `req.session.driveFolderID`,
//         //             //     req.session.driveFolderID
//         //             // );

//         //             const uploadFolderName =
//         //                 theEvent?.bookingWhen.toISOString().substring(0, 10) +
//         //                 ' — ' +
//         //                 // 'Concert' +
//         //                 (theEvent?.artist?.stageName ||
//         //                     theEvent?.confirmedArtist?.stageName) +
//         //                 ' in ' +
//         //                 theEvent?.bookingWhere?.city +
//         //                 ', ' +
//         //                 theEvent?.bookingWhere?.state;

//         //             // const theArtist = await Artist.findOne({
//         //             //     _id: req.body.artist,
//         //             // });
//         //             // req.body.artist = theArtist; //replace the artistID with the whole artist document

//         //             if (theEvent.bookingWhen) {
//         //                 const googleDriveUpload = authorize()
//         //                     .then(async (authClient) => {
//         //                         const drive = google.drive({
//         //                             version: 'v3',
//         //                             auth: authClient,
//         //                         });
//         //                         if (
//         //                             theFile &&
//         //                             theFile.buffer &&
//         //                             theEvent.driveFolderID
//         //                             // &&
//         //                             // req.session.driveFolderID
//         //                         ) {
//         //                             // console.log('req.file', req.file);
//         //                             const uploadRes = await uploadFile(
//         //                                 authClient,
//         //                                 req,
//         //                                 theEvent,
//         //                                 drive,
//         //                                 filesIndex
//         //                             ).then((result) => {
//         //                                 // console.log(
//         //                                 //     'uploadFile result.data',
//         //                                 //     result.data
//         //                                 // );
//         //                                 return result.data;
//         //                             });
//         //                             console.log(
//         //                                 'uploadFile uploadRes.name and id',
//         //                                 uploadRes.name,
//         //                                 uploadRes.id
//         //                             );

//         //                             if (uploadRes.id !== undefined) {
//         //                                 uploadRes.url = `https://drive.usercontent.google.com/download?id=${uploadRes.id}`;
//         //                                 uploadRes.driveID = uploadRes.id;
//         //                                 theEvent.uploadedImages.push(uploadRes);
//         //                                 theEvent.markModified('uploadedImages');
//         //                                 await theEvent.save();
//         //                             }
//         //                             return uploadRes;
//         //                         }
//         //                     })
//         //                     .catch('error');
//         //                 return googleDriveUpload;
//         //             }
//         //         } catch (err) {
//         //             //console.log('Upload error: ' + err);
//         //             if (err.code == 'LIMIT_FILE_SIZE') {
//         //                 return res.status(500).json({
//         //                     msg: 'File size should not be larger than 50MB.',
//         //                 });
//         //             }
//         //             console.log(`Could not upload the file. ${err}`);
//         //             res.status(500).json({
//         //                 msg: `Could not upload the file. ${err}`,
//         //             });
//         //         }
//         //     });

//         //     Promise.all(promises)
//         //         .then((results) => {
//         //             console.log(`Uploaded ${results.length} files):`, results);

//         //             res.status(200).json({
//         //                 url: results[0].url, //it wants a url here...
//         //                 msg: `Uploaded ${results.length} files successfully!`, //+ req.file.originalname,
//         //                 files: results,
//         //             });
//         //         })
//         //         .catch((err) => {
//         //             console.log(`Could not upload the files. ${err}`);
//         //             res.status(500).json({
//         //                 msg: `Could not upload the files. ${err}`,
//         //             });
//         //         });
//         //     // uploadedImages = results.filter((result) => result !== undefined);
//         // }
//         else {
//             res.status(500).json({
//                 msg: `No files found in req.`,
//             });
//         }
//     }
// );

module.exports = router;
