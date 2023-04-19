import axios from 'axios'; //only for uploads as of December 31st, 2021
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { IMAGE_UPLOAD, UPDATE_ARTIST_ME } from '../../actions/types';
import { setAlert } from '../../actions/alert';
import { createMyHost } from '../../actions/host';
import { toTitleCase } from '../../actions/app';
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
    SvgIcon,
    Divider,
    Tooltip,
} from '@mui/material';
import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';
import Button from '../layout/SvgButton';

import HostProfile from '../hosts/HostProfile';

import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import DateRangeTwoToneIcon from '@mui/icons-material/DateRangeTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import LiquorTwoToneIcon from '@mui/icons-material/LiquorTwoTone';
import NoDrinksTwoToneIcon from '@mui/icons-material/NoDrinksTwoTone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';
import { hostRaiseHand } from '../../actions/event';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';
import { textAlign } from '@mui/system';

import {
    getFontAwesomeIcon,
    pullDomainFrom,
    StackDateforDisplay,
} from '../../actions/app';

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

const EventSpecificHostForm = ({
    artist,
    host,
    inDialog, //passed in from EditMyHostProfile.js
    createMyHost,
    history,
    auth,
    theEvent,
    hostRaiseHand,
    bookingDetailsDialogHandleClose,
}) => {
    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        showSchedule: {
            setupTime: '17:45',
            startTime: '19:00',
            doorsOpen: '18:30',
            hardWrap: '21:00',
            flexible: true,
        },
        //refreshments: [],
        refreshments: '',
        overnight: '',
        overnightArrangements: '',
        openers: '',
        houseRules: '',
        eventbritePublicAddress: '',
        additionalRequests: '',
        guaranteeHonorarium: '',
        honorariumAmount: '',
        extraClarification: '',
        seatingProvided: '',
    });

    useEffect(() => {
        if (host.me.firstName) {
            setFormData({
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
                // refreshments:
                //     loading || !host.me.refreshments
                //         ? []
                //         : host.me.refreshments,
                refreshments:
                    loading || !host.me.refreshments
                        ? ''
                        : host.me.refreshments,
                overnight:
                    loading || !host.me.overnight ? '' : host.me.overnight,
                overnightArrangements:
                    loading || !host.me.overnightArrangements
                        ? ''
                        : host.me.overnightArrangements,
                openers: loading || !theEvent.openers ? '' : theEvent.openers,
                houseRules:
                    loading || !host.me.houseRules ? '' : host.me.houseRules,
                eventbritePublicAddress:
                    loading || !host.me.eventbritePublicAddress
                        ? ''
                        : host.me.eventbritePublicAddress,
                additionalRequests:
                    loading || !host.me.additionalRequests
                        ? ''
                        : host.me.additionalRequests,

                guaranteeHonorarium:
                    loading || !host.me.guaranteeHonorarium
                        ? ''
                        : host.me.guaranteeHonorarium,
                honorariumAmount:
                    loading || !host.me.honorariumAmount
                        ? theEvent.financialHopes
                        : host.me.honorariumAmount,
                extraClarification:
                    loading || !host.me.extraClarification
                        ? ''
                        : host.me.extraClarification,
                seatingProvided:
                    loading || !host.me.seatingProvided
                        ? ''
                        : host.me.seatingProvided,
            });
        }
    }, [auth.loading, createMyHost, host.me]);

    const {
        showSchedule,
        refreshments,
        overnight,
        overnightArrangements,
        openers,
        houseRules,
        eventbritePublicAddress,
        additionalRequests,
        guaranteeHonorarium,
        honorariumAmount,
        extraClarification,
        seatingProvided,
    } = formData;

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
        if (theFieldName === 'genres') {
            let theHostGenres = [];
            val.map((genre) => {
                let genreCapitalized = toTitleCase(genre.trim());
                theHostGenres.push(genreCapitalized);
            });
            targetValue = theHostGenres;
        }
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
        console.log(e.target.value);
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

    const onSubmit = (e) => {
        e.preventDefault();
        //console.log('Submitting...');
        //createMyHost(formData, history, true);
        changesMade.current = false;
    };

    const [open, setOpen] = useState(true);

    const formGroups = {
        showSchedule: [
            [
                <FormLabel
                    component="h3"
                    sx={{ fontSize: '1.5em', textAlign: 'center' }}
                >
                    It’s so exciting you’re interested in hosting this{' '}
                    {artist.stageName} show near {theEvent.bookingWhere.city},{' '}
                    {theEvent.bookingWhere.state}!
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{
                        textAlign: 'center',
                        display: 'block',
                        marginBottom: '8px',
                    }}
                >
                    <em>
                        We need only a little more information before you can
                        make an offer to book this show.
                    </em>
                </FormLabel>,
                // <Grid item container justifyContent="center" sx={{}}>
                //     <StackDateforDisplay
                //         date={theEvent.bookingWhen}
                //     ></StackDateforDisplay>
                // </Grid>,
                <FormLabel component="legend" sx={{ marginBottom: '0px' }}>
                    If this schedule doesn’t work for you, please propose
                    whatever changes you need to make.
                </FormLabel>,
            ],
            [
                <Grid item sx={{}}>
                    {artist.stageName} will need to start setting up at
                    <TextField
                        variant="standard"
                        id="setupTime"
                        //label='Alarm clock'
                        type="time"
                        name="showSchedule.setupTime"
                        value={
                            showSchedule.setupTime ||
                            theEvent.showSchedule.setupTime ||
                            ''
                        }
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
                        value={
                            showSchedule.doorsOpen ||
                            theEvent.showSchedule.doorsOpen ||
                            ''
                        }
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
                        value={
                            showSchedule.startTime ||
                            theEvent.showSchedule.startTime ||
                            ''
                        }
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
                        value={
                            showSchedule.hardWrap ||
                            theEvent.showSchedule.hardWrap ||
                            ''
                        }
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
        // refreshments: [
        //     <FormLabel component="legend">
        //         Let's talk refreshments. Do you plan on having any food or
        //         drinks?
        //     </FormLabel>,
        //     <Grid
        //         item
        //         container
        //         xs={12}
        //         sx={{ width: '100%' }}
        //         justifyContent="center"
        //         className="bookingDetails"
        //     >
        //         <Grid item xs={12}>
        //             <Autocomplete
        //                 multiple
        //                 id="refreshments"
        //                 value={refreshments}
        //                 options={[]}
        //                 freeSolo
        //                 clearOnBlur={true}
        //                 onChange={(event, value) =>
        //                     onAutocompleteTagChange(
        //                         event,
        //                         'refreshments',
        //                         value
        //                     )
        //                 }
        //                 renderTags={(value, getTagProps) =>
        //                     value.map((option, index) => (
        //                         <Chip
        //                             variant="outlined"
        //                             name="refreshments"
        //                             label={option}
        //                             {...getTagProps({ index })}
        //                         />
        //                     ))
        //                 }
        //                 renderInput={(params) => (
        //                     <TextField
        //                         {...params}
        //                         sx={{ width: '100%' }}
        //                         variant="standard"
        //                         label={`I was thinking we’d have `}
        //                         name="refreshments"
        //                         helperText="Type and press [enter] to add stuff to the list"
        //                     />
        //                 )}
        //             />
        //         </Grid>
        //         {artist.allergies && artist.allergies.length > 0 && (
        //             <Grid
        //                 item
        //                 sx={{
        //                     marginTop: '8px',
        //                     backgroundColor: 'rgba(0 0 0 /.3)',
        //                     padding: '20px',
        //                     color: 'var(--primary-color)',
        //                 }}
        //                 justifyContent="center"
        //                 xs={12}
        //                 md={5}
        //                 className="allergies"
        //             >
        //                 <SvgIcon
        //                     style={{
        //                         width: '26px',
        //                         verticalAlign: 'baseline',
        //                     }}
        //                 >
        //                     <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
        //                 </SvgIcon>
        //                 {artist.stageName + ' has these allergies: '}
        //                 <strong>
        //                     {artist.allergies.constructor.name === 'Array' &&
        //                         artist.allergies.map((allergy, ind) => {
        //                             if (ind !== artist.allergies.length - 1) {
        //                                 return allergy + ', ';
        //                             } else {
        //                                 return allergy;
        //                             }
        //                         })}{' '}
        //                 </strong>
        //                 .
        //             </Grid>
        //         )}
        //         {artist.alcohol && (
        //             <Grid
        //                 item
        //                 sx={{
        //                     margin: '8px',
        //                     backgroundColor: 'rgba(0 0 0 /.3)',
        //                     padding: '20px',
        //                     color: 'var(--primary-color)',
        //                 }}
        //                 justifyContent="center"
        //                 xs={12}
        //                 md={5}
        //                 className="alcohol"
        //             >
        //                 <LiquorTwoToneIcon></LiquorTwoToneIcon>
        //                 {artist.stageName + ' is comfortable having '}
        //                 <strong>alcohol</strong> at the show.
        //             </Grid>
        //         )}
        //         {!artist.alcohol && (
        //             <Grid
        //                 item
        //                 sx={{
        //                     margin: '8px',
        //                     backgroundColor: 'rgba(0 0 0 /.3)',
        //                     padding: '20px',
        //                     color: 'var(--primary-color)',
        //                 }}
        //                 justifyContent="center"
        //                 xs={12}
        //                 md={5}
        //                 className="alcohol"
        //             >
        //                 <NoDrinksTwoToneIcon></NoDrinksTwoToneIcon>
        //                 {artist.stageName} Would prefer having{' '}
        //                 <strong> no alcohol </strong> at the show.
        //             </Grid>
        //         )}
        //     </Grid>,
        // ],
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
                <Grid
                    item
                    container
                    xs={12}
                    sx={{ width: '100%' }}
                    justifyContent="center"
                    className="bookingDetails"
                >
                    {theEvent.allergies && theEvent.allergies.length > 0 && (
                        <Grid
                            item
                            sx={{
                                marginTop: '8px',
                                backgroundColor: 'rgba(0 0 0 /.3)',
                                padding: '20px',
                                color: 'var(--primary-color)',
                            }}
                            justifyContent="center"
                            xs={12}
                            md={5}
                            className="allergies"
                        >
                            <SvgIcon
                                style={{
                                    width: '26px',
                                    verticalAlign: 'baseline',
                                }}
                            >
                                <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
                            </SvgIcon>
                            {artist.stageName +
                                ' has these allergies/sensitivities: '}
                            <strong>
                                {theEvent.allergies.constructor.name ===
                                    'Array' &&
                                    theEvent.allergies.map((allergy, ind) => {
                                        if (
                                            ind !==
                                            theEvent.allergies.length - 1
                                        ) {
                                            return allergy + ', ';
                                        } else {
                                            return allergy;
                                        }
                                    })}
                            </strong>
                            .
                        </Grid>
                    )}
                    {theEvent.alcohol && (
                        <Grid
                            item
                            sx={{
                                margin: '8px',
                                backgroundColor: 'rgba(0 0 0 /.3)',
                                padding: '20px',
                                color: 'var(--primary-color)',
                            }}
                            justifyContent="center"
                            xs={12}
                            md={5}
                            className="alcohol"
                        >
                            <LiquorTwoToneIcon></LiquorTwoToneIcon>
                            {artist.stageName + ' is comfortable having '}
                            <strong>alcohol</strong> at the show.
                        </Grid>
                    )}
                    {!theEvent.alcohol && (
                        <Grid
                            item
                            sx={{
                                margin: '8px',
                                backgroundColor: 'rgba(0 0 0 /.3)',
                                padding: '20px',
                                color: 'var(--primary-color)',
                            }}
                            justifyContent="center"
                            xs={12}
                            md={5}
                            className="alcohol"
                        >
                            <NoDrinksTwoToneIcon></NoDrinksTwoToneIcon>
                            {artist.stageName} Would prefer having{' '}
                            <strong> no alcohol </strong> at the show.
                        </Grid>
                    )}
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
                            label={`Yes, I've got all the seating needed for at least ${host.me.maxNumAttendees} people.`}
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
        ...(theEvent.overnight &&
            theEvent.overnight > 0 && {
                overnight: [
                    [
                        <FormLabel component="legend">
                            Are you able and willing to host the band overnight?
                        </FormLabel>,
                        <FormLabel
                            component="small"
                            sx={{ textAlign: 'center', display: 'block' }}
                        >
                            <em>
                                {artist.firstName} {artist.lastName} is
                                traveling
                                {theEvent.travelingCompanions &&
                                theEvent.travelingCompanions.length > 0
                                    ? ` with a ` +
                                      theEvent.travelingCompanions.map(
                                          (travelingCompanion, index) =>
                                              theEvent.travelingCompanions
                                                  .length > 1 &&
                                              index ===
                                                  theEvent.travelingCompanions
                                                      .length -
                                                      1
                                                  ? ' and ' +
                                                    travelingCompanion.role
                                                  : ' ' +
                                                    travelingCompanion.role
                                      )
                                    : ' alone'}
                                .
                            </em>
                        </FormLabel>,
                    ],
                    [
                        <FormControl component="fieldset">
                            <RadioGroup
                                id="overnight"
                                value={overnight}
                                name="overnight"
                                onChange={(e) => onChange(e)}
                            >
                                <FormControlLabel
                                    value="yes"
                                    control={<Radio />}
                                    label={`Yes, I can accommodate ${
                                        theEvent.travelingCompanions.length + 1
                                    }
                                 ${
                                     theEvent.travelingCompanions.length + 1 > 1
                                         ? ' people'
                                         : 'person'
                                 } overnight.`}
                                />
                                <FormControlLabel
                                    value="no"
                                    control={<Radio />}
                                    label="No."
                                />
                            </RadioGroup>

                            {/* {overnight && overnight === 'yes' && (
                                <Grid item xs={12} sx={{ width: '100%' }}>
                                    <FormLabel component="legend">
                                        Can you describe the potential sleeping
                                        arrangements?
                                    </FormLabel>
                                    <TextField
                                        variant="standard"
                                        name="overnightArrangements"
                                        id="overnightArrangements"
                                        label={`I'm able to offer `}
                                        value={overnightArrangements}
                                        onChange={(e) => onChange(e)}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            )} */}
                        </FormControl>,
                    ],
                ],
            }),
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
                    shared in an email with only those who{' '}
                    {theEvent.costStructure === 'ticket'
                        ? 'buy a ticket'
                        : 'RSVP'}
                    .
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
                    {host.me.numDraw} people to a show. Considering that we’re{' '}
                    {theEvent.costStructure === 'ticket'
                        ? 'selling tickets for '
                        : 'hoping for individual donations of '}{' '}
                    ${theEvent.namedPrice}, {artist.stageName} is looking at
                    maybe making $
                    {Math.round(
                        (host.me.numDraw * theEvent.namedPrice +
                            Number.EPSILON) *
                            100
                    ) / 100}
                    .
                </FormLabel>,
                <FormLabel component="legend">
                    If the band comes up short of their hoped-for $
                    {theEvent.financialHopes} minimum, we’d like to encourage
                    you to consider offering a{' '}
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
                        personally, if {artist.stageName} reaches out to pursue
                        your offer, rather than through this cold and impersonal
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
                <Typography component="h2" sx={{ textAlign: 'center' }}>
                    That’s everything we think {artist.stageName} will need, in
                    order to make a decision about this show.
                </Typography>,
                <Typography
                    component="p"
                    sx={{ textAlign: 'center', marginTop: '20px' }}
                >
                    As soon as you submit this offer, a notification will be
                    sent to {artist.stageName}, so that we can hopefully get
                    this show booked for{' '}
                    {new Date(theEvent.bookingWhen).toLocaleDateString(
                        undefined,
                        {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }
                    )}{' '}
                    near {theEvent.bookingWhere.city},{' '}
                    {theEvent.bookingWhere.state}.
                </Typography>,
                <Typography
                    component="p"
                    sx={{ textAlign: 'center', marginTop: '20px' }}
                >
                    <em>
                        {artist.stageName} will review this offer, and contact
                        you by phone or email if it seems like a good fit.
                    </em>
                </Typography>,
                <Grid
                    item
                    container
                    justifyContent="center"
                    sx={{ marginTop: '8px' }}
                >
                    <Button
                        btnwidth="300"
                        onClick={(e) => {
                            hostRaiseHand({
                                artist: artist,
                                bookingWhen: theEvent.bookingWhen,
                                theOffer: formData,
                            });
                            bookingDetailsDialogHandleClose();
                        }}
                    >
                        Submit My Offer To Host
                    </Button>
                </Grid>,
                <Grid
                    item
                    container
                    justifyContent="center"
                    sx={{
                        marginTop: 3,
                        borderTop: 'dashed 2px var(--primary-color)',
                    }}
                >
                    <Typography
                        component="h2"
                        sx={{
                            paddingTop: 2,
                            textAlign: 'center',
                        }}
                    >
                        Below is what {artist.stageName} will see when reviewing
                        your offer:
                    </Typography>
                </Grid>,
                <Grid
                    item
                    container
                    justifyContent="center"
                    sx={{ marginTop: '8px' }}
                >
                    <HostProfile
                        theHost={host.me}
                        theEvent={theEvent}
                        theOffer={formData}
                    ></HostProfile>
                </Grid>,
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

    //// CARD INDEX ///////
    const [formCardIndex, setIndex] = useState(formStartIndex);

    const cardIndex = formCardIndex;

    const [formCardDirection, setDirection] = useState(1);
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
        setDirection(1);
        if (changesMade.current) {
            onSubmit(e);
        }
        setIndex((cardIndex) => {
            //(cardIndex + 1) % Object.keys(formGroups).length;
            if (cardIndex === Object.keys(formGroups).length - 1) {
                //if it's at the end there's nothing next, don't loop around
                return cardIndex;
            } else {
                return cardIndex + 1;
            }
        });
    };
    const previousCard = (e) => {
        setDirection(-1);
        if (changesMade.current) {
            onSubmit(e);
        }
        setIndex((cardIndex) => {
            // if (cardIndex == 0) { //loop around to the last index
            //     cardIndex = Object.keys(formGroups).length;
            // }
            if (cardIndex == 0) {
                //if it's at the benninging there's nothing previous, don't loop around
                return cardIndex;
            } else {
                return cardIndex - 1;
            }
        });
    };

    return (
        <Fragment>
            {/* <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(0 0 0 /.6)',
                    padding: '0',
                }}
            >
                <StackDateforDisplay
                    date={theEvent.bookingWhen}
                ></StackDateforDisplay>
            </Box> */}
            <form className="form" onSubmit={(e) => onSubmit(e)}>
                <Grid container sx={{ padding: '20px!important' }}>
                    <Grid
                        container
                        item
                        sx={{ width: '100%' }}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        className="cardNav"
                    >
                        <Grid item>
                            {/* { cardIndex > 0 ? (  */}
                            <Button
                                variant="contained"
                                component="span"
                                onClick={(e) => previousCard(e)}
                                sx={{
                                    opacity: cardIndex > 0 ? 1 : 0.2,
                                    transition:
                                        'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 500ms',
                                }}
                            >
                                <ArrowBackIcon></ArrowBackIcon>Previous
                            </Button>
                            {/* ) : '' } */}
                        </Grid>
                        {/* <Grid item>
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
                        </Grid> */}
                        <Grid item>
                            {/* { cardIndex < formGroups.length - 1 ? ( */}
                            <Button
                                variant="contained"
                                component="span"
                                onClick={(e) => nextCard(e)}
                                sx={{
                                    opacity:
                                        cardIndex !==
                                        Object.keys(formGroups).length - 1
                                            ? 1
                                            : 0.2,
                                    transition:
                                        'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 500ms',
                                }}
                            >
                                Next<ArrowForwardIcon></ArrowForwardIcon>
                            </Button>
                            {/* ) : ''} */}
                        </Grid>
                    </Grid>
                </Grid>
                {transitions((style, i) => (
                    <animated.div
                        className={'animatedFormGroup'}
                        key={'animatedFormGroup' + i}
                        style={{
                            ...style,
                        }}
                    >
                        <div
                            className="form-group"
                            key={'form-group' + i}
                            style={{ maxWidth: '100%' }}
                        >
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
                                //className="bookingDetails"
                            >
                                {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}> */}

                                {/* {formGroups && formGroups.length > 0 ? formGroups[i].map((formGroup, ind) => (  */}
                                <Grid
                                    item
                                    xs={12}
                                    sx={{ '--form-num': `'${i + 1}'` }}
                                    data-form-num={i + 1}
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

EventSpecificHostForm.propTypes = {
    createMyHost: PropTypes.func.isRequired,
    host: PropTypes.object.isRequired,
    artist: PropTypes.object.isRequired,
    theEvent: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    inDialog: PropTypes.object,

    hostRaiseHand: PropTypes.func.isRequired,

    bookingDetailsDialogHandleClose: PropTypes.func,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    host: state.host,
    //artist: state.artist.artist,
});

export default connect(mapStateToProps, {
    hostRaiseHand,
    createMyHost,
})(withRouter(EventSpecificHostForm)); //withRouter allows us to pass history objects
