import {
    HOST_RAISE_HAND,
    UPDATE_EVENT_ERROR,
    GET_EVENTS_OFFERED_TO_HOST,
    GET_THIS_ARTIST_BOOKING_EVENTS,
    GET_ALL_EVENTS,
    GET_THIS_ARTIST_EVENTS_OFFERS,
    ARTIST_VIEWED_HOST_OFFER,
    ARTIST_ACCEPTED_HOST_OFFER,
    EVENTS_ERROR,
    LOGOUT,
} from '../actions/types';

const initialState = {
    //myHostEvents: [],
    //myArtistEvents: [],
    events: [],
    loading: true,
    msg: {},
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_EVENTS_OFFERED_TO_HOST:
            return {
                ...state,
                myHostEvents: payload,
                loading: false,
            };
        case GET_THIS_ARTIST_BOOKING_EVENTS:
            return {
                ...state,
                events: payload,
                loading: false,
            };
        case GET_ALL_EVENTS:
            return {
                ...state,
                adminEvents: payload,
                loading: false,
            };
        case GET_THIS_ARTIST_EVENTS_OFFERS:
            return {
                ...state,
                myArtistEvents: payload,
                loading: false,
            };
        case ARTIST_VIEWED_HOST_OFFER:
        case ARTIST_ACCEPTED_HOST_OFFER:
            return {
                ...state,
                myArtistEvents: state.myArtistEvents.map((myArtistEvent) =>
                    myArtistEvent._id === payload._id ? payload : myArtistEvent
                ),
                loading: false,
            };
        case HOST_RAISE_HAND:
            return {
                ...state,
                myHostEvents: [...state.myHostEvents, payload],
                loading: false,
            };
        case UPDATE_EVENT_ERROR:
        case EVENTS_ERROR:
            return {
                ...state,
                error: payload,
                loading: false,
            };
        case LOGOUT:
            return {
                ...state,
                myArtistEvents: [],
                myHostEvents: [],
                adminEvents: [],
            };
        default:
            return state;
    }
}
