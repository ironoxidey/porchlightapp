import React, { useState } from 'react';
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

const FileUploader = ({}) => {
    if (localStorage.token) {
        const uppy = new Uppy({
            id: 'uppity',
            autoProceed: true,
            debug: true,
            allowedFileTypes: ['image/*'],
            formData: true,
            theme: 'dark',
        })
            // .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' });
            .use(XHR, {
                id: 'XHRUpload',
                endpoint: '/api/uploads/upload',
                method: 'post',
                headers: {
                    'x-auth-token': localStorage.token,
                    // 'Content-Type': 'application/json',
                },
                fieldName: 'imageUpload',
                // onBeforeSend: (files, xhr) => {
                //     xhr.upload = files;
                // },
                // withCredentials: true,
            });

        const handleFileAdded = (file) => {
            console.log('added file: ', file);
            uppy.addFile({
                name: file.name,
                type: file.type,
                data: file,
            });
        };
        return (
            <>
                <Dashboard
                    uppy={uppy}
                    onFilesAdded={(files) => files.forEach(handleFileAdded)}
                />
            </>
        );
    } else return <></>;
};

export default FileUploader;
