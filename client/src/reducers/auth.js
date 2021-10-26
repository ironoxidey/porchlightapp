import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  FORGOTPASSWORD_SUCCESS,
  FORGOTPASSWORD_FAIL,
  RESETPASSWORD_SUCCESS,
  RESETPASSWORD_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from '../actions/types';

const intialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  resetSuccess: false,
  forgotSuccess: false
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
      };

    case RESETPASSWORD_SUCCESS:
      return {
        ...state,
        resetSuccess: true
      }

    case FORGOTPASSWORD_SUCCESS:
      return {
        ...state,
        forgotSuccess: true
      }

    default:
      return state;
  }
}
