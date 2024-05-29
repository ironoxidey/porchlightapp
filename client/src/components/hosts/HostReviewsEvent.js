import axios from 'axios'; //only for uploads as of December 31st, 2021
import React, { Fragment, useState, useEffect, useRef } from 'react';

import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

import {
    Link,
    // withRouter,
    useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { hostReviewsEvent } from '../../actions/host';
import porchlightLogo from '../../img/Porchlight_logo05-17.svg';

import {
    TextField,
    //Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    InputAdornment,
    Grid,
    Box,
    Typography,
    Rating,
    Dialog,
    DialogContent,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
// import { PhoneInput as ReactPhoneInput } from 'react-phone-input-2';
import { styled } from '@mui/material/styles';
import Button from '../layout/SvgButton';

import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';

import { SpinnerCircular } from 'spinners-react';

import HostProfile from '../hosts/HostProfile';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import FlareTwoToneIcon from '@mui/icons-material/FlareTwoTone';
import AttachFileIcon from '@mui/icons-material/AttachFile';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';

import { toTitleCase, StackDateforDisplay } from '../../actions/app';
import FileUploader from '../../common/components/FileUploader';

// import { HOST_UPLOADED_FILES } from '../../actions/types';

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

const HostReviewsEvent = ({
    hostMe,
    history,
    auth,
    theEvent,
    hostReviewsEvent,
    // thisHostEvent,
}) => {
    // const dispatch = useDispatch();
    //File Uploading with Uppy
    // if (localStorage.token) {
    let numRequests = 0;
    const uppy = new Uppy({
        id: 'uppity',
        // autoProceed: true,
        autoProceed: false,
        // debug: true,
        formData: true,
        theme: 'dark',
        allowedFileTypes: ['image/*', 'video/*'],

        meta: {
            // bookingWhen: thisEvent.bookingWhen.slice(0, 10),
            // artist: thisEvent.confirmedArtist || thisEvent.artist,
            // host: thisEvent.confirmedHost,
            thisEvent: theEvent._id,
            // driveFolderID: thisEvent.driveFolderID,
            // location:
            //     thisEvent.bookingWhere.city +
            //     ', ' +
            //     thisEvent.bookingWhere.state,
        },
    }).use(Tus, {
        endpoint: 'https://app.porchlight.art/api/uploads/file', //needs to be called over https
        // endpoint: '/api/uploads/file',
        headers: {
            'x-auth-token': localStorage.token,
        },
        onBeforeRequest: async (req, file) => {
            // make sure it has a Google Drive Folder to go into
            // console.log('onBeforeRequest req', req);
            // console.log('onBeforeRequest file', file);
            if (numRequests === 0) {
                //only make the folder once (we don't need a bunch of empty folders in the Drive)
                try {
                    numRequests++;
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    };
                    const res = await axios.post(
                        '/api/uploads/createDriveFolder',
                        { thisEvent: file.meta.thisEvent },
                        config
                    );
                    // console.log(
                    //     `/api/uploads/createDriveFolder res index(${numRequests})`,
                    //     res
                    // );
                } catch (err) {
                    console.log('error: ' + err);
                    // const errors = err.response.data.errors;
                    // if (errors) {
                    //     errors.forEach((error) =>
                    //         dispatch(setAlert(error.msg, 'danger'))
                    //     );
                    // }
                    // dispatch({
                    //     type: UPDATE_EVENT_ERROR,
                    //     payload: {
                    //         msg: err.response.statusText,
                    //         status: err.response.status,
                    //     },
                    // });
                    // dispatch(setAlert('Update Error: ' + err, 'danger')); // alertType = 'success' to add a class of alert-success to the alert (alert.alertType used in /components/layout/Alert.js)
                }
            }
        },
    });

    async function checkForUpdates(theEventId, delay = 2000) {
        try {
            // if (delay < 1000 * 100) {
            const updatedEvent = await axios.get(
                `/api/uploads/eventUploadedFiles/${theEventId}`
            );
            console.log('updatedEvent.data', updatedEvent.data);

            setTheUploadedFiles(updatedEvent.data.uploadedFiles);

            // Check if all images have driveIDs
            const imagesWithoutDriveID = updatedEvent.data.uploadedFiles.filter(
                (uploadedImage) => !uploadedImage.driveID
            );

            if (imagesWithoutDriveID.length === 0) {
                console.log('All images have driveIDs now.');
                // dispatch({
                //     type: HOST_UPLOADED_FILES,
                //     payload: updatedEvent.data,
                // });
                return; // Exit the recursion if all images have driveIDs
            }

            // If not, wait for the specified delay and check again
            setTimeout(async () => {
                await checkForUpdates(theEventId, delay + 2000); //add a second to the delay every time we run it — just trying to save on resources
            }, delay);
            // } else {
            //     console.log(
            //         'The images don’t all have driveIDs, but we can’t be waiting FOREVER!'
            //     );
            //     return;
            // }
        } catch (error) {
            console.error(error);
            return;
            // You might want to retry or exit the loop based on the error type
        }
    }

    uppy.on('upload-success', async (file, response) => {
        console.log('Rusty upload-success file, response', file, response);
        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // };

        console.log('Rusty upload-success theEvent._id', theEvent._id);
        console.log(
            'Rusty upload-success file.meta.thisEvent',
            file.meta.thisEvent
        );
        try {
            // let updatedEvent = await axios.get(
            //     '/api/uploads/eventUploadedFiles/' + theEvent._id
            //     // { thisEvent: file.meta.thisEvent },
            //     // { thisEvent: theEvent._id },
            //     // config
            // );

            // console.log('updatedEvent', updatedEvent);
            // console.log(
            //     'updatedEvent.data.uploadedFiles.filter((uploadedImage) => !uploadedImage.driveID)',
            //     updatedEvent.data.uploadedFiles.filter(
            //         (uploadedImage) => !uploadedImage.driveID
            //     )
            // );
            checkForUpdates(theEvent._id);

            // do {
            //     setTimeout(async () => {
            //         updatedEvent = await axios.get(
            //             '/api/uploads/eventUploadedFiles',
            //             { thisEvent: theEvent._id },
            //             config
            //         );

            //         console.log('do updatedEvent', updatedEvent);
            //     }, 3000);
            // } while (
            //     updatedEvent &&
            //     updatedEvent.data &&
            //     updatedEvent.data.uploadedFiles &&
            //     updatedEvent.data.uploadedFiles.length > 0 &&
            //     updatedEvent.data.uploadedFiles.filter(
            //         (uploadedImage) => !uploadedImage.driveID
            //     ).length > 0
            // );
        } catch (error) {
            console.error(error);
        }

        // start watching theEvent.uploadedFiles on a setInterval, for the driveID to be updated
    });
    // }

    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    // const dispatch = useDispatch();

    const [theReview, setTheReview] = useState({});
    const [theOffer, setTheOffer] = useState({});
    const [theHost, setTheHost] = useState({});
    const [theArtist, setTheArtist] = useState({});
    const [theUploadedFiles, setTheUploadedFiles] = useState([]);

    // console.log('HostReviewsEvent theEvent', theEvent);

    useEffect(() => {
        if (
            theEvent &&
            theEvent.uploadedFiles &&
            theEvent.uploadedFiles.length > 0
        ) {
            // console.log(
            //     'change in theEvent.uploadedFiles',
            //     theEvent.uploadedFiles
            // );
            setTheUploadedFiles(theEvent.uploadedFiles);
        }
    }, [theEvent.uploadedFiles]);

    // useEffect(() => {
    //     if (
    //         thisHostEvent &&
    //         thisHostEvent.uploadedFiles &&
    //         thisHostEvent.uploadedFiles.length > 0
    //     ) {
    //         console.log(
    //             'change in thisHostEvent.uploadedFiles',
    //             thisHostEvent.uploadedFiles
    //         );
    //         setTheUploadedFiles(thisHostEvent.uploadedFiles);
    //     }
    // }, [thisHostEvent.uploadedFiles]);

    useEffect(() => {
        if (theEvent && theEvent._id) {
            const theAcceptedOffer = theEvent.offersFromHosts.filter(
                (thisOffer) => {
                    // console.log('thisOffer.status', thisOffer.status);
                    if (thisOffer.status === 'ACCEPTED') {
                        return thisOffer;
                    } else return thisOffer;
                }
            )[0];
            // console.log('theAcceptedOffer', theAcceptedOffer);
            setTheOffer(theAcceptedOffer);
        }
        if (theEvent.hostReviewOfEvent) {
            setTheReview(theEvent.hostReviewOfEvent);
        }
        if (theEvent.artist) {
            setTheArtist(theEvent.artist);
        } else if (
            theEvent.confirmedArtist &&
            theEvent.preferredArtists &&
            theEvent.preferredArtists.length > 0
        ) {
            theEvent.preferredArtists.map((prefArtist) => {
                if (prefArtist._id === theEvent.confirmedArtist) {
                    setTheArtist(prefArtist);
                }
            });
        }
    }, [theEvent]);
    useEffect(() => {
        if (theEvent.hostReviewOfEvent) {
            setTheReview(theEvent.hostReviewOfEvent);
        }
    }, [theEvent?.hostReviewOfEvent]);

    useEffect(() => {
        if (theOffer && theOffer.host) {
            setTheHost(theOffer.host);

            // console.log('the ACCEPTED Offer theOffer.host', theOffer.host);
        }
        if (hostMe) {
            setTheHost(hostMe);
        }
        // console.log('the ACCEPTED Offer', theOffer);
        // console.log('the ACCEPTED Offer Host', theHost);
    }, [theOffer, hostMe]);

    const [formData, setFormData] = useState({
        eventId: '',
        artistId: '',
        hostId: '',
        bookingWhen: '',
        bookingWhere: {},

        //hostReviewsEvent
        processOfConnecting: 0,
        curationSuggestions: '',
        howMuchAttentionToGuide: '',
        howHelpfulWasGuide: 0,
        guideSuggestions: '',
        eventbriteExperience: 0,
        eventbriteSuggestions: '',
        porchlightCommunications: 0,
        artistCommunications: 0,
        attendanceExpectations: '',
        promotionInsight: '',
        experienceMeetingArtist: '',
        audienceInteraction: '',
        artistVibe: 0,
        artistMusicalSkill: 0,
        artistVocalSkill: 0,
        artistSongwritingSkill: 0,
        overnightExperience: 0,
        critiqueOfArtist: '',
        critiqueOfPorchlight: '',
        experienceWithPorchlight: '',
        mediaContent: [], //list of URLs — maybe Google Drive links
        testimonial: '',
        willingToShareMore: '',
    });

    useEffect(() => {
        if (theEvent._id && theReview) {
            setFormData({
                eventId: loading || !theEvent._id ? '' : theEvent._id,
                artistId: loading || !theArtist._id ? '' : theArtist._id,
                hostId: loading || !theHost._id ? '' : theHost._id,
                // hostId:
                //     loading ||
                //     !theOffer.host ||
                //     (theOffer.host && !theOffer.host._id)
                //         ? ''
                //         : theOffer.host._id,
                bookingWhen:
                    loading || !theEvent.bookingWhen
                        ? ''
                        : theEvent.bookingWhen,
                bookingWhere:
                    loading || !theEvent.bookingWhere
                        ? {}
                        : theEvent.bookingWhere,

                processOfConnecting:
                    loading || !theReview.processOfConnecting
                        ? 0
                        : theReview.processOfConnecting,
                curationSuggestions:
                    loading || !theReview.curationSuggestions
                        ? ''
                        : theReview.curationSuggestions,
                howMuchAttentionToGuide:
                    loading || !theReview.howMuchAttentionToGuide
                        ? ''
                        : theReview.howMuchAttentionToGuide,
                howHelpfulWasGuide:
                    loading || !theReview.howHelpfulWasGuide
                        ? 0
                        : theReview.howHelpfulWasGuide,
                guideSuggestions:
                    loading || !theReview.guideSuggestions
                        ? ''
                        : theReview.guideSuggestions,
                eventbriteExperience:
                    loading || !theReview.eventbriteExperience
                        ? 0
                        : theReview.eventbriteExperience,
                eventbriteSuggestions:
                    loading || !theReview.eventbriteSuggestions
                        ? ''
                        : theReview.eventbriteSuggestions,
                porchlightCommunications:
                    loading || !theReview.porchlightCommunications
                        ? 0
                        : theReview.porchlightCommunications,
                artistCommunications:
                    loading || !theReview.artistCommunications
                        ? 0
                        : theReview.artistCommunications,
                attendanceExpectations:
                    loading || !theReview.attendanceExpectations
                        ? ''
                        : theReview.attendanceExpectations,
                promotionInsight:
                    loading || !theReview.promotionInsight
                        ? ''
                        : theReview.promotionInsight,
                experienceMeetingArtist:
                    loading || !theReview.experienceMeetingArtist
                        ? ''
                        : theReview.experienceMeetingArtist,
                audienceInteraction:
                    loading || !theReview.audienceInteraction
                        ? ''
                        : theReview.audienceInteraction,
                artistVibe:
                    loading || !theReview.artistVibe ? 0 : theReview.artistVibe,
                artistMusicalSkill:
                    loading || !theReview.artistMusicalSkill
                        ? 0
                        : theReview.artistMusicalSkill,
                artistVocalSkill:
                    loading || !theReview.artistVocalSkill
                        ? 0
                        : theReview.artistVocalSkill,
                artistSongwritingSkill:
                    loading || !theReview.artistSongwritingSkill
                        ? 0
                        : theReview.artistSongwritingSkill,
                overnightExperience:
                    loading || !theReview.overnightExperience
                        ? 0
                        : theReview.overnightExperience,
                critiqueOfArtist:
                    loading || !theReview.critiqueOfArtist
                        ? ''
                        : theReview.critiqueOfArtist,
                critiqueOfPorchlight:
                    loading || !theReview.critiqueOfPorchlight
                        ? ''
                        : theReview.critiqueOfPorchlight,
                experienceWithPorchlight:
                    loading || !theReview.experienceWithPorchlight
                        ? ''
                        : theReview.experienceWithPorchlight,
                mediaContent:
                    loading || !theReview.mediaContent
                        ? []
                        : theReview.mediaContent,
                testimonial:
                    loading || !theReview.testimonial
                        ? ''
                        : theReview.testimonial,
                willingToShareMore:
                    loading || !theReview.willingToShareMore
                        ? ''
                        : theReview.willingToShareMore,
            });
        } else if (theEvent._id) {
            setFormData({
                eventId: loading || !theEvent._id ? '' : theEvent._id,
                artistId: loading || !theArtist._id ? '' : theArtist._id,
                hostId: loading || !hostMe._id ? '' : hostMe._id,
                // hostId:
                //     loading ||
                //     !theOffer.host ||
                //     (theOffer.host && !theOffer.host._id)
                //         ? ''
                //         : theOffer.host._id,
                bookingWhen:
                    loading || !theEvent.bookingWhen
                        ? ''
                        : theEvent.bookingWhen,
                bookingWhere:
                    loading || !theEvent.bookingWhere
                        ? {}
                        : theEvent.bookingWhere,
            });
        }
    }, [auth.loading, theArtist, theEvent, theOffer, theReview]);

    const {
        processOfConnecting,
        curationSuggestions,
        howMuchAttentionToGuide,
        howHelpfulWasGuide,
        guideSuggestions,
        eventbriteExperience,
        eventbriteSuggestions,
        porchlightCommunications,
        artistCommunications,
        attendanceExpectations,
        promotionInsight,
        experienceMeetingArtist,
        audienceInteraction,
        artistVibe,
        artistMusicalSkill,
        artistVocalSkill,
        artistSongwritingSkill,
        overnightExperience,
        critiqueOfArtist,
        critiqueOfPorchlight,
        experienceWithPorchlight,
        mediaContent, //list of URLs — maybe Google Drive links
        testimonial,
        willingToShareMore,
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

    //const [changesMade, setChangesMade] = useState(false);
    const changesMade = useRef(false);
    const firstLoad = useRef(true);

    const onSubmit = (e) => {
        e.preventDefault();
        //console.log('Submitting...');
        hostReviewsEvent(formData, history, true);
        changesMade.current = false;
    };

    const formGroups = {
        titleCard: [
            [
                <FormLabel component="legend">
                    Thank you for taking a moment to review the Porchlight
                    booking and show advancement process.
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    Let's get started!
                </FormLabel>,
            ],
        ],
        processOfConnecting: [
            [
                <FormLabel component="legend">
                    How would you rate Porchlight's process of connecting you
                    with available musicians?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    1 star being worst, 5 stars being best.
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="processOfConnecting"
                        value={processOfConnecting}
                        name="processOfConnecting"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        curationSuggestions: [
            [
                <FormLabel component="legend">
                    Do you have any suggested changes for how we curate
                    musicians for you, and go about booking?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    If so, let us know what they are! If not, feel free to skip.
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="curationSuggestions"
                        id="curationSuggestions"
                        placeholder={'Type your response here'}
                        value={curationSuggestions}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        howMuchAttentionToGuide: [
            [
                <MenuBookTwoToneIcon
                    sx={{
                        fontSize: '3em',
                        margin: '0 auto',
                        width: '100%',
                        textAlign: 'center',
                        color: 'var(--primary-color)',
                    }}
                />,
                <FormLabel component="legend">
                    How much attention did you pay to the Hosting Guide?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="howMuchAttentionToGuide"
                        value={howMuchAttentionToGuide}
                        name="howMuchAttentionToGuide"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="neverLookedAtIt"
                            control={<Radio />}
                            label={`I never looked at the Hosting Guide.`}
                        />
                        <FormControlLabel
                            value="glancedAtIt"
                            control={<Radio />}
                            label="I glanced at the Hosting Guide."
                        />
                        <FormControlLabel
                            value="skimmedIt"
                            control={<Radio />}
                            label="I skimmed the Hosting Guide."
                        />
                        <FormControlLabel
                            value="readIt"
                            control={<Radio />}
                            label="I read the Hosting Guide."
                        />
                        <FormControlLabel
                            value="thoroughlyReadAndAppliedIt"
                            control={<Radio />}
                            label="I thoroughly read and applied the Hosting Guide."
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        ...(howMuchAttentionToGuide !== 'neverLookedAtIt' && {
            howHelpfulWasGuide: [
                [
                    <MenuBookTwoToneIcon
                        sx={{
                            fontSize: '3em',
                            margin: '0 auto',
                            width: '100%',
                            textAlign: 'center',
                            color: 'var(--primary-color)',
                        }}
                    />,
                    <FormLabel component="legend">
                        How helpful was the Hosting Guide?
                    </FormLabel>,
                ],
                [
                    <FormControl component="fieldset">
                        <Rating
                            size="large"
                            id="howHelpfulWasGuide"
                            value={howHelpfulWasGuide}
                            name="howHelpfulWasGuide"
                            onChange={(e) => onChange(e)}
                        />
                    </FormControl>,
                ],
            ],
        }),
        ...(howMuchAttentionToGuide !== 'neverLookedAtIt' && {
            guideSuggestions: [
                [
                    [
                        <MenuBookTwoToneIcon
                            sx={{
                                fontSize: '3em',
                                margin: '0 auto',
                                width: '100%',
                                textAlign: 'center',
                                color: 'var(--primary-color)',
                            }}
                        />,
                        <FormLabel component="legend">
                            Do you have any suggested edits for the Hosting
                            Guide?
                        </FormLabel>,
                    ],
                    <FormLabel
                        component="small"
                        sx={{ textAlign: 'center', display: 'block' }}
                    >
                        If so, let us know what they are! If not, feel free to
                        skip.
                    </FormLabel>,
                ],
                [
                    <Grid
                        item
                        xs={12}
                        sx={{ margin: '16px auto', width: '70%' }}
                        className="artistNotes_textarea"
                        justifyContent={'center'}
                    >
                        <TextField
                            multiline
                            variant="standard"
                            name="guideSuggestions"
                            id="guideSuggestions"
                            placeholder={'Type your response here'}
                            value={guideSuggestions}
                            onChange={(e) => onChange(e)}
                            sx={{ width: '100%' }}
                        />
                    </Grid>,
                ],
            ],
        }),
        eventbriteExperience: [
            [
                <FormLabel component="legend">
                    How was your experience using Eventbrite?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="eventbriteExperience"
                        value={eventbriteExperience}
                        name="eventbriteExperience"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        eventbriteSuggestions: [
            [
                <FormLabel component="legend">
                    Do you have any suggestions on how Porchlight uses the
                    Eventbrite platform?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    If so, let us know what they are! If not, feel free to skip.
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="eventbriteSuggestions"
                        id="eventbriteSuggestions"
                        placeholder={'Type your response here'}
                        value={eventbriteSuggestions}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        porchlightCommunications: [
            [
                <Box
                    // className="squareImgInACircle"
                    sx={{
                        // height: '250px',
                        width: '220px',
                        // maxHeight: '250px',
                        maxWidth: '220px',
                        // borderRadius: '50%',
                        // overflow: 'hidden',
                        // backgroundImage: `url("${theArtist.squareImg}")`,
                        // backgroundPosition: '50% 25%',
                        backgroundSize: 'cover',
                        // padding: '4px',
                        backgroundClip: 'content-box',
                        //border: '1px solid var(--primary-color)',
                        // border: '1px solid var(--primary-color)',

                        margin: '-20px auto -20px',
                    }}
                >
                    {' '}
                    <img
                        src={porchlightLogo}
                        alt=""
                        className="porchlightLogo"
                    />
                </Box>,
                <FormLabel component="legend" sx={{ marginTop: '0px' }}>
                    Leading up to the show, were communications from Porchlight
                    timely, efficient, and personable?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="porchlightCommunications"
                        value={porchlightCommunications}
                        name="porchlightCommunications"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        artistCommunications: [
            [
                <Box
                    className="squareImgInACircle"
                    sx={{
                        height: '150px',
                        width: '150px',
                        maxHeight: '150px',
                        maxWidth: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundImage: `url("${theArtist.squareImg}")`,
                        backgroundPosition: '50% 25%',
                        backgroundSize: 'cover',
                        padding: '4px',
                        backgroundClip: 'content-box',
                        //border: '1px solid var(--primary-color)',
                        border: '1px solid var(--primary-color)',

                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'end',
                        aspectRatio: '1 / 1',
                    }}
                ></Box>,
                <FormLabel component="legend">
                    Leading up to the show, were communications from{' '}
                    {theArtist.stageName} timely, efficient, and personable?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="artistCommunications"
                        value={artistCommunications}
                        name="artistCommunications"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        attendanceExpectations: [
            <FormLabel component="legend">
                Did crowd size meet your expectations?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="attendanceExpectations"
                        value={attendanceExpectations}
                        name="attendanceExpectations"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="muchSmallerThanAnticipated"
                            control={<Radio />}
                            label={`No, crowd was much smaller than I anticipated`}
                        />
                        <FormControlLabel
                            value="littleSmallerThanAnticipated"
                            control={<Radio />}
                            label={`No, crowd was just a little smaller than I anticipated`}
                        />
                        <FormControlLabel
                            value="metAnticipations"
                            control={<Radio />}
                            label="Yes, crowd size was about what I anticipated"
                        />
                        <FormControlLabel
                            value="largerThanAnticipated"
                            control={<Radio />}
                            label="Crowd size was larger than I anticipated"
                        />
                        <FormControlLabel
                            value="muchLargerThanAnticipated"
                            control={<Radio />}
                            label="Crowd size was much larger than I anticipated"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        promotionInsight: [
            [
                <FormLabel component="legend">
                    Tell us about your experience promoting this Porchlight
                    event.
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    Do you have any advice (either for yourself or other hosts)
                    on how you might promote an event like this in the future?
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="promotionInsight"
                        id="promotionInsight"
                        placeholder={'Type your response here'}
                        value={promotionInsight}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        experienceMeetingArtist: [
            [
                <Box
                    className="squareImgInACircle"
                    sx={{
                        height: '150px',
                        width: '150px',
                        maxHeight: '150px',
                        maxWidth: '150px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundImage: `url("${theArtist.squareImg}")`,
                        backgroundPosition: '50% 25%',
                        backgroundSize: 'cover',
                        padding: '4px',
                        backgroundClip: 'content-box',
                        //border: '1px solid var(--primary-color)',
                        border: '1px solid var(--primary-color)',

                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'end',
                        aspectRatio: '1 / 1',
                    }}
                ></Box>,
                <FormLabel component="legend">
                    What was your experience like meeting {theArtist.stageName}?
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="experienceMeetingArtist"
                        id="experienceMeetingArtist"
                        placeholder={'Type your response here'}
                        value={experienceMeetingArtist}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        audienceInteraction: [
            [
                <FormLabel component="legend">
                    How would you describe the audience and their interaction
                    with {theArtist.stageName}?
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="audienceInteraction"
                        id="audienceInteraction"
                        placeholder={'Type your response here'}
                        value={audienceInteraction}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        artistVibe: [
            [
                <FormLabel component="legend">
                    Did {theArtist.stageName} come across as friendly, engaged,
                    grateful and helpful?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="artistVibe"
                        value={artistVibe}
                        name="artistVibe"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        artistMusicalSkill: [
            [
                <FormLabel component="legend">
                    How would you rate {theArtist.stageName}’s
                    technical/instrumental/musical ability?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="artistMusicalSkill"
                        value={artistMusicalSkill}
                        name="artistMusicalSkill"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        artistVocalSkill: [
            [
                <FormLabel component="legend">
                    How would you rate {theArtist.stageName}’s vocal ability?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="artistVocalSkill"
                        value={artistVocalSkill}
                        name="artistVocalSkill"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        artistSongwritingSkill: [
            [
                <FormLabel component="legend">
                    How would you rate {theArtist.stageName}’s songwriting and
                    original content?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="artistSongwritingSkill"
                        value={artistSongwritingSkill}
                        name="artistSongwritingSkill"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        overnightExperience: [
            [
                <FormLabel component="legend">
                    If you hosted {theArtist.stageName} overnight, how would you
                    rate that experience?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="overnightExperience"
                        value={overnightExperience}
                        name="overnightExperience"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        critiqueOfArtist: [
            [
                <FormLabel component="legend">
                    Could {theArtist.stageName} have done anything differently
                    to make the show better?
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="critiqueOfArtist"
                        id="critiqueOfArtist"
                        placeholder={'Type your response here'}
                        value={critiqueOfArtist}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        critiqueOfPorchlight: [
            [
                <FormLabel component="legend">
                    Could Porchlight have done anything more or differently to
                    help you host?
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="critiqueOfPorchlight"
                        id="critiqueOfPorchlight"
                        placeholder={'Type your response here'}
                        value={critiqueOfPorchlight}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        experienceWithPorchlight: [
            [
                <FormLabel component="legend">
                    Feel free to tell us more about your overall experience with
                    the Porchlight Network.
                </FormLabel>,

                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    If you had a particularly good experience, we’d love a few
                    of your words we can share with others in a testimonial
                    format. If you have constructive criticism, we’d love even
                    more words - our desire is to get better at what we do.
                    Thank you in advance for your response and care.
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="experienceWithPorchlight"
                        id="experienceWithPorchlight"
                        placeholder={'Type your response here'}
                        value={experienceWithPorchlight}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        ...(false && {
            //I'm intentionally hiding it right now because it's broken
            mediaContent: [
                //23
                [
                    <FormLabel component="legend">
                        Please share any photo/video content you’d be willing
                        for us to share in our newsletters/social media!
                    </FormLabel>,
                ],
                [
                    <FileUploader
                        uppy={uppy}
                        thisEvent={theEvent}
                    ></FileUploader>,
                    <>
                        {theUploadedFiles.length > 0 && (
                            <Grid
                                container
                                xs={12}
                                sx={{ margin: '16px auto', width: '95%' }}
                                className="uploadedFiles"
                                justifyContent={'center'}
                            >
                                <Typography
                                    component="h2"
                                    sx={{ width: '100%', marginBottom: '10px' }}
                                >
                                    <AttachFileIcon
                                        sx={{
                                            fontSize: '1.4em',
                                            marginRight: '5px',
                                        }}
                                    />
                                    {theUploadedFiles.length > 1
                                        ? 'These files are'
                                        : 'This file is'}{' '}
                                    attached to this event:
                                </Typography>
                                <Masonry
                                    columns={{ xs: 3, sm: 4, md: 7, lg: 7 }}
                                    spacing={2}
                                >
                                    {theUploadedFiles.map((image, idx) => {
                                        const theFileLink =
                                            image.filetype &&
                                            image.filetype.split('/')[0] ===
                                                'image'
                                                ? 'https://lh3.googleusercontent.com/d/' +
                                                  image.driveID
                                                : 'https://drive.google.com/file/d/' +
                                                  image.driveID;
                                        if (image.driveID) {
                                            return (
                                                <Grid
                                                    item
                                                    key={idx}
                                                    sx={{
                                                        width: '100px',
                                                        margin: '10px',
                                                        overflowWrap:
                                                            'break-word',
                                                        textAlign: 'center',
                                                        fontSize: '.75em',
                                                    }}
                                                >
                                                    <a
                                                        // href={image.url}
                                                        href={theFileLink}
                                                        target="_blank"
                                                    >
                                                        <img
                                                            src={
                                                                'https://lh3.googleusercontent.com/d/' +
                                                                image.driveID
                                                            }
                                                            style={{
                                                                width: '100px',
                                                                padding: '3px',
                                                                border: '1px solid var(--primary-color)',
                                                            }}
                                                        />

                                                        <p>{image.name}</p>
                                                    </a>
                                                </Grid>
                                                // <img
                                                //     src={
                                                //         'https://drive.google.com/file/d/' +
                                                //         image.driveID +
                                                //         '/uc?export=view'
                                                //     }
                                                //     alt="Image Description"
                                                // ></img>
                                            );
                                        } else {
                                            return (
                                                <>
                                                    <Grid
                                                        item
                                                        key={idx}
                                                        sx={{
                                                            width: '100px',
                                                            margin: '10px',
                                                            overflowWrap:
                                                                'break-word',
                                                            textAlign: 'center',
                                                            fontSize: '.75em',
                                                        }}
                                                    >
                                                        <SpinnerCircular
                                                            size={60}
                                                            thickness={130}
                                                            speed={75}
                                                            color="rgba(255, 255, 217, 1)"
                                                            secondaryColor="rgba(16, 15, 14, 1)"
                                                        />

                                                        <p>{image.name}</p>
                                                    </Grid>
                                                </>
                                            );
                                        }
                                    })}
                                </Masonry>
                            </Grid>
                        )}
                    </>,
                ],
            ],
        }),
        testimonial: [
            [
                <FormLabel component="legend">
                    Testimonial moment! Please highlight anything about the
                    event or artist that stood out to you and you’d like to
                    share with others publicly.
                </FormLabel>,
            ],
            [
                <Grid
                    item
                    xs={12}
                    sx={{ margin: '16px auto', width: '70%' }}
                    className="artistNotes_textarea"
                    justifyContent={'center'}
                >
                    <TextField
                        multiline
                        variant="standard"
                        name="testimonial"
                        id="testimonial"
                        placeholder={'Type your response here'}
                        value={testimonial}
                        onChange={(e) => onChange(e)}
                        sx={{ width: '100%' }}
                    />
                </Grid>,
            ],
        ],
        willingToShareMore: [
            <FormLabel component="legend">
                Are you willing/interested in sharing your experience and
                stories around hosting with our team?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="willingToShareMore"
                        value={willingToShareMore}
                        name="willingToShareMore"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="noThanks"
                            control={<Radio />}
                            label={`No, thank you`}
                        />
                        <FormControlLabel
                            value="yesEmail"
                            control={<Radio />}
                            label="Yes, I'd prefer to share via an email interview"
                        />
                        <FormControlLabel
                            value="yesPhoneOrZoom"
                            control={<Radio />}
                            label="Yes, I'd prefer share over phone or Zoom"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        endSlide: [
            [
                <Typography
                    component="h2"
                    sx={{ fontSize: '2.2em!important', textAlign: 'center' }}
                >
                    Thanks so much!
                </Typography>,
                <Typography
                    component="h2"
                    sx={{ fontSize: '2.2em!important', textAlign: 'center' }}
                >
                    It helps more than you know...
                </Typography>,
                <>
                    <Typography
                        component="p"
                        sx={{
                            textAlign: 'center',
                            marginTop: '16px',
                            textWrap: 'balance',
                        }}
                    >
                        The Porchlight community is constantly growing and
                        learning, and your insight is essential as we develop a
                        network of hosts who exemplify the heart of Jesus as we
                        all care for attendees, artists, hosts, and culture.
                    </Typography>

                    <Typography
                        component="p"
                        sx={{
                            textAlign: 'center',
                            marginTop: '16px',
                        }}
                    >
                        Your collaboration and perspective is an essential part
                        of this process.
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            textAlign: 'center',
                            marginTop: '16px',
                        }}
                    >
                        Thank you.
                    </Typography>

                    <Grid
                        item
                        container
                        justifyContent="center"
                        sx={{ marginTop: '16px' }}
                    >
                        <Button
                            btnwidth="300"
                            onClick={() => {
                                setDialogOpen(false);
                            }}
                        >
                            Close This Window
                        </Button>
                    </Grid>
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

    //// CARD INDEX ///////
    // const [formCardIndex, setIndex] = useState(formStartIndex);
    const [formCardIndex, setIndex] = useState(0);

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
        // config: config.molasses,
        config: { mass: 2, tension: 280, friction: 60 },
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

    //Dialog Functions
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <Fragment key={`Fragment` + theEvent._id + theArtist._id}>
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                scroll="body"
                fullWidth
                maxWidth="lg"
                className="porchlightBG"
            >
                <DialogContent
                    sx={
                        {
                            // margin: '8px',
                            // border: '1px solid var(--primary-color)',
                        }
                    }
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: 'rgba(0 0 0 /.6)',
                            padding: '0',
                        }}
                    >
                        <StackDateforDisplay
                            date={theEvent?.bookingWhen}
                        ></StackDateforDisplay>
                    </Box>
                    <form className="form" onSubmit={(e) => onSubmit(e)}>
                        <Grid
                            container
                            direction="row"
                            alignItems="start"
                            justifyContent="center"
                            height="65vh"
                            sx={{ padding: '20px!important' }}
                            key={`cardGrid` + theEvent._id + theArtist._id}
                        >
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
                                                Object.keys(formGroups).length -
                                                    1
                                                    ? 1
                                                    : 0.2,
                                            transition:
                                                'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 500ms',
                                        }}
                                    >
                                        Next
                                        <ArrowForwardIcon></ArrowForwardIcon>
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
                                    minHeight: 'inherit',
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
                                        key={
                                            `bookingDetails` + theEvent._id + i
                                        }
                                        //className="bookingDetails"
                                    >
                                        {/* <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}> */}

                                        {/* {formGroups && formGroups.length > 0 ? formGroups[i].map((formGroup, ind) => (  */}
                                        <Grid
                                            item
                                            xs={12}
                                            sx={
                                                i > 0 && {
                                                    '--form-num': `'${i}'`,
                                                }
                                            } // this is where the form number is set
                                            data-form-num={i}
                                            className="formInquiry"
                                        >
                                            {
                                                formGroups[
                                                    Object.keys(formGroups)[i]
                                                ][0]
                                            }
                                        </Grid>
                                        {
                                            formGroups[
                                                Object.keys(formGroups)[i]
                                            ][1]
                                        }
                                    </Grid>
                                </div>
                            </animated.div>
                        ))}
                    </form>
                </DialogContent>
            </Dialog>
            {(!theEvent.hostReviewOfEvent ||
                !theEvent.hostReviewOfEvent._id) && (
                <Box
                    className="createdAt"
                    sx={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                    }}
                >
                    {' '}
                    <Typography
                        component="p"
                        sx={{
                            fontSize: '.7em',
                            fontFamily: 'var(--secondary-font)',
                            color: 'var(--link-color)',
                        }}
                    >
                        <FlareTwoToneIcon
                            style={{ fontSize: '1.5em' }}
                        ></FlareTwoToneIcon>{' '}
                        Please consider reviewing your experience hosting{' '}
                        {theArtist.stageName}.
                    </Typography>
                </Box>
            )}
            <Grid item style={{ margin: '20px auto 0', alignSelf: 'center' }}>
                <Button btnwidth="250" onClick={() => setDialogOpen(true)}>
                    {theEvent &&
                    theEvent.hostReviewOfEvent &&
                    theEvent.hostReviewOfEvent._id
                        ? 'Edit Your Review'
                        : 'Review Your Experience'}
                </Button>
            </Grid>
        </Fragment>
    );
};

HostReviewsEvent.propTypes = {
    hostMe: PropTypes.object.isRequired,
    theEvent: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    hostReviewsEvent: PropTypes.func.isRequired,
    // thisHostEvent: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    // console.log('HostReviewsEvent mapStateToProps ownProps', ownProps);
    // const thisHostEvent = state.event.myHostEvents.find(
    //     (myHostEvent) => myHostEvent._id === ownProps.theEvent._id
    // );
    // console.log(
    //     'HostReviewsEvent mapStateToProps thisHostEvent',
    //     thisHostEvent
    // );
    return {
        auth: state.auth,
        hostMe: state.host.me,
        // thisHostEvent: thisHostEvent,
    };
};

export default connect(mapStateToProps, {
    hostReviewsEvent,
    // })(withRouter(HostReviewsEvent)); //withRouter allows us to pass history objects
})(HostReviewsEvent);
