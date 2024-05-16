const express = require('express');
const config = !process.env.NODE_ENV ? require('config') : process.env;

const auth = require('../../middleware/auth');

const fs = require('fs');
const { google } = require('googleapis');

const apikeys = config['googleDriveApiKey'];

const router = express.Router();
const Event = require('../../models/Event');
const Host = require('../../models/Host');

const { Server, EVENTS } = require('@tus/server');
const { FileStore } = require('@tus/file-store');

const { Metadata, ERRORS } = require('@tus/utils');

const uploadFolderName = (theEvent) => {
    if (theEvent?.bookingWhen) {
        return (
            theEvent?.bookingWhen.toISOString().substring(0, 10) +
            ' — ' +
            // 'Concert' +
            (theEvent?.artist?.stageName ||
                theEvent?.confirmedArtist?.stageName) +
            ' in ' +
            theEvent?.bookingWhere?.city +
            ', ' +
            theEvent?.bookingWhere?.state
        );
    }
};

const tusServer = new Server({
    path: '/api/uploads/file',
    datastore: new FileStore({ directory: './uploads' }),

    // https://www.npmjs.com/package/@tus/server#example-validate-metadata-when-an-upload-is-created
    async onUploadCreate(req, res, upload) {
        console.log('tusServer setup onUploadCreate req.user', req.user);
        console.log('tusServer setup onUploadCreate req.body', req.body);
        console.log('tusServer setup onUploadCreate upload', upload);

        if (req.body.thisEvent) {
            const hostMe = await Host.findOne({
                email: req.user.email,
            }); //ADD .select('-field'); to exclude [field] from the response
            if (!hostMe) {
                return res.status(400).json({
                    msg: 'There is no host for this email: ' + req.user.email,
                });
            }

            const theEvent = await Event.findOne({
                _id: req.body.thisEvent,
                confirmedHost: hostMe._id,
            }).select('driveFolderID');

            if (!theEvent.driveFolderID) {
                console.log(
                    'tusServer setup onUploadCreate THERE’S STILL NO theEvent.driveFolderID ?!?!',
                    theEvent?.bookingWhen.toISOString().substring(0, 10)
                );
                return { res, metadata: { ...upload.metadata } };
            } else {
                console.log(
                    `tusServer setup onUploadCreate theEvent.driveFolderID`,
                    theEvent.driveFolderID
                );
                return {
                    res,
                    metadata: {
                        ...upload.metadata,
                        driveFolderID: theEvent.driveFolderID,
                    },
                };
            }
        }

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
    // async onUploadFinish(req, res, upload) {
    //     //upload to server finished, uploadFile to Google Drive from here
    //     console.log('onUploadFinish upload', upload);
    //     // uploadFile(req, res, upload);

    //     //uploadFile to Google Drive
    //     const uploadRes = await uploadFile(req, res, upload).then((result) => {
    //         return result.data;
    //     });
    //     console.log(
    //         'uploadFile uploadRes.name and id',
    //         uploadRes.name,
    //         uploadRes.id
    //     );

    //     if (uploadRes.id !== undefined) {
    //         const theEvent = await Event.findOne({
    //             _id: upload.metadata.thisEvent,
    //         });

    //         uploadRes.url = `https://drive.usercontent.google.com/download?id=${uploadRes.id}`;
    //         uploadRes.driveID = uploadRes.id;
    //         theEvent.uploadedImages.push(uploadRes);
    //         theEvent.markModified('uploadedImages');
    //         await theEvent.save();

    //         //delete file from server
    //         // const serverFilePath = './uploads/' + upload.id;
    //         // fs.unlink(serverFilePath, (err) => {
    //         //     if (err) {
    //         //         console.error(err);
    //         //         return;
    //         //     }
    //         //     console.log('successfully deleted', serverFilePath);
    //         // });
    //         // fs.unlink(serverFilePath + '.json', (err) => {
    //         //     if (err) {
    //         //         console.error(err);
    //         //         return;
    //         //     }
    //         //     console.log('json successfully deleted', serverFilePath);
    //         // });
    //         console.log('onUploadFinish uploadRes:', uploadRes);
    //         return uploadRes;
    //     } else {
    //         return res.status(400).json({
    //             msg: 'Failed to upload to Googlge Drive.',
    //         });
    //     }
    // },
});
tusServer.on(EVENTS.POST_FINISH, async (req, res, upload) => {
    console.log('tusServer EVENTS.POST_FINISH upload', upload);
    //upload to server finished, uploadFile to Google Drive from here
    console.log('onUploadFinish upload', upload);
    // uploadFile(req, res, upload);

    //uploadFile to Google Drive
    const uploadRes = await uploadFile(req, res, upload).then((result) => {
        console.log('onUploadFinish uploadFile result', result);
        return result.data;
    });
    console.log(
        'uploadFile uploadRes.name and id',
        uploadRes.name,
        uploadRes.id
    );

    if (uploadRes.id !== undefined) {
        const theEvent = await Event.findOne({
            _id: upload.metadata.thisEvent,
        });

        uploadRes.url = `https://drive.usercontent.google.com/download?id=${uploadRes.id}`;
        uploadRes.driveID = uploadRes.id;
        theEvent.uploadedImages.push(uploadRes);
        theEvent.markModified('uploadedImages');
        await theEvent.save();

        // delete file from server
        const serverFilePath = './uploads/' + upload.id; //the server file id (not the Google Drive file id in uploadRes.id)
        fs.unlink(serverFilePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(serverFilePath, 'successfully deleted from the server');
        });
        fs.unlink(serverFilePath + '.json', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(
                serverFilePath + '.json successfully deleted from the server'
            );
        });
        console.log('onUploadFinish uploadRes:', uploadRes);
        return uploadRes;
    } else {
        return res.status(400).json({
            msg: 'Failed to upload to Googlge Drive.',
        });
    }
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

const decodeMetadataMiddleWare = async (req, res, next) => {
    // metadata from Uppy came in on req.rawHeaders and is encoded

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
                'decodeMetadataMiddleWare decodedMetadata',
                decodedMetadata
            );
            req.body = decodedMetadata;
        }
    }

    next();
};

const createFolder = async (req, theEvent, hostMe) => {
    //create folder for the event on Google Drive for the files to be uploaded into
    const authClient = await authorize();
    const drive = google.drive({
        version: 'v3',
        auth: authClient,
    });

    //search for an 'empties' folder in the Google Drive
    const googleDriveEmptiesFolder = await drive.files.list({
        q: `'1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o' in parents and mimeType = 'application/vnd.google-apps.folder' and name = 'empties' and trashed = false`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });

    let theEmptiesFolderId;

    try {
        if (googleDriveEmptiesFolder.data.files.length > 0) {
            //there is an 'empties' folder in the Google Drive
            const theDriveFolderId =
                googleDriveEmptiesFolder.data.files[
                    googleDriveEmptiesFolder.data.files.length - 1
                ].id;
            // req.body.driveFolderID = theDriveFolderId;
            theEmptiesFolderId = theDriveFolderId;
            // theEvent.driveFolderID = theDriveFolderId;
            // theEvent.markModified('driveFolderID');
            // await theEvent.save();
            // console.log('driveFolderID: ' + theDriveFolderId);
        } else {
            // there's no 'empties' folder in the Google Drive, so make one

            const emptiesFolder = await drive.files.create({
                resource: {
                    name: 'empties',
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: ['1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o'], //Porchlight App Uploads
                },
                fields: 'id',
            });

            theEmptiesFolderId = await emptiesFolder.data.id;
            // theEvent.driveFolderID = emptiesFolder.data.id;
            // theEvent.markModified('driveFolderID');
            // await theEvent.save();
            console.log('driveFolderID: ' + emptiesFolder.data.id);
        }
        console.log(
            'createFolder theEmptiesFolderId',
            await theEmptiesFolderId
        );
        //return await theEmptiesFolderId;
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }

    //https://developers.google.com/drive/api/guides/search-files
    const googleDriveFolderSearch = await drive.files.list({
        q: `('1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o' in parents or '${await theEmptiesFolderId}' in parents) and mimeType = 'application/vnd.google-apps.folder' and name = '${uploadFolderName(
            theEvent
        )}' and trashed = false`,
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
            //there's already a folder for this event in the Google Drive
            const theDriveFolderId =
                googleDriveFolderSearch.data.files[
                    googleDriveFolderSearch.data.files.length - 1
                ].id;
            // req.body.driveFolderID = theDriveFolderId;
            theFolderIdToReturn = theDriveFolderId;
            theEvent.driveFolderID = theDriveFolderId;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            console.log('driveFolderID: ' + theDriveFolderId);
        } else {
            // there's no folder for this event in the Google Drive
            const uploadFolder = await drive.files.create({
                resource: {
                    name: uploadFolderName(theEvent),
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [theEmptiesFolderId], //Porchlight App Uploads
                },
                fields: 'id',
            });

            theFolderIdToReturn = await uploadFolder.data.id;
            theEvent.driveFolderID = uploadFolder.data.id;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            console.log('driveFolderID: ' + uploadFolder.data.id);
        }
        console.log(
            'createFolder theFolderIdToReturn',
            await theFolderIdToReturn
        );
        return await theFolderIdToReturn;
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }
};

async function uploadFile(req, res, upload) {
    //upload the file to Google Drive
    console.log('uploadFile upload ', upload);
    console.log('uploadFile req.body', req.body);

    if (upload?.metadata?.driveFolderID) {
        const authClient = await authorize();
        const drive = google.drive({ version: 'v3', auth: authClient });
        return new Promise((resolve, rejected) => {
            drive.files.create(
                {
                    resource: {
                        name: upload.metadata.filename,
                        parents: [upload.metadata.driveFolderID], //should be inside Porchlight App Uploads on Google Drive
                    },
                    media: {
                        body: fs.createReadStream(`./uploads/${upload.id}`),
                        mimeType: upload.metadata.filetype,
                    },
                    fields: 'id,name',
                },
                async function (err, file) {
                    if (err) {
                        console.log('error', err);
                        rejected(err);
                    } else {
                        //delete file from server
                        // const serverFilePath = './uploads/' + upload.id;
                        // fs.unlink(serverFilePath, (err) => {
                        //     if (err) {
                        //         console.error(err);
                        //         return;
                        //     }
                        //     console.log('successfully deleted', serverFilePath);
                        // });
                        // fs.unlink(serverFilePath + '.json', (err) => {
                        //     if (err) {
                        //         console.error(err);
                        //         return;
                        //     }
                        //     console.log(
                        //         'json successfully deleted',
                        //         serverFilePath
                        //     );
                        // });

                        //get parents of eventFolder and relocate it if necessary
                        const eventFolder = await drive.files.get({
                            fileId: upload.metadata.driveFolderID,
                            fields: 'parents',
                        });

                        // console.log('uploadFile eventFolder', eventFolder);

                        if (
                            eventFolder.data.parents.indexOf(
                                '1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o'
                            ) < 0
                        ) {
                            //if root Drive folder is not an index of parents,
                            //move event folder to root from 'empties'
                            // const movedEventFolder =
                            await drive.files.update({
                                fileId: upload.metadata.driveFolderID,
                                addParents: '1YbUXYyijMsXObU-qSOcDOQUDSjGsbJ5o',
                                removeParents:
                                    eventFolder.data.parents.join(','),
                                fields: 'id, parents',
                            });
                            // console.log(
                            //     'uploadFile movedEventFolder',
                            //     movedEventFolder
                            // );
                        }

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
    } else {
        console.log('No event found at uploadMetaData.thisEvent');
        return res.status(400).json({
            msg: 'There is no event found at uploadMetaData.thisEvent',
        });
    }
}

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
router.patch('/file/:id', auth, decodeMetadataMiddleWare, (req, res) => {
    console.log('patch req.params.id: ', req.params.id);
    console.log('patch req.body: ', req.body);
    tusServer.handle(req, res);
    // handler(req, res);
    // tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    //     console.log('patch tusServer EVENTS.POST_FINISH upload', upload);
    // });
});
router.post('/file', auth, decodeMetadataMiddleWare, (req, res) => {
    // console.log('patch req.params.id: ', req.params.id);

    console.log('post req.body: ', req.body);
    // const uploadMetaData = req.body;

    tusServer.handle(req, res);
    // handler(req, res);
    // tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    //     // console.log('patch tusServer EVENTS.POST_FINISH uploaded');
    //     console.log('post tusServer EVENTS.POST_FINISH upload', upload);
    // });
    // tusServer.on(EVENTS.POST_TERMINATE, (req, res, upload) => {
    //     console.log('post tusServer EVENTS.POST_TERMINATE uploaded');
    //     console.log('post tusServer upload', upload);

    //     setTimeout(() => {
    //         uploadFile(req, res, upload, uploadMetaData);
    //     }, 1000);
    // });
});
router.post('/createDriveFolder', auth, async (req, res) => {
    // console.log('createDriveFolder req.body', req.body);
    if (req.body?.thisEvent) {
        const hostMe = await Host.findOne({
            email: req.user.email,
        }); //ADD .select('-field'); to exclude [field] from the response
        if (!hostMe) {
            return res
                .status(400)
                .json({ msg: 'There is no host for this email' });
        }
        // console.log('hostMe.firstName: ' + hostMe.firstName);
        // let randTime = Math.random() * 1000;

        const theEvent = await Event.findOne({
            _id: req.body.thisEvent._id || req.body.thisEvent,
            confirmedHost: hostMe._id,
        })
            .populate('artist')
            .populate('confirmedArtist');
        if (!theEvent.driveFolderID) {
            console.log(
                '**** createFolder for event on',
                theEvent?.bookingWhen.toISOString().substring(0, 10)
            );
            let theDriveFolderId = await createFolder(req, theEvent, hostMe);
            // console.log(
            //     `setTimeout ${randTime} !theEvent.driveFolderID createFolder return`,
            //     theDriveFolderId
            // );

            req.body.driveFolderID = theDriveFolderId;

            theEvent.driveFolderID = theDriveFolderId;
            theEvent.markModified('driveFolderID');
            await theEvent.save();
            // console.log(
            //     `setTimeout ${randTime} !theEvent.driveFolderID createFolder req.body`,
            //     req.body
            // );
            console.log('driveFolder created successfully');
            return res.json('driveFolder created successfully');
        } else {
            // console.log(
            //     `setTimeout ${randTime} theEvent.driveFolderID`,
            //     theEvent.driveFolderID
            // );
            req.body.driveFolderID = theEvent.driveFolderID;

            // console.log(
            //     `setTimeout ${randTime} theEvent.driveFolderID req.body`,
            //     req.body
            // );
            console.log('driveFolder already existed');
            return res.json('driveFolder already existed');
        }
    } else {
        console.log('No event found at req.body.thisEvent');
        return res
            .status(400)
            .json({ msg: 'There is no event found at req.body.thisEvent' });
    }
});

module.exports = router;
