import axios from 'axios';
import states from 'us-state-converter';
import React from 'react';

import {
    OPEN_NAV_DRAWER,
    CLOSE_NAV_DRAWER,
    // OPEN_USER_DRAWER,
    // CLOSE_USER_DRAWER,
    CLOSE_EVENT_EDIT_DRAWER,
    FLIP_ARTIST_CARD,
    CHANGE_HATS,
    JUMP_TO,
} from './types';
import { setAlert } from './alert';
import { updateUserAvatar } from './auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core'; //for checking the existence of an icon

import { Grid } from '@mui/material';

export const openNavDrawer = () => (dispatch) => {
    dispatch({
        type: OPEN_NAV_DRAWER,
    });
};

export const closeNavDrawer = () => (dispatch) => {
    dispatch({
        type: CLOSE_NAV_DRAWER,
    });
};
export const closeEventEditDrawer = (eventID) => (dispatch) => {
    dispatch({
        payload: eventID,
        type: CLOSE_EVENT_EDIT_DRAWER,
    });
};
export const changeHats = (toRole) => (dispatch) => {
    dispatch({
        payload: toRole,
        type: CHANGE_HATS,
    });
};
export const jumpTo = (anchor) => (dispatch) => {
    //console.log('jumpTo', anchor);
    dispatch({
        payload: anchor,
        type: JUMP_TO,
    });
};
// export const openUserDrawer = () => (dispatch) => {
//     dispatch({
//         type: OPEN_USER_DRAWER,
//     });
// };

// export const closeUserDrawer = () => (dispatch) => {
//     dispatch({
//         type: CLOSE_USER_DRAWER,
//     });
// };

export const flipArtistCard = (artist) => (dispatch) => {
    dispatch({
        type: FLIP_ARTIST_CARD,
        payload: artist,
    });
};

export const convert24HourTime = (time) => {
    var hours = time.substring(0, 2); // gives the value in 24 hours format
    var AmOrPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
    var minutes = time.substring(time.length - 2);
    var finalTime = hours + ':' + minutes + ' ' + AmOrPm;
    return finalTime;
};

export const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = match[1] ? '+1 ' : '';
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join(
            ''
        );
    }
    return null;
};

export const pullDomainFrom = (url) => {
    try {
        let theURL = new URL(url);
        //console.log('theURL.hostname: ' + theURL.hostname);
        let domain = theURL.hostname.split('.');
        let linkName = domain.slice(-(domain.length === 4 ? 3 : 2))[0];
        //console.log(linkName);

        if (domain) {
            return linkName;
        }
    } catch (err) {
        return '';
    }
};

export const StackDateforDisplay = (props) => {
    let theDate = new Date(props.date).toDateString().split(' ');
    return (
        <Grid
            item
            container
            className="dateStack"
            sx={{
                fontFamily: 'var(--secondary-font)',
                textTransform: 'uppercase',
                lineHeight: '1',
                textAlign: 'center',
                border: '1px solid var(--link-color)',
                width: '44px',
            }}
            direction="column"
        >
            <Grid
                className="weekday"
                item
                sx={{
                    color: 'var(--dark-color)',
                    backgroundColor: 'var(--link-color)',
                    margin: '0',
                    padding: '2px',
                }}
            >
                {theDate[0]}
            </Grid>
            <Grid
                className="month"
                item
                sx={{
                    marginTop: '4px',
                }}
            >
                {theDate[1]}
            </Grid>
            <Grid
                className="date"
                item
                sx={{
                    fontSize: '1.8em',
                    marginBottom: '-2px',
                }}
            >
                {theDate[2]}
            </Grid>
            <Grid
                item
                className="year"
                sx={{
                    color: 'var(--primary-color)',
                    fontSize: '.9em',
                    marginBottom: '4px',
                }}
            >
                {theDate[3]}
            </Grid>
        </Grid>
    );
};

// export const pullYouTubeEmbedCode = (url) => {
//     let theDomain = pullDomainFrom(url);
//     if (theDomain === 'youtube') {
//         let theSearchParams = new URL(url).search;
//         let theEmbedCode = new URLSearchParams(theSearchParams).get('v');
//         return theEmbedCode;
//     } else {
//         return url;
//     }
// };

// export const youTubeEmbed = (formInput) => {
//     try {
//         return (
//             <iframe
//                 style={{ margin: '8px auto' }}
//                 width="560"
//                 height="315"
//                 src={`https://www.youtube.com/embed/${pullYouTubeEmbedCode(
//                     formInput
//                 )}?rel=0`}
//                 title="YouTube video player"
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//             ></iframe>
//         );
//     } catch (err) {
//         console.log(err);
//     }
// };

export const getFontAwesomeIcon = (url, size = 'lg') => {
    let theDomain = pullDomainFrom(url);
    let isIcon = icon({
        prefix: 'fab',
        iconName: theDomain,
    }); //will return 'undefined' if no icon found
    if (isIcon) {
        return (
            <FontAwesomeIcon icon={['fab', theDomain]} size={size} fixedWidth />
        );
    } else {
        return (
            <FontAwesomeIcon
                icon={['fas', 'globe-americas']}
                size={size}
                fixedWidth
            />
        );
        //console.log('no icon for: ' + pullDomainFrom(url));
        return '';
    }
};

export const toTitleCase = (str) => {
    var i, j, str, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

    // Certain minor words should be left lowercase unless
    // they are the first or last words in the string
    lowers = [
        'A',
        'An',
        'The',
        'And',
        'But',
        'Or',
        'For',
        'Nor',
        'As',
        'At',
        'By',
        'For',
        'From',
        'In',
        'Into',
        'Near',
        'Of',
        'On',
        'Onto',
        'To',
        'With',
    ];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(
            new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function (txt) {
                return txt.toLowerCase();
            }
        );

    // Certain words such as initialisms or acronyms should be left uppercase
    uppers = ['Id', 'Tv'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(
            new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase()
        );

    return str;
};

export const sortDates = (a, b) => {
    if (b.when > a.when) {
        return -1;
    } else if (b.when < a.when) {
        return 1;
    }
    return 0;
};
