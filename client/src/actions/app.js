import states from 'us-state-converter';
import {
    OPEN_NAV_DRAWER,
    CLOSE_NAV_DRAWER,
    // OPEN_USER_DRAWER,
    // CLOSE_USER_DRAWER,
    FLIP_ARTIST_CARD,
} from './types';
import { setAlert } from './alert';
import { updateUserAvatar } from './auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icon } from '@fortawesome/fontawesome-svg-core'; //for checking the existence of an icon

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

export const pullDomainFrom = (url) => {
    try {
        let theURL = new URL(url);
        //console.log('theURL: ' + theURL);
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

export const pullYouTubeEmbedCode = (url) => {
    let theDomain = pullDomainFrom(url);
    if (theDomain === 'youtube') {
        let theSearchParams = new URL(url).search;
        let theEmbedCode = new URLSearchParams(theSearchParams).get('v');
        return theEmbedCode;
    } else {
        return url;
    }
};

export const youTubeEmbed = (formInput) => {
    try {
        return (
            <iframe
                style={{ margin: '8px auto' }}
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${pullYouTubeEmbedCode(
                    formInput
                )}?rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        );
    } catch (err) {
        console.log(err);
    }
};

export const getFontAwesomeIcon = (url) => {
    let theDomain = pullDomainFrom(url);
    let isIcon = icon({
        prefix: 'fab',
        iconName: theDomain,
    }); //will return 'undefined' if no icon found
    if (isIcon) {
        return (
            <FontAwesomeIcon icon={['fab', theDomain]} size="lg" fixedWidth />
        );
    } else {
        return (
            <FontAwesomeIcon
                icon={['fas', 'globe-americas']}
                size="lg"
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

export const getHostLocations = () => {
    //Host's locations as of Frebruary 3rd, 2022
    const hostLocations = [
        {
            submitted: '2021-07-22T02:41:02.000Z',
            city: 'Hattiesburg',
            state: 'Mississippi',
            zip: '39401',
        },
        {
            submitted: '2021-07-22T15:06:54.000Z',
            city: 'Shawnee',
            state: 'Oklahoma',
            zip: '74804',
        },
        {
            submitted: '2021-07-22T20:59:54.000Z',
            city: 'Birmingham',
            state: 'Alabama',
            zip: '35211',
        },
        {
            submitted: '2021-07-22T23:41:10.000Z',
            city: 'Fort worth',
            state: 'Texas',
            zip: '76112',
        },
        {
            submitted: '2021-07-23T04:09:25.000Z',
            city: 'Hico',
            state: 'West Virginia',
            zip: '25854',
        },
        {
            submitted: '2021-07-23T22:50:33.000Z',
            city: 'Belmont',
            state: 'North Carolina',
            zip: '28012',
        },
        {
            submitted: '2021-07-25T17:00:45.000Z',
            city: 'Pearland',
            state: 'Texas',
            zip: '77581',
        },
        {
            submitted: '2021-07-28T04:12:27.000Z',
            city: 'Dayton',
            state: 'Tennessee',
            zip: '37321',
        },
        {
            submitted: '2021-08-04T23:54:36.000Z',
            city: 'Northport',
            state: 'Alabama',
            zip: '35475',
        },
        {
            submitted: '2021-08-05T05:23:58.000Z',
            city: 'Frederick',
            state: 'Maryland',
            zip: '21702',
        },
        {
            submitted: '2021-08-05T06:48:40.000Z',
            city: 'Columbus',
            state: 'Ohio',
            zip: '43224',
        },
        {
            submitted: '2021-08-07T18:36:54.000Z',
            city: 'Weir',
            state: 'Mississippi',
            zip: '39772',
        },
        {
            submitted: '2021-08-13T02:24:41.000Z',
            city: 'Goffstown',
            state: 'New Hampshire',
            zip: '03045',
        },
        {
            submitted: '2021-08-16T07:33:11.000Z',
            city: 'Clovis',
            state: 'California',
            zip: '93611',
        },
        {
            submitted: '2021-08-16T23:04:58.000Z',
            city: 'Desoto',
            state: 'Texas',
            zip: '75115',
        },
        {
            submitted: '2021-08-19T00:42:39.000Z',
            city: 'Olathe',
            state: 'Kansas',
            zip: '66062',
        },
        {
            submitted: '2021-08-22T05:44:32.000Z',
            city: 'Atlanta',
            state: 'Georgia',
            zip: '30315',
        },
        {
            submitted: '2021-09-07T23:16:56.000Z',
            city: 'Chattanooga',
            state: 'Tennessee',
            zip: '37419',
        },
        {
            submitted: '2021-09-13T02:03:49.000Z',
            city: 'Rochester',
            state: 'New Hampshire',
            zip: '03867',
        },
        {
            submitted: '2021-09-15T19:20:44.000Z',
            city: 'Albuquerque',
            state: 'New Mexico',
            zip: '87109',
        },
        {
            submitted: '2021-09-21T01:20:02.000Z',
            city: 'Alpharetta',
            state: 'Georgia',
            zip: '30022',
        },
        {
            submitted: '2021-09-24T19:07:24.000Z',
            city: 'oconomowoc',
            state: 'wisconsin',
            zip: '53066',
        },
        {
            submitted: '2021-09-30T00:18:28.000Z',
            city: 'Dayton',
            state: 'Tennessee',
            zip: '37321',
        },
        {
            submitted: '2021-09-30T18:11:09.000Z',
            city: 'Knoxville',
            state: 'Tennessee',
            zip: '37922',
        },
        {
            submitted: '2021-10-05T15:49:33.000Z',
            city: 'Orlando',
            state: 'Florida',
            zip: '32828',
        },
        {
            submitted: '2021-10-06T20:37:32.000Z',
            city: 'Hume',
            state: 'California',
            zip: '93628',
        },
        {
            submitted: '2021-10-08T18:51:35.000Z',
            city: 'Norman',
            state: 'Oklahoma',
            zip: '73071',
        },
        {
            submitted: '2021-10-17T05:01:56.000Z',
            city: 'Greenbelt',
            state: 'Maryland',
            zip: '20770',
        },
        {
            submitted: '2021-11-04T23:53:59.000Z',
            city: 'Chelsea',
            state: 'Massachusetts',
            zip: '02150',
        },
        {
            submitted: '2021-11-05T01:06:44.000Z',
            city: 'Colorado springs',
            state: 'Colorado',
            zip: '80821',
        },
        {
            submitted: '2021-11-15T03:35:52.000Z',
            city: 'Rogers',
            state: 'Texas',
            zip: '76569',
        },
        {
            submitted: '2021-11-17T01:17:21.000Z',
            city: 'Avon',
            state: 'Colorado',
            zip: '81620',
        },
        {
            submitted: '2021-11-23T19:40:59.000Z',
            city: 'Indian Trail',
            state: 'North Carolina',
            zip: '28079',
        },
        {
            submitted: '2021-12-09T01:31:34.000Z',
            city: 'Pittsford, NY',
            state: 'New York',
            zip: '14534',
        },
        {
            submitted: '2021-12-09T08:37:00.000Z',
            city: 'Charles Town',
            state: 'West Virginia',
            zip: '25414',
        },
        {
            submitted: '2021-12-12T07:54:57.000Z',
            city: 'Raleigh',
            state: 'North Carolina',
            zip: '27612',
        },
        {
            submitted: '2021-12-12T21:54:00.000Z',
            city: 'Raleigh',
            state: 'North Carolina',
            zip: '27601',
        },
        {
            submitted: '2021-12-14T23:03:46.000Z',
            city: 'Orlando',
            state: 'Florida',
            zip: '32803',
        },
        {
            submitted: '2022-01-24T23:08:15.000Z',
            city: 'Liberty',
            state: 'Maine',
            zip: '04949',
        },
        {
            submitted: '2022-02-02T04:46:51.000Z',
            city: 'Crescent City',
            state: 'CA',
            zip: '95531',
        },
        {
            submitted: '2020-09-02T20:34:54.354Z',
            city: 'Colorado Springs',
            state: 'CO',
            zip: 80920,
        },
        {
            submitted: '2020-09-02T20:35:32.575Z',
            city: 'Austin',
            state: 'Texas',
            zip: 78739,
        },
        {
            submitted: '2020-09-02T20:51:16.443Z',
            city: 'Hot Springs',
            state: 'SD',
            zip: 57747,
        },
        {
            submitted: '2020-09-02T22:18:09.052Z',
            city: 'Austin',
            state: 'Texas',
            zip: 78737,
        },
        {
            submitted: '2020-09-02T23:22:21.412Z',
            city: 'Jefferson',
            state: 'Ohio',
            zip: 44047,
        },
        {
            submitted: '2020-09-02T23:52:34.878Z',
            city: 'Newnan',
            state: 'GA',
            zip: 30265,
        },
        {
            submitted: '2020-09-03T01:10:57.368Z',
            city: 'Blue Springs',
            state: 'Missouri',
            zip: 64015,
        },
        {
            submitted: '2020-09-03T03:47:25.380Z',
            city: 'Las Vegas',
            state: 'NV',
            zip: 89135,
        },
        {
            submitted: '2020-09-03T11:38:38.144Z',
            city: 'New Berlin',
            state: 'Wisconsin',
            zip: 53146,
        },
        {
            submitted: '2020-09-03T12:31:11.824Z',
            city: 'Dalton',
            state: 'Georgia',
            zip: 30720,
        },
        {
            submitted: '2020-09-03T18:51:47.221Z',
            city: 'Avon',
            state: 'CT',
            zip: '06001',
        },
        {
            submitted: '2020-09-04T01:55:28.442Z',
            city: 'Murfreesboro',
            state: 'Tennessee',
            zip: 37129,
        },
        {
            submitted: '2020-09-04T04:06:50.732Z',
            city: 'Bel Air',
            state: 'Maryland',
            zip: 21015,
        },
        {
            submitted: '2020-09-04T09:47:17.573Z',
            city: 'Mountain Lake',
            state: 'MN',
            zip: 56159,
        },
        {
            submitted: '2020-09-04T14:31:16.713Z',
            city: 'Columbus',
            state: 'Georgia',
            zip: 31904,
        },
        {
            submitted: '2020-09-04T18:54:00.759Z',
            city: 'westmont',
            state: 'il',
            zip: 60559,
        },
        {
            submitted: '2020-09-04T20:31:53.465Z',
            city: 'Matthews',
            state: 'NC',
            zip: 28105,
        },
        {
            submitted: '2020-09-05T11:08:34.656Z',
            city: 'West Sayville',
            state: 'NY',
            zip: 11796,
        },
        {
            submitted: '2020-09-05T11:59:27.788Z',
            city: 'Homer Glen',
            state: 'Illinois',
            zip: 60491,
        },
        {
            submitted: '2020-09-07T19:13:54.950Z',
            city: 'Orlando',
            state: 'Fl',
            zip: 32806,
        },
        {
            submitted: '2020-09-09T21:01:28.531Z',
            city: 'Peachtree Corners',
            state: 'GA',
            zip: 30092,
        },
        {
            submitted: '2020-09-09T21:04:39.963Z',
            city: 'Alameda',
            state: 'CA',
            zip: 94501,
        },
        {
            submitted: '2020-09-09T23:40:33.730Z',
            city: 'Warsaw',
            state: 'IN',
            zip: 46582,
        },
        {
            submitted: '2020-09-10T02:33:13.516Z',
            city: 'Suwanee',
            state: 'GA',
            zip: 30024,
        },
        {
            submitted: '2020-09-10T02:38:12.513Z',
            city: 'Washington',
            state: 'PA',
            zip: 15301,
        },
        {
            submitted: '2020-09-10T19:29:12.980Z',
            city: 'Rogers',
            state: 'AR',
            zip: 72756,
        },
        {
            submitted: '2020-09-10T20:07:31.703Z',
            city: 'Sugar Hill',
            state: 'GA',
            zip: 30518,
        },
        {
            submitted: '2020-09-10T20:43:28.967Z',
            city: 'Marietta',
            state: 'GA',
            zip: 30064,
        },
        {
            submitted: '2020-09-10T22:35:03.931Z',
            city: 'Eugene',
            state: 'OR',
            zip: 97403,
        },
        {
            submitted: '2020-09-13T21:25:10.333Z',
            city: 'DUBUQUE',
            state: 'Iowa',
            zip: 52001,
        },
        {
            submitted: '2020-09-15T12:58:18.030Z',
            city: 'Tyrone',
            state: 'Georgia',
            zip: 30290,
        },
        {
            submitted: '2020-09-19T14:56:07.664Z',
            city: 'Huntley',
            state: 'IL',
            zip: 60142,
        },
        {
            submitted: '2020-09-22T19:53:15.125Z',
            city: 'Bellingham',
            state: 'WA',
            zip: 98226,
        },
        {
            submitted: '2020-09-22T22:01:56.120Z',
            city: 'Homewood',
            state: 'IL',
            zip: 60430,
        },
        {
            submitted: '2020-09-22T22:10:12.603Z',
            city: 'Wyanet',
            state: 'IL',
            zip: 61379,
        },
        {
            submitted: '2020-09-23T00:14:41.253Z',
            city: 'Libertyville',
            state: 'IL',
            zip: 60048,
        },
        {
            submitted: '2020-09-24T14:15:38.976Z',
            city: 'Indianapolis',
            state: 'IN',
            zip: 46220,
        },
        {
            submitted: '2020-09-25T18:30:54.207Z',
            city: 'Newton',
            state: 'North Carolina',
            zip: 28658,
        },
        {
            submitted: '2020-09-25T18:59:07.619Z',
            city: 'oakland',
            state: 'CA',
            zip: 94606,
        },
        {
            submitted: '2020-09-30T21:08:27.803Z',
            city: 'Cumming',
            state: 'GA',
            zip: 30028,
        },
        {
            submitted: '2020-09-30T22:33:54.725Z',
            city: 'Asheville',
            state: 'NC',
            zip: 28806,
        },
        {
            submitted: '2020-10-02T22:13:54.834Z',
            city: 'Queen Creek',
            state: 'AZ',
            zip: 85142,
        },
        {
            submitted: '2020-10-03T01:45:06.999Z',
            city: 'Harrisonburg',
            state: 'Virginia',
            zip: 22801,
        },
        {
            submitted: '2020-10-03T23:14:15.956Z',
            city: 'Grand Rapids',
            state: 'MI',
            zip: 49503,
        },
        {
            submitted: '2020-10-06T21:46:25.139Z',
            city: 'Oconomowoc',
            state: 'WI',
            zip: 53066,
        },
        {
            submitted: '2020-10-07T13:23:25.612Z',
            city: 'Charlotte',
            state: 'NC',
            zip: 28227,
        },
        {
            submitted: '2020-10-09T21:21:18.249Z',
            city: 'Ramah',
            state: 'CO',
            zip: 80832,
        },
        {
            submitted: '2020-10-15T23:16:58.191Z',
            city: 'Alton Bay',
            state: 'NH',
            zip: '03810',
        },
        {
            submitted: '2020-10-16T05:41:19.133Z',
            city: 'Wichita',
            state: 'KS',
            zip: 67209,
        },
        {
            submitted: '2020-10-19T02:26:12.445Z',
            city: 'Colorado Springs',
            state: 'CO',
            zip: 80921,
        },
        {
            submitted: '2020-10-23T04:08:40.037Z',
            city: 'Sugar Hill',
            state: 'GA',
            zip: 30518,
        },
        {
            submitted: '2020-10-26T14:31:47.908Z',
            city: 'Greenville',
            state: 'South Carolina',
            zip: 29611,
        },
        {
            submitted: '2020-11-02T21:18:59.833Z',
            city: 'Richmond',
            state: 'TX',
            zip: 77407,
        },
        {
            submitted: '2020-11-04T13:50:36.672Z',
            city: 'St. Paul',
            state: 'MN',
            zip: 55113,
        },
        {
            submitted: '2020-11-06T02:01:14.301Z',
            city: 'Hollywood',
            state: 'CA',
            zip: 90028,
        },
        {
            submitted: '2020-11-06T03:00:49.454Z',
            city: 'Dayton',
            state: 'TN',
            zip: 37321,
        },
        {
            submitted: '2020-11-06T14:59:54.960Z',
            city: 'Norman',
            state: 'Oklahoma',
            zip: 73072,
        },
        {
            submitted: '2020-11-12T12:41:23.046Z',
            city: 'Columbus',
            state: 'OH',
            zip: 43085,
        },
        {
            submitted: '2020-11-12T16:17:44.893Z',
            city: 'Westboro',
            state: 'WI',
            zip: 54490,
        },
        {
            submitted: '2020-11-12T19:20:24.812Z',
            city: 'Cheverly',
            state: 'MD',
            zip: 20785,
        },
        {
            submitted: '2020-11-17T14:38:12.918Z',
            city: 'Round Rock',
            state: 'TX',
            zip: 78681,
        },
        {
            submitted: '2020-11-18T17:30:02.780Z',
            city: 'Durham',
            state: 'NC',
            zip: 27701,
        },
        {
            submitted: '2020-11-19T21:12:11.154Z',
            city: 'Burlington',
            state: 'North Carolina',
            zip: 27217,
        },
        {
            submitted: '2020-11-20T17:58:41.275Z',
            city: 'Dallas',
            state: 'Texas',
            zip: 75214,
        },
        {
            submitted: '2020-11-23T15:38:23.421Z',
            city: 'Madison',
            state: 'WI',
            zip: 53704,
        },
        {
            submitted: '2021-01-05T15:10:39.999Z',
            city: 'Richmond',
            state: 'Virginia',
            zip: 23222,
        },
        {
            submitted: '2021-01-19T16:33:14.761Z',
            city: 'Memphis',
            state: 'TN',
            zip: 38018,
        },
        {
            submitted: '2021-01-19T21:46:30.785Z',
            city: 'Memphis',
            state: 'TN',
            zip: 38103,
        },
        {
            submitted: '2021-01-25T18:58:18.655Z',
            city: 'Dayton',
            state: 'TN',
            zip: 37321,
        },
        {
            submitted: '2021-02-03T02:56:01.707Z',
            city: 'Fort Collins',
            state: 'CO',
            zip: 80524,
        },
        {
            submitted: '2021-02-03T22:49:45.181Z',
            city: 'SAINT CLOUD',
            state: 'MN',
            zip: 56304,
        },
        {
            submitted: '2021-02-17T10:55:51.534Z',
            city: 'Cleveland',
            state: 'TN',
            zip: 37323,
        },
        {
            submitted: '2021-03-08T20:30:44.282Z',
            city: 'Portland',
            state: 'ME',
            zip: '04101',
        },
        {
            submitted: '2021-03-10T16:20:46.582Z',
            city: 'Austin',
            state: 'TX',
            zip: 78746,
        },
        {
            submitted: '2021-03-13T23:17:52.989Z',
            city: 'Ramah',
            state: 'CO',
            zip: 80832,
        },
        {
            submitted: '2021-03-15T02:34:25.436Z',
            city: 'Nashville',
            state: 'TN',
            zip: 37220,
        },
        {
            submitted: '2021-03-15T22:10:22.299Z',
            city: 'Peyton',
            state: 'Colorado',
            zip: 80831,
        },
        {
            submitted: '2021-03-16T03:13:32.994Z',
            city: 'Clarksville',
            state: 'TN',
            zip: 37043,
        },
        {
            submitted: '2021-03-16T21:39:47.171Z',
            city: 'Nashville',
            state: 'TN',
            zip: 37221,
        },
        {
            submitted: '2021-03-19T16:07:06.787Z',
            city: 'Hendersonville',
            state: 'TN',
            zip: 37075,
        },
        {
            submitted: '2021-03-24T19:18:06.174Z',
            city: 'Harleysville',
            state: 'PA',
            zip: 19438,
        },
        {
            submitted: '2021-03-30T05:05:06.651Z',
            city: 'Speedwell',
            state: 'TN',
            zip: 37870,
        },
        {
            submitted: '2021-03-31T16:46:04.450Z',
            city: 'Canton',
            state: 'GA',
            zip: 30114,
        },
        {
            submitted: '2021-04-07T14:23:44.470Z',
            city: 'Savannah',
            state: 'GA',
            zip: 31419,
        },
        {
            submitted: '2021-04-12T15:37:02.571Z',
            city: 'Opelika',
            state: 'AL',
            zip: 36801,
        },
        {
            submitted: '2021-04-13T19:09:30.274Z',
            city: 'Fort Collins',
            state: 'Colorado',
            zip: 80524,
        },
        {
            submitted: '2021-04-16T23:54:54.856Z',
            city: 'Austin',
            state: 'TX',
            zip: 78717,
        },
        {
            submitted: '2021-04-19T19:02:49.754Z',
            city: 'Littleton',
            state: 'Colorado',
            zip: 80128,
        },
        {
            submitted: '2021-04-19T19:05:41.878Z',
            city: 'Culver City',
            state: 'CA',
            zip: 90232,
        },
        {
            submitted: '2021-04-19T19:44:30.455Z',
            city: 'Covington',
            state: 'Georgia',
            zip: 30014,
        },
        {
            submitted: '2021-04-19T19:51:22.618Z',
            city: 'Woodbury',
            state: 'MN',
            zip: 55125,
        },
        {
            submitted: '2021-04-21T17:43:26.472Z',
            city: 'Boulder',
            state: 'CO',
            zip: 80302,
        },
        {
            submitted: '2021-04-22T18:08:44.159Z',
            city: 'Grove City',
            state: 'PA',
            zip: 16127,
        },
        {
            submitted: '2021-04-24T01:38:05.296Z',
            city: 'Harpers Ferry',
            state: 'WV',
            zip: 25425,
        },
        {
            submitted: '2021-04-24T12:15:03.157Z',
            city: 'West Chester',
            state: 'Ohio',
            zip: 45069,
        },
        {
            submitted: '2021-04-26T21:44:12.214Z',
            city: 'Federal Way',
            state: 'WA',
            zip: 98003,
        },
        {
            submitted: '2021-04-28T17:57:43.851Z',
            city: 'Fayetteville',
            state: 'GA',
            zip: 30214,
        },
        {
            submitted: '2021-04-30T16:52:52.405Z',
            city: 'Rock Hill',
            state: 'SC',
            zip: 29730,
        },
        {
            submitted: '2021-05-08T14:49:16.304Z',
            city: 'Raleigh',
            state: 'NC',
            zip: 27615,
        },
        {
            submitted: '2021-05-10T15:41:53.540Z',
            city: 'Dadeville',
            state: 'AL',
            zip: 36853,
        },
        {
            submitted: '2021-05-10T19:21:25.800Z',
            city: 'Waverly',
            state: 'AL',
            zip: 36879,
        },
        {
            submitted: '2021-05-12T16:22:55.386Z',
            city: 'Gig Harbor',
            state: 'WA',
            zip: 98329,
        },
        {
            submitted: '2021-05-14T21:31:55.551Z',
            city: 'Nashville',
            state: 'TN',
            zip: 37206,
        },
        {
            submitted: '2021-05-15T17:49:01.872Z',
            city: 'Strasburg',
            state: 'PA',
            zip: 17579,
        },
        {
            submitted: '2021-05-21T16:47:12.240Z',
            city: 'Dallas',
            state: 'GA',
            zip: 30132,
        },
        {
            submitted: '2021-05-23T18:02:15.215Z',
            city: 'Midway',
            state: 'Kentucky',
            zip: 40347,
        },
        {
            submitted: '2021-05-26T16:42:34.142Z',
            city: 'Denver',
            state: 'CO',
            zip: 80219,
        },
        {
            submitted: '2021-05-29T21:04:14.655Z',
            city: 'Nashville',
            state: 'TN',
            zip: 37205,
        },
        {
            submitted: '2021-05-29T21:06:34.408Z',
            city: 'Dodgeville',
            state: 'WI',
            zip: 53533,
        },
        {
            submitted: '2021-05-29T21:47:03.069Z',
            city: 'Evansville',
            state: 'IN',
            zip: 47715,
        },
        {
            submitted: '2021-05-29T21:48:03.784Z',
            city: 'Herrin',
            state: 'IL',
            zip: 62948,
        },
        {
            submitted: '2021-05-29T21:48:16.398Z',
            city: 'Marion',
            state: 'Illinois',
            zip: 62959,
        },
        {
            submitted: '2021-05-29T21:59:00.227Z',
            city: 'Webster',
            state: 'Fl',
            zip: 33597,
        },
        {
            submitted: '2021-05-29T22:10:01.853Z',
            city: 'Cary',
            state: 'NC',
            zip: 27511,
        },
        {
            submitted: '2021-05-29T22:31:08.599Z',
            city: 'Murfreesboro',
            state: 'Tn',
            zip: 37129,
        },
        {
            submitted: '2021-05-29T23:56:21.672Z',
            city: 'Hastings',
            state: 'Michigan',
            zip: 49058,
        },
        {
            submitted: '2021-05-31T14:29:58.472Z',
            city: 'Washougal',
            state: 'WA',
            zip: 98671,
        },
        {
            submitted: '2021-06-02T17:59:43.718Z',
            city: 'Pensacola',
            state: 'Florida',
            zip: 32503,
        },
        {
            submitted: '2021-06-02T21:04:43.574Z',
            city: 'Madison',
            state: 'Alabama',
            zip: 35757,
        },
        {
            submitted: '2021-06-03T15:08:18.616Z',
            city: 'South Jordan',
            state: 'UT',
            zip: 84009,
        },
        {
            submitted: '2021-06-03T19:13:04.422Z',
            city: 'Knoxville',
            state: 'TN',
            zip: 37918,
        },
        {
            submitted: '2021-06-11T05:24:47.107Z',
            city: 'Hoover',
            state: 'Alabama',
            zip: 35226,
        },
        {
            submitted: '2021-06-13T20:08:33.797Z',
            city: 'Marion',
            state: 'IN',
            zip: 46953,
        },
        {
            submitted: '2021-06-16T14:08:53.890Z',
            city: 'ITHACA',
            state: 'NY',
            zip: 14850,
        },
        {
            submitted: '2021-06-19T20:14:06.003Z',
            city: 'Candler',
            state: 'NC',
            zip: 28715,
        },
        {
            submitted: '2021-06-22T19:04:55.421Z',
            city: 'Rochester',
            state: 'NY',
            zip: 14618,
        },
        {
            submitted: '2021-06-23T17:41:13.725Z',
            city: 'Flippin',
            state: 'Arkansas',
            zip: 72634,
        },
        {
            submitted: '2021-06-26T17:47:38.549Z',
            city: 'Evensville',
            state: 'TN',
            zip: 37332,
        },
        {
            submitted: '2021-06-30T16:00:33.075Z',
            city: 'Milpitas',
            state: 'CA',
            zip: 95035,
        },
        {
            submitted: '2021-07-01T16:29:50.264Z',
            city: 'Scotts Valley',
            state: 'CA',
            zip: 95066,
        },
        {
            submitted: '2021-07-01T17:51:29.710Z',
            city: 'Fullerton',
            state: 'CA',
            zip: 92832,
        },
        {
            submitted: '2021-07-02T11:25:22.850Z',
            city: 'River Falls',
            state: 'WI',
            zip: 54023,
        },
        {
            submitted: '2021-07-03T05:41:53.896Z',
            city: 'Tacoma',
            state: 'WA',
            zip: 98422,
        },
        {
            submitted: '2021-07-03T15:03:09.401Z',
            city: 'Overland Park',
            state: 'Kansas',
            zip: 66212,
        },
        {
            submitted: '2021-07-03T22:09:22.879Z',
            city: 'Ardmore',
            state: 'TN',
            zip: 38449,
        },
        {
            submitted: '2021-07-05T16:58:17.131Z',
            city: 'Kettering',
            state: 'OH',
            zip: 45429,
        },
        {
            submitted: '2021-07-05T22:50:25.885Z',
            city: 'North Aurora',
            state: 'IL',
            zip: 60542,
        },
        {
            submitted: '2021-07-07T19:20:46.024Z',
            city: 'Dayton',
            state: 'Tennessee',
            zip: 37321,
        },
        {
            submitted: '2021-07-09T17:15:34.444Z',
            city: 'Tyler',
            state: 'TX',
            zip: 75703,
        },
        {
            submitted: '2021-07-12T14:37:45.336Z',
            city: 'Tyler',
            state: 'Texas',
            zip: 75702,
        },
        {
            submitted: '2021-07-14T22:14:54.954Z',
            city: 'Scotts Valley',
            state: 'CA',
            zip: 95066,
        },
        {
            submitted: '2021-07-19T14:21:35.460Z',
            city: 'Gore Springs',
            state: 'Mississippi',
            zip: 38929,
        },
        {
            submitted: '2021-07-21T21:54:53.196Z',
            city: 'Santa Fe',
            state: 'NM',
            zip: 87506,
        },
        {
            submitted: '2021-08-06T15:42:54.515Z',
            city: 'Harrisburg',
            state: 'PA',
            zip: 17102,
        },
        {
            submitted: '2021-08-20T23:44:15.424Z',
            city: 'Carbondale',
            state: 'IL',
            zip: 62903,
        },
    ];

    //console.log(hostLocations);

    const sortStateCity = (a, b) => {
        const aState = states(a.state).name;
        const bState = states(b.state).name;
        const aCity = a.city;
        const bCity = b.city;

        if (bState === aState) {
            if (bCity > aCity) {
                return -1;
            } else if (bCity < aCity) {
                return 1;
            }
        } else if (bState > aState) {
            return -1;
        } else if (bState < aState) {
            return 1;
        }
        return 0;
    };

    let hostProcessedLocations = hostLocations.map((location, index) => {
        const hostCityST = {};
        hostCityST.city = toTitleCase(location.city);
        hostCityST.state = states(location.state).usps;
        hostCityST.fullState = states(location.state).name;
        hostCityST.zip = location.zip;
        return hostCityST;
    });

    let hostFilteredLocations = hostProcessedLocations.filter(
        (value, index, self) =>
            index ===
            self.findIndex(
                (t) => t.city === value.city && t.state === value.state
            )
    );

    let hostSortedLocations = hostFilteredLocations.sort((a, b) =>
        sortStateCity(a, b)
    );
    return hostSortedLocations;
};
