import {
    OPEN_NAV_DRAWER,
    CLOSE_NAV_DRAWER,
    CLOSE_EVENT_EDIT_DRAWER,
    // OPEN_USER_DRAWER,
    // CLOSE_USER_DRAWER,
    IMAGE_UPLOAD,
    PAGE_LOAD,
    FLIP_ARTIST_CARD,
    CLEAR_ARTIST,
    JUMP_TO,
    CHANGE_HATS,
    LOGOUT,
    ACCOUNT_DELETED,
} from '../actions/types';

const intialState = {
    navDrawer: false,
    //userDrawer: false,
    pageTitle: '',
    artistCardFlip: false,
    doneFlipped: true,
    msg: '',
    profileHat: '',
    jumpTo: '',
    eventEditDrawer: '',
};

export default function (state = intialState, action) {
    const { type, payload } = action;
    switch (type) {
        case JUMP_TO:
            return {
                ...state,
                jumpTo: payload,
            };
        case CHANGE_HATS:
            return {
                ...state,
                profileHat: payload,
            };

        case FLIP_ARTIST_CARD:
            return {
                ...state,
                artistCardFlip: !state.artistCardFlip,
                doneFlipped: false,
            };
        case CLEAR_ARTIST:
            return {
                ...state,
                doneFlipped: true,
            };
        case OPEN_NAV_DRAWER:
            return {
                ...state,
                navDrawer: true,
            };
        case CLOSE_NAV_DRAWER:
            return {
                ...state,
                navDrawer: false,
            };
        case CLOSE_EVENT_EDIT_DRAWER:
            return {
                ...state,
                eventEditDrawer: payload,
            };
        // case OPEN_USER_DRAWER:
        //     return {
        //         ...state,
        //         userDrawer: true,
        //     };
        // case CLOSE_USER_DRAWER:
        //     return {
        //         ...state,
        //         userDrawer: false,
        //     };
        case IMAGE_UPLOAD:
            return {
                ...state,
                msg: payload.msg,
            };
        case PAGE_LOAD:
            return {
                ...state,
                pageTitle:
                    payload.pageTitle !== ''
                        ? payload.pageTitle + ' | Porchlight: Art + Hospitality'
                        : 'Porchlight: Art + Hospitality',
            };
        case LOGOUT:
        case ACCOUNT_DELETED:
            return {
                ...state,
                profileHat: '',
                eventEditDrawer: '',
            };

        default:
            return state;
    }
}
