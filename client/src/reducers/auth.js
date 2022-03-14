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
    ACCOUNT_DELETED,
    UPDATE_AVATAR,
    UPDATE_ERROR,
    USER_ROLE_UPDATED,
} from '../actions/types';

const intialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    users: [],
    user: null,
    resetSuccess: false,
    forgotSuccess: false,
    forgotMsg: '',
};

export default function (state = intialState, action) {
    const { type, payload } = action;
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
            };
        case USERS_LOADED:
            return {
                ...state,
                loading: false,
                users: payload,
            };
        case USER_ROLE_UPDATED:
            const updatedUsers = state.users.map((user) => {
                //adds the updated user (payload) to the users state depending on its _id
                return user._id === payload._id ? payload : user;
            });
            return {
                ...state,
                users: updatedUsers,
            };
        case UPDATE_AVATAR:
        case UPDATE_ERROR:
            return {
                ...state,
                user: {
                    ...state.user,
                    avatar: payload,
                },
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false,
                user: payload,
            };
        case REGISTER_FAIL:
        case RESETPASSWORD_FAIL:
        case FORGOTPASSWORD_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
        case ACCOUNT_DELETED:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                users: [],
                forgotMsg: payload,
            };

        case RESETPASSWORD_SUCCESS:
            return {
                ...state,
                resetSuccess: true,
            };

        case FORGOTPASSWORD_SUCCESS:
            return {
                ...state,
                forgotSuccess: true,
                forgotMsg: payload,
            };

        default:
            return state;
    }
}
