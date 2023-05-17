import {
    EDIT_ARTIST_EVENT,
    EDIT_HOST_EVENT,
    HOST_RAISE_HAND,
    HOST_PROPOSES,
    UPDATE_EVENT_ERROR,
    GET_EVENTS_OFFERED_TO_HOST,
    GET_EVENTS_NEAR_ME_TO_HOST,
    GET_EVENT_BY_ID,
    GET_THIS_ARTIST_BOOKING_EVENTS,
    GET_ALL_EVENTS,
    GET_THIS_ARTIST_EVENTS,
    ARTIST_VIEWED_HOST_OFFER,
    ARTIST_ACCEPTED_HOST_OFFER,
    EVENTS_ERROR,
    LOGOUT,
    DELETE_ARTIST_EVENT,
    DELETE_HOST_EVENT,
    DELETE_ADMIN_EVENT,
} from '../actions/types';

const initialState = {
    //myHostEvents: [],
    // myArtistEvents: [],
    events: [],
    loading: true,
    msg: {},
    error: {},
};

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_EVENTS_NEAR_ME_TO_HOST:
            return {
                ...state,
                nearMeToHost: payload,
                loading: false,
            };
        case GET_EVENT_BY_ID:
            let updateNearMeToHost = state.nearMeToHost.findIndex(
                (artistEvent) => artistEvent._id === payload._id
            ); //if -1 then insert
            console.log('updateNearMeToHost: ', updateNearMeToHost);
            return {
                ...state,
                nearMeToHost:
                    updateNearMeToHost > -1
                        ? state.nearMeToHost.map((myNearMeEvent) =>
                              myNearMeEvent._id === payload._id
                                  ? payload //updates an event in the state
                                  : myNearMeEvent
                          )
                        : [...state.nearMeToHost, payload], //inserts an event into the state
                loading: false,
            };

        case GET_EVENTS_OFFERED_TO_HOST:
        case EDIT_HOST_EVENT:
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
        case GET_THIS_ARTIST_EVENTS:
            return {
                ...state,
                myArtistEvents: payload,
                loading: false,
            };
        case EDIT_ARTIST_EVENT:
            let update = state.myArtistEvents.findIndex(
                (artistEvent) => artistEvent._id === payload._id
            ); //if -1 then insert
            console.log('update: ', update);
            return {
                ...state,
                myArtistEvents:
                    update > -1
                        ? state.myArtistEvents.map((myArtistEvent) =>
                              myArtistEvent._id === payload._id
                                  ? payload //updates an event in the state
                                  : myArtistEvent
                          )
                        : [...state.myArtistEvents, payload], //inserts an event into the state
                loading: false,
            };
        case ARTIST_VIEWED_HOST_OFFER:
        case ARTIST_ACCEPTED_HOST_OFFER:
            return {
                ...state,
                myArtistEvents: state.myArtistEvents.map(
                    (myArtistEvent) =>
                        myArtistEvent._id === payload._id
                            ? payload
                            : myArtistEvent //updates an event in the state
                ),
                loading: false,
            };
        case DELETE_ARTIST_EVENT:
            return {
                ...state,
                myArtistEvents: state.myArtistEvents.filter(
                    (myArtistEvent) =>
                        myArtistEvent._id !== payload && myArtistEvent //deletes an event from the state
                ),
                loading: false,
            };
        case DELETE_HOST_EVENT:
            return {
                ...state,
                myHostEvents: state.myHostEvents.filter(
                    (myHostEvent) => myHostEvent._id !== payload && myHostEvent //deletes an event from the state
                ),
                loading: false,
            };
        case DELETE_ADMIN_EVENT:
            return {
                ...state,
                adminEvents: state.adminEvents.filter(
                    (adminEvent) => adminEvent._id !== payload && adminEvent //deletes an event from the state
                ),
                loading: false,
            };
        case HOST_RAISE_HAND:
            let newNearMeToHost = state.nearMeToHost.filter(
                (eventNearMeToHost) => {
                    if (eventNearMeToHost._id !== payload._id) {
                        return eventNearMeToHost;
                    }
                }
            );
            console.log('newNearMeToHost', newNearMeToHost);
            return {
                ...state,
                myHostEvents: [...state.myHostEvents, payload],
                nearMeToHost: newNearMeToHost,

                loading: false,
            };
        case HOST_PROPOSES:
            return {
                ...state,
                myHostEvents: state.myHostEvents.map((myHostEvent) => {
                    if (myHostEvent._id === payload._id) {
                        return payload;
                    } else return myHostEvent;
                }),
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
                nearMeToHost: [],
                myArtistEvents: [],
                myHostEvents: [],
                adminEvents: [],
            };
        default:
            return state;
    }
}
