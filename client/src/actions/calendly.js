import axios from 'axios';
import { setAlert } from './alert';

import { GET_CALENDLY_USER, GET_CALENDLY_SCHEDULED_EVENTS, GET_CALENDLY_EVENT_INVITEE, CALENDLY_ERROR, REFRESH_CALENDLY, UPDATE_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, ACCOUNT_DELETED } from './types';

// Get User Info
export const getCalendlyUserInfo = (accessToken) => async (dispatch) => {
    try {
        //console.log(accessToken);
      const calendlyRequest = axios.create({
        baseURL: 'https://api.calendly.com',
      }); 
      const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
      };
      const res = await calendlyRequest.get('/users/me', config);
      //console.log(res);
      dispatch({
        type: GET_CALENDLY_USER,
        payload: res,
      });
      //return res; //I don't know if this will work, but I need the function to return the access token for CalendlyService.js to try again after an auth error
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: CALENDLY_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
};

// Get Scheduled Events
export const getCalendlyScheduledEvents = (accessToken, userUri, count) => async (dispatch) => {
    try {
        //console.log(accessToken);
      const calendlyRequest = axios.create({
        baseURL: 'https://api.calendly.com',
      }); 
      const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
      };

      let queryParams = [
        `user=${userUri}`,
        `count=${count || 99}`,
        `sort=start_time:desc`
      ].join('&');

      const res = await calendlyRequest.get(`/scheduled_events?${queryParams}`, config);
      //console.log(res);
      dispatch({
        type: GET_CALENDLY_SCHEDULED_EVENTS,
        payload: res,
      });
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: CALENDLY_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
};

// Get Event Invitee
export const getCalendlyEventInvitee = (accessToken, eventUri) => async (dispatch) => {
    try {
        //console.log(accessToken);
      const calendlyRequest = axios.create({
        baseURL: eventUri,
      }); 
      const config = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
      };

      const res = await calendlyRequest.get(`/invitees`, config);
      //console.log(res);
      dispatch({
        type: GET_CALENDLY_EVENT_INVITEE,
        payload: res,
      });
    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }
      dispatch({
        type: CALENDLY_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
};

// Add Calendly Auth Code
export const addCalendlyAuthCode = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/api/users/calendlyAuth', formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert('Calendly Added', 'success')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Refresh Calendly Auth
export const refreshCalendlyAuth = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const res = await axios.post('/api/users/calendlyRefresh', config);
    dispatch({
      type: REFRESH_CALENDLY, //Need to add this to a reducer!!!
      payload: res.data,
    });
    return res.data; //I don't know if this will work, but I need the function to return the access token to try again after an auth error
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};