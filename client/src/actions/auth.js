import axios from 'axios';
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    FORGOTPASSWORD_SUCCESS,
    FORGOTPASSWORD_FAIL,
    RESETPASSWORD_SUCCESS,
    RESETPASSWORD_FAIL,
    USER_LOADED,
    USERS_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE,
    UPDATE_AVATAR,
    UPDATE_ERROR,
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Get all users
export const getAllUsers = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/users/edit');
        //res.data.avatar = await axios.get('/api/artists/my-avatar');

        dispatch({
            type: USERS_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

//Load User
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        //res.data.avatar = await axios.get('/api/artists/my-avatar');

        dispatch({
            type: USER_LOADED,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

//Register User
export const register =
    ({ name, email, password }) =>
    async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const body = JSON.stringify({ name, email, password });

        try {
            const res = await axios.post('/api/users', body, config);

            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data,
            });
            dispatch(loadUser());
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({ type: REGISTER_FAIL });
        }
    };

//Forgot Password
export const forgotPassword =
    ({ email }) =>
    async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const body = JSON.stringify({ email });

        try {
            const res = await axios.put(
                '/api/users/forgot-password',
                body,
                config
            );
            dispatch({
                type: FORGOTPASSWORD_SUCCESS,
                payload: res.data,
            });
            dispatch(setAlert(res.data, 'success'));
            //console.log('res.data: ' + res.data);
            // dispatch(setAlert(error.msg, 'success'));
        } catch (err) {
            //const errors = err.response.data.errors;
            //console.log('err: ' + err);
            // if (errors) {
            //   errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
            // }
            dispatch(setAlert(err.message, 'danger'));
            dispatch({
                type: FORGOTPASSWORD_FAIL,
                errors: err.message,
                rawErr: err,
                email: email,
            });
        }
    };

//Reset Password
export const resetPassword =
    ({ newPass, resetLink }) =>
    async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const body = JSON.stringify({ newPass, resetLink });

        try {
            const res = await axios.put(
                '/api/users/reset-password',
                body,
                config
            );

            dispatch({
                type: RESETPASSWORD_SUCCESS,
                payload: res.data,
            });
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({ type: RESETPASSWORD_FAIL });
        }
    };

//Update User Avatar
export const updateUserAvatar = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.put(
            '/api/users/update-avatar',
            formData,
            config
        );

        dispatch({
            type: UPDATE_AVATAR,
            payload: res.data.avatar,
        });

        dispatch(setAlert('User Avatar Updated', 'success')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

//Login User
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({ type: LOGIN_FAIL });
    }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
    setAuthToken();
    dispatch({
        type: CLEAR_PROFILE,
    });
    dispatch({
        type: LOGOUT,
    });
};
