import {
    GET_ALL_HOSTS_EDIT,
    TOGGLE_HOST_ADMIN_ACTIVE_STATUS,
    TOGGLE_HOST_ACTIVE_STATUS,
    TOGGLE_MY_HOST_ACTIVE_STATUS,
    GET_HOST_ME,
    GET_HOSTS,
    UPDATE_HOST_ME,
    UPDATE_HOST_TERMS_AGREEMENT,
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
    // console.log('host payload', payload);
    switch (type) {
        case GET_HOST_ME:
        case UPDATE_HOST_ME:

        case TOGGLE_MY_HOST_ACTIVE_STATUS:
            return {
                ...state,
                me: payload,
                loading: false,
            };
        case UPDATE_HOST_TERMS_AGREEMENT:
            return {
                ...state,
                me: {
                    ...state.me,
                    agreedToTerms: payload.agreedToTerms
                        ? payload.agreedToTerms
                        : false,
                },
                loading: false,
            };
        case GET_ALL_HOSTS_EDIT:
            return {
                ...state,
                hosts: payload,
                loading: false,
            };

        case TOGGLE_HOST_ACTIVE_STATUS:
        case TOGGLE_HOST_ADMIN_ACTIVE_STATUS:
            return {
                ...state,
                hosts: state.hosts.map((host) => {
                    if (host._id === payload._id) {
                        return {
                            ...host,
                            ...payload,
                        };
                    } else return host;
                }),
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
