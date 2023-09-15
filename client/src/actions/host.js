import axios from 'axios';
import states from 'us-state-converter';
import { setAlert } from './alert';
import { toTitleCase } from './app';

import {
    GET_ALL_HOSTS_EDIT,
    GET_HOST,
    GET_HOST_ME,
    GET_HOSTS,
    UPDATE_HOST,
    UPDATE_HOST_ME,
    UPDATE_HOST_TERMS_AGREEMENT,
    UPDATE_HOST_ERROR,
    HOST_ERROR,
    CLEAR_HOST,
    USER_LOADED,
    TOGGLE_HOST_ACTIVE_STATUS,
} from './types';

//Get all users
export const getAllHosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/hosts/edit');
        //res.data.avatar = await axios.get('/api/artists/my-avatar');

        dispatch({
            type: GET_ALL_HOSTS_EDIT,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: HOST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get current host's profile
export const getCurrentHost = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/hosts/me`);

        dispatch({
            type: GET_HOST_ME,
            payload: res.data,
        });
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        dispatch({
            type: HOST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

const sortStateCity = (a, b) => {
    const aState = states(a.state).name;
    const bState = states(b.state).name;
    const aCity = a.city;
    const bCity = b.city;

    if (bState === aState) {
        if (bCity > aCity) {
            return -1;
        } else if (bCity < aCity) {
            return 1;
        }
    } else if (bState > aState) {
        return -1;
    } else if (bState < aState) {
        return 1;
    }
    return 0;
};

// Get all hosts' locations
export const getHostsLocations = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/hosts/');

        const hostLocations = res.data;
        //console.log('getHostsLocations hostLocations', hostLocations);

        let hostProcessedLocations = hostLocations.reduce(
            (result, location) => {
                if (
                    location &&
                    location.city &&
                    location.state &&
                    states(location.state).name &&
                    location.zipCode
                ) {
                    const hostCityST = {};

                    hostCityST.city = toTitleCase(location.city.trim());
                    hostCityST.state = states(location.state).usps;
                    hostCityST.fullState = states(location.state).name;
                    hostCityST.zip = location.zipCode;
                    hostCityST.anonLatLong = location.anonLatLong;
                    result.push(hostCityST);
                }
                return result;
            },
            []
        );

        let hostFilteredLocations = hostProcessedLocations.filter(
            (value, index, self) =>
                index ===
                self.findIndex(
                    (t) => t.city === value.city && t.state === value.state
                )
        );

        let hostSortedLocations = hostFilteredLocations.sort((a, b) =>
            sortStateCity(a, b)
        );

        //console.log('hostSortedLocations', hostSortedLocations);

        dispatch({
            type: GET_HOSTS,
            payload: hostSortedLocations,
        });
    } catch (err) {
        dispatch({
            type: HOST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Create or update host
export const createMyHost =
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
                '/api/hosts/updateMe',
                formDataArray,
                config
            );
            dispatch({
                type: UPDATE_HOST_ME,
                payload: res.data.host,
            });
            dispatch({
                type: USER_LOADED,
                payload: res.data.user,
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
                type: UPDATE_HOST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };
// Agree to Terms
export const agreeToHostTerms =
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
                '/api/hosts/termsAgreement',
                formDataArray,
                config
            );
            console.log('agreedToHost res', res);
            dispatch({
                // type: UPDATE_HOST_ME,
                type: UPDATE_HOST_TERMS_AGREEMENT,
                payload: res.data.host,
            });
            //dispatch(setAlert(edit ? 'Artist Updated' : 'Artist Created', 'success')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        } catch (err) {
            // const errors = err.response.data.errors;
            console.log('error: ' + err);
            // if (errors) {
            //     errors.forEach((error) =>
            //         dispatch(setAlert(error.msg, 'danger'))
            //     );
            // }
            dispatch({
                type: UPDATE_HOST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };

// Toggle Host active status
export const toggleHostActiveStatus =
    (formData, history, edit = false) =>
    async (dispatch) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const formDataArray = [formData];
            // console.log('formDataArray', formDataArray);
            const res = await axios.post(
                '/api/hosts/updateMe',
                formDataArray,
                config
            );
            // console.log('toggleHostActiveStatus res', res);
            dispatch({
                type: TOGGLE_HOST_ACTIVE_STATUS,
                payload: res.data.host,
            });
        } catch (err) {
            const errors = err.response.data.errors;
            console.log('error: ' + err);
            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({
                type: UPDATE_HOST_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };

// Create or update host
export const unsubscribeHostDigest = (hostID, getTime) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const formDataArray = { getTime: getTime };
        const res = await axios.post(
            '/api/hosts/unsubscribe/' + hostID,
            formDataArray,
            config
        );

        console.log('DISPATCH:', res);
        // dispatch({
        //     type: UPDATE_HOST_ME,
        //     payload: res.data.host,
        // });
        // dispatch({
        //     type: USER_LOADED,
        //     payload: res.data.user,
        // });
        //dispatch(setAlert(edit ? 'Artist Updated' : 'Artist Created', 'success')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    } catch (err) {
        const errors = err.response.data.errors;
        console.log('error: ' + err);
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_HOST_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};
