import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import XHR from '@uppy/xhr-upload';
// import GoogleDrive from '@uppy/google-drive';
// import Webcam from '@uppy/webcam';
import RemoteSources from '@uppy/remote-sources';
import {
    Dashboard,
    DashboardModal,
    DragDrop,
    ProgressBar,
    FileInput,
} from '@uppy/react';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/file-input/dist/style.css';
import '@uppy/progress-bar/dist/style.css';

const FileUploader = ({ thisEvent }) => {
    const createDriveFolder = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.post(
            '/api/uploads/createDriveFolder',
            { thisEvent: thisEvent },
            config
        );
        console.log(
            `/api/uploads/createDriveFolder res`,
            // `/api/uploads/createDriveFolder res index(${numRequests})`,
            res
        );
    };

    useEffect(() => {
        // if (numRequests === 0) {
        //only make the folder once (we don't need a bunch of empty folders in the Drive)
        try {
            createDriveFolder();
            // numRequests++;

            // dispatch({
            //     type: EDIT_HOST_EVENT,
            //     payload: res.data,
            // });
            // dispatch(
            //     setAlert(
            //         'Your offer to host the show on ' +
            //             new Date(formData.bookingWhen).toLocaleDateString(
            //                 undefined,
            //                 {
            //                     weekday: 'long',
            //                     year: 'numeric',
            //                     month: 'long',
            //                     day: 'numeric',
            //                 }
            //             ) +
            //             ' was submitted.',
            //         'success'
            //     )
            // ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        } catch (err) {
            console.log('error: ' + err);
        }
    }, []);
    if (localStorage.token) {
        let numRequests = 0;
        const uppy = new Uppy({
            id: 'uppity',
            // autoProceed: true,
            autoProceed: false,
            debug: true,
            allowedFileTypes: ['image/*'],
            formData: true,
            theme: 'dark',
            allowedFileTypes: ['image/*', 'video/*'],

            meta: {
                // bookingWhen: thisEvent.bookingWhen.slice(0, 10),
                // artist: thisEvent.confirmedArtist || thisEvent.artist,
                // host: thisEvent.confirmedHost,
                thisEvent: thisEvent._id,
                // driveFolderID: thisEvent.driveFolderID,
                // location:
                //     thisEvent.bookingWhere.city +
                //     ', ' +
                //     thisEvent.bookingWhere.state,
            },
        }).use(Tus, {
            endpoint: '/api/uploads/file',
            headers: {
                'x-auth-token': localStorage.token,
            },
            onBeforeRequest: async (req, file) => {
                // make sure it has a Google Drive Folder to go into
                // console.log('onBeforeRequest req', req);
                console.log('onBeforeRequest file', file);
                if (numRequests === 0) {
                    //only make the folder once (we don't need a bunch of empty folders in the Drive)
                    try {
                        numRequests++;
                        const config = {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        };
                        const res = await axios.post(
                            '/api/uploads/createDriveFolder',
                            { thisEvent: file.meta.thisEvent },
                            config
                        );
                        // console.log(
                        //     `/api/uploads/createDriveFolder res index(${numRequests})`,
                        //     res
                        // );
                        // dispatch({
                        //     type: EDIT_HOST_EVENT,
                        //     payload: res.data,
                        // });
                        // dispatch(
                        //     setAlert(
                        //         'Your offer to host the show on ' +
                        //             new Date(formData.bookingWhen).toLocaleDateString(
                        //                 undefined,
                        //                 {
                        //                     weekday: 'long',
                        //                     year: 'numeric',
                        //                     month: 'long',
                        //                     day: 'numeric',
                        //                 }
                        //             ) +
                        //             ' was submitted.',
                        //         'success'
                        //     )
                        // ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
                    } catch (err) {
                        console.log('error: ' + err);
                        // const errors = err.response.data.errors;
                        // if (errors) {
                        //     errors.forEach((error) =>
                        //         dispatch(setAlert(error.msg, 'danger'))
                        //     );
                        // }
                        // dispatch({
                        //     type: UPDATE_EVENT_ERROR,
                        //     payload: {
                        //         msg: err.response.statusText,
                        //         status: err.response.status,
                        //     },
                        // });
                        // dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
                    }
                }
            },
        });
        // .use(XHR, {
        //     id: 'XHRUpload',
        //     endpoint: '/api/uploads/upload',
        //     method: 'post',
        //     headers: {
        //         'x-auth-token': localStorage.token,
        //         // 'Content-Type': 'application/json',
        //     },
        //     fieldName: 'imageUpload',
        //     bundle: true,
        //     formData: true,
        //     getResponseData: (responseText, response) => {
        //         // Parse the response data and return it
        //         // This allows Uppy to get the uploaded file URLs
        //         const data = JSON.parse(responseText);
        //         console.log('getResponseData data', data);
        //         uppy.info({
        //             message: `${data.msg} Thank you so much!`,
        //             duration: 8000,
        //         });
        //         return {
        //             url: data.url,
        //         };
        //     },
        //     getResponseError: (responseText, response) => {
        //         console.log('getResponseError responseText', responseText);
        //         uppy.info({
        //             message: `Something went wrong. Please refresh and try again.`,
        //             type: 'error',
        //             duration: 8000,
        //         });
        //         // return new Error(JSON.parse(responseText).message);
        //     },
        //     validateStatus: (status, responseData) => {
        //         if (status >= 400) {
        //             // Extract error information from the response data
        //             let errorMessage =
        //                 responseData && responseData.error
        //                     ? responseData.error
        //                     : 'An error occurred during upload';
        //             let errorDetails =
        //                 responseData && responseData.details
        //                     ? responseData.details
        //                     : null;

        //             // Log the error
        //             console.error(`Upload failed: ${errorMessage}`);
        //             if (errorDetails) {
        //                 console.error('Error details:', errorDetails);
        //             }

        //             // Display an error notification to the user
        //             uppy.info({
        //                 message: errorMessage,
        //                 type: 'error',
        //                 duration: 8000,
        //             });

        //             // Optionally, you can retry the upload or perform other actions based on the error
        //             if (status === 429) {
        //                 // Too Many Requests
        //                 // Implement retry logic here
        //             } else if (status === 401) {
        //                 // Unauthorized
        //                 // Handle authentication errors
        //             }

        //             return false; // Indicate failed upload
        //         }
        //         console.log('Uppy responseData', responseData);

        //         return true;
        //     },
        //     // onBeforeSend: (files, xhr) => {
        //     //     xhr.upload = files;
        //     // },
        //     // withCredentials: true,
        // });

        // const handleFileAdded = (file) => {
        //     console.log('added file: ', file);
        //     uppy.addFile({
        //         name: file.name,
        //         type: file.type,
        //         data: file,
        //     });
        // };
        return (
            <>
                <Dashboard
                    uppy={uppy}
                    // onFilesAdded={(files) => files.forEach(handleFileAdded)}
                />
            </>
        );
    } else return <></>;
};

export default FileUploader;
