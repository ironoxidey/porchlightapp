import {
  GET_ARTIST,
  ARTIST_ERROR,
  CLEAR_ARTIST,
  UPDATE_ARTIST,
  GET_ARTISTS,
} from '../actions/types';

const initialState = {
  artist: null,
  artists: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_ARTIST:
    case UPDATE_ARTIST:
      return {
        ...state,
        artist: payload,
        loading: false,
      };
    case GET_ARTISTS:
      return {
        ...state,
        artists: payload,
        artist: null,
        loading: false
      }
    case ARTIST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        artist: null
      };
    case CLEAR_ARTIST:
      return {
        ...state,
        artist: null
      };
    default:
      return state;
  }
}