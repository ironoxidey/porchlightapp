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
} from '@mui/material';
import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';
import Button from '../layout/SvgButton';

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

import { getFontAwesomeIcon, pullDomainFrom } from '../../actions/app';

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
        refreshments: [],
        overnight: '',
        overnightArrangements: '',
        openers: '',
        houseRules: '',
        eventbritePublicAddress: '',
        additionalRequests: '',
        guaranteeHonorarium: '',
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
                refreshments:
                    loading || !host.me.refreshments
                        ? []
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
            <FormLabel component="legend">
                Does this schedule work for you?
            </FormLabel>,
            [
                <Grid item>
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
                        sx={{ padding: '0 8px' }}
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
                        sx={{ padding: '0 8px' }}
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
                        sx={{ padding: '0 0 0 8px' }}
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
                        sx={{ padding: '0 0 0 8px' }}
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
            <Grid item xs={12} sx={{ width: '100%' }}>
                <Autocomplete
                    multiple
                    id="refreshments"
                    value={refreshments}
                    options={[]}
                    freeSolo
                    clearOnBlur={true}
                    onChange={(event, value) =>
                        onAutocompleteTagChange(event, 'refreshments', value)
                    }
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                variant="outlined"
                                name="refreshments"
                                label={option}
                                {...getTagProps({ index })}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{ width: '100%' }}
                            variant="standard"
                            label={`I was thinking we’d have `}
                            name="refreshments"
                            helperText="Type and press [enter] to add stuff to the list"
                        />
                    )}
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
        <Fragment>
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
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    host: state.host,
    artist: state.artist.artist,
});

export default connect(mapStateToProps, {
    createMyHost,
})(withRouter(EventSpecificHostForm)); //withRouter allows us to pass history objects
