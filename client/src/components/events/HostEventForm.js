//copied from ArtistEventForm.js from EditArtistBookingForm.js
import states from 'us-state-converter';

import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { IMAGE_UPLOAD, UPDATE_ARTIST_ME } from '../../actions/types';
import { setAlert } from '../../actions/alert';
import { editHostEvent } from '../../actions/event';
import {
    TextField,
    //Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Select,
    InputLabel,
    MenuItem,
    InputAdornment,
    IconButton,
    Grid,
    Box,
    Paper,
    BottomNavigationAction,
    BottomNavigation,
    Autocomplete,
    Chip,
    withStyles,
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

//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';
import { textAlign } from '@mui/system';

import {
    getFontAwesomeIcon,
    //getHostLocations,
    sortDates,
    jumpTo,
    toTitleCase,
} from '../../actions/app';
//import { ProfileAvatar } from '../../common/components';
import { getHostsLocations } from '../../actions/host';
import { getArtists } from '../../actions/artist';
import moment from 'moment';
import ReactPlayer from 'react-player/lazy';

import EventDetails from './EventDetails';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

//filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), []);

// const hostLocations = getHostsLocations();
// console.log(
//     'The hard coded list:',
//     getHostLocations(),
//     'The list from the database:',
//     getHostsLocations()
// );

const UploadInput = styled('input')({
    display: 'none',
});

const prettifyDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const HostEventForm = ({
    hostMe,
    theEvent,
    editHostEvent,
    getHostsLocations,
    getArtists,
    artists,
    hosts,
    history,
    auth,
    myHostEvents, //for disabling dates in the multipledate picker calendar
    jumpTo,
    jumpToState, //user can click Edit Tooltip in EventDetails and jumpToState formField here
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

    //let hostLocations = [];
    //const [hostLocations, setHostLocations] = useState([]);

    useEffect(() => {
        getArtists();
    }, []);

    useEffect(() => {
        getHostsLocations();
        //setHostLocations(hosts);
        // console.log(
        //     'The hard coded list:',
        //     getHostLocations(),
        //     'The list from the database:',
        //     hosts
        // );
    }, []);

    const [formData, setFormData] = useState({
        createdBy: 'HOST',
        // email: '',
        // genres: [],
        // medium: '',
        // active: '',
        // phone: '',
        // hometown: '',
        // streetAddress: '',
        // city: '',
        // state: '',
        // zip: '',
        promotionApproval: '',
        // artistWebsite: '',
        // artistStatementVideo: '',
        // livePerformanceVideo: '',
        // costStructure: '',
        // namedPrice: '',
        // payoutPlatform: 'PayPal',
        // payoutHandle: '',
        tourVibe: [],
        preferredArtists: [],
        bookingWhen: '',
        bookingWhere: {},
        // setLength: '',
        // schedule: '',
        showSchedule: {
            setupTime: '17:45',
            startTime: '19:00',
            doorsOpen: '18:30',
            hardWrap: '21:00',
            flexible: true,
        },
        overnight: '',
        openers: '',
        // travelingCompanions: [],
        //companionTravelers: '',
        hangout: '',
        merchTable: false,
        // allergies: [],
        familyFriendly: false,
        alcohol: false,
        soundSystem: '',
        agreeToPayAdminFee: false,
        agreeToPromote: false,
        // wideImg: '',
        // squareImg: '',
        // covidPrefs: [],
        hostNotes: '',
        // financialHopes: '',
        // fanActions: [],
        // onboardDate: '',
        // bio: '',
        hostUpdated: new Date(),
    });

    useEffect(() => {
        if (theEvent) {
            //console.log('theEvent', theEvent);
            setFormData({
                createdBy: 'HOST',
                // email:
                //     loading || !theEvent.artistEmail
                //         ? ''
                //         : theEvent.artistEmail,
                // medium: loading || !theEvent.medium ? '' : theEvent.medium,
                // genres: loading || !theEvent.genres ? [] : theEvent.genres,
                // soundsLike:
                //     loading || !theEvent.soundsLike ? [] : theEvent.soundsLike,
                // repLinks:
                //     loading || !theEvent.repLinks ? [] : theEvent.repLinks,
                // repLink: loading || !theEvent.repLink ? '' : theEvent.repLink,
                // socialLinks:
                //     loading || !theEvent.socialLinks
                //         ? []
                //         : theEvent.socialLinks,
                // helpKind:
                //     loading || !theEvent.helpKind ? '' : theEvent.helpKind,
                // typeformDate: loading || !theEvent.typeformDate ? '' : theEvent.typeformDate,
                // active: loading || (theEvent.active == null) ? false : theEvent.active,
                // phone: loading || !theEvent.phone ? '' : theEvent.phone,
                // hometown:
                //     loading || !theEvent.hometown ? '' : theEvent.hometown,
                // streetAddress:
                //     loading || !theEvent.streetAddress
                //         ? ''
                //         : theEvent.streetAddress,
                // city: loading || !theEvent.city ? '' : theEvent.city,
                // state: loading || !theEvent.state ? '' : theEvent.state,
                // zip: loading || !theEvent.zip ? '' : theEvent.zip,
                promotionApproval:
                    loading || !theEvent.promotionApproval
                        ? ''
                        : theEvent.promotionApproval,
                // artistWebsite:
                //     loading || !theEvent.artistWebsite
                //         ? ''
                //         : theEvent.artistWebsite,
                // artistStatementVideo:
                //     loading || !theEvent.artistStatementVideo
                //         ? ''
                //         : theEvent.artistStatementVideo,
                // livePerformanceVideo:
                //     loading || !theEvent.livePerformanceVideo
                //         ? ''
                //         : theEvent.livePerformanceVideo,
                // costStructure:
                //     loading || !theEvent.costStructure
                //         ? ''
                //         : theEvent.costStructure,
                // namedPrice:
                //     loading || !theEvent.namedPrice ? '' : theEvent.namedPrice,
                // payoutPlatform:
                //     loading || !theEvent.payoutPlatform
                //         ? 'PayPal'
                //         : theEvent.payoutPlatform,
                // payoutHandle:
                //     loading || !theEvent.payoutHandle
                //         ? ''
                //         : theEvent.payoutHandle,
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
                // setLength:
                //     loading || !theEvent.setLength ? '' : theEvent.setLength,
                // schedule:
                //     loading || !theEvent.schedule ? '' : theEvent.schedule,
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
                // travelingCompanions:
                //     loading || theEvent.travelingCompanions == null
                //         ? []
                //         : theEvent.travelingCompanions,
                // companionTravelers:
                //     loading || theEvent.companionTravelers == null
                //         ? false
                //         : theEvent.companionTravelers,
                hangout:
                    loading || theEvent.hangout == null
                        ? false
                        : theEvent.hangout,
                merchTable:
                    loading || theEvent.merchTable == null
                        ? false
                        : theEvent.merchTable,
                // allergies:
                //     loading || !theEvent.allergies ? [] : theEvent.allergies,
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
                // agreeToPayAdminFee:
                //     loading || theEvent.agreeToPayAdminFee == null
                //         ? false
                //         : theEvent.agreeToPayAdminFee,
                agreeToPromote:
                    loading || theEvent.agreeToPromote == null
                        ? false
                        : theEvent.agreeToPromote,
                // wideImg: loading || !theEvent.wideImg ? '' : theEvent.wideImg,
                // squareImg:
                //     loading || !theEvent.squareImg ? '' : theEvent.squareImg,
                // covidPrefs:
                //     loading || !theEvent.covidPrefs ? [] : theEvent.covidPrefs,
                hostNotes:
                    loading || !theEvent.hostNotes ? '' : theEvent.hostNotes,
                // financialHopes:
                //     loading || !theEvent.financialHopes
                //         ? ''
                //         : theEvent.financialHopes,
                // fanActions:
                //     loading || !theEvent.fanActions ? [] : theEvent.fanActions,
                // onboardDate: loading || !theEvent.onboardDate ? '' : theEvent.onboardDate,
                // bio: loading || !theEvent.bio ? '' : theEvent.bio,
                hostUpdated: new Date(),
            });
        } else {
            if (!auth.loading) {
                // console.log(
                //     'Create a new event with email: ' + auth.user.email
                // );
                setFormData({
                    email: auth.user.email,

                    createdBy: 'HOST',
                    // genres: [],
                    // soundsLike: [],
                    // medium: '',
                    // repLinks: [],
                    // repLink: '',
                    // socialLinks: [],
                    // helpKind: '',
                    // typeformDate: '',
                    // active: '',
                    // phone: '',
                    // hometown: '',
                    // streetAddress: '',
                    // city: '',
                    // state: '',
                    // zip: '',
                    promotionApproval: '',
                    // artistWebsite: '',
                    // artistStatementVideo: '',
                    // livePerformanceVideo: '',
                    // costStructure: '',
                    // namedPrice: '',
                    // payoutPlatform: 'PayPal',
                    // payoutHandle: '',
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
                    // setLength: '',
                    // schedule: '',
                    showSchedule: {
                        setupTime: '17:45',
                        startTime: '19:00',
                        doorsOpen: '18:30',
                        hardWrap: '21:00',
                        flexible: true,
                    },
                    overnight: '',
                    openers: '',
                    // travelingCompanions: [],
                    //companionTravelers: '',
                    hangout: '',
                    merchTable: false,
                    // allergies: [],
                    familyFriendly: false,
                    alcohol: false,
                    soundSystem: '',
                    // agreeToPayAdminFee: false,
                    agreeToPromote: false,
                    // wideImg: '',
                    // squareImg: '',
                    // covidPrefs: [],
                    hostNotes: '',
                    // financialHopes: '',
                    // fanActions: [],
                    // onboardDate: '',
                    // bio: '',
                });
            }
        }
    }, [auth.loading, editHostEvent]);

    const {
        // email,
        // medium,
        // genres,
        // soundsLike,
        // repLinks,
        // repLink,
        // socialLinks,
        // helpKind,
        // typeformDate,
        // active,
        // phone,
        // hometown,
        // streetAddress,
        // city,
        // state,
        // zip,
        promotionApproval,
        // artistWebsite,
        // artistStatementVideo,
        // livePerformanceVideo,
        // costStructure,
        // payoutPlatform,
        // payoutHandle,
        preferredArtists,
        tourVibe,
        // namedPrice,
        bookingWhen,
        bookingWhere,
        // setLength,
        // schedule,
        showSchedule,
        overnight,
        // openers,
        // travelingCompanions,
        //companionTravelers,
        hangout,
        merchTable,
        // allergies,
        familyFriendly,
        alcohol,
        soundSystem,
        // agreeToPayAdminFee,
        agreeToPromote,
        // wideImg,
        // squareImg,
        // covidPrefs,
        hostNotes,
        // financialHopes,
        // fanActions,
        // onboardDate,
        // bio,
    } = formData;

    const stageName = hostMe.stageName;

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
        //console.log(theFieldName);
        //console.log(Object.keys(formGroups).length);
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
            editHostEvent(formData, history, true);
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
        // bookingWhere: [
        //     <FormLabel component="legend">
        //         Please select roughly where you’d like to try to play a concert
        //         on {prettifyDate(bookingWhen)}:
        //     </FormLabel>,
        //     bookingWhere && (
        //         <Grid
        //             className="whenBooking"
        //             container
        //             direction="row"
        //             justifyContent="space-around"
        //             alignItems="start"
        //             spacing={2}
        //             sx={{
        //                 // borderColor: 'primary.dark',
        //                 // borderWidth: '2px',
        //                 // borderStyle: 'solid',
        //                 backgroundColor: 'rgba(0,0,0,0.15)',
        //                 '&:hover': {},
        //                 border: `1px var(--light-color) solid`,
        //                 padding: '0 10px 10px',
        //                 margin: '0px auto',
        //                 width: '100%',
        //             }}
        //         >
        //             {/* <Grid item xs={12} md={3}>
        // 							<TextField
        // 								variant='standard'
        // 								name='bookingWhenWhere'
        // 								id={`bookingWhenWhere${idx}`}
        // 								label={
        // 									"On "+bookingWhen[idx]+" I’d like to play in "
        // 								}
        // 								value={bookingWhenWhere[idx].when || ''}
        // 								onChange={(e) =>
        // 									onMultiTextChange('when', bookingWhenWhere, idx, e)
        // 								}
        // 								sx={{ width: '100%' }}
        // 							/>
        // 						</Grid> */}
        //             <Grid item xs={12} md={12}>
        //                 <Autocomplete
        //                     id="bookingWhere"
        //                     //value={whenBooking && whenBooking.where || whenWhereOrig[idx-1] && whenWhereOrig[idx-1].where || null}
        //                     value={(bookingWhere.city && bookingWhere) || null}
        //                     options={hosts}
        //                     disableClearable
        //                     groupBy={(option) => option.fullState}
        //                     getOptionLabel={(option) =>
        //                         option.city + ', ' + option.state || ''
        //                     }
        //                     //getOptionSelected={(option, value) => option.city === value.city}
        //                     isOptionEqualToValue={(option, value) =>
        //                         option.city === value.city &&
        //                         option.state === value.state
        //                     }
        //                     onChange={(e, value) => {
        //                         onAutocompleteTagChange(
        //                             e,
        //                             'bookingWhere',
        //                             value
        //                         );

        //                         // onMultiAutocompleteTagChange(
        //                         //     'where',
        //                         //     'bookingWhere',
        //                         //     bookingWhere,
        //                         //     idx,
        //                         //     e,
        //                         //     value
        //                         // );
        //                     }}
        //                     renderTags={(value, getTagProps) =>
        //                         value.map((option, index) => (
        //                             <Chip
        //                                 variant="outlined"
        //                                 name="bookingWhere"
        //                                 key={`bookingWhere${index}`}
        //                                 label={
        //                                     option.city + ', ' + option.state
        //                                 }
        //                                 {...getTagProps({
        //                                     index,
        //                                 })}
        //                             />
        //                         ))
        //                     }
        //                     renderInput={(params) => (
        //                         <TextField
        //                             {...params}
        //                             sx={{ width: '100%' }}
        //                             variant="standard"
        //                             label={`On ${prettifyDate(
        //                                 bookingWhen
        //                             )}, I’d love to play in or around`}
        //                             name="bookingWhere"
        //                         />
        //                     )}
        //                 />
        //             </Grid>
        //         </Grid>
        //     ),
        // ],
        preferredArtists: [
            <FormLabel component="legend">
                Who would you like to invite to perform?
            </FormLabel>,
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <Autocomplete
                        multiple
                        id="preferredArtists"
                        value={preferredArtists}
                        options={artists}
                        getOptionLabel={(option) =>
                            option.stageName + ' ' + option.genres
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
                                            {option.stageName}
                                        </Typography>
                                    </Grid>
                                </Tooltip>
                            </li>
                        )}
                        disableCloseOnSelect={true}
                        clearOnBlur={true}
                        onChange={(event, value) =>
                            onAutocompleteTagChange(
                                event,
                                'preferredArtists',
                                value
                            )
                        }
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
                                helperText="(Select the artists you’d like to invite from the list)"
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
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        promotionApproval: [
            <FormLabel component="legend">
                Do you approve Porchlight to use video, photo, and audio
                captured, for promotional purposes?
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
        // openers: [
        //     <FormLabel component="legend">
        //         Let’s talk openers. What’s your preference?
        //     </FormLabel>,
        //     [
        //         <RadioGroup
        //             id="openers"
        //             value={openers}
        //             name="openers"
        //             onChange={(e) => onChange(e)}
        //         >
        //             <FormControlLabel
        //                 value="I plan on travelling with an opener."
        //                 control={<Radio />}
        //                 label="I plan on travelling with an opener."
        //             />
        //             <FormControlLabel
        //                 value="I'd like Porchlight Hosts to invite local openers."
        //                 control={<Radio />}
        //                 label="I'd like Porchlight Hosts to invite local openers."
        //             />
        //             <FormControlLabel
        //                 value="I'd prefer a solo set."
        //                 control={<Radio />}
        //                 label="I'd prefer a solo set."
        //             />
        //             <FormControlLabel
        //                 value="I have no preference."
        //                 control={<Radio />}
        //                 label="I have no preference."
        //             />
        //         </RadioGroup>,
        //     ],
        // ],
        // costStructure: [
        //     <FormLabel component="legend">
        //         What cost structure would you prefer?
        //         <br />
        //         <small>
        //             *We currently offer very few guaranteed shows, for bands
        //             selected at our discretion.
        //         </small>
        //     </FormLabel>,
        //     [
        //         <Grid item>
        //             <RadioGroup
        //                 id="costStructure"
        //                 value={costStructure}
        //                 name="costStructure"
        //                 onChange={(e) => onChange(e)}
        //             >
        //                 <FormControlLabel
        //                     value="ticket"
        //                     control={<Radio />}
        //                     label="Ticketed"
        //                 />
        //                 <FormControlLabel
        //                     value="donation"
        //                     control={<Radio />}
        //                     label="Free RSVP, with a suggested donation"
        //                 />
        //             </RadioGroup>
        //         </Grid>,
        //     ],
        // ],
        // namedPrice: [
        //     <FormLabel component="legend">Name your price.</FormLabel>,
        //     [
        //         <Grid item>
        //             <TextField
        //                 variant="standard"
        //                 name="namedPrice"
        //                 id="namedPrice"
        //                 label={
        //                     costStructure == 'donation'
        //                         ? "I'd suggest a donation of"
        //                         : 'Tickets should cost'
        //                 }
        //                 value={namedPrice}
        //                 onChange={(e) => onChange(e)}
        //                 type="number"
        //                 InputProps={{
        //                     startAdornment: (
        //                         <InputAdornment position="start">
        //                             $
        //                         </InputAdornment>
        //                     ),
        //                 }}
        //             />
        //         </Grid>,
        //     ],
        // ],
        // payoutPlatform: [
        //     <FormLabel component="legend">
        //         For show payout, what is the email address associated with your
        //         Paypal account?
        //     </FormLabel>,
        //     <Grid
        //         container
        //         direction="row"
        //         justifyContent="center"
        //         alignItems="center"
        //         spacing={2}
        //     >
        //         {/* <Grid item>
        // 			<FormControl
        // 				variant='outlined'
        // 				sx={{ minWidth: 160, m: '8px 8px 8px 0' }}
        // 			>
        // 				<InputLabel id='payoutPlatformLabel'>I prefer using</InputLabel>
        // 				<Select
        // 					//variant="standard"
        // 					labelId='payoutPlatformLabel'
        // 					id='payoutPlatform'
        // 					name='payoutPlatform'
        // 					value={payoutPlatform}
        // 					onChange={(e) => onChange(e)}
        // 					label='I prefer using'
        // 				>
        // 					<MenuItem value='PayPal'>PayPal</MenuItem>
        // 					<MenuItem value='Venmo'>Venmo</MenuItem>
        // 					<MenuItem value='Zelle'>Zelle</MenuItem>
        // 					<MenuItem value='Cash App'>Cash App</MenuItem>
        // 				</Select>
        // 			</FormControl>
        // 		</Grid> */}
        //         <Grid item>
        //             <TextField
        //                 variant="standard"
        //                 sx={{ width: 420, maxWidth: '90vw', m: '0 0 0 0' }}
        //                 name="payoutHandle"
        //                 id="payoutHandle"
        //                 label={
        //                     'The handle for my ' +
        //                     payoutPlatform +
        //                     ' account is'
        //                 }
        //                 value={payoutHandle}
        //                 onChange={(e) => onChange(e)}
        //                 helperText=""
        //             />
        //         </Grid>
        //     </Grid>,
        // ],
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
                            label={`No, ${stageName} can play an acoustic show if it makes sense for the size of the space.`}
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        // financialHopes: [
        //     <FormLabel component="legend">
        //         What are your financial expectations and/or hopes for this
        //         concert?
        //     </FormLabel>,
        //     [
        //         // <Grid item>
        //         // 	<TextField
        //         // 		variant='standard'
        //         // 		name='financialHopes'
        //         // 		multiline
        //         // 		id='financialHopes'
        //         // 		label='What are your financial expectations and/or hopes for this show or tour?'
        //         // 		value={financialHopes}
        //         // 		onChange={(e) => onChange(e)}
        //         // 	/>
        //         // </Grid>,
        //         <Grid item>
        //             <TextField
        //                 variant="standard"
        //                 name="financialHopes"
        //                 id="financialHopes"
        //                 label={`It would be hard for me to make less than`}
        //                 value={financialHopes}
        //                 onChange={(e) => onChange(e)}
        //                 type="number"
        //                 InputProps={{
        //                     startAdornment: (
        //                         <InputAdornment position="start">
        //                             $
        //                         </InputAdornment>
        //                     ),
        //                     endAdornment: (
        //                         <InputAdornment position="end">
        //                             {' '}
        //                             per show
        //                         </InputAdornment>
        //                     ),
        //                 }}
        //             />
        //         </Grid>,
        //     ],
        // ],
        // fanActions: [
        //     <FormLabel component="legend">
        //         What are the top ONE or TWO actions you’d like to see new fans
        //         make?
        //     </FormLabel>,
        //     [
        //         <Grid item xs={12} sx={{ width: '100%' }}>
        //             <Autocomplete
        //                 multiple
        //                 id="fanActions"
        //                 value={fanActions}
        //                 options={[]}
        //                 freeSolo
        //                 onChange={(event, value) =>
        //                     onAutocompleteTagChange(event, 'fanActions', value)
        //                 }
        //                 renderTags={(value, getTagProps) =>
        //                     value.map((option, index) => (
        //                         <Chip
        //                             variant="outlined"
        //                             name="fanActions"
        //                             label={option}
        //                             key={`fanAction${index}`}
        //                             {...getTagProps({ index })}
        //                         />
        //                     ))
        //                 }
        //                 renderInput={(params) => (
        //                     <TextField
        //                         {...params}
        //                         sx={{ width: '100%' }}
        //                         variant="standard"
        //                         label={`New fans of ${stageName} should `}
        //                         name="fanActions"
        //                     />
        //                 )}
        //             />
        //         </Grid>,
        //     ],
        // ],
        // agreeToPayAdminFee: [
        //     <FormLabel component="legend">
        //         Porchlight requests 20% of gross ticket sales, tips, and merch
        //         sales (unless other terms have been agreed to in writing). Do
        //         you agree to pay this fee upon completion of the show/tour?
        //     </FormLabel>,
        //     [
        //         <FormControl component="fieldset">
        //             <RadioGroup
        //                 id="agreeToPayAdminFee"
        //                 value={agreeToPayAdminFee}
        //                 name="agreeToPayAdminFee"
        //                 onChange={(e) => onChange(e)}
        //             >
        //                 <FormControlLabel
        //                     value="true"
        //                     control={<Radio />}
        //                     label="Yes"
        //                 />
        //                 <FormControlLabel
        //                     value="false"
        //                     control={<Radio />}
        //                     label="I'd like to discuss this further."
        //                 />
        //             </RadioGroup>
        //         </FormControl>,
        //         <FormLabel component="small">
        //             *We collect this fee so that we can cover our costs of
        //             managing and growing the Porchlight network. If we
        //             experience a surplus at the end of the year, we are
        //             committed (and personally gratified) to invest it back into
        //             the Porchlight network in the form of an artist fund which
        //             we will use for sponsored recording projects, micro
        //             songwriter retreats, artist grants, and other artist
        //             support.
        //         </FormLabel>,
        //     ],
        // ],
        agreeToPromote: [
            <FormLabel component="legend">
                Do you agree to promote this concert to your audience, including
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
        // travelingCompanions: [
        //     <FormLabel component="legend">
        //         Will anybody be travelling with you?
        //     </FormLabel>,
        //     [
        //         travelingCompanions && travelingCompanions.length > 0
        //             ? travelingCompanions.map((travelingCompanion, idx) => (
        //                   <Grid
        //                       className="travelingCompanion"
        //                       key={`travelingCompanion${idx}`}
        //                       container
        //                       direction="row"
        //                       justifyContent="space-around"
        //                       alignItems="start"
        //                       spacing={2}
        //                       sx={{
        //                           // borderColor: 'primary.dark',
        //                           // borderWidth: '2px',
        //                           // borderStyle: 'solid',
        //                           backgroundColor: 'rgba(0,0,0,0.15)',
        //                           '&:hover': {},
        //                           padding: '0 10px 10px',
        //                           margin: '0px auto',
        //                           width: '100%',
        //                       }}
        //                   >
        //                       <Grid item xs={12} md={3}>
        //                           <TextField
        //                               variant="standard"
        //                               name="travelingCompanions"
        //                               id={`travelingCompanionName${idx}`}
        //                               label={
        //                                   travelingCompanions.length > 1
        //                                       ? `One of their names is`
        //                                       : `The person's name is`
        //                               }
        //                               value={travelingCompanion.name}
        //                               onChange={(e) =>
        //                                   onMultiTextChange(
        //                                       'name',
        //                                       travelingCompanions,
        //                                       idx,
        //                                       e
        //                                   )
        //                               }
        //                               sx={{ width: '100%' }}
        //                           />
        //                       </Grid>
        //                       <Grid item xs={12} md={2}>
        //                           <TextField
        //                               variant="standard"
        //                               name="travelingCompanions"
        //                               id={`travelingCompanionRole${idx}`}
        //                               label={
        //                                   travelingCompanion.name
        //                                       ? `${
        //                                             travelingCompanion.name.split(
        //                                                 ' '
        //                                             )[0]
        //                                         }'s role is`
        //                                       : `Their role is`
        //                               }
        //                               value={travelingCompanion.role}
        //                               onChange={(e) =>
        //                                   onMultiTextChange(
        //                                       'role',
        //                                       travelingCompanions,
        //                                       idx,
        //                                       e
        //                                   )
        //                               }
        //                               sx={{ width: '100%' }}
        //                           />
        //                       </Grid>
        //                       <Grid item xs={10} md={true}>
        //                           <TextField
        //                               variant="standard"
        //                               name="travelingCompanions"
        //                               id={`travelingCompanionEmail${idx}`}
        //                               label={
        //                                   travelingCompanion.name
        //                                       ? `${
        //                                             travelingCompanion.name.split(
        //                                                 ' '
        //                                             )[0]
        //                                         }'s email is`
        //                                       : `Their email is`
        //                               }
        //                               value={travelingCompanion.email}
        //                               onChange={(e) =>
        //                                   onMultiTextChange(
        //                                       'email',
        //                                       travelingCompanions,
        //                                       idx,
        //                                       e
        //                                   )
        //                               }
        //                               sx={{ width: '100%' }}
        //                           />
        //                       </Grid>
        //                       <Grid item xs={2} md={0.65}>
        //                           <IconButton
        //                               onClick={(e) =>
        //                                   handleRemoveMultiTextField(
        //                                       'travelingCompanions',
        //                                       travelingCompanions,
        //                                       idx
        //                                   )
        //                               }
        //                           >
        //                               <DeleteIcon />
        //                           </IconButton>
        //                       </Grid>
        //                   </Grid>
        //               ))
        //             : '',
        //         <Grid
        //             container
        //             item
        //             direction="row"
        //             justifyContent="center"
        //             alignItems="center"
        //             xs={12}
        //         >
        //             <Button
        //                 onClick={(e) =>
        //                     handleAddMultiTextField(
        //                         'travelingCompanions',
        //                         travelingCompanions
        //                     )
        //                 }
        //             >
        //                 <PersonAddIcon />
        //                 Add person
        //             </Button>
        //         </Grid>,
        //     ],
        // ],
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
                    {/* <FormControl component="fieldset">
                        <RadioGroup
                            id="overnight"
                            value={overnight}
                            name="overnight"
                            onChange={(e) => onChange(e)}
                        >
                            <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="Yes, for 1 person, please."
                            />
                            {travelingCompanions &&
                            travelingCompanions.length > 0
                                ? travelingCompanions.map(
                                      (travelingCompanion, idx) => (
                                          <FormControlLabel
                                              key={`travelingCompanion${idx}`}
                                              value={idx + 2}
                                              control={<Radio />}
                                              label={
                                                  'Yes, for ' +
                                                  (idx + 2) +
                                                  ' people, please.'
                                              }
                                          />
                                      )
                                  )
                                : ''}
                            <FormControlLabel
                                value="0"
                                control={<Radio />}
                                label="No, thank you."
                            />
                        </RadioGroup>
                    </FormControl> */}
                </Grid>,
            ],
        ],
        hangout: [
            [
                // <Grid
                // 	container
                // 	item
                // 	justifyContent='center'
                // 	alignItems='center'
                // 	spacing={2}
                // 	sx={{
                // 		borderColor: 'primary.dark',
                // 		borderWidth: '2px',
                // 		borderStyle: 'solid',
                // 		backgroundColor: 'rgba(0,0,0,0.15)',
                // 		'&:hover': {},
                // 		padding: '0 10px 10px',
                // 		margin: '0px auto',
                // 		width: '100%',
                // 	}}
                // >
                // 	<FormLabel
                // 		component='p'
                // 		className='small'
                // 		sx={{
                // 			textAlign: 'left!important',
                // 			width: '100%',
                // 			fontSize: '1rem!important',
                // 			lineHeight: '1.3em!important',
                // 			padding: '8px 16px',
                // 		}}
                // 	>
                // 		Our heart at Porchlight is to cultivate relationships between
                // 		artists and hosts. As such, we’d love to make time for a little
                // 		hangout either before or after the show, just for you, your hosts,
                // 		and maybe a couple people interested in meeting with artists like
                // 		you in a more informal setting.
                // 	</FormLabel>
                // </Grid>,

                <Grid item xs={12}>
                    <FormLabel component="legend" sx={{}}>
                        The heart of Porchlight is to cultivate relationships
                        between artists and hosts. Are you open to spending some
                        informal time with your hosts?
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
                                label="That sounds great! Either before or after works for me."
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
        // covidPrefs: [
        //     <FormLabel component="legend">
        //         Beyond host preferences and local guidelines, do you have
        //         particular Covid concerns you’d like these events to adhere to?
        //     </FormLabel>,
        //     <Grid item xs={12} sx={{ width: '100%' }}>
        //         <Autocomplete
        //             id="covidPrefs"
        //             multiple
        //             disableCloseOnSelect
        //             value={covidPrefs}
        //             options={[
        //                 'the host determining what is best',
        //                 'everyone passing a fever check',
        //                 'everyone presenting a negative Covid test',
        //                 'everyone presenting a vaccination passport',
        //                 'everyone social distancing',
        //                 'everyone wearing masks',
        //                 'everything being outdoors',
        //             ]}
        //             onChange={(event, value) =>
        //                 onAutocompleteTagChange(event, 'covidPrefs', value)
        //             }
        //             renderTags={(value, getTagProps) =>
        //                 value.map((option, index) => (
        //                     <Chip
        //                         variant="outlined"
        //                         name="covidPrefs"
        //                         label={option}
        //                         key={`covidPref${index}`}
        //                         {...getTagProps({ index })}
        //                     />
        //                 ))
        //             }
        //             renderInput={(params) => (
        //                 <TextField
        //                     {...params}
        //                     sx={{ width: '100%' }}
        //                     variant="standard"
        //                     label={`I would feel most comfortable with`}
        //                     name="covidPrefs"
        //                 />
        //             )}
        //         />
        //     </Grid>,
        //     {
        //         /* <TextField
        // 		name='covidPrefs'
        // 		id='covidPrefs'
        // 		label='Do you have Covid guidelines you’d like these events to adhere to, beyond local guidelines and host preferences?'
        // 		value={covidPrefs}
        // 		onChange={(e) => onChange(e)}
        // 	/>, */
        //     },
        // ],
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
                    label="Artist Notes"
                    value={hostNotes}
                    onChange={(e) => onChange(e)}
                    sx={{ width: '100%' }}
                />
            </Grid>,
        ],
        endSlide: [
            [
                <Typography component="h2" sx={{ textAlign: 'center' }}>
                    Artists will see the fields you’ve filled out (nothing
                    orange):
                </Typography>,
                <Typography
                    component="p"
                    sx={{ textAlign: 'center', marginTop: '0px' }}
                >
                    (click to edit)
                </Typography>,
            ],
            [
                //Event Details as a host will see it
                //theEvent usually comes from EditHostEvent.js, but if the user is proposing this event we'll hit up the Redux store for the myHostEvents that has a matching bookingWhen
                //
                // <EventDetails
                //     theEvent={{
                //         ...(theEvent ||
                //             myHostEvents.find((event) => {
                //                 if (
                //                     bookingWhen &&
                //                     bookingWhen.length > 0 &&
                //                     bookingWhen[0]
                //                 ) {
                //                     return event.bookingWhen === bookingWhen[0];
                //                 }
                //             })),
                //         artist: hostMe,
                //     }}
                // />,
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
                formNavRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
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
                //     'mostRecentlyUpdatedEvent before:',
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
                delete mostRecentlyUpdatedEventTrimmed.updatedAt;
                delete mostRecentlyUpdatedEventTrimmed.hostsOfferingToBook;
                delete mostRecentlyUpdatedEventTrimmed.offersFromHosts;
                delete mostRecentlyUpdatedEventTrimmed.confirmedHost;
                delete mostRecentlyUpdatedEventTrimmed.confirmedHostUser;
                delete mostRecentlyUpdatedEventTrimmed.confirmedDate;
                delete mostRecentlyUpdatedEventTrimmed.status;
                delete mostRecentlyUpdatedEventTrimmed.updatedAt;
                delete mostRecentlyUpdatedEventTrimmed.hostUpdated;
                delete mostRecentlyUpdatedEventTrimmed.geocodedBookingWhere;

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
    getHostsLocations,
    editHostEvent,
})(withRouter(HostEventForm)); //withRouter allows us to pass history objects