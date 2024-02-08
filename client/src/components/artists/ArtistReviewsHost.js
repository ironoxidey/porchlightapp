import axios from 'axios'; //only for uploads as of December 31st, 2021
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { artistReviewsHost } from '../../actions/artist';
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
import ReactPhoneInput from 'react-phone-input-mui';
import { styled } from '@mui/material/styles';
import Button from '../layout/SvgButton';

import HostProfile from '../hosts/HostProfile';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTransition, animated, config } from '@react-spring/web';
import styles from '../../formCards.css';

import { toTitleCase, StackDateforDisplay } from '../../actions/app';

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

const ArtistReviewsHost = ({
    artistMe,
    history,
    auth,
    theEvent,
    artistReviewsHost,
}) => {
    const loading = false; //a bunch of things are dependent on it; I should really just take it out.
    // const dispatch = useDispatch();

    const [theReview, setTheReview] = useState({});
    const [theOffer, setTheOffer] = useState({});
    const [theHost, setTheHost] = useState({});

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
            console.log('theAcceptedOffer', theAcceptedOffer);
            setTheOffer(theAcceptedOffer);
        }
        if (theEvent.artistReviewOfHost) {
            setTheReview(theEvent.artistReviewOfHost);
        }
    }, [theEvent]);
    useEffect(() => {
        if (theEvent.artistReviewOfHost) {
            setTheReview(theEvent.artistReviewOfHost);
        }
    }, [theEvent.artistReviewOfHost]);

    useEffect(() => {
        if (theOffer && theOffer.host) {
            setTheHost(theOffer.host);

            // console.log('the ACCEPTED Offer theOffer.host', theOffer.host);
        }

        // console.log('the ACCEPTED Offer', theOffer);
        // console.log('the ACCEPTED Offer Host', theHost);
    }, [theOffer]);

    const [formData, setFormData] = useState({
        eventId: '',
        artistId: '',
        hostId: '',
        bookingWhen: '',
        bookingWhere: {},

        communication: 0,
        promotion: 0,
        tipsDonations: 0,
        merchSales: 0,
        ticketSales: 0,
        revenueExpectations: '',
        attendanceExpectations: '',
        audienceQuality: '',
        venueQuality: 0,
        everythingNeeded: 0,
        introductionByHost: 0,
        hostExample: 0,
        hostInteractions: 0,
        hostAccomodations: 0,
        hostCommitment: 0,
        recHostForRetreat: '',
        artistNotes: '',
    });

    useEffect(() => {
        if (theEvent._id && theReview) {
            setFormData({
                eventId: loading || !theEvent._id ? '' : theEvent._id,
                artistId: loading || !artistMe._id ? '' : artistMe._id,
                hostId:
                    loading ||
                    !theOffer.host ||
                    (theOffer.host && !theOffer.host._id)
                        ? ''
                        : theOffer.host._id,
                bookingWhen:
                    loading || !theEvent.bookingWhen
                        ? ''
                        : theEvent.bookingWhen,
                bookingWhere:
                    loading || !theEvent.bookingWhere
                        ? {}
                        : theEvent.bookingWhere,

                communication:
                    loading || !theReview.communication
                        ? 0
                        : theReview.communication,
                promotion:
                    loading || !theReview.promotion ? 0 : theReview.promotion,
                tipsDonations:
                    loading || !theReview.tipsDonations
                        ? 0
                        : theReview.tipsDonations,
                merchSales:
                    loading || !theReview.merchSales ? 0 : theReview.merchSales,
                ticketSales:
                    loading || !theReview.ticketSales
                        ? 0
                        : theReview.ticketSales,
                revenueExpectations:
                    loading || !theReview.revenueExpectations
                        ? ''
                        : theReview.revenueExpectations,
                attendanceExpectations:
                    loading || !theReview.attendanceExpectations
                        ? ''
                        : theReview.attendanceExpectations,
                audienceQuality:
                    loading || !theReview.audienceQuality
                        ? ''
                        : theReview.audienceQuality,
                venueQuality:
                    loading || !theReview.venueQuality
                        ? 0
                        : theReview.venueQuality,
                everythingNeeded:
                    loading || !theReview.everythingNeeded
                        ? 0
                        : theReview.everythingNeeded,
                introductionByHost:
                    loading || !theReview.introductionByHost
                        ? 0
                        : theReview.introductionByHost,
                hostExample:
                    loading || !theReview.hostExample
                        ? 0
                        : theReview.hostExample,
                hostInteractions:
                    loading || !theReview.hostInteractions
                        ? 0
                        : theReview.hostInteractions,
                hostAccomodations:
                    loading || !theReview.hostAccomodations
                        ? 0
                        : theReview.hostAccomodations,
                hostCommitment:
                    loading || !theReview.hostCommitment
                        ? 0
                        : theReview.hostCommitment,
                recHostForRetreat:
                    loading || !theReview.recHostForRetreat
                        ? ''
                        : theReview.recHostForRetreat,
                artistNotes:
                    loading || !theReview.artistNotes
                        ? ''
                        : theReview.artistNotes,
            });
        } else if (theEvent._id) {
            setFormData({
                eventId: loading || !theEvent._id ? '' : theEvent._id,
                artistId: loading || !artistMe._id ? '' : artistMe._id,
                hostId:
                    loading ||
                    !theOffer.host ||
                    (theOffer.host && !theOffer.host._id)
                        ? ''
                        : theOffer.host._id,
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
    }, [auth.loading, artistMe, theEvent, theOffer, theReview]);

    const {
        communication,
        promotion,
        tipsDonations,
        merchSales,
        ticketSales,
        revenueExpectations,
        attendanceExpectations,
        audienceQuality,
        venueQuality,
        everythingNeeded,
        introductionByHost,
        hostExample,
        hostInteractions,
        hostAccomodations,
        hostCommitment,
        recHostForRetreat,
        artistNotes,
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
        artistReviewsHost(formData, history, true);
        changesMade.current = false;
    };

    const formGroups = {
        communication: [
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
                        backgroundImage: `url("${theHost.profileImg}")`,
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
                    How was your communication with{' '}
                    {theHost.firstName + ' ' + theHost.lastName}?
                </FormLabel>,
                // <FormLabel
                //     component="small"
                //     sx={{ textAlign: 'center', display: 'block' }}
                // >
                //     (1 is terrible, 5 is great!)
                // </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="communication"
                        value={communication}
                        name="communication"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        promotion: [
            [
                <FormLabel component="legend">
                    Did you feel like {theHost.firstName} tried to promote the
                    show?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="promotion"
                        value={promotion}
                        name="promotion"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        tipsDonations: [
            [
                <FormLabel component="legend">
                    How much did you make in tips/donations?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <TextField
                        variant="standard"
                        name="tipsDonations"
                        id="tipsDonations"
                        // label={
                        //     costStructure == 'donation'
                        //         ? "I'd suggest a donation of"
                        //         : 'Tickets should cost'
                        // }
                        value={tipsDonations}
                        onChange={(e) => onChange(e)}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>,
            ],
        ],
        merchSales: [
            [
                <FormLabel component="legend">
                    How much did you make in merch?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <TextField
                        variant="standard"
                        name="merchSales"
                        id="merchSales"
                        // label={
                        //     costStructure == 'donation'
                        //         ? "I'd suggest a donation of"
                        //         : 'Tickets should cost'
                        // }
                        value={merchSales}
                        onChange={(e) => onChange(e)}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>,
            ],
        ],
        ticketSales: [
            [
                <FormLabel component="legend">
                    How much did you make in ticket sales?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <TextField
                        variant="standard"
                        name="ticketSales"
                        id="ticketSales"
                        // label={
                        //     costStructure == 'donation'
                        //         ? "I'd suggest a donation of"
                        //         : 'Tickets should cost'
                        // }
                        value={ticketSales}
                        onChange={(e) => onChange(e)}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    $
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>,
            ],
        ],

        revenueExpectations: [
            <FormLabel component="legend">
                Did this revenue live up to your expectations?
            </FormLabel>,
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="revenueExpectations"
                        value={revenueExpectations}
                        name="revenueExpectations"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="fellShort"
                            control={<Radio />}
                            label={`No, this revenue fell short of my expectations`}
                        />
                        <FormControlLabel
                            value="met"
                            control={<Radio />}
                            label="Yes, this revenue met my expectations."
                        />
                        <FormControlLabel
                            value="exceeded"
                            control={<Radio />}
                            label="Did it ever?! This revenue exceeded my expectations!"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        attendanceExpectations: [
            <FormLabel component="legend">
                Did the show meet your expectations in terms of the number of
                attendees?
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
                            value="fellShort"
                            control={<Radio />}
                            label={`No, the number of
                            attendees fell short of my expectations`}
                        />
                        <FormControlLabel
                            value="met"
                            control={<Radio />}
                            label="Yes, the number of
                            attendees met my expectations."
                        />
                        <FormControlLabel
                            value="exceeded"
                            control={<Radio />}
                            label="Did it ever?! The number of
                            attendees exceeded my expectations!"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],
        audienceQuality: [
            [
                <FormLabel component="legend">
                    Did the show meet your expectations in terms of the quality
                    of their attendance?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    How <i>good</i> of an audience were they?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="audienceQuality"
                        value={audienceQuality}
                        name="audienceQuality"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="fellShort"
                            control={<Radio />}
                            label={`No, the audience quality fell short of my expectations`}
                        />
                        <FormControlLabel
                            value="met"
                            control={<Radio />}
                            label="Yes, the audience quality met my expectations."
                        />
                        <FormControlLabel
                            value="exceeded"
                            control={<Radio />}
                            label="Did it ever?! The audience quality exceeded my expectations!"
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],

        venueQuality: [
            [
                <FormLabel component="legend">
                    Was the venue welcoming?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    Did it look good?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="venueQuality"
                        value={venueQuality}
                        name="venueQuality"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        everythingNeeded: [
            [
                <FormLabel component="legend">
                    Did the hosts prepare the space for you well?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    Was everything there that you needed?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="everythingNeeded"
                        value={everythingNeeded}
                        name="everythingNeeded"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        introductionByHost: [
            [
                <FormLabel component="legend">
                    Did the hosts do a good job introducing you to the stage?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="introductionByHost"
                        value={introductionByHost}
                        name="introductionByHost"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        hostExample: [
            [
                <FormLabel component="legend">
                    Did the hosts set the example of model attendees during the
                    show?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    (As much as is possible for hosts...)
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="hostExample"
                        value={hostExample}
                        name="hostExample"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        hostInteractions: [
            [
                <FormLabel component="legend">
                    Were your interactions with the hosts pleasant?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="hostInteractions"
                        value={hostInteractions}
                        name="hostInteractions"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        hostAccomodations: [
            [
                <FormLabel component="legend">
                    If you ate with the hosts and/or stayed at their place, how
                    were those accommodations?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="hostAccomodations"
                        value={hostAccomodations}
                        name="hostAccomodations"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        hostCommitment: [
            [
                <FormLabel component="legend">
                    Do you feel like the hosts did everything they committed to
                    do to make this show a success?
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <Rating
                        size="large"
                        id="hostCommitment"
                        value={hostCommitment}
                        name="hostCommitment"
                        onChange={(e) => onChange(e)}
                    />
                </FormControl>,
            ],
        ],
        recHostForRetreat: [
            [
                <FormLabel component="legend">
                    Do you recommend this host as a songwriter retreat host?
                    Feel free to skip if you’ve already answered about this
                    host, or if you have no opinion.
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    These retreats would be held in the host’s space, and only
                    for a weekend. Just a few musicians would be invited for
                    each of these intimate, collaborative songwriting retreats.
                    The capstone event for each retreat would be a songwriter’s
                    round with a small audience, culminating in sharing any
                    worthwhile new material.
                </FormLabel>,
            ],
            [
                <FormControl component="fieldset">
                    <RadioGroup
                        id="recHostForRetreat"
                        value={recHostForRetreat}
                        name="recHostForRetreat"
                        onChange={(e) => onChange(e)}
                    >
                        <FormControlLabel
                            value="yesAndYes"
                            control={<Radio />}
                            label={`Yes, ${theHost.firstName} ${theHost.lastName} is an ideal choice, and I would like to be involved!`}
                        />
                        <FormControlLabel
                            value="yesAndNo"
                            control={<Radio />}
                            label={`Yes, ${theHost.firstName} ${theHost.lastName} is an ideal choice, but I’m probably not the best fit.`}
                        />
                        <FormControlLabel
                            value="no"
                            control={<Radio />}
                            label="No, this host is not ideal for a micro-retreat."
                        />
                        <FormControlLabel
                            value="other"
                            control={<Radio />}
                            label="Other."
                        />
                    </RadioGroup>
                </FormControl>,
            ],
        ],

        artistNotes: [
            [
                <FormLabel component="legend">
                    Was there anything about the show, venue, or host behavior
                    you think could have been improved?
                </FormLabel>,
                <FormLabel
                    component="small"
                    sx={{ textAlign: 'center', display: 'block' }}
                >
                    Be as long or short as you would like; the more specific
                    your feedback, the more helpful!
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
                        name="artistNotes"
                        id="artistNotes"
                        label={'Notes'}
                        value={artistNotes}
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
                        }}
                    >
                        The Porchlight community is constantly growing and
                        learning, and your insight is essential as we develop a
                        network of hosts who exemplify the heart of Jesus as we
                        all care for attendees, artists, and culture.
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
        <Fragment key={`Fragment` + theEvent._id + artistMe._id}>
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
                            date={theEvent.bookingWhen}
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
                            key={`cardGrid` + theEvent._id + artistMe._id}
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
                                            sx={{ '--form-num': `'${i + 1}'` }}
                                            data-form-num={i + 1}
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
            <Grid item style={{ margin: '0 auto', alignSelf: 'center' }}>
                <Button btnwidth="250" onClick={() => setDialogOpen(true)}>
                    {theEvent.artistReviewOfHost
                        ? 'Edit Review'
                        : 'Review Your Experience'}
                </Button>
            </Grid>
        </Fragment>
    );
};

ArtistReviewsHost.propTypes = {
    artistMe: PropTypes.object.isRequired,
    theEvent: PropTypes.object,
    auth: PropTypes.object.isRequired,
    artistReviewsHost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    artistMe: state.artist.me,
});

export default connect(mapStateToProps, {
    artistReviewsHost,
})(withRouter(ArtistReviewsHost)); //withRouter allows us to pass history objects
