import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_ARTIST,
    GET_ARTIST_ME,
    GET_ARTISTS,
    UPDATE_ARTIST,
    UPDATE_ARTIST_ME,
    UPDATE_ARTISTS,
    UPDATE_ARTIST_ERROR,
    ARTIST_ERROR,
    ARTIST_ME_ERROR,
    CLEAR_ARTIST,
    ACCOUNT_DELETED,
} from './types';

// Get current artist's profile
export const getCurrentArtist = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/artists/me`);
        dispatch({
            type: GET_ARTIST_ME,
            payload: res.data,
        });
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        dispatch({
            type: ARTIST_ME_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get artist's profile by email
export const getArtistByEmail = (email) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            email: email,
        };
        const res = await axios.post(`/api/artists/by-email/`, config);
        //console.log('res.data', res.data);
        return res.data;
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        // dispatch({
        //     type: ARTIST_ERROR,
        //     payload: {
        //         msg: err.response.statusText,
        //         status: err.response.status,
        //     },
        // });
    }
};

// Get all artists
export const getArtists = () => async (dispatch) => {
    dispatch({ type: CLEAR_ARTIST });
    try {
        const res = await axios.get('/api/artists');
        dispatch({
            type: GET_ARTISTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ARTIST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get all artists to edit
export const getEditArtists = () => async (dispatch) => {
    //dispatch({ type: CLEAR_ARTIST });
    try {
        const res = await axios.get('/api/artists/edit');
        dispatch({
            type: GET_ARTISTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ARTIST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get artist by slug
export const getArtistBySlug = (artistSlug) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/artists/${artistSlug}`);
        dispatch({
            type: GET_ARTIST,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: ARTIST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Create or update artist
export const createMyArtist =
    (formData, history, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const formDataArray = [formData];
            const res = await axios.post(
                '/api/artists/updateMe',
                formDataArray,
                config
            );
            dispatch({
                type: UPDATE_ARTIST_ME,
                payload: res.data,
            });
            //dispatch(setAlert(edit ? 'Artist Updated' : 'Artist Created', 'success')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        } catch (err) {
            const errors = err.response.data.errors;
            console.log('error: ' + err);
            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({
                type: UPDATE_ARTIST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };

// Create or update artist
// export const createArtist =
//     (formData, history, edit = false) =>
//     async (dispatch) => {
//         try {
//             const config = {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             };
//             const formDataArray = [formData];
//             const res = await axios.post(
//                 '/api/artists/batch',
//                 formDataArray,
//                 config
//             );
//             dispatch({
//                 type: UPDATE_ARTIST,
//                 payload: res.data,
//             });
//             dispatch(
//                 setAlert(edit ? 'Artist Updated' : 'Artist Created', 'success')
//             ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
//         } catch (err) {
//             const errors = err.response.data.errors;
//             console.log('error: ' + err);
//             if (errors) {
//                 errors.forEach((error) =>
//                     dispatch(setAlert(error.msg, 'danger'))
//                 );
//             }
//             dispatch({
//                 type: UPDATE_ARTIST_ERROR,
//                 payload: {
//                     msg: err.response.statusText,
//                     status: err.response.status,
//                 },
//             });
//             dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
//         }
//     };

// Update artists
export const updateArtists =
    (formData, history, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const formDataArray = [formData];
            const res = await axios.post(
                '/api/artists/admin-update',
                formDataArray,
                config
            );
            dispatch({
                type: UPDATE_ARTISTS,
                payload: res.data,
            });
            dispatch(
                setAlert(edit ? 'Artist Updated' : 'Artist Created', 'success')
            ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        } catch (err) {
            const errors = err.response.data.errors;
            console.log('error: ' + err);
            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({
                type: UPDATE_ARTIST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };

// Delete account and profile
export const deleteAccount = (id) => async (dispatch) => {
    if (
        window.confirm(
            'Are you sure you want to do this? This cannot be undone!'
        )
    ) {
        try {
            await axios.delete(`/api/profile`);

            dispatch({ type: CLEAR_ARTIST });
            dispatch({ type: ACCOUNT_DELETED });
            dispatch(setAlert('Your account has been permanently deleted')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        } catch (err) {
            dispatch({
                type: ARTIST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
        }
    }
};
