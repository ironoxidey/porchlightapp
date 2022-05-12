import axios from 'axios'; //only for uploads as of December 31st, 2021
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { IMAGE_UPLOAD, UPDATE_ARTIST_ME } from '../../actions/types';
import { setAlert } from '../../actions/alert';
import { createMyHost } from '../../actions/host';
import { updateUserAvatar } from '../../actions/auth';
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
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

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

//import { DateRangePicker, DateRange } from "materialui-daterange-picker";
//import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker';
import MultipleDatesPicker from '../mui-multi-date-picker-lib';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';
import { textAlign } from '@mui/system';

import {
    getFontAwesomeIcon,
    getHostLocations,
    pullDomainFrom,
} from '../../actions/app';
import moment from 'moment';
import ReactPlayer from 'react-player/lazy';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

//filter() for Objects -- https://stackoverflow.com/a/37616104/3338608
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), []);

const hostLocations = getHostLocations();

const UploadInput = styled('input')({
    display: 'none',
});

const EditHostProfileForm = ({
    theHost, //passed in from EditMyHostProfile.js
    inDialog, //passed in from EditMyHostProfile.js
    createMyHost,
    history,
    auth,
    updateUserAvatar,
    hostMe,
}) => {
    //Booking Details Dialog Functions
    const [hostDetailsDialogOpen, setHostDetailsDialogOpen] = useState(false);

    const [wantsToBook, setWantsToBook] = useState(false);

    const hostDetailsDialogHandleClose = () => {
        setDialogDetailsState({});
        setHostDetailsDialogOpen(false);
        setWantsToBook(false);
    };

    const [hostDialogDetails, setDialogDetailsState] = useState({});

    useEffect(() => {
        console.log('hostDialogDetails', hostDialogDetails);
        setHostDetailsDialogOpen(true);
    }, [hostDialogDetails]);

    const handleEventBtnClick = (hostMe) => {
        setDialogDetailsState(hostMe);
    };
    //End of Dialog Functions

    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        profileImg: '',
        numDraw: '',
        numHostedBefore: '',
        phone: '',
        connectionToUs: '',
        primarySpace: '',
        venueStreetAddress: '',
        venueCity: '',
        venueState: '',
        venueZipCode: '',
        venueNickname: '',
        backupPlan: '',
        maxNumAttendees: '',
        //seatingProvided: '',
        venueImg: '',
        specialNavDirections: '',
        overnight: '',
        overnightArrangements: '',
        guaranteeHonorarium: '',
        lastLogin: new Date(),
    });

    useEffect(() => {
        if (theHost.firstName) {
            setFormData({
                firstName:
                    loading || !theHost.firstName ? '' : theHost.firstName,
                lastName: loading || !theHost.lastName ? '' : theHost.lastName,
                email: loading || !theHost.email ? '' : theHost.email,
                streetAddress:
                    loading || !theHost.streetAddress
                        ? ''
                        : theHost.streetAddress,
                city: loading || !theHost.city ? '' : theHost.city,
                state: loading || !theHost.state ? '' : theHost.state,
                zipCode: loading || !theHost.zipCode ? '' : theHost.zipCode,
                profileImg:
                    loading || !theHost.profileImg ? '' : theHost.profileImg,
                numDraw: loading || !theHost.numDraw ? '' : theHost.numDraw,
                numHostedBefore:
                    loading || !theHost.numHostedBefore
                        ? ''
                        : theHost.numHostedBefore,
                phone: loading || !theHost.phone ? '' : theHost.phone,
                connectionToUs:
                    loading || !theHost.connectionToUs
                        ? ''
                        : theHost.connectionToUs,
                primarySpace:
                    loading || !theHost.primarySpace
                        ? ''
                        : theHost.primarySpace,
                venueStreetAddress:
                    loading || !theHost.venueStreetAddress
                        ? ''
                        : theHost.venueStreetAddress,
                venueCity:
                    loading || !theHost.venueCity ? '' : theHost.venueCity,
                venueState:
                    loading || !theHost.venueState ? '' : theHost.venueState,
                venueZipCode:
                    loading || !theHost.venueZipCode
                        ? ''
                        : theHost.venueZipCode,
                venueNickname:
                    loading || !theHost.venueNickname
                        ? ''
                        : theHost.venueNickname,
                backupPlan:
                    loading || !theHost.backupPlan ? '' : theHost.backupPlan,
                maxNumAttendees:
                    loading || !theHost.maxNumAttendees
                        ? ''
                        : theHost.maxNumAttendees,
                // seatingProvided:
                //     loading || !theHost.seatingProvided
                //         ? ''
                //         : theHost.seatingProvided,
                venueImg: loading || !theHost.venueImg ? '' : theHost.venueImg,
                specialNavDirections:
                    loading || !theHost.specialNavDirections
                        ? ''
                        : theHost.specialNavDirections,
                overnight:
                    loading || !theHost.overnight ? '' : theHost.overnight,
                overnightArrangements:
                    loading || !theHost.overnightArrangements
                        ? ''
                        : theHost.overnightArrangements,
                guaranteeHonorarium:
                    loading || !theHost.guaranteeHonorarium
                        ? ''
                        : theHost.guaranteeHonorarium,
                lastLogin: new Date(),
            });
        } else {
            if (!auth.loading) {
                console.log(
                    'A host profile couldn’t be found for: ' +
                        auth.user.email +
                        '. No worries! We’ll make one!'
                );
                setFormData({
                    firstName: auth.user.name.split(' ')[0],
                    lastName: auth.user.name.split(' ')[1],
                    email: auth.user.email,
                    streetAddress: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    profileImg: '',
                    numDraw: '',
                    numHostedBefore: '',
                    phone: '',
                    connectionToUs: '',
                    primarySpace: '',
                    venueStreetAddress: '',
                    venueCity: '',
                    venueState: '',
                    venueZipCode: '',
                    venueNickname: '',
                    backupPlan: '',
                    maxNumAttendees: '',
                    //seatingProvided: '',
                    venueImg: '',
                    specialNavDirections: '',
                    overnight: '',
                    overnightArrangements: '',
                    guaranteeHonorarium: '',
                    lastLogin: new Date(),
                });
            }
        }
    }, [auth.loading, createMyHost, theHost]);

    const {
        firstName,
        lastName,
        email,
        streetAddress,
        city,
        state,
        zipCode,
        profileImg,
        numDraw,
        numHostedBefore,
        phone,
        connectionToUs,
        primarySpace,
        venueStreetAddress,
        venueCity,
        venueState,
        venueZipCode,
        venueNickname,
        backupPlan,
        maxNumAttendees,
        //seatingProvided,
        venueImg,
        specialNavDirections,
        overnight,
        overnightArrangements,
        guaranteeHonorarium,
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

    useEffect(() => {
        if (changesMade.current) {
            createMyHost(formData, history, true);
            changesMade.current = false;
        }
    }, [venueImg]);

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

    const cloudinaryUpload = async (fieldName, tags, hostID, preset) => {
        let imageRatio =
            fieldName === 'profileImg' ? 'a square image' : 'an image';

        const stringToSign = {
            public_id: 'uploads/' + hostID + '/' + fieldName,
            uploadPreset: preset,
            tags: tags,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...stringToSign,
        };
        const response = await axios.post(
            `/api/cloudinary/upload-signature`,
            config
        );
        const data = response.data;

        window.cloudinary.openUploadWidget(
            //added cloudinary script to /public/index.html
            {
                ...stringToSign,
                apiKey: '622466913451276', //data.apikey,
                uploadSignatureTimestamp: data.timestamp,
                uploadSignature: data.signature,

                cloudName: 'porchlight',
                clientAllowedFormats: 'image',
                sources: [
                    'local',
                    'url',
                    'camera',
                    'google_drive',
                    'facebook',
                    'dropbox',
                    'instagram',
                ],
                googleApiKey: '<image_search_google_api_key>',
                showAdvancedOptions: true,
                //cropping: true,
                multiple: false,
                defaultSource: 'local',
                text: {
                    en: {
                        menu: {
                            files: 'My Device',
                        },
                        local: {
                            browse: 'Browse',
                            dd_title_single:
                                'Drag and Drop ' + imageRatio + ' here',
                            dd_title_multi: 'Drag and Drop assets here',
                            drop_title_single:
                                'Drop ' + imageRatio + ' to upload',
                            drop_title_multiple: 'Drop files to upload',
                        },
                    },
                },
                styles: {
                    palette: {
                        // window: '#100F0E',
                        // sourceBg: '#384847',
                        // windowBorder: '#8BADAA',
                        tabIcon: '#7a9492',
                        inactiveTabIcon: '#4D5553',
                        //menuIcons: '#FFA14E',
                        link: '#FFA14E',
                        action: '#FFA14E',
                        inProgress: '#FFA14E',
                        complete: '#7A9492',
                        error: '#c43737',
                        textDark: '#000000',
                        textLight: '#FFFFD9',
                    },
                    frame: {
                        background: '#100f0eaa',
                    },
                    fonts: {
                        default: null,
                        "'Merriweather', serif": {
                            url: 'https://fonts.googleapis.com/css?family=Merriweather',
                            active: true,
                        },
                    },
                },
            },
            (err, info) => {
                if (!err) {
                    if (info.event === 'success') {
                        //console.log('info: ', info.info);
                        changesMade.current = true;
                        setFormData({
                            ...formData,
                            [fieldName]: info.info.secure_url,
                        });
                        dispatch({
                            type: IMAGE_UPLOAD,
                            payload: info.info.secure_url,
                        });
                        dispatch(
                            setAlert(
                                info.info.original_filename +
                                    ' uploaded successfully.',
                                'success'
                            )
                        );
                        if (preset == 'porchlight_squareImg_upload') {
                            updateUserAvatar({ avatar: info.info.secure_url });
                        }

                        //addUploadToDB(preset, info);
                    }
                    //console.log('Upload Widget event - ', info);
                    return info;
                }
            }
        );
    };

    //const [changesMade, setChangesMade] = useState(false);
    const changesMade = useRef(false);
    const firstLoad = useRef(true);

    const onSubmit = (e) => {
        e.preventDefault();
        //console.log('Submitting...');
        createMyHost(formData, history, true);
        changesMade.current = false;
    };

    const [open, setOpen] = useState(true);

    const formGroups = {
        firstName: [
            [
                <FormLabel
                    component="h3"
                    sx={{ fontSize: '1.5em', textAlign: 'center' }}
                >
                    Thanks for your interest in becoming a host!
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{
                        textAlign: 'left',
                        display: 'block',
                        maxWidth: '600px',
                    }}
                >
                    {!inDialog ? (
                        <Fragment>
                            Just so you know: answering these questions does not
                            obligate you to host any particular event. This
                            questionnaire signifies your interest to host, and
                            loops you in to updates and opportunities to host.
                            <br />
                            <br />
                            <em>
                                Also, the information you submit is for internal
                                use only, and will never be sold to a third
                                party.
                            </em>
                        </Fragment>
                    ) : (
                        <Fragment>
                            We need some information, in order for you to offer
                            to host an artist on the Porchlight network.
                            <br />
                            <br />
                            <em>
                                The information you submit is for internal use
                                only, and will never be sold to a third party.
                            </em>
                        </Fragment>
                    )}
                </FormLabel>,
                <FormLabel component="legend">
                    Starting off, what is your name?
                </FormLabel>,
            ],
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ width: '100%' }}
            >
                <Grid item xs={12} sm={6} textAlign="center">
                    <TextField
                        variant="standard"
                        name="firstName"
                        id="firstName"
                        label="My first name is"
                        value={firstName}
                        onChange={(e) => onChange(e)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} textAlign="center">
                    <TextField
                        variant="standard"
                        name="lastName"
                        id="lastName"
                        label="and my last name is"
                        value={lastName}
                        onChange={(e) => onChange(e)}
                    />
                </Grid>
            </Grid>,
        ],
        city: [
            [
                <FormLabel component="legend">
                    What is the address of your residence?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    <em>
                        Even if you don't plan on hosting at your residence, we
                        sometimes snail-mail resources to our hosts.
                    </em>
                </FormLabel>,
            ],
            [
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                            variant="standard"
                            name="streetAddress"
                            id="streetAddress"
                            label="At the street address of"
                            value={streetAddress}
                            onChange={(e) => onChange(e)}
                            sx={{ width: '100%' }}
                        />
                    </Grid>
                </Grid>,
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ marginTop: '8px' }}
                >
                    <Grid item>
                        <TextField
                            variant="standard"
                            name="city"
                            id="city"
                            label="In the city of"
                            value={city}
                            onChange={(e) => onChange(e)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="standard"
                            name="state"
                            id="state"
                            label="in the state of"
                            value={state}
                            onChange={(e) => onChange(e)}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            variant="standard"
                            name="zipCode"
                            id="zipCode"
                            label="with the zip code"
                            value={zipCode}
                            onChange={(e) => onChange(e)}
                        />
                    </Grid>
                </Grid>,
            ],
        ],
        profileImg: [
            <FormLabel component="legend">
                We’d love to have a face to put with your name, {firstName}.
                Would you upload a square picture that we could send to an
                artist if you offer to book their show?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <label htmlFor="profileImg">
                        <Button
                            variant="contained"
                            component="span"
                            onClick={(e) => {
                                cloudinaryUpload(
                                    'profileImg',
                                    [
                                        theHost.firstName + theHost.lastName,
                                        'profileImg',
                                    ],
                                    theHost._id,
                                    'porchlight_profileImg_upload'
                                );
                                // clickWideUpload();
                            }}
                        >
                            <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>
                            Upload
                        </Button>
                    </label>
                </FormControl>,
                profileImg ? (
                    <img
                        className="venueImg-image uploaded-image"
                        src={profileImg}
                        alt=""
                        style={{
                            marginTop: '16px',
                            maxHeight: '60vh',
                            maxWidth: '90vw',
                            height: 'auto',
                            width: 'auto',
                        }}
                    />
                ) : (
                    ''
                ),
            ],
        ],
        numDraw: [
            [
                <FormLabel component="legend">
                    How many people do you think you could draw to an event?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    <em>
                        Do not include what a musician or band might bring:
                        we’re curious about your own “draw.”{' '}
                    </em>
                </FormLabel>,
            ],
            [
                <Grid item>
                    <TextField
                        variant="standard"
                        name="numDraw"
                        id="numDraw"
                        label="I could draw about "
                        value={numDraw}
                        helperText="people to an event."
                        onChange={(e) => onChange(e)}
                        type="number"
                    />
                </Grid>,
            ],
        ],
        numHostedBefore: [
            <FormLabel component="legend">
                How many concerts like this have you hosted before?
            </FormLabel>,
            [
                <Grid item>
                    <TextField
                        variant="standard"
                        name="numHostedBefore"
                        id="numHostedBefore"
                        label="I’ve hosted "
                        value={numHostedBefore}
                        helperText="events like this before."
                        onChange={(e) => onChange(e)}
                        type="number"
                    />
                </Grid>,
            ],
        ],
        phone: [
            [
                <FormLabel component="legend">
                    Would you provide your phone number?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    <em>
                        Sometimes last-minute event changes need a quick way to
                        get in touch.
                    </em>
                </FormLabel>,
            ],
            [
                <Grid item>
                    <ReactPhoneInput
                        name="phone"
                        id="phone"
                        value={phone || ''}
                        onChange={(val) => onPhoneChange('phone', val)}
                        helperText=""
                        component={TextField}
                        inputExtraProps={{
                            name: 'phone',
                            variant: 'standard',
                            label: 'My phone number is',
                        }}
                        autoFormat={true}
                        defaultCountry={'us'}
                        onlyCountries={['us']}
                        disableCountryCode={true}
                        placeholder={''}
                    />
                </Grid>,
            ],
        ],
        connectionToUs: [
            [
                <FormLabel component="legend">
                    How did you hear about Porchlight?
                </FormLabel>,
            ],
            <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                    variant="standard"
                    name="connectionToUs"
                    id="connectionToUs"
                    label="It’s a funny story..."
                    value={connectionToUs}
                    onChange={(e) => onChange(e)}
                    sx={{ width: '100%' }}
                />
            </Grid>,
        ],
        primarySpace: [
            <FormLabel component="legend">
                What space do you expect to primarily host at?
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <Autocomplete
                    id="primarySpace"
                    value={primarySpace}
                    disableClearable
                    options={['residence', 'church', 'business', 'park']}
                    freeSolo
                    onChange={(event, value) =>
                        onAutocompleteTagChange(event, 'primarySpace', value)
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '100%' }}
                            variant="standard"
                            label={`At my `}
                            name="primarySpace"
                        />
                    )}
                />
            </Grid>,
        ],
        venueNickname: [
            [
                <FormLabel component="legend">
                    Does your {primarySpace || 'place'} have a name?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    <em>
                        Sometimes people even come up with a nickname for their
                        house venue!
                    </em>
                </FormLabel>,
            ],
            [
                <Grid item xs={12} sx={{ width: '100%' }}>
                    <TextField
                        variant="standard"
                        name="venueNickname"
                        id="venueNickname"
                        label={`Yeah, we call my ${primarySpace || 'place'} `}
                        value={venueNickname}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
                primarySpace === 'residence'
                    ? ''
                    : [
                          <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              spacing={2}
                          >
                              <Grid item xs={12}>
                                  <TextField
                                      variant="standard"
                                      name="venueStreetAddress"
                                      id="venueStreetAddress"
                                      label="At the street address of"
                                      value={venueStreetAddress}
                                      onChange={(e) => onChange(e)}
                                      sx={{ width: '100%' }}
                                  />
                              </Grid>
                          </Grid>,
                          <Grid
                              container
                              direction="row"
                              justifyContent="center"
                              alignItems="center"
                              spacing={2}
                              sx={{ marginTop: '8px' }}
                          >
                              <Grid item>
                                  <TextField
                                      variant="standard"
                                      name="venueCity"
                                      id="venueCity"
                                      label="In the city of"
                                      value={venueCity}
                                      onChange={(e) => onChange(e)}
                                  />
                              </Grid>
                              <Grid item>
                                  <TextField
                                      variant="standard"
                                      name="venueState"
                                      id="venueState"
                                      label="in the state of"
                                      value={venueState}
                                      onChange={(e) => onChange(e)}
                                  />
                              </Grid>
                              <Grid item>
                                  <TextField
                                      variant="standard"
                                      name="venueZipCode"
                                      id="venueZipCode"
                                      label="with the zip code"
                                      value={venueZipCode}
                                      onChange={(e) => onChange(e)}
                                  />
                              </Grid>
                          </Grid>,
                      ],
            ],
        ],
        backupPlan: [
            [
                <FormLabel component="legend">
                    If the space is outdoors, is there a convenient "plan B"
                    space in the case of bad weather?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    <em>
                        A contingency is not necessary, but it’s good to know if
                        there is one or not.
                    </em>
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="backupPlan"
                        value={backupPlan}
                        name="backupPlan"
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
        maxNumAttendees: [
            <FormLabel component="legend">
                What do you think is the maximum number of attendees you can
                host at your {primarySpace}?
            </FormLabel>,
            [
                <Grid item>
                    <TextField
                        variant="standard"
                        name="maxNumAttendees"
                        id="maxNumAttendees"
                        label={`I think I can host about `}
                        value={maxNumAttendees}
                        helperText={`people at my ${primarySpace}`}
                        onChange={(e) => onChange(e)}
                        type="number"
                    />
                </Grid>,
            ],
        ],
        venueImg: [
            <FormLabel component="legend">
                If it's not too much trouble, could you please provide an image
                of this space?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <label htmlFor="venueImg">
                        <Button
                            variant="contained"
                            component="span"
                            onClick={(e) => {
                                cloudinaryUpload(
                                    'venueImg',
                                    [theHost.stageName, 'venueImg'],
                                    theHost._id,
                                    'porchlight_venueImg_upload'
                                );
                                // clickWideUpload();
                            }}
                        >
                            <AddPhotoAlternateTwoToneIcon></AddPhotoAlternateTwoToneIcon>
                            Upload
                        </Button>
                    </label>
                </FormControl>,
                venueImg ? (
                    <img
                        className="venueImg-image uploaded-image"
                        src={venueImg}
                        alt=""
                        style={{
                            marginTop: '16px',
                            maxHeight: '60vh',
                            maxWidth: '90vw',
                            height: 'auto',
                            width: 'auto',
                        }}
                    />
                ) : (
                    ''
                ),
            ],
        ],
        specialNavDirections: [
            <FormLabel component="legend" sx={{ maxWidth: '600px' }}>
                Sometimes GPS doesn’t do a perfect job getting people to certain
                spots. Please list any special directions or instructions for
                people navigating to the venue on the day of the show.
            </FormLabel>,
            <Grid item xs={12} sx={{ width: '100%' }}>
                <TextField
                    variant="standard"
                    name="specialNavDirections"
                    multiline
                    id="specialNavDirections"
                    label="specialNavDirections"
                    value={specialNavDirections}
                    onChange={(e) => onChange(e)}
                    sx={{ width: '100%' }}
                />
            </Grid>,
        ],

        endSlide: [
            [
                <Typography component="h2" sx={{ textAlign: 'center' }}>
                    Those were all the questions we have for right now.
                </Typography>,
                <Typography
                    component="p"
                    sx={{ textAlign: 'center', marginTop: '20px' }}
                >
                    Thank you for taking the time to respond to them! Please
                    check your profile to be sure everything is correct.
                </Typography>,
                hostMe && hostMe._id === theHost._id && (
                    <Grid
                        item
                        container
                        justifyContent="center"
                        sx={{ marginTop: '16px' }}
                    >
                        <Button
                            btnwidth="240"
                            onClick={(e) => {
                                handleEventBtnClick(hostMe);
                            }}
                        >
                            {/* <HowToRegTwoToneIcon
                                sx={{ marginRight: '8px' }}
                            ></HowToRegTwoToneIcon>{' '} */}
                            View My Host Profile
                        </Button>
                    </Grid>
                ),
            ],
            // [
            //     slug && (
            //         <Grid
            //             item
            //             sx={{
            //                 margin: '8px auto',
            //             }}
            //         >
            //             <Link to={'/artists/' + slug}>
            //                 <Button btnwidth="300" className="">
            //                     <AccountBoxTwoToneIcon /> View My Profile
            //                 </Button>
            //             </Link>
            //         </Grid>
            //     ),
            //     theHost.bookingWhen && theHost.bookingWhen.length > 0 ? (
            //         <Grid
            //             item
            //             sx={{
            //                 margin: '8px auto',
            //             }}
            //         >
            //             <Link to="/edit-artist-booking">
            //                 <Button btnwidth="300" className="">
            //                     <DateRangeTwoToneIcon /> Edit My Booking Info
            //                 </Button>
            //             </Link>
            //         </Grid>
            //     ) : theHost.active ? (
            //         <Grid
            //             item
            //             sx={{
            //                 margin: '8px auto',
            //             }}
            //         >
            //             <p> </p>
            //             <Link to="/edit-artist-booking">
            //                 <Button className="">Start Booking Shows</Button>
            //             </Link>
            //         </Grid>
            //     ) : (
            //         ''
            //     ),
            // ],
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
        setIndex(
            (cardIndex) => (cardIndex + 1) % Object.keys(formGroups).length
        );
        if (changesMade.current) {
            onSubmit(e);
        }
    };
    const previousCard = (e) => {
        setDirection(-1);
        setIndex((cardIndex) => {
            if (cardIndex == 0) {
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
        <>
            {hostDialogDetails && hostDialogDetails._id && (
                <Dialog
                    open={hostDetailsDialogOpen}
                    onClose={hostDetailsDialogHandleClose}
                    // aria-labelledby="alert-dialog-title"
                    // aria-describedby="alert-dialog-description"
                    scroll="body"
                    fullWidth
                    maxWidth="md"
                >
                    {/* <DialogTitle id="alert-dialog-title"></DialogTitle> */}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <HostProfile
                                theHost={hostDialogDetails}
                                //theEvent={thisEvent}
                                //theOffer={hostDialogDetails}
                                hostDetailsDialogHandleClose={
                                    hostDetailsDialogHandleClose
                                }
                            ></HostProfile>
                        </DialogContentText>
                    </DialogContent>
                    {/* <DialogActions>
                    <Button onClick={hostDetailsDialogHandleClose}>
                        Close
                    </Button>
                </DialogActions> */}
                </Dialog>
            )}
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
        </>
    );
};

EditHostProfileForm.propTypes = {
    createMyHost: PropTypes.func.isRequired,
    theHost: PropTypes.object,
    auth: PropTypes.object.isRequired,
    updateUserAvatar: PropTypes.func.isRequired,
    inDialog: PropTypes.object,
    hostMe: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    hostMe: state.host.me,
});

export default connect(mapStateToProps, {
    createMyHost,
    updateUserAvatar,
})(withRouter(EditHostProfileForm)); //withRouter allows us to pass history objects
