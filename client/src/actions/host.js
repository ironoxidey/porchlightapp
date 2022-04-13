import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_HOST,
    GET_HOST_ME,
    GET_HOSTS,
    UPDATE_HOST,
    UPDATE_HOST_ME,
    UPDATE_HOST_ERROR,
    HOST_ERROR,
    CLEAR_HOST,
    USER_LOADED,
} from './types';

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

// Get all hosts
export const getHostsLocations = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/hosts');
        dispatch({
            type: GET_HOSTS,
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
