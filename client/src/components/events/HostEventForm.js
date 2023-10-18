//copied from ArtistEventForm.js from EditArtistBookingForm.js
import states from 'us-state-converter';

import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { IMAGE_UPLOAD, UPDATE_ARTIST_ME } from '../../actions/types';
import { setAlert } from '../../actions/alert';
import { StackDateforDisplay } from '../../actions/app';
import { editHostEvent } from '../../actions/event';
import {
    TextField,
    //Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    //Select,
    //InputLabel,
    //MenuItem,
    InputAdornment,
    //IconButton,
    Grid,
    Box,
    //Paper,
    //BottomNavigationAction,
    // BottomNavigation,
    Autocomplete,
    Chip,
    // withStyles,
    Typography,
    Tooltip,
    Avatar,
} from '@mui/material';
//import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';
import Button from '../layout/SvgButton';

import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import SendIcon from '@mui/icons-material/Send';

//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';
import { textAlign } from '@mui/system';

import {
    getFontAwesomeIcon,
    sortDates,
    jumpTo,
    toTitleCase,
} from '../../actions/app';
//import { ProfileAvatar } from '../../common/components';
import { getHostsLocations } from '../../actions/host';
import { getArtists } from '../../actions/artist';
import { hostProposes } from '../../actions/event';
import moment from 'moment';
import ReactPlayer from 'react-player/lazy';

// import EventDetails from './EventDetails';
// import HostEventDetails from './HostEventDetails';
import HostProfile from '../hosts/HostProfile';
import HostTermsAgreement from '../hosts/HostTermsAgreement';
import GoogleMapForHosts from '../layout/GoogleMapForHosts';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

//filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), []);

const UploadInput = styled('input')({
    display: 'none',
});

const prettifyDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
    });
};

const HostEventForm = ({
    hostMe,
    theEvent,
    editHostEvent,
    getHostsLocations,
    getArtists,
    hostProposes,
    artists,
    hosts,
    history,
    auth,
    myHostEvents, //for disabling dates in the multipledate picker calendar
    jumpTo,
    jumpToState, //user can click Edit Tooltip in EventDetails and jumpToState formField here
    setDrawerOpen, //to close the drawer after the proposal has been sent
}) => {
    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    const dispatch = useDispatch();

    let isMe = false;
    if (
        hostMe &&
        theEvent &&
        theEvent.confirmedHost &&
        hostMe._id === theEvent.confirmedHost
    ) {
        isMe = true;
    }

    useEffect(() => {
        getArtists(true);
    }, []);

    useEffect(() => {
        getHostsLocations();
    }, []);

    const [formData, setFormData] = useState({
        status: 'DRAFT',
        createdBy: 'HOST',
        promotionApproval: '',
        tourVibe: [],
        preferredArtists: [],
        bookingWhen: '',
        bookingWhere: {},
        showSchedule: {
            setupTime: '17:45',
            startTime: '19:00',
            doorsOpen: '18:30',
            hardWrap: '21:00',
            flexible: true,
        },
        overnight: '',
        openers: '',
        hangout: '',
        merchTable: false,
        familyFriendly: false,
        alcohol: false,
        soundSystem: '',
        agreeToPayAdminFee: false,
        agreeToPromote: false,
        hostNotes: '',
        hostUpdated: new Date(),

        offersFromHosts: [],

        //from EventSpecificHostForm.js
        refreshments: '',
        houseRules: '',
        eventbritePublicAddress: '',
        additionalRequests: '',
        guaranteeHonorarium: '',
        honorariumAmount: '',
        extraClarification: '',
        seatingProvided: '',
    });

    useEffect(() => {
        if (theEvent) {
            //console.log('theEvent.offersFromHosts', theEvent.offersFromHosts);
            setFormData({
                status: loading || !theEvent.status ? '' : theEvent.status,
                createdBy: 'HOST',
                promotionApproval:
                    loading || !theEvent.promotionApproval
                        ? ''
                        : theEvent.promotionApproval,
                tourVibe:
                    loading || !theEvent.tourVibe ? [] : theEvent.tourVibe,
                preferredArtists:
                    loading || !theEvent.preferredArtists
                        ? []
                        : theEvent.preferredArtists,
                bookingWhen:
                    loading || !theEvent.bookingWhen
                        ? ''
                        : theEvent.bookingWhen,
                bookingWhere:
                    loading || !hostMe.city || !hostMe.state
                        ? {}
                        : {
                              city: toTitleCase(hostMe.city),
                              state: states(hostMe.state).usps,
                              fullState: states(hostMe.state).name,
                              zip: hostMe.zipCode,
                          },
                showSchedule:
                    loading || !theEvent.showSchedule
                        ? {
                              setupTime: '17:45',
                              startTime: '19:00',
                              doorsOpen: '18:30',
                              hardWrap: '21:00',
                              flexible: true,
                          }
                        : theEvent.showSchedule,
                overnight:
                    loading || !theEvent.overnight ? '' : theEvent.overnight,
                openers: loading || !theEvent.openers ? '' : theEvent.openers,

                hangout:
                    loading || theEvent.hangout == null
                        ? false
                        : theEvent.hangout,
                merchTable:
                    loading || theEvent.merchTable == null
                        ? false
                        : theEvent.merchTable,
                familyFriendly:
                    loading || theEvent.familyFriendly == null
                        ? false
                        : theEvent.familyFriendly,
                alcohol:
                    loading || theEvent.alcohol == null
                        ? false
                        : theEvent.alcohol,
                soundSystem:
                    loading || !theEvent.soundSystem
                        ? ''
                        : theEvent.soundSystem,
                agreeToPromote:
                    loading || theEvent.agreeToPromote == null
                        ? false
                        : theEvent.agreeToPromote,
                hostNotes:
                    loading || !theEvent.hostNotes ? '' : theEvent.hostNotes,
                hostUpdated: new Date(),

                refreshments:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].refreshments
                        ? ''
                        : theEvent.offersFromHosts[0].refreshments,
                houseRules:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].houseRules
                        ? ''
                        : theEvent.offersFromHosts[0].houseRules,
                eventbritePublicAddress:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].eventbritePublicAddress
                        ? ''
                        : theEvent.offersFromHosts[0].eventbritePublicAddress,
                additionalRequests:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].additionalRequests
                        ? ''
                        : theEvent.offersFromHosts[0].additionalRequests,

                offersFromHosts:
                    !loading ||
                    (theEvent.offersFromHosts &&
                        theEvent.offersFromHosts.length < 1)
                        ? []
                        : theEvent.offersFromHosts,

                guaranteeHonorarium:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].guaranteeHonorarium
                        ? ''
                        : theEvent.offersFromHosts[0].guaranteeHonorarium,
                honorariumAmount:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].honorariumAmount
                        ? theEvent.financialHopes
                        : theEvent.offersFromHosts[0].honorariumAmount,
                extraClarification:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].extraClarification
                        ? ''
                        : theEvent.offersFromHosts[0].extraClarification,
                seatingProvided:
                    loading ||
                    theEvent.offersFromHosts.length < 1 ||
                    !theEvent.offersFromHosts[0].seatingProvided
                        ? ''
                        : theEvent.offersFromHosts[0].seatingProvided,
            });
        } else {
            if (!auth.loading) {
                setFormData({
                    status: 'DRAFT',
                    email: auth.user.email,

                    createdBy: 'HOST',
                    promotionApproval: '',
                    preferredArtists: [],
                    tourVibe: [],
                    bookingWhen: '',
                    bookingWhere:
                        !hostMe.city || !hostMe.state
                            ? {}
                            : {
                                  city: toTitleCase(hostMe.city),
                                  state: states(hostMe.state).usps,
                                  fullState: states(hostMe.state).name,
                                  zip: hostMe.zipCode,
                              },
                    showSchedule: {
                        setupTime: '17:45',
                        startTime: '19:00',
                        doorsOpen: '18:30',
                        hardWrap: '21:00',
                        flexible: true,
                    },
                    overnight: '',
                    openers: '',
                    hangout: '',
                    merchTable: false,
                    familyFriendly: false,
                    alcohol: false,
                    soundSystem: '',
                    agreeToPromote: false,
                    hostNotes: '',

                    offersFromHosts: [],

                    refreshments: '',
                    houseRules: '',
                    eventbritePublicAddress: '',
                    additionalRequests: '',
                    guaranteeHonorarium: '',
                    honorariumAmount: '',
                    extraClarification: '',
                    seatingProvided: '',
                });
            }
        }
    }, [auth.loading, editHostEvent]);

    const {
        status,
        promotionApproval,
        preferredArtists,
        tourVibe,
        bookingWhen,
        bookingWhere,
        showSchedule,
        overnight,
        hangout,
        merchTable,
        familyFriendly,
        alcohol,
        soundSystem,
        agreeToPromote,
        hostNotes,

        offersFromHosts,

        refreshments,
        houseRules,
        eventbritePublicAddress,
        additionalRequests,
        guaranteeHonorarium,
        honorariumAmount,
        extraClarification,
        seatingProvided,
    } = formData;

    // const stageName = hostMe.stageName;

    //console.log('HostEventForm offersFromHosts', offersFromHosts);

    const onChange = (e) => {
        //console.log(e);
        //console.log(Object.keys(formGroups).length);
        changesMade.current = true;
        let targetValue = e.target.value;
        switch (e.target.type) {
            case 'checkbox':
                targetValue = e.target.checked;
                break;
            default:
                targetValue = e.target.value;
        }
        const targetName = e.target.name.split('.');
        //console.log(targetName + ': ' + targetValue);
        //setFormData({ ...formData, [e.target.name]: targetValue });
        if (targetName.length === 1) {
            setFormData({ ...formData, [targetName[0]]: targetValue });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [targetName[0]]: {
                    ...prevData[targetName[0]],
                    [targetName[1]]: targetValue,
                },
            }));
            //console.log(formData);
        }
    };
    const onPhoneChange = (theFieldName, val) => {
        changesMade.current = true;
        let targetValue = val;
        setFormData({ ...formData, [theFieldName]: targetValue });
    };
    const onAutocompleteTagChange = (e, theFieldName, val) => {
        // console.log('onAutocompleteTagChange theFieldName: ', theFieldName);
        // console.log('val', val);
        // console.log(Object.keys(formGroups).length);
        changesMade.current = true;
        let targetValue = val;
        setFormData({ ...formData, [theFieldName]: targetValue });
    };
    //onAutocompleteTagChange(event, 'allergies', value)
    //onMultiTextChange('email', travelingCompanions, idx, e)
    const onMultiAutocompleteTagChange = (
        theFieldKey,
        theFieldName,
        theFieldObj,
        idx,
        e,
        value
    ) => {
        changesMade.current = true;
        let targetValue = value;
        let updatedField = theFieldObj.map((fieldObj, tFidx) => {
            if (idx !== tFidx) return fieldObj;
            return { ...fieldObj, [theFieldKey]: targetValue }; //updates travelingCompanion[tFidx].name
        });
        // dispatch({
        // 	type: UPDATE_ARTIST_ME,
        // 	payload: { ...formData, [theFieldName]: updatedField },
        // });
        setFormData({ ...formData, [theFieldName]: updatedField });
    };

    // const handleAddMultiInput = (targetName, theFieldObj, payload) => {
    // 	//super helpful: https://goshacmd.com/array-form-inputs/
    // 	let updatedField = theFieldObj.concat([{}]);
    // 	console.log(targetName);
    // 	if (targetName == 'bookingWhenWhere') {
    // 		updatedField = theFieldObj.concat([
    // 			{ when: payload, where: [] },
    // 		]);
    // 	}
    // 	// console.log("["+targetName+"]: ");
    // 	console.log(updatedField);
    // 	setFormData({ ...formData, [targetName]: updatedField });
    // };

    // useEffect(() => {
    //     if (changesMade.current) {
    //         if (bookingWhen && bookingWhere && bookingWhere.city) {
    //             editHostEvent(formData, history, true);
    //             changesMade.current = false;
    //         }
    //     }
    // }, [bookingWhere]);

    const onCalendarChange = (target) => {
        changesMade.current = true;
        let targetValue = target.value;
        let targetValueDated = targetValue.map((date) => {
            return new Date(date).toISOString();
        });

        setFormData({ ...formData, [target.name]: targetValueDated });
    };

    const handleAddMultiTextField = (targetName, theFieldObj) => {
        //super helpful: https://goshacmd.com/array-form-inputs/
        let updatedField = theFieldObj.concat([{}]);
        if (targetName === 'travelingCompanions') {
            let updatedField = theFieldObj.concat([
                { name: '', role: '', email: '' },
            ]);
        }
        setFormData({ ...formData, [targetName]: updatedField });
    };
    const handleRemoveMultiTextField = (targetName, theFieldObj, idx) => {
        let updatedField = theFieldObj.filter((s, _idx) => _idx !== idx);
        setFormData({ ...formData, [targetName]: updatedField });
    };

    const onMultiTextChange = (theFieldKey, theFieldObj, idx, e) => {
        changesMade.current = true;
        //console.log(e.target.value);
        let targetValue = e.target.value;
        targetValue = e.target.value;
        let updatedField = theFieldObj.map((fieldObj, tFidx) => {
            if (idx !== tFidx) return fieldObj;
            return { ...fieldObj, [theFieldKey]: e.target.value }; //updates travelingCompanion[tFidx].name
        });
        setFormData({ ...formData, [e.target.name]: updatedField });
    };

    //const [changesMade, setChangesMade] = useState(false);
    const changesMade = useRef(false);
    const firstLoad = useRef(true);
    const formNavRef = useRef(null);

    const onSubmit = (e) => {
        e.preventDefault();
        //console.log('Submitting...');
        if (bookingWhen && bookingWhere && bookingWhere.city) {
            const formDataWithOffer = {
                ...formData,
                theOffer: {
                    refreshments: formData.refreshments,
                    houseRules: formData.houseRules,
                    eventbritePublicAddress: formData.eventbritePublicAddress,
                    additionalRequests: formData.additionalRequests,
                    guaranteeHonorarium: formData.guaranteeHonorarium,
                    honorariumAmount: formData.honorariumAmount,
                    extraClarification: formData.extraClarification,
                    seatingProvided: formData.seatingProvided,
                    openers: formData.openers,
                    overnight: formData.overnight,
                    showSchedule: formData.showSchedule,
                },
            };
            // editHostEvent(formData, history, true);
            editHostEvent(formDataWithOffer, history, true);
            changesMade.current = false;
        }
    };

    const [open, setOpen] = useState(true);

    const formGroups = {
        bookingWhen: [
            <Typography component="h2">
                It’s so exciting you’re interested in proposing a concert!
                Please select the date you’d like to try to host this event in{' '}
                {bookingWhere.city}, {bookingWhere.state}:
            </Typography>,
            [
                // bookingWhen && bookingWhen.length > 0
                // 	? bookingWhen.map((whenBooking, idx) => (
                // 		handleAddMultiInput('bookingWhenWhere',bookingWhenWhere, whenBooking)
                // 	  ))
                // 	: '',

                <MultipleDatesPicker
                    id="bookingWhen"
                    name="bookingWhen"
                    open={true}
                    //trying to figure out how to disable dates you've already picked ~Aug 26, 2022
                    disabledDates={
                        myHostEvents &&
                        myHostEvents
                            .filter((event) => {
                                if (event.bookingWhen !== bookingWhen) {
                                    return true;
                                } else {
                                    return false;
                                }
                            })
                            .map((event) => {
                                return event.bookingWhen;
                            })
                    }
                    //readOnly={bookingWhen ? true : false} //if there's a bookingWhen date, don't let people change it
                    selectedDates={bookingWhen ? [bookingWhen] : []}
                    //value={bookingWhen}
                    onCancel={() => setOpen(false)}
                    //onSubmit={dates => console.log('selected dates', dates)}
                    onChange={(target) => onCalendarChange(target)}
                />,
            ],
        ],
        preferredArtists: [
            [
                <FormLabel component="legend">
                    Who would you like to invite to perform?
                </FormLabel>,
                <Grid className="clarifyingText" item>
                    <FormLabel
                        component="small"
                        sx={{
                            textAlign: 'left',
                            display: 'block',
                            marginTop: '6px',
                        }}
                    >
                        Consider giving local artists priority in your offers to
                        host. We want to help you invest in your community, and
                        the relationships you develop with local artists have
                        the potential to become most meaningful to you and your
                        community over time.
                    </FormLabel>
                    <FormLabel
                        component="small"
                        sx={{
                            textAlign: 'left',
                            display: 'block',
                            marginTop: '8px',
                        }}
                    >
                        Also, please do your homework on the artist/artists you
                        invite to perform (checkout each artist’s profile to
                        read about them, watch their Artist Statement video, and
                        listen to their music).
                    </FormLabel>
                    <FormLabel
                        component="small"
                        sx={{
                            textAlign: 'left',
                            display: 'block',
                            marginTop: '8px',
                        }}
                    >
                        If you select multiple artists, we believe preference
                        should be given to the first artist who wants to accept
                        the offer.
                    </FormLabel>
                </Grid>,
            ],
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Autocomplete
                        multiple
                        id="preferredArtists"
                        value={preferredArtists}
                        options={artists}
                        getOptionLabel={(option) =>
                            option.stageName +
                            ' ' +
                            option.genres +
                            ' ' +
                            option.city +
                            ' ' +
                            option.state +
                            ' ' +
                            states(option.state).usps
                        }
                        isOptionEqualToValue={(option, value) =>
                            option._id === value._id
                        }
                        renderOption={(props, option, { selected }) => (
                            <li {...props}>
                                <Tooltip
                                    arrow={true}
                                    placement="bottom-start"
                                    title={
                                        <>
                                            <div>
                                                {option.genres.map(
                                                    (genre, index) => (
                                                        <Chip
                                                            sx={{
                                                                margin: '4px',
                                                                borderColor:
                                                                    'rgba(255,255,255,.3)',
                                                                background:
                                                                    'rgba(255,255,255,.2)',
                                                            }}
                                                            size="small"
                                                            variant="outlined"
                                                            name="genre"
                                                            label={genre}
                                                            key={`genre${index}`}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </>
                                    }
                                >
                                    <Grid container alignItems="center">
                                        <Avatar
                                            src={option.squareImg}
                                            sx={{ marginRight: '4px' }}
                                        />
                                        <Typography
                                            sx={{
                                                margin: '0 4px',
                                            }}
                                        >
                                            {option.stageName}{' '}
                                            <span
                                                style={{
                                                    color: 'var(--primary-color)',
                                                    fontSize: '.75em',
                                                }}
                                            >
                                                ({toTitleCase(option.city)},{' '}
                                                {states(option.state).usps})
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Tooltip>
                            </li>
                        )}
                        disableCloseOnSelect={true}
                        clearOnBlur={true}
                        onChange={(event, value) => {
                            // console.log('value', value);
                            onAutocompleteTagChange(
                                event,
                                'preferredArtists',
                                value
                            );
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    name="preferredArtists"
                                    label={option.stageName}
                                    key={`preferredArtists${index}`}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{ width: '100%' }}
                                variant="standard"
                                label={'I’d like to invite'}
                                name="preferredArtists"
                                helperText="(Select the artists you’d like to invite from the list or map. Note: artists in the same city will have overlapping map pins, and will be hard to select from the map.)"
                            />
                        )}
                    />
                    {/* <TextField
						variant='standard'
						name='tourVibe'
						multiline
						id='tourVibe'
						label='I’m most comfortable performing for an audience who is '
						placeholder='[plural noun]'
						value={tourVibe}
						onChange={(e) => onChange(e)}
						helperText='are my audience.'
						InputLabelProps={{ shrink: true }}
					/> */}
                    <Grid item container className="feoyGoogleMap">
                        <GoogleMapForHosts
                            markers={artists}
                            markerClick={onAutocompleteTagChange}
                            // radius={Number(hostReachRadius)}
                            circleCenter={
                                preferredArtists &&
                                preferredArtists.length > 0 &&
                                preferredArtists[preferredArtists.length - 1]
                                    .city
                                    ? preferredArtists[
                                          preferredArtists.length - 1
                                      ].latLong
                                    : hostMe.latLong
                            }
                            preferredArtists={preferredArtists}
                            // bookingWhereZip={
                            //     preferredArtists[preferredArtists.length - 1]
                            //         .zip
                            // }
                        />
                    </Grid>
                </Grid>,
            ],
        ],
        tourVibe: [
            <FormLabel component="legend">
                We want to make sure you and the artist are on the same page
                about what to expect concerning who the audience is. How would
                you describe the folks you’re going to invite?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Autocomplete
                        multiple
                        id="tourVibe"
                        value={tourVibe}
                        options={[]}
                        freeSolo
                        clearOnBlur={true}
                        onChange={(event, value) =>
                            onAutocompleteTagChange(event, 'tourVibe', value)
                        }
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    name="tourVibe"
                                    label={option}
                                    key={`tourVibe${index}`}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{ width: '100%' }}
                                variant="standard"
                                label={'The folks I’m going to invite are '}
                                name="tourVibe"
                                helperText="Type and press [enter] to add adjectives to the list"
                            />
                        )}
                    />
                    {/* <TextField
						variant='standard'
						name='tourVibe'
						multiline
						id='tourVibe'
						label='I’m most comfortable performing for an audience who is '
						placeholder='[plural noun]'
						value={tourVibe}
						onChange={(e) => onChange(e)}
						helperText='are my audience.'
						InputLabelProps={{ shrink: true }}
					/> */}
                </Grid>,
            ],
        ],
        merchTable: [
            <FormLabel component="legend">
                Will you be able to provide a merch table in the event that an
                artist needs one?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="merchTable"
                        value={merchTable}
                        name="merchTable"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                            defaultChecked
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        promotionApproval: [
            <FormLabel component="legend">
                Do you approve Porchlight to use video, photo, and audio
                captured for promotional purposes?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="promotionApproval"
                        value={promotionApproval}
                        name="promotionApproval"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],

        familyFriendly: [
            <FormLabel component="legend">
                Are you looking to host a particularly family-friendly concert?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="familyFriendly"
                        value={familyFriendly}
                        name="familyFriendly"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                            defaultChecked
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="Not Necessarily"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        alcohol: [
            <FormLabel component="legend">
                Would you be comfortable if there was alcohol at the show?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="alcohol"
                        value={alcohol}
                        name="alcohol"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No"
                            defaultChecked
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        soundSystem: [
            <FormLabel component="legend">
                Are you able to provide a sound system for this show?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="soundSystem"
                        value={soundSystem}
                        name="soundSystem"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="noButNeed"
                            control={<Radio />}
                            label="No, but I will need one."
                        />
                        <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label={`No, I’d like the artist to do an acoustic show.`}
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],

        agreeToPromote: [
            <FormLabel component="legend">
                Do you agree to promote this event to your community, including
                email sends and social media?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="agreeToPromote"
                        value={agreeToPromote}
                        name="agreeToPromote"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Yes, to the best of my ability."
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="No, I'm not willing to commit to that."
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],

        overnight: [
            <FormLabel component="legend">
                How many people are you able and willing to accommodate
                overnight?
                <br />
                <small>
                    (obviously you’ll need to coordinate with the artist to find
                    out if people are able/willing to share rooms or even beds,
                    but what’s your ballpark?)
                </small>
            </FormLabel>,
            [
                <Grid item>
                    <TextField
                        variant="standard"
                        name="overnight"
                        id="overnight"
                        label="I can accommodate"
                        value={overnight}
                        onChange={(e) => onChange(e)}
                        type="number"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {overnight == 1 ? 'person.' : 'people.'}
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>,
            ],
        ],
        hangout: [
            [
                <Grid item xs={12}>
                    <FormLabel component="legend" sx={{}}>
                        The heart of Porchlight is to cultivate relationships
                        between artists and hosts. Are you open to spending some
                        informal time with the artist(s)?
                    </FormLabel>
                </Grid>,
            ],
            [
                <Grid item>
                    <FormControl component="fieldset">
                        <RadioGroup
                            id="hangout"
                            value={hangout}
                            name="hangout"
                            onChange={(e) => onChange(e)}
                        >
                            <FormControlLabel
                                value="I'd rather not."
                                control={<Radio />}
                                label="I'd rather not."
                            />
                            <FormControlLabel
                                value="That sounds great! I prefer a private hangout AFTER the show."
                                control={<Radio />}
                                label="That sounds great! I prefer a private hangout AFTER the show."
                            />
                            <FormControlLabel
                                value="That sounds great! I prefer a private hangout BEFORE the show."
                                control={<Radio />}
                                label="That sounds great! I prefer a private hangout BEFORE the show."
                            />
                            <FormControlLabel
                                value="That sounds great! Either before or after works for me."
                                control={<Radio />}
                                label="That sounds great! Either before and/or after works for me."
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>,
            ],
        ],
        showSchedule: [
            <FormLabel component="legend">
                {/* Schedules often get shifted by hosts or artists, but it’s really helpful
				to have a “proposed schedule” and tweak from there. Please edit the
				times below to best represent the schedule you propose. */}
                If you would like to propose a different show schedule, please
                edit our standard timeline below.
            </FormLabel>,
            [
                <Grid item>
                    The artist will need to start setting up at
                    <TextField
                        variant="standard"
                        id="setupTime"
                        //label='Alarm clock'
                        type="time"
                        name="showSchedule.setupTime"
                        value={showSchedule.setupTime || ''}
                        onChange={(e) => onChange(e)}
                        inputProps={{
                            step: 900, // 15 min
                        }}
                        sx={{
                            padding: '0 8px',
                            '& input[type="time"]::-webkit-calendar-picker-indicator':
                                {
                                    filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                                },
                        }}
                    />{' '}
                    to have “doors open” at
                    <TextField
                        variant="standard"
                        id="doorsOpen"
                        //label='Alarm clock'
                        type="time"
                        name="showSchedule.doorsOpen"
                        value={showSchedule.doorsOpen || ''}
                        onChange={(e) => onChange(e)}
                        inputProps={{
                            step: 900, // 15 min
                        }}
                        sx={{
                            padding: '0 8px',
                            '& input[type="time"]::-webkit-calendar-picker-indicator':
                                {
                                    filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                                },
                        }}
                    />
                    for the show starting at
                    <TextField
                        variant="standard"
                        id="startTime"
                        //label='Alarm clock'
                        type="time"
                        name="showSchedule.startTime"
                        value={showSchedule.startTime || ''}
                        onChange={(e) => onChange(e)}
                        inputProps={{
                            step: 900, // 15 min
                        }}
                        sx={{
                            padding: '0 0 0 8px',
                            '& input[type="time"]::-webkit-calendar-picker-indicator':
                                {
                                    filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                                },
                        }}
                    />
                    with a hard wrap at about{' '}
                    <TextField
                        variant="standard"
                        id="hardWrap"
                        //label='Alarm clock'
                        type="time"
                        name="showSchedule.hardWrap"
                        value={showSchedule.hardWrap || ''}
                        onChange={(e) => onChange(e)}
                        inputProps={{
                            step: 900, // 15 min
                        }}
                        sx={{
                            padding: '0 0 0 8px',
                            '& input[type="time"]::-webkit-calendar-picker-indicator':
                                {
                                    filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
                                },
                        }}
                    />
                    .
                </Grid>,
            ],
        ],
        refreshments: [
            <FormLabel component="legend">
                Let's talk refreshments. Do you plan on having any food or
                drinks?
            </FormLabel>,
            [
                <Grid item xs={12}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            id="refreshments"
                            value={refreshments}
                            name="refreshments"
                            onChange={(e) => onChange(e)}
                        >
                            <FormControlLabel
                                value="I don't plan on providing any drinks or food."
                                control={<Radio />}
                                label={`I don't plan on providing any drinks or food.`}
                            />
                            <FormControlLabel
                                value="I plan on providing some light snacks and drinks."
                                control={<Radio />}
                                label="I plan on providing some light snacks and drinks."
                            />
                            <FormControlLabel
                                value="I plan on providing lots of finger foods and several drink options."
                                control={<Radio />}
                                label="I plan on providing lots of finger foods and several drink options."
                            />
                            <FormControlLabel
                                value="I plan on providing a full meal for all my guests."
                                control={<Radio />}
                                label="I plan on providing a full meal for all my guests."
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>,
            ],
        ],
        seatingProvided: [
            <FormLabel component="legend">
                Do you have all the seating you’ll need, or should we encourage
                people to bring their own chairs?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="seatingProvided"
                        value={seatingProvided}
                        name="seatingProvided"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label={`Yes, I've got all the seating needed ${
                                hostMe.maxNumAttendees > 0
                                    ? `for at least ${hostMe.maxNumAttendees} people.`
                                    : '.'
                            }`}
                        />
                        <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No, please encourage attenders to bring something to sit on."
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],

        houseRules: [
            <FormLabel component="legend">
                Let's talk house rules! What rules about being in/around your
                house would you like to make known to the attendees and artists?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="houseRules"
                        id="houseRules"
                        label={`These are my house rules:`}
                        value={houseRules}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        eventbritePublicAddress: [
            [
                <FormLabel component="h3">
                    We usually set up Eventbrite pages for these shows. Some
                    folks prefer to have their street address kept private, and
                    shared in an email with only those who RSVP.
                </FormLabel>,
                <FormLabel component="legend">
                    Are you comfortable with your address being publicly
                    viewable on the Eventbrite page?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="eventbritePublicAddress"
                        value={eventbritePublicAddress}
                        name="eventbritePublicAddress"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                        />
                        <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No"
                        />
                        <FormControlLabel
                            value="notSure"
                            control={<Radio />}
                            label="Not Sure"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        additionalRequests: [
            <FormLabel component="legend">
                As the host, do you have any other requests as we set up the
                Eventbrite page for this show?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="additionalRequests"
                        id="additionalRequests"
                        label={`These are my additional requests:`}
                        value={additionalRequests}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        guaranteeHonorarium: [
            [
                <FormLabel component="h3">
                    You mentioned before that you might be able to draw{' '}
                    {hostMe.numDraw} people to a show.
                    {/* Considering that we’re{' '}
                    {theEvent.costStructure === 'ticket'
                        ? 'selling tickets for '
                        : 'hoping for individual donations of '}{' '}
                    ${theEvent.namedPrice}, the artist is looking at maybe
                    making $
                    {Math.round(
                        (hostMe.numDraw * theEvent.namedPrice +
                            Number.EPSILON) *
                            100
                    ) / 100}
                    . */}
                </FormLabel>,
                <FormLabel component="legend">
                    If the band comes up short of their hoped-for $
                    {/* {theEvent.financialHopes}  */}
                    minimum, we’d like to encourage you to consider offering a{' '}
                    <Tooltip
                        arrow={true}
                        placement="bottom"
                        title={
                            'A guarantee is when the host covers the difference between the desired minimum and the amount made in tickets/donations.'
                        }
                    >
                        <span style={{ textDecoration: 'underline dotted' }}>
                            guarantee
                        </span>
                    </Tooltip>{' '}
                    or{' '}
                    <Tooltip
                        arrow={true}
                        placement="bottom"
                        title={
                            'An honorarium is a flat amount you’re willing to offer the musician to come play this concert.'
                        }
                    >
                        <span style={{ textDecoration: 'underline dotted' }}>
                            honorarium
                        </span>
                    </Tooltip>
                    .
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{
                        textAlign: 'center',
                        display: 'block',
                        marginTop: '6px',
                    }}
                >
                    <em>
                        We want to give you the opportunity to make this offer
                        personally, if the artist reaches out to pursue your
                        offer, rather than through this cold and impersonal
                        form.
                    </em>
                </FormLabel>,
            ],
            [
                // <FormControl component="fieldset">
                //     <RadioGroup
                //         id="guaranteeHonorarium"
                //         value={guaranteeHonorarium}
                //         name="guaranteeHonorarium"
                //         onChange={(e) => onChange(e)}
                //     >
                //         <FormControlLabel
                //             value="no"
                //             control={<Radio />}
                //             label="Not this time, thanks."
                //         />
                //         <FormControlLabel
                //             value="guarantee"
                //             control={<Radio />}
                //             label={`I’m willing to guarantee that ${artist.stageName} makes a minimum of $${artist.financialHopes}—I’ll make up the difference.`}
                //         />
                //         <FormControlLabel
                //             value="honorarium"
                //             control={<Radio />}
                //             label={`I’d like to offer ${artist.stageName} an honorarium...`}
                //         />
                //     </RadioGroup>
                //     {guaranteeHonorarium === 'honorarium' && (
                //         <TextField
                //             variant="standard"
                //             name="honorariumAmount"
                //             id="honorariumAmount"
                //             label="of "
                //             value={honorariumAmount || artist.financialHopes}
                //             onChange={(e) => onChange(e)}
                //             type="number"
                //             sx={{ maxWidth: '300px', margin: '8px auto' }}
                //             helperText="no matter how much the band makes otherwise."
                //             InputProps={{
                //                 startAdornment: (
                //                     <InputAdornment position="start">
                //                         $
                //                     </InputAdornment>
                //                 ),
                //             }}
                //         />
                //     )}
                // </FormControl>,
            ],
        ],
        hostNotes: [
            <FormLabel component="legend">
                Do you have any final thoughts, questions, notes, or
                clarifications for us? Feel free to list them below.
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                    variant="standard"
                    name="hostNotes"
                    multiline
                    id="hostNotes"
                    label="Host Notes"
                    value={hostNotes}
                    onChange={(e) => onChange(e)}
                    sx={{ width: '100%' }}
                />
            </Grid>,
        ],
        extraClarification: [
            <FormLabel component="legend">
                Would you like to clarify any of your answers? Do you have any
                questions for us?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="extraClarification"
                        id="extraClarification"
                        label={`Extra Clarifications:`}
                        value={extraClarification}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],

        endSlide: [
            [
                <Typography
                    component="h2"
                    sx={{ textAlign: 'center', marginBottom: '8px' }}
                >
                    {preferredArtists.length > 2
                        ? preferredArtists
                              .map((preferredArtist, i) => {
                                  if (
                                      preferredArtists.length > 1 &&
                                      i === preferredArtists.length - 1
                                  ) {
                                      return (
                                          ' and ' + preferredArtist.stageName
                                      );
                                  } else {
                                      return preferredArtist.stageName;
                                  }
                              })
                              .join(', ')
                        : preferredArtists.map((preferredArtist, i) => {
                              if (
                                  preferredArtists.length > 1 &&
                                  i === preferredArtists.length - 1
                              ) {
                                  return ' and ' + preferredArtist.stageName;
                              } else {
                                  return preferredArtist.stageName;
                              }
                          })}
                    {preferredArtists.length === 0 && '[The Artist]'} will see
                    the fields you’ve filled out:
                </Typography>,
                <HostTermsAgreement></HostTermsAgreement>,
                <>
                    {hostMe && hostMe.agreedToTerms ? (
                        <>
                            <Typography
                                component="p"
                                sx={{ textAlign: 'center', marginTop: '16px' }}
                            >
                                Before sending this proposal, please look it
                                over and make any necessary changes. (After you
                                send it, you won’t be able to change it. And if
                                you need to cancel, it will still show up as
                                “CANCELED” on the dashboard
                                {preferredArtists.length > 1 ? 's' : ''} of{' '}
                                {preferredArtists.length > 2
                                    ? preferredArtists
                                          .map((preferredArtist, i) => {
                                              if (
                                                  preferredArtists.length > 1 &&
                                                  i ===
                                                      preferredArtists.length -
                                                          1
                                              ) {
                                                  return (
                                                      ' and ' +
                                                      preferredArtist.stageName
                                                  );
                                              } else {
                                                  return preferredArtist.stageName;
                                              }
                                          })
                                          .join(', ')
                                    : preferredArtists.map(
                                          (preferredArtist, i) => {
                                              if (
                                                  preferredArtists.length > 1 &&
                                                  i ===
                                                      preferredArtists.length -
                                                          1
                                              ) {
                                                  return (
                                                      ' and ' +
                                                      preferredArtist.stageName
                                                  );
                                              } else {
                                                  return preferredArtist.stageName;
                                              }
                                          }
                                      )}
                                {preferredArtists.length === 0 &&
                                    '[The Artist]'}
                                .)
                            </Typography>
                            <Grid
                                container
                                sx={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    padding: '8px 0',
                                }}
                            >
                                <Button
                                    btnwidth={350}
                                    onClick={() => {
                                        hostProposes(formData);
                                        setDrawerOpen(false);
                                        jumpTo(''); //to reset the form for the next event
                                    }}
                                >
                                    <p>
                                        Send my proposal to the{' '}
                                        {preferredArtists.length > 1
                                            ? preferredArtists.length +
                                              ' artists'
                                            : ' artist'}
                                    </p>
                                    <SendIcon
                                        sx={{ marginLeft: '8px!important' }}
                                    ></SendIcon>
                                </Button>
                            </Grid>
                        </>
                    ) : (
                        <Grid
                            container
                            sx={{
                                color: 'var(--link-color)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid',
                                padding: '8px',
                                margin: '16px auto',
                            }}
                        >
                            <Typography component="p">
                                You must agree to the Porchlight Host Terms and
                                Conditions before you can propose this concert.
                            </Typography>
                        </Grid>
                    )}{' '}
                </>,
            ],
            [
                //Event Details as an artist will see it
                //theEvent usually comes from EditHostEvent.js, but if the user is proposing this event we'll hit up the Redux store for the myHostEvents that has a matching bookingWhen
                //

                <>
                    {' '}
                    {formData && (
                        <Grid
                            container
                            sx={{
                                width: '100%',
                                maxWidth: '900px',
                                paddingBottom: '16px',
                                border:
                                    !status || status === 'DRAFT'
                                        ? '4px dashed var(--primary-color)'
                                        : 'none',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    margin: '0 auto',
                                    width: '100%',
                                    height: 'fit-content',
                                }}
                            >
                                <HostProfile
                                    theHost={hostMe}
                                    theEvent={
                                        theEvent ||
                                        myHostEvents.find((event) => {
                                            if (
                                                bookingWhen &&
                                                bookingWhen.length > 0 &&
                                                bookingWhen[0]
                                            ) {
                                                return (
                                                    event.bookingWhen ===
                                                    bookingWhen[0]
                                                );
                                            }
                                        })
                                    }
                                    theOffer={{
                                        refreshments: formData.refreshments,
                                        houseRules: formData.houseRules,
                                        eventbritePublicAddress:
                                            formData.eventbritePublicAddress,
                                        additionalRequests:
                                            formData.additionalRequests,
                                        guaranteeHonorarium:
                                            formData.guaranteeHonorarium,
                                        honorariumAmount:
                                            formData.honorariumAmount,
                                        extraClarification:
                                            formData.extraClarification,
                                        seatingProvided:
                                            formData.seatingProvided,
                                        openers: formData.openers,
                                        overnight: formData.overnight,
                                        showSchedule: formData.showSchedule,
                                    }}
                                    // eventDetailsDialogHandleClose={
                                    //     eventDetailsDialogHandleClose
                                    // }
                                />
                            </Grid>
                            {/* <Grid item sx={{ margin: '16px auto', width: '100%' }}>
                            <HostEventDetails
                                theEvent={{
                                    ...(theEvent ||
                                        myHostEvents.find((event) => {
                                            if (
                                                bookingWhen &&
                                                bookingWhen.length > 0 &&
                                                bookingWhen[0]
                                            ) {
                                                return (
                                                    event.bookingWhen ===
                                                    bookingWhen[0]
                                                );
                                            }
                                        })),
                                    artist: hostMe,
                                }}
                            />
                        </Grid> */}
                        </Grid>
                    )}
                </>,
            ],
        ],
    };

    let query = useQuery();
    const queryEditField = query.get('field');
    let formStartIndex = 0;

    if (queryEditField) {
        const formGroupKeys = Object.keys(formGroups);
        formStartIndex =
            formGroupKeys.indexOf(queryEditField) > -1
                ? formGroupKeys.indexOf(queryEditField)
                : 0;
    }
    if (jumpToState !== '') {
        const formGroupKeys = Object.keys(formGroups);
        formStartIndex =
            formGroupKeys.indexOf(jumpToState) > -1
                ? formGroupKeys.indexOf(jumpToState)
                : 0;
    }

    //// CARD INDEX ///////
    const [formCardIndex, setIndex] = useState(formStartIndex);

    const cardIndex = formCardIndex;

    const [formCardDirection, setDirection] = useState(1);

    //jumpToState (app state set in EventDetails.js)
    useEffect(() => {
        //console.log('jumpToState HostEventForm', jumpToState);
        if (jumpToState !== '') {
            const formGroupKeys = Object.keys(formGroups);
            let jumpToIndex =
                formGroupKeys.indexOf(jumpToState) > -1
                    ? formGroupKeys.indexOf(jumpToState)
                    : 0;
            if (jumpToState === 'endSlide') {
                setDirection(1);
            } else {
                if (formNavRef.current) {
                    formNavRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end',
                    });
                }
                setDirection(-1);
            }
            setIndex(jumpToIndex);
        }
    }, [jumpToState]);

    // useEffect(() => {
    //     //console.log('jumpToState HostEventForm', jumpToState);
    //     if (bookingWhen) {
    //         setDirection(1);
    //         setIndex(Object.keys(formGroups).length - 1);
    //     }
    // }, [bookingWhen]);

    const formNavContainerRef = useRef(null);
    const [formNavHeight, setHeight] = useState(0);
    useEffect(() => {
        setHeight(formNavContainerRef.current.scrollHeight);
    }, []);

    useEffect(() => {
        //console.log('jumpToState HostEventForm', jumpToState);
        if (bookingWhen && jumpToState === '') {
            //triggers the form to go to the next slide when a bookingWhen is selected and pulls in the most recently created event's details, but doesn't affect the "Edit Concert Details"
            setDirection(1);
            setIndex(
                (cardIndex) => (cardIndex + 1) % Object.keys(formGroups).length
            );
            if (Array.isArray(myHostEvents) && myHostEvents.length > 0) {
                const mostRecentlyUpdatedEvent = myHostEvents.reduce((a, b) =>
                    a.updatedAt > b.updatedAt ? a : b
                );
                // console.log(
                //     'host mostRecentlyUpdatedEvent before:',
                //     mostRecentlyUpdatedEvent
                // );

                const mostRecentlyUpdatedEventTrimmed = {
                    //this solved the issue where, if a HOST picked a date and then closed the drawer without saving, it would make a random event, they'd offered to host, disappear from their dashboard
                    ...mostRecentlyUpdatedEvent,
                };

                //remove the fields we don't want to copy from mostRecentlyUpdatedEvent
                delete mostRecentlyUpdatedEventTrimmed.createdBy;
                delete mostRecentlyUpdatedEventTrimmed.artist;

                delete mostRecentlyUpdatedEventTrimmed._id;
                delete mostRecentlyUpdatedEventTrimmed.createdAt;
                delete mostRecentlyUpdatedEventTrimmed.bookingWhen;
                delete mostRecentlyUpdatedEventTrimmed.bookingWhere;
                delete mostRecentlyUpdatedEventTrimmed.updatedAt;
                delete mostRecentlyUpdatedEventTrimmed.hostsOfferingToBook;
                // delete mostRecentlyUpdatedEventTrimmed.offersFromHosts;
                delete mostRecentlyUpdatedEventTrimmed.confirmedHost;
                delete mostRecentlyUpdatedEventTrimmed.confirmedHostUser;
                delete mostRecentlyUpdatedEventTrimmed.confirmedDate;
                delete mostRecentlyUpdatedEventTrimmed.status;
                delete mostRecentlyUpdatedEventTrimmed.hostUpdated;
                delete mostRecentlyUpdatedEventTrimmed.geocodedBookingWhere;
                delete mostRecentlyUpdatedEventTrimmed.confirmedArtist;
                delete mostRecentlyUpdatedEventTrimmed.declinedArtists;

                setFormData({
                    ...formData,
                    ...mostRecentlyUpdatedEventTrimmed,
                });
            }
        }
    }, [bookingWhen]);

    const transitions = useTransition(formCardIndex, {
        key: formCardIndex,
        initial: null,
        from: {
            opacity: 0,
            transform: `translateX(${formCardDirection * 60}vw)`,
        },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: {
            opacity: 0,
            transform: `translateX(${formCardDirection * -60}vw)`,
        },
        config: config.molasses,
        // onRest: (_a, _b, item) => {
        //   if (formCardIndex === item) {
        //     set(cardIndex => (cardIndex + 1) % formGroups.length)
        //   }
        // },
        exitBeforeEnter: false,
    });
    const nextCard = (e) => {
        jumpTo('');
        setDirection(1);
        setIndex((cardIndex) => {
            if (
                bookingWhen &&
                cardIndex === Object.keys(formGroups).length - 1
            ) {
                //skips the first slide if a bookingWhen exists, so that a user can't select more dates in the multidate picker
                cardIndex = (cardIndex + 1) % Object.keys(formGroups).length;
            }
            return (cardIndex + 1) % Object.keys(formGroups).length;
        });
        if (changesMade.current) {
            onSubmit(e);
        }
    };
    const previousCard = (e) => {
        jumpTo('');
        setDirection(-1);
        setIndex((cardIndex) => {
            if (bookingWhen && cardIndex === 1) {
                cardIndex = Object.keys(formGroups).length;
            }
            //console.log(cardIndex);
            return cardIndex - 1;
        });
        if (changesMade.current) {
            onSubmit(e);
        }
    };

    return (
        <Fragment>
            {bookingWhen && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(0 0 0 /.6)',
                        padding: '0',
                        zIndex: 100,
                    }}
                >
                    <StackDateforDisplay
                        date={bookingWhen}
                    ></StackDateforDisplay>
                </Box>
            )}
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <Grid
                    container
                    sx={{
                        padding: '20px!important',
                        //height: bookingWhen ? formNavHeight + 'px' : '0px',
                        opacity: bookingWhen ? '1' : '0',
                        zIndex: bookingWhen ? '100' : '-99999',
                        transform: bookingWhen
                            ? 'translate(0px, 0)'
                            : 'translate(0,-100px)',
                        transition: 'all 1s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                        transitionDelay: bookingWhen ? '.10s' : '.2s',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                    //display={bookingWhen ? 'flex' : 'none'}
                    className="formNavContainer"
                    ref={formNavContainerRef}
                >
                    <Grid
                        container
                        item
                        sx={{ width: '100%', marginTop: '20px' }}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        zIndex="100"
                        position="relative"
                        className="formNav"
                        ref={formNavRef}
                    >
                        <Grid item>
                            {/* { cardIndex > 0 ? (  */}
                            <Button
                                variant="contained"
                                component="span"
                                onClick={(e) => previousCard(e)}
                            >
                                <ArrowBackIcon></ArrowBackIcon>Previous
                            </Button>
                            {/* ) : '' } */}
                        </Grid>
                        <Grid item>
                            <label htmlFor="submit">
                                <input id="submit" type="submit" hidden />
                                <Button
                                    variant="contained"
                                    component="span"
                                    onClick={(e) => onSubmit(e)}
                                >
                                    Save <SaveTwoToneIcon></SaveTwoToneIcon>
                                </Button>
                            </label>
                        </Grid>
                        <Grid item>
                            {/* { cardIndex < formGroups.length - 1 ? ( */}
                            <Button
                                variant="contained"
                                component="span"
                                onClick={(e) => nextCard(e)}
                            >
                                Next<ArrowForwardIcon></ArrowForwardIcon>
                            </Button>
                            {/* ) : ''} */}
                        </Grid>
                        {jumpToState !== '' && jumpToState !== 'endSlide' && (
                            <Grid item>
                                {/* { cardIndex < formGroups.length - 1 ? ( */}
                                <Button
                                    variant="contained"
                                    component="span"
                                    onClick={(e) => {
                                        if (changesMade.current) {
                                            onSubmit(e);
                                        }
                                        jumpTo('endSlide');
                                    }}
                                >
                                    To Summary
                                    <ArrowForwardIcon></ArrowForwardIcon>
                                </Button>
                                {/* ) : ''} */}
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                {transitions((style, i) => (
                    <animated.div
                        className={'animatedFormGroup'}
                        key={'animatedFormGroup' + i}
                        style={{
                            ...style,
                            top: bookingWhen ? formNavHeight + 'px' : '0px',
                            transition:
                                'top 750ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                            transitionDelay:
                                bookingWhen && i > 0 ? '.05s' : '2s',
                        }}
                    >
                        <div className="form-group" key={'form-group' + i}>
                            <Grid
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                //spacing={2}
                                sx={{
                                    width: '100%',
                                    margin: '0 auto',
                                }}
                            >
                                {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}> */}

                                {/* {formGroups && formGroups.length > 0 ? formGroups[i].map((formGroup, ind) => (  */}
                                <Grid
                                    item
                                    xs={12}
                                    //sx={{ '--form-num': `'${i + 1}'` }}
                                    sx={{ '--form-num': `'${i}'` }}
                                    data-form-num={i}
                                    //data-form-num={i + 1}
                                    className="formInquiry"
                                >
                                    {formGroups[Object.keys(formGroups)[i]][0]}
                                </Grid>
                                {formGroups[Object.keys(formGroups)[i]][1]}
                            </Grid>
                        </div>
                    </animated.div>
                ))}
                {/* <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
          >
            <BottomNavigationAction label="Previous" onClick={() => previousCard()} icon={<ArrowBackIcon />} />
            <BottomNavigationAction label="Save" onClick={(e) => onSubmit(e)} icon={<SaveIcon />} />
            <BottomNavigationAction label="Next" onClick={() => nextCard()} icon={<ArrowForwardIcon />} />
          </BottomNavigation>
        </Paper> */}
            </form>
        </Fragment>
    );
};

HostEventForm.propTypes = {
    getHostsLocations: PropTypes.func.isRequired,
    getArtists: PropTypes.func.isRequired,
    hostProposes: PropTypes.func.isRequired,
    artists: PropTypes.object.isRequired,
    hosts: PropTypes.array.isRequired,
    editHostEvent: PropTypes.func.isRequired,
    theEvent: PropTypes.object,
    auth: PropTypes.object.isRequired,
    hostMe: PropTypes.object,
    myHostEvents: PropTypes.array,
    jumpToState: PropTypes.string,
    jumpTo: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    artists: state.artist.artists,
    hosts: state.host.hosts,
    hostMe: state.host.me,
    myHostEvents: state.event.myHostEvents,
    jumpToState: state.app.jumpTo,
});

export default connect(mapStateToProps, {
    jumpTo,
    getArtists,
    hostProposes,
    getHostsLocations,
    editHostEvent,
})(withRouter(HostEventForm)); //withRouter allows us to pass history objects
