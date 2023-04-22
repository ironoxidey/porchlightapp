import axios from 'axios';
import { setAlert } from './alert';

import {
    EDIT_ARTIST_EVENT,
    EDIT_HOST_EVENT,
    DELETE_ARTIST_EVENT,
    DELETE_HOST_EVENT,
    DELETE_ADMIN_EVENT,
    HOST_RAISE_HAND,
    HOST_PROPOSES,
    UPDATE_EVENT_ERROR,
    GET_EVENTS_OFFERED_TO_HOST,
    GET_EVENTS_NEAR_ME_TO_HOST,
    GET_THIS_ARTIST_BOOKING_EVENTS,
    GET_THIS_ARTIST_EVENTS,
    GET_ALL_EVENTS,
    ARTIST_VIEWED_HOST_OFFER,
    ARTIST_ACCEPTED_HOST_OFFER,
    EVENTS_ERROR,
    AUTH_ERROR,
} from './types';

//Create a host event by bookingWhen and bookingWhere
export const editHostEvent = (formData, history) => async (dispatch) => {
    try {
        //console.log('hostRaiseHand formData', formData);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.post('/api/events/hostEvent', formData, config);
        console.log('editHostEvent res.data', res.data);
        dispatch({
            type: EDIT_HOST_EVENT,
            payload: res.data,
        });
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
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

//Delete an admin event by id
export const deleteAdminEvent = (eventData) => async (dispatch) => {
    console.log('deleteAdminEvent eventData: ', eventData);
    try {
        const res = await axios.delete(
            `/api/events/adminEvent/${eventData._id}`,
            { data: eventData }
        );
        dispatch({
            type: DELETE_ADMIN_EVENT,
            payload: res.data,
        });
    } catch (err) {
        console.log('error: ' + err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

//Delete a host event by id
export const deleteHostEvent = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/events/hostEvent/${id}`);
        dispatch({
            type: DELETE_HOST_EVENT,
            payload: res.data,
        });
    } catch (err) {
        console.log('error: ' + err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

//Create an artist event by bookingWhen and bookingWhere
export const editArtistEvent = (formData, history) => async (dispatch) => {
    try {
        //console.log('hostRaiseHand formData', formData);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.post(
            '/api/events/artistEvent',
            formData,
            config
        );
        console.log('editArtistEvent res.data', res.data);
        dispatch({
            type: EDIT_ARTIST_EVENT,
            payload: res.data,
        });
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
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

//Delete an artist event by id
export const deleteArtistEvent = (id) => async (dispatch) => {
    //console.log('deleteArtistEvent id', id);
    try {
        const res = await axios.delete(`/api/events/artistEvent/${id}`);
        //console.log('hostRaiseHand res.data', res.data);
        dispatch({
            type: DELETE_ARTIST_EVENT,
            payload: res.data,
        });
    } catch (err) {
        console.log('error: ' + err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

// Get the events that I've offered to host
export const getMyEventsOfferedToHost = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/events/myEventsOfferedToHost`);
        //console.log('res', res);

        dispatch({
            type: GET_EVENTS_OFFERED_TO_HOST,
            payload: res.data,
        });
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        dispatch({
            type: EVENTS_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
// Get the events that I've offered to host
export const getEventsNearMeToHost = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/events/nearMeToHost`);
        dispatch({
            type: GET_EVENTS_NEAR_ME_TO_HOST,
            payload: res.data,
        });
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        dispatch({
            type: EVENTS_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
// Get the events that this artist is trying to book
export const getArtistBookingEvents = (artistSlug) => async (dispatch) => {
    try {
        const res = await axios.get(
            `/api/events/getArtistBooking/${artistSlug}`
        );
        dispatch({
            type: GET_THIS_ARTIST_BOOKING_EVENTS,
            payload: res.data,
        });
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        dispatch({
            type: EVENTS_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
//Get current user's artist's events where the hostsOfferingToBook has at least one index
export const getMyArtistEventsOffers = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/events/myArtistEvents/`);
        dispatch({
            type: GET_THIS_ARTIST_EVENTS,
            payload: res.data,
        });
    } catch (err) {
        //dispatch({ type: CLEAR_ARTIST });
        dispatch({
            type: EVENTS_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Offer to host a show
export const hostRaiseHand = (formData, history) => async (dispatch) => {
    try {
        //console.log('hostRaiseHand formData', formData);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.post(
            '/api/events/hostRaiseHand',
            formData,
            config
        );
        //console.log('hostRaiseHand res.data', res.data);
        dispatch({
            type: HOST_RAISE_HAND,
            payload: res.data,
        });
        dispatch(
            setAlert(
                'Your offer to host the show on ' +
                    new Date(formData.bookingWhen).toLocaleDateString(
                        undefined,
                        {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }
                    ) +
                    ' was submitted.',
                'success'
            )
        ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    } catch (err) {
        console.log('error: ' + err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

// Host submits proposal — update the status of the event in the database to PENDING, no longer DRAFT
export const hostProposes = (formData, history) => async (dispatch) => {
    try {
        //console.log('hostRaiseHand formData', formData);
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const res = await axios.post(
            '/api/events/hostProposes',
            formData,
            config
        );
        console.log('hostProposes res.data', res.data);
        dispatch({
            type: HOST_PROPOSES,
            payload: res.data,
        });
        dispatch(
            setAlert(
                'Your proposal to host the show on ' +
                    new Date(formData.bookingWhen).toLocaleDateString(
                        undefined,
                        {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }
                    ) +
                    ' was sent.',
                'success'
            )
        ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    } catch (err) {
        console.log('error: ' + err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: UPDATE_EVENT_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
        dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
    }
};

// Artist viewed Host's offer to book
export const artistViewedHostOffer =
    (theHost, theEvent, history) => async (dispatch) => {
        let formData = {
            bookingWhen: theEvent,
            offeringHost: { _id: theHost },
        };
        //console.log('artistViewedHostOffer formData', formData);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            //let formData = { ...theEvent, offeringHost: theHost };
            const res = await axios.post(
                '/api/events/artistViewedHostOffer',
                formData,
                config
            );
            //console.log('artistViewedHostOffer res.data:', res.data);
            dispatch({
                type: ARTIST_VIEWED_HOST_OFFER,
                payload: res.data,
            });
        } catch (err) {
            console.log('error: ' + err);
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({
                type: UPDATE_EVENT_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            //dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };

// Artist accepted Host's offer to book
export const artistAcceptOffer =
    (bookingWhen, theOffer, stageName, history) => async (dispatch) => {
        let formData = {
            bookingWhen: bookingWhen,
            offeringHost: { _id: theOffer.host._id },
            stageName: stageName,
        };
        console.log('artistAcceptOffer theOffer', theOffer);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            //let formData = { ...theEvent, offeringHost: theHost };
            const res = await axios.post(
                '/api/events/artistAcceptOffer',
                formData,
                config
            );
            //console.log('artistAcceptOffer res.data:', res.data);
            dispatch({
                type: ARTIST_ACCEPTED_HOST_OFFER,
                payload: res.data,
            });
            dispatch(
                setAlert(
                    'You accepted ' +
                        theOffer.host.firstName +
                        ' ' +
                        theOffer.host.lastName +
                        '’s offer to host your concert on ' +
                        new Date(formData.bookingWhen).toLocaleDateString(
                            undefined,
                            {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }
                        ) +
                        '. Someone will be in touch soon!',
                    'success'
                )
            ); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        } catch (err) {
            //console.log('error: ' + err);
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, 'danger'))
                );
            }
            dispatch({
                type: UPDATE_EVENT_ERROR,
                payload: {
                    msg: err.response.statusText,
                    status: err.response.status,
                },
            });
            //dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
        }
    };

//Get all events for [ADMIN, BOOKING]
export const getAllEvents = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/events/edit');
        //res.data.avatar = await axios.get('/api/artists/my-avatar');
        dispatch({
            type: GET_ALL_EVENTS,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};
