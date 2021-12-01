import {
    CALENDLY_ERROR,
    GET_CALENDLY_USER,
    GET_CALENDLY_SCHEDULED_EVENTS,
    GET_CALENDLY_EVENT_INVITEE,
  } from '../actions/types';
  
  const initialState = {
    calendly: null,
    events: null,
    invitees: null,
    loading: true,
    error: {},
  };
  
  export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
      case GET_CALENDLY_USER:
        return {
          ...state,
          calendly: payload,
          loading: false,
        };
      case GET_CALENDLY_SCHEDULED_EVENTS:
        return {
            ...state,
            events: payload,
            loading: false,
        };
      case GET_CALENDLY_EVENT_INVITEE:
        return {
            ...state,
            invitees: payload,
            loading: false,
        };
      case CALENDLY_ERROR:
        return {
            ...state,
            error: payload,
            loading: false,
        };
      default:
        return state;
    }
  }
  