import {
	GET_ARTIST,
	GET_ARTIST_ME,
	ARTIST_ERROR,
	CLEAR_ARTIST,
	UPDATE_ARTIST,
	UPDATE_ARTIST_ME,
	GET_ARTISTS,
	LOGOUT,
	FLIP_ARTIST_CARD,
	ACCOUNT_DELETED,
} from '../actions/types';

const initialState = {
	me: null,
	artist: null,
	artists: [],
	loading: true,
	msg: {},
	error: {},
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_ARTIST:
		case FLIP_ARTIST_CARD:
			return {
				...state,
				artist: payload,
				loading: false,
			};
		case GET_ARTIST_ME:
		case UPDATE_ARTIST_ME:
			return {
				...state,
				me: payload,
				loading: false,
			};
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
				loading: false,
			};
		case ARTIST_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
				artist: null,
			};
		case CLEAR_ARTIST:
			return {
				...state,
				artist: null,
			};
		case LOGOUT:
		case ACCOUNT_DELETED:
			return {
				...state,
				artist: null,
				me: null,
			};
		default:
			return state;
	}
}
