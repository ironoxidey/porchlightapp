import {
    GET_HOST_ME,
    GET_HOSTS,
    UPDATE_HOST_ME,
    UPDATE_HOST_ERROR,
    HOST_ERROR,
    LOGOUT,
} from '../actions/types';

const initialState = {
    me: null,
    hosts: [],
    loading: true,
    msg: {},
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_HOST_ME:
        case UPDATE_HOST_ME:
            return {
                ...state,
                me: payload,
                loading: false,
            };
        case GET_HOSTS:
            return {
                ...state,
                hosts: payload,
                loading: false,
            };
        case UPDATE_HOST_ERROR:
        case HOST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case LOGOUT:
            return {
                ...state,
                hosts: [],
                me: null,
            };
        default:
            return state;
    }
}