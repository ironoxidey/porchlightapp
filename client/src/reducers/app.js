import {
    OPEN_NAV_DRAWER,
    CLOSE_NAV_DRAWER,
    // OPEN_USER_DRAWER,
    // CLOSE_USER_DRAWER,
    IMAGE_UPLOAD,
    PAGE_LOAD,
    FLIP_ARTIST_CARD,
    CLEAR_ARTIST,
} from '../actions/types';

const intialState = {
    navDrawer: false,
    //userDrawer: false,
    pageTitle: '',
    artistCardFlip: false,
    doneFlipped: true,
    msg: '',
};

export default function (state = intialState, action) {
    const { type, payload } = action;
    switch (type) {
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

        default:
            return state;
    }
}
