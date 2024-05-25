const express = require('express');
const config = !process.env.NODE_ENV ? require('config') : process.env;

const auth = require('../../middleware/auth');

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// const apikeys = config['googleDriveApiKey'];
// const buff = Buffer.from(googleDrivePrivateKey).toString('base64');
// console.log('buff', buff);

const googleDriveClientEmail = config['googleDriveApiClientEmail'];
// const googleDrivePrivateKeyBase64 = config['googleDriveApiPrivateKey'];
// const googleDrivePrivateKey = Buffer.from(
//     googleDrivePrivateKeyBase64,
//     'base64'
// ).toString('ascii');
// const googleDrivePrivateKeyPath = config['googleDriveApiPrivateKeyPath'];
console.log("config['mongoURI']", config['mongoURI']);
console.log(
    "config['googleDriveApiPrivateKeyPath']",
    config['googleDriveApiPrivateKeyPath']
);
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
const googleDrivePrivateKey = process.env.NODE_ENV
    ? fs.readFileSync(config['googleDriveApiPrivateKeyPath'], 'utf8')
    : config['googleDriveApiPrivateKey'];
console.log('googleDrivePrivateKey', googleDrivePrivateKey);
const googleDriveRootFolder = config['googleDriveRootFolder'];

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

const searchInGoogleDrive = async (theQuery) => {
    const authClient = await authorize();
    const drive = google.drive({
        version: 'v3',
        auth: authClient,
        // protocol: 'resumable',
        // upload_protocol: 'resumable',
        // uploadType: 'multipart',
    });
    const googleDriveSearch = await drive.files.list({
        q: theQuery,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });
    // console.log(
    //     'googleDriveFolderSearch.data.files',
    //     googleDriveSearch.data.files
    // );
    return googleDriveSearch;
};

const searchForFolderInGoogleDrive = async (theEvent) => {
    const authClient = await authorize();
    const drive = google.drive({
        version: 'v3',
        auth: authClient,
        // protocol: 'resumable',
        // upload_protocol: 'resumable',
        // uploadType: 'multipart',
    });
    const googleDriveFolderSearch = await drive.files.list({
        q: `'${googleDriveRootFolder}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${uploadFolderName(
            theEvent
        )}' and trashed = false`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });
    // console.log(
    //     'googleDriveFolderSearch.data.files',
    //     googleDriveFolderSearch.data.files
    // );

    try {
        if (googleDriveFolderSearch.data.files.length > 0) {
            //there's a folder in the Google Drive
            theEvent.driveFolderID =
                googleDriveFolderSearch.data.files[
                    googleDriveFolderSearch.data.files.length - 1
                ].id; //pick the last one in the list (hopefully there's only one, but we're always going to favor the most recent)
            theEvent.markModified('driveFolderID');
            // console.log(
            //     'searchForFolderInGoogleDrive found theEvent.driveFolderID:',
            //     theEvent.driveFolderID
            // );
            await theEvent.save();
            return googleDriveFolderSearch.data.files[
                googleDriveFolderSearch.data.files.length - 1
            ].id; //pick the last one in the list (hopefully there's only one, but we're always going to favor the most recent)
        }
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }

    return googleDriveFolderSearch.data.files[0]; //essentially return empty
};

const tusServer = new Server({
    path: '/api/uploads/file',
    datastore: new FileStore({ directory: './uploads' }),

    // https://www.npmjs.com/package/@tus/server#example-validate-metadata-when-an-upload-is-created
    async onUploadCreate(req, res, upload) {
        console.log('tusServer setup onUploadCreate req.user', req.user);
        console.log('tusServer setup onUploadCreate req.body', req.body);
        console.log('tusServer setup onUploadCreate upload', upload);

        const uploadFileTypePassed = () => {
            if (
                upload.metadata.filetype.split('/')[0] === 'image' ||
                upload.metadata.filetype.split('/')[0] === 'video'
            ) {
                // console.log(
                //     'FILETYPE PASSED tusServer setup onUploadCreate upload.metadata.filetype',
                //     upload.metadata.filetype
                // );
                return true;
            } else {
                // console.log(
                //     'WRONG FILETYPE tusServer setup onUploadCreate upload.metadata.filetype',
                //     upload.metadata.filetype
                // );
                return false;
            }
        };

        if (!req.body.thisEvent || !uploadFileTypePassed()) {
            // return res.status(400).json({
            //     msg: uploadFileTypePassed()
            //         ? 'There is no event found at req.body.thisEvent'
            //         : "Invalid filetype. We're accepting only images and videos.",
            // });
            throw {
                status_code: 400,
                body: uploadFileTypePassed()
                    ? 'There is no event found at req.body.thisEvent'
                    : "Invalid filetype. We're accepting only images and videos.",
            };
        } else {
            try {
                const hostMe = await Host.findOne({
                    email: req.user.email,
                    adminActive: true,
                }); //ADD .select('-field'); to exclude [field] from the response
                if (!hostMe) {
                    throw {
                        status_code: 500,
                        body:
                            'There is no host for this email: ' +
                            req.user.email,
                    }; // if undefined, falls back to 500 with "Internal server error".
                    // return res.status(400).json({
                    //     msg:
                    //         'There is no host for this email: ' +
                    //         req.user.email,
                    // });
                }

                const theEvent = await Event.findOne({
                    _id: req.body.thisEvent,
                    confirmedHost: hostMe._id,
                    status: 'CONFIRMED',
                }).select('driveFolderID');

                if (!theEvent.driveFolderID) {
                    //this should not happen, because the drive folder should have been created and attached to the event in the onBeforeRequest call to /createDriveFolder
                    console.log(
                        'tusServer setup onUploadCreate THERE’S STILL NO theEvent.driveFolderID ?!?!',
                        theEvent?.bookingWhen.toISOString().substring(0, 10)
                    );
                    // return { res, metadata: { ...upload.metadata } };
                    throw {
                        status_code: 500,
                        body: 'An upload folder could not be found for this event. Please try again.',
                    }; // if undefined, falls back to 500 with "Internal server error".
                } else {
                    //there's a driveFolderID on theEvent (this should really always be the case)
                    console.log(
                        `tusServer setup onUploadCreate theEvent.driveFolderID`,
                        theEvent.driveFolderID
                    );
                    //Check the Drive for a file by this name (prevent duplicates)
                    const googleDriveSearchRes = await searchInGoogleDrive(
                        `'${theEvent.driveFolderID}' in parents and name = '${upload.metadata.filename}' and trashed = false`
                    );

                    console.log(
                        'googleDriveSearchRes.data.files',
                        googleDriveSearchRes.data.files
                    );
                    if (googleDriveSearchRes.data.files.length > 0) {
                        //if the file exists already, attach driveID to upload.metadata
                        const theDriveId =
                            googleDriveSearchRes.data.files[
                                googleDriveSearchRes.data.files.length - 1
                            ].id;

                        console.log('FILE EXISTS IN DRIVE -', theDriveId);
                        return {
                            res,
                            metadata: {
                                ...upload.metadata,
                                driveFolderID: theEvent.driveFolderID,
                                driveID: theDriveId,
                            },
                        };
                    } else {
                        //Add the Drive folder ID to the metadata of the files coming in
                        return {
                            res,
                            metadata: {
                                ...upload.metadata,
                                driveFolderID: theEvent.driveFolderID,
                            },
                        };
                    }
                }
            } catch (err) {
                console.log('error', err);
                throw { status_code: 500, body: err }; // if undefined, falls back to 500 with "Internal server error".
                // throw err;
            }
        }
    },
});
tusServer.on(EVENTS.POST_FINISH, async (req, res, upload) => {
    console.log('tusServer EVENTS.POST_FINISH upload', upload);
    //upload to server finished, uploadFile to Google Drive from here
    // console.log('onUploadFinish upload', upload);
    // uploadFile(req, res, upload);

    //update a file that has already been uploaded before
    const theEventPullUploadedFile = await Event.findOneAndUpdate(
        {
            _id: upload.metadata.thisEvent,
        },
        {
            $pull: {
                //remove from array (overwrite to prevent duplicates)
                uploadedFiles: {
                    name: upload.metadata.name,
                },
            },
        },
        {
            new: true, //set the new option to true to return the document after update was applied.
            includeResultMetadata: true,
        }
    );
    // console.log('theEventPullUploadedFile', theEventPullUploadedFile);
    // if (!theEventSetUploaded.updatedExisting) {
    //create an entry for the uploaded file in the database
    const theEventBefore = await Event.findOneAndUpdate(
        {
            _id: upload.metadata.thisEvent,
        },
        {
            $addToSet: {
                uploadedFiles: {
                    name: upload.metadata.name,
                },
            },
        },
        {
            new: true,
        }
    );
    // }

    //uploadFile to Google Drive
    const uploadRes = await uploadFile(req, res, upload).then((result) => {
        // console.log('onUploadFinish uploadFile result', result);
        return result.data;
    });
    // console.log(
    //     'uploadFile uploadRes.name and id',
    //     uploadRes.name,
    //     uploadRes.id
    // );

    if (uploadRes.id !== undefined) {
        //file uploaded to Google Drive

        uploadRes.url = `https://drive.usercontent.google.com/download?id=${uploadRes.id}`;
        uploadRes.driveID = uploadRes.id;
        uploadRes.filetype = upload.metadata.filetype;

        const theEvent = await Event.findOneAndUpdate(
            {
                _id: upload.metadata.thisEvent,
                uploadedFiles: {
                    $elemMatch: { name: upload.metadata.name },
                },
            },
            {
                $set: {
                    'uploadedFiles.$': {
                        ...uploadRes,
                        name: uploadRes.name,
                    },
                },
            },
            {
                new: true,
            }
        );

        // console.log('EVENTS.POST_FINISH findOneAndUpdated theEvent', theEvent);

        // theEvent.uploadedFiles.push(uploadRes);
        // theEvent.markModified('uploadedFiles');
        // await theEvent.save();

        // delete file from server
        const serverFilePath = './uploads/' + upload.id; //the server file id (not the Google Drive file id in uploadRes.id)
        fs.unlink(serverFilePath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            // console.log(serverFilePath, 'successfully deleted from the server');
        });
        fs.unlink(serverFilePath + '.json', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            // console.log(
            //     serverFilePath + '.json successfully deleted from the server'
            // );
        });
        // console.log('onUploadFinish uploadRes:', uploadRes);
        return uploadRes;
    } else {
        return res.status(400).json({
            msg: 'Failed to upload to Googlge Drive.',
        });
    }
});

async function authorize() {
    const jwtClient = new google.auth.JWT(
        googleDriveClientEmail,
        null,
        googleDrivePrivateKey,
        ['https://www.googleapis.com/auth/drive']
    );

    await jwtClient.authorize();
    // console.log('authorization complete');

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

            // console.log(
            //     'decodeMetadataMiddleWare decodedMetadata',
            //     decodedMetadata
            // );
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
        q: `'${googleDriveRootFolder}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = 'empties' and trashed = false`,
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
                    parents: [googleDriveRootFolder], //Porchlight App Uploads
                },
                fields: 'id',
            });

            theEmptiesFolderId = await emptiesFolder.data.id;
            // theEvent.driveFolderID = emptiesFolder.data.id;
            // theEvent.markModified('driveFolderID');
            // await theEvent.save();
            // console.log('driveFolderID: ' + emptiesFolder.data.id);
        }
        // console.log(
        //     'createFolder theEmptiesFolderId',
        //     await theEmptiesFolderId
        // );
        //return await theEmptiesFolderId;
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }

    //https://developers.google.com/drive/api/guides/search-files
    const googleDriveFolderSearch = await drive.files.list({
        q: `('${googleDriveRootFolder}' in parents or '${await theEmptiesFolderId}' in parents) and mimeType = 'application/vnd.google-apps.folder' and name = '${uploadFolderName(
            theEvent
        )}' and trashed = false`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    });
    // console.log(
    //     'googleDriveFolderSearch.data.files',
    //     googleDriveFolderSearch.data.files
    // );
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
            // console.log('driveFolderID: ' + theDriveFolderId);
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
            // console.log('driveFolderID: ' + uploadFolder.data.id);
        }
        // console.log(
        //     'createFolder theFolderIdToReturn',
        //     await theFolderIdToReturn
        // );
        return await theFolderIdToReturn;
    } catch (err) {
        // TODO(developer) - Handle error
        console.log('error', err);
        throw err;
    }
};

async function uploadFile(req, res, upload) {
    //upload the file to Google Drive
    // console.log('uploadFile upload ', upload);
    // console.log('uploadFile req.body', req.body);

    if (upload?.metadata?.driveFolderID) {
        const authClient = await authorize();
        const drive = google.drive({
            version: 'v3',
            auth: authClient,
        });

        if (upload?.metadata?.driveID) {
            //If there was another file in the drive with the same name,
            //a driveID was attached to the upload.metadata in the onUploadCreate
            //update the file, DON'T create a new one
            // console.log('UPDATE AN EXISTING FILE');
            return new Promise((resolve, rejected) => {
                drive.files.update(
                    {
                        fileId: upload.metadata.driveID,
                        media: {
                            body: fs.createReadStream(`./uploads/${upload.id}`),
                            mimeType: upload.metadata.filetype,
                        },
                        fields: 'id, name',
                    },
                    async function (err, file) {
                        if (err) {
                            console.log('error', err);
                            rejected(err);
                        } else {
                            // console.log(
                            //     'UPDATED file.data.name:',
                            //     file.data.name,
                            //     'UPDATED file.data.id:',
                            //     file.data.id
                            // );
                            resolve(file);
                        }
                    }
                );
            });
        } else {
            //create a new file in the drive
            // console.log('CREATING A NEW FILE');
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
                                    googleDriveRootFolder
                                ) < 0
                            ) {
                                //if root Drive folder is not an index of parents,
                                //move event folder to root from 'empties'
                                // const movedEventFolder =
                                await drive.files.update({
                                    fileId: upload.metadata.driveFolderID,
                                    addParents: googleDriveRootFolder,
                                    removeParents:
                                        eventFolder.data.parents.join(','),
                                    fields: 'id, parents',
                                });
                                // console.log(
                                //     'uploadFile movedEventFolder',
                                //     movedEventFolder
                                // );
                            }

                            // console.log(
                            //     'file.data.name:',
                            //     file.data.name,
                            //     ' file.data.id:',
                            //     file.data.id
                            // );
                            resolve(file);
                        }
                    }
                );
            });
        }
    } else {
        console.log('No event found at uploadMetaData.thisEvent');
        return res.status(400).json({
            msg: 'There is no event found at uploadMetaData.thisEvent',
        });
    }
}

// tusServer path '/api/uploads/file'
router.get('/file/:id', (req, res) => {
    // console.log('get req.params.id: ', req.params.id);
    // console.log('get req.body: ', req.body);
    tusServer.handle(req, res);
    // handler(req, res);
    // tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    //     console.log('get tusServer EVENTS.POST_FINISH uploaded');
    //     console.log('get tusServer upload', upload);
    // });
});
router.patch('/file/:id', auth, decodeMetadataMiddleWare, (req, res) => {
    // console.log('patch req.params.id: ', req.params.id);
    // console.log('patch req.body: ', req.body);
    tusServer.handle(req, res);
    // handler(req, res);
    // tusServer.on(EVENTS.POST_FINISH, (req, res, upload) => {
    //     console.log('patch tusServer EVENTS.POST_FINISH upload', upload);
    // });
});
router.post('/file', auth, decodeMetadataMiddleWare, (req, res) => {
    // console.log('patch req.params.id: ', req.params.id);

    // console.log('post req.body: ', req.body);
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
            adminActive: true,
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
            status: 'CONFIRMED',
        })
            .populate('artist')
            .populate('confirmedArtist');
        if (!theEvent.driveFolderID) {
            // console.log(
            //     '**** createFolder for event on',
            //     theEvent?.bookingWhen.toISOString().substring(0, 10)
            // );
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
            // console.log('driveFolder created successfully');
            return res.json('driveFolder created successfully');
        } else {
            //if theEvent does have a driveFolderID
            const searchDriveFolderId = await searchForFolderInGoogleDrive(
                theEvent
            );
            if (searchDriveFolderId) {
                // console.log(
                //     '/createDriveFolder theEvent.driveFolderID',
                //     theEvent.driveFolderID
                // );
                // console.log(
                //     '/createDriveFolder searchDriveFolderId',
                //     searchDriveFolderId
                // );
                if (searchDriveFolderId === theEvent.driveFolderID) {
                    req.body.driveFolderID = theEvent.driveFolderID;
                    // console.log('driveFolder already existed');
                    return res.json('driveFolder already existed');
                } else {
                    // console.log(
                    //     'searchDriveFolderId and driveFolderID are mismatched'
                    // );
                    return res.json(
                        'searchDriveFolderId and driveFolderID are mismatched'
                    );
                }
            } else {
                // console.log(
                //     '**** createFolder for event on',
                //     theEvent?.bookingWhen.toISOString().substring(0, 10)
                // );
                let theDriveFolderId = await createFolder(
                    req,
                    theEvent,
                    hostMe
                );
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
                // console.log(
                //     'there was a driveFolderID, but searchDriveFolderId came back empty — driveFolder created successfully'
                // );
                return res.json(
                    'there was a driveFolderID, but searchDriveFolderId came back empty — driveFolder created successfully'
                );
            }
            // console.log(
            //     `setTimeout ${randTime} theEvent.driveFolderID`,
            //     theEvent.driveFolderID
            // );
            // req.body.driveFolderID = theEvent.driveFolderID;

            // console.log(
            //     `setTimeout ${randTime} theEvent.driveFolderID req.body`,
            //     req.body
            // );
        }
    } else {
        console.log('No event found at req.body.thisEvent');
        return res
            .status(400)
            .json({ msg: 'There is no event found at req.body.thisEvent' });
    }
});

router.get('/eventUploadedFiles/:id', auth, async (req, res) => {
    // console.log('/eventUploadedFiles req', req);
    // console.log('/eventUploadedFiles get req.params.id: ', req.params.id);
    if (req.params.id) {
        const hostMe = await Host.findOne({
            email: req.user.email,
            adminActive: true,
        }); //ADD .select('-field'); to exclude [field] from the response
        if (!hostMe) {
            return res
                .status(400)
                .json({ msg: 'There is no host for this email' });
        }
        // console.log('hostMe.firstName: ' + hostMe.firstName);
        // let randTime = Math.random() * 1000;

        const theEvent = await Event.findOne({
            // _id: req.body.thisEvent._id || req.body.thisEvent,
            _id: req.params.id,
            confirmedHost: hostMe._id,
            status: 'CONFIRMED',
        })
            .select(
                '-artistEmail -hostsOfferingToBook -latLong -hostsInReach -agreeToPayAdminFee -payoutHandle -declinedHosts'
            )
            .populate(
                'artist',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            )
            .populate(
                'preferredArtists',
                '-email -phone -streetAddress -payoutHandle -companionTravelers -travelingCompanions -artistNotes -agreeToPayAdminFee -sentFollowUp'
            );

        // console.log('/eventUploadedFiles theEvent', theEvent);
        res.json(theEvent);
    }
});

module.exports = router;
