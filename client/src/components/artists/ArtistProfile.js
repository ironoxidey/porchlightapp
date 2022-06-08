import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from '../auth/Login';
import EditMyHostProfile from '../hosts/EditMyHostProfile';
import EventDetails from '../events/EventDetails';

import prependHttp from 'prepend-http';

import {
    Grid,
    Chip,
    Typography,
    Box,
    Tooltip,
    SvgIcon,
    IconButton,
    Divider,
} from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//import Masonry from '@mui/lab/Masonry';
import Button from '../layout/SvgButton';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import HearingTwoToneIcon from '@mui/icons-material/HearingTwoTone';
import EmojiObjectsTwoToneIcon from '@mui/icons-material/EmojiObjectsTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import HotelTwoToneIcon from '@mui/icons-material/HotelTwoTone';
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import VolunteerActivismTwoToneIcon from '@mui/icons-material/VolunteerActivismTwoTone';
import ConfirmationNumberTwoToneIcon from '@mui/icons-material/ConfirmationNumberTwoTone';
import FamilyRestroomTwoToneIcon from '@mui/icons-material/FamilyRestroomTwoTone';
import SpeakerTwoToneIcon from '@mui/icons-material/SpeakerTwoTone';
import CoronavirusTwoToneIcon from '@mui/icons-material/CoronavirusTwoTone';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import SavingsTwoToneIcon from '@mui/icons-material/SavingsTwoTone';
import WcTwoToneIcon from '@mui/icons-material/WcTwoTone';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import LiquorTwoToneIcon from '@mui/icons-material/LiquorTwoTone';
import NoDrinksTwoToneIcon from '@mui/icons-material/NoDrinksTwoTone';
import AttachMoneyTwoToneIcon from '@mui/icons-material/AttachMoneyTwoTone';
import MoneyOffTwoToneIcon from '@mui/icons-material/MoneyOffTwoTone';
import InterpreterModeTwoToneIcon from '@mui/icons-material/InterpreterModeTwoTone'; //for opener
// import SignLanguageTwoToneIcon from '@mui/icons-material/SignLanguageTwoTone'; //howFansCanShowSupport

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MultipleDatesPicker from '../mui-multi-date-picker-lib';
import ReactPlayer from 'react-player/lazy';

import { useTransition, animated, config } from '@react-spring/web';

import {
    toTitleCase,
    //youTubeEmbed,
    getFontAwesomeIcon,
    pullDomainFrom,
    convert24HourTime,
    StackDateforDisplay,
} from '../../actions/app';

import { hostRaiseHand, getArtistBookingEvents } from '../../actions/event';
import EventSpecificHostForm from '../events/EventSpecificHostForm';
import ArtistTop from './ArtistTop';

const ArtistProfile = ({
    user,
    isAuthenticated,
    me,
    host,
    events,
    hostRaiseHand,
    getArtistBookingEvents,
    artist,
}) => {
    let history = useHistory();

    let isMe = false;
    if (me && me._id === artist._id) {
        isMe = true;
    }

    const wideImgBW =
        artist.wideImg &&
        artist.wideImg.replace(
            'https://res.cloudinary.com/porchlight/image/upload/',
            'https://res.cloudinary.com/porchlight/image/upload/e_saturation:-100/'
        );

    const [mediaTabs, setMediaTab] = useState([]);
    useEffect(() => {
        setMediaTab([]); //reset to [] so we don't get duplicates
        // if (mediaTabs.length < 3) {
        if (artist.artistStatementVideo)
            setMediaTab((mediaTabs) => [
                ...mediaTabs,
                {
                    fieldName: 'artistStatementVideo',
                    title: 'Artist Statement',
                    mediaLink: artist.artistStatementVideo,
                    width: 200,
                },
            ]);
        if (artist.repLink)
            setMediaTab((mediaTabs) => [
                ...mediaTabs,
                {
                    fieldName: 'repLink',
                    title: `Listen`,
                    mediaLink: artist.repLink,
                    width: 140,
                },
            ]);
        if (artist.livePerformanceVideo)
            setMediaTab((mediaTabs) => [
                ...mediaTabs,
                {
                    fieldName: 'livePerformanceVideo',
                    title: `Live performance`,
                    mediaLink: artist.livePerformanceVideo,
                    width: 200,
                },
            ]);
        // }
    }, [artist]);

    const [mediaTabIndex, setTabIndex] = useState(0);

    const transitions = useTransition(mediaTabIndex, {
        key: mediaTabIndex,
        initial: null,
        from: { opacity: 0, transform: `scale(1.1,1.1)` },
        enter: { opacity: 1, transform: 'scale(1,1)' },
        leave: {
            opacity: 0,
            transform: `scale(0.9,0.9)`,
        },
        config: config.molasses,
        // onRest: (_a, _b, item) => {
        //   if (formCardIndex === item) {
        //     set(cardIndex => (cardIndex + 1) % formGroups.length)
        //   }
        // },
        exitBeforeEnter: false,
    });

    useEffect(() => {
        getArtistBookingEvents(artist.slug);
    }, [getArtistBookingEvents, artist]);

    //Booking Details Dialog Functions
    const [bookingDetailsDialogOpen, setBookingDetailsDialogOpen] =
        useState(false);

    const [wantsToBook, setWantsToBook] = useState(false);

    const bookingDetailsDialogHandleClose = () => {
        setBookingDialogDetailsState({});
        setBookingDetailsDialogOpen(false);
        setWantsToBook(false);
    };

    const [bookingDialogDetails, setBookingDialogDetailsState] = useState({});

    useEffect(() => {
        //console.log('bookingDialogDetails', bookingDialogDetails);
        setBookingDetailsDialogOpen(true);
    }, [bookingDialogDetails]);

    const handleBookingDetailsBtnClick = (theEvent) => {
        if (user && user._id) {
            if (user && user.role && user.role.indexOf('HOST') > -1) {
                //console.log('user:', user.role);
                setBookingDialogDetailsState({
                    ...theEvent,
                    hostSignUp: false,
                    login: false,
                }); //open dialog box with 'theEvent' as the props
            } else {
                setBookingDialogDetailsState({
                    ...theEvent,
                    hostSignUp: true,
                    login: false,
                }); //open dialog box and make hostSignUp with 'theEvent' as the props
            }
        } else {
            setBookingDialogDetailsState({
                ...theEvent,
                login: true,
                hostSignUp: false,
            }); //open dialog box and make login with 'whenBooking' as the props

            // console.log('Should redirect to login.');
            // history.push('/login');
        }
    };

    return (
        <>
            {bookingDialogDetails && bookingDialogDetails.bookingWhen && (
                <Dialog
                    open={bookingDetailsDialogOpen}
                    onClose={bookingDetailsDialogHandleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    scroll="body"
                    fullWidth
                    maxWidth={isAuthenticated || !wantsToBook ? 'md' : 'xs'}
                >
                    <DialogTitle id="alert-dialog-title">
                        {!isAuthenticated &&
                            wantsToBook &&
                            `For you to offer to host this show, you'll need
                                to login.`}
                        {/* : host &&
                              host.me &&
                              host.me._id &&
                              host.me.email &&
                              host.me.streetAddress &&
                              wantsToBook
                            ? `Would you like to offer to host ` +
                              artist.stageName +
                              ` on ` +
                              new Date(
                                  bookingDialogDetails.bookingWhen
                              ).toLocaleDateString(undefined, {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                              }) +
                              ` near ` +
                              bookingDialogDetails.bookingWhere.city +
                              ', ' +
                              bookingDialogDetails.bookingWhere.state +
                              '?'
                            : ''} */}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {!isAuthenticated && wantsToBook ? (
                                <Login bookingDialog={bookingDialogDetails} />
                            ) : !wantsToBook ? (
                                <EventDetails theEvent={bookingDialogDetails} />
                            ) : host &&
                              host.me &&
                              host.me._id &&
                              host.me.completedProfileForm &&
                              host.me.firstName &&
                              host.me.lastName &&
                              host.me.email &&
                              host.me.profileImg &&
                              (host.me.streetAddress ||
                                  host.me.venueStreetAddress) ? (
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    className="dateLocationForBooking"
                                >
                                    <Grid
                                        container
                                        item
                                        direction="row"
                                        alignItems="start"
                                        justifyContent="center"
                                        height="80vh"
                                    >
                                        <EventSpecificHostForm
                                            artist={artist}
                                            theEvent={bookingDialogDetails}
                                            bookingDetailsDialogHandleClose={
                                                bookingDetailsDialogHandleClose
                                            }
                                        />
                                        {/* <StackDateforDisplay
                                            date={
                                                bookingDialogDetails.bookingWhen
                                            }
                                        ></StackDateforDisplay> */}
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid
                                    container
                                    item
                                    direction="row"
                                    alignItems="start"
                                    justifyContent="center"
                                    height="100vh"
                                >
                                    <EditMyHostProfile
                                        inDialog={bookingDialogDetails}
                                    />
                                </Grid>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    {host &&
                        host.me &&
                        host.me._id &&
                        host.me.email &&
                        host.me.streetAddress &&
                        wantsToBook && (
                            <DialogActions>
                                {/* <Button
                                    onClick={bookingDetailsDialogHandleClose}
                                >
                                    No
                                </Button> */}
                                {/* <Button
                                    onClick={(e) => {
                                        hostRaiseHand({
                                            artist: artist,
                                            bookingWhen:
                                                bookingDialogDetails.bookingWhen,
                                        });
                                        bookingDetailsDialogHandleClose();
                                    }}
                                >
                                    Yes
                                </Button> */}
                            </DialogActions>
                        )}
                    {!wantsToBook && (
                        <DialogActions>
                            <Button
                                btnwidth="280"
                                onClick={(e) => {
                                    setWantsToBook(true);
                                }}
                            >
                                I want to host this show
                            </Button>
                        </DialogActions>
                    )}
                </Dialog>
            )}

            <Grid
                container
                className="artistProfile"
                sx={{
                    paddingBottom: '80px!important',
                }}
            >
                <ArtistTop artist={artist}></ArtistTop>
                <Grid
                    item
                    container
                    justifyContent="start"
                    direction="row"
                    className="mediaRow"
                    sx={{
                        padding: '8px 0px 0!important',
                        height: 'fit-content',
                    }}
                >
                    <Grid
                        item
                        container
                        sx={{
                            margin: '0 auto',
                            height: '100%',
                        }}
                        className="mediaTabEmbed"
                        direction="column"
                        md={8}
                        xs={12}
                    >
                        <Grid
                            item
                            container
                            sx={{
                                marginTop: '0',
                                width: '100%',

                                flexDirection: 'row',
                                justifyContent: {
                                    md: 'space-between',
                                    xs: 'center',
                                },
                            }}
                            className="mediaTabNav"
                        >
                            {mediaTabs.map((mediaTab, i) => (
                                <Grid
                                    item
                                    key={i}
                                    sx={{
                                        marginRight: {
                                            md: '8px',
                                        },
                                        marginBottom: '8px',
                                    }}
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link
                                                to={`/edit-artist-profile?field=${mediaTab.fieldName}`}
                                            >
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <Button
                                            variant="contained"
                                            component="span"
                                            onClick={(e) => setTabIndex(i)}
                                            btnwidth={mediaTab.width}
                                        >
                                            {mediaTab.title}
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            ))}
                        </Grid>
                        <Grid
                            item
                            sx={{
                                position: 'relative',
                                height: '400px',
                            }}
                        >
                            {mediaTabs.length > 0
                                ? transitions((style, i) => (
                                      <animated.div
                                          className={'animatedMediaTab'}
                                          key={'animatedMediaTab' + i}
                                          style={{
                                              ...style,
                                              position: 'absolute',
                                              width: '100%',
                                              height: '400px',
                                              //paddingBottom: '100%',
                                          }}
                                      >
                                          <ReactPlayer
                                              light={
                                                  (new URL(
                                                      mediaTabs[i].mediaLink
                                                  ).hostname !==
                                                      'music.youtube.com' &&
                                                      pullDomainFrom(
                                                          mediaTabs[i].mediaLink
                                                      ) === 'youtube') ||
                                                  pullDomainFrom(
                                                      mediaTabs[i].mediaLink
                                                  ) === 'youtu'
                                              }
                                              url={mediaTabs[i].mediaLink}
                                              width="100%"
                                              style={{
                                                  width: '100%',
                                                  padding: '0 8px 0 0',
                                              }}
                                          />
                                      </animated.div>
                                  ))
                                : ''}
                        </Grid>
                    </Grid>
                </Grid>
                {events &&
                events.length > 0 &&
                events[0].bookingWhen &&
                events[0].bookingWhere != '' ? ( //check to be sure there's a valid first entry
                    <Grid
                        item
                        container
                        justifyContent="start"
                        direction="row"
                        sx={{
                            height: '100%',
                            padding: '0 20px!important',
                            color: 'var(--primary-color)',

                            justifyContent: {
                                xs: 'center',
                            },
                        }}
                        className="bookingDetails"
                    >
                        {/* <Grid direction="column" xs={12} md={12}> */}
                        <Grid item direction="column" xs={12} md={12}>
                            <Grid item xs={12}>
                                <Typography component="h2">
                                    {artist.stageName} is looking to book a show
                                    for{' '}
                                    {events.length > 1
                                        ? 'these dates and locations'
                                        : 'this date and location'}
                                    :
                                </Typography>
                            </Grid>
                            {/* {bookingWhenWhere && bookingWhenWhere.length > 0 && bookingWhenWhere[0].when ? //check to be sure there's a valid first entry */}
                            <Grid
                                container
                                className="whenBooking"
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                xs={12}
                                spacing={2}
                                sx={{
                                    margin: '0px auto 16px',
                                    width: '100%',
                                }}
                            >
                                {events
                                    .filter((e) => e)
                                    .map(
                                        (
                                            thisEvent,
                                            idx,
                                            whenWhereOrig //.filter(e => e) to remove any null values
                                        ) =>
                                            thisEvent.bookingWhen &&
                                            thisEvent.bookingWhere != '' ? (
                                                <Grid
                                                    container
                                                    item
                                                    className="bookingWhen"
                                                    key={`bookingWhen${idx}`}
                                                    direction="row"
                                                    md={3.7}
                                                    sm={5.5}
                                                    xs={12}
                                                    sx={{
                                                        backgroundColor:
                                                            'rgba(0,0,0,0.35)',
                                                        '&:hover': {},
                                                        padding: '16px',
                                                        margin: '4px',
                                                        color: 'var(--light-color)',
                                                    }}
                                                >
                                                    <Tooltip
                                                        arrow={true}
                                                        disableHoverListener={
                                                            !isMe
                                                        }
                                                        disableFocusListener={
                                                            !isMe
                                                        }
                                                        disableTouchListener={
                                                            !isMe
                                                        }
                                                        title={
                                                            <Link to="/edit-artist-booking?field=bookingWhen">
                                                                Edit
                                                            </Link>
                                                        }
                                                    >
                                                        <Grid
                                                            container
                                                            item
                                                            direction="row"
                                                            alignItems="center"
                                                            className="dateLocationForBooking"
                                                        >
                                                            <Grid
                                                                item
                                                                sx={{
                                                                    width: '55px',
                                                                }}
                                                            >
                                                                <StackDateforDisplay
                                                                    date={
                                                                        thisEvent.bookingWhen
                                                                    }
                                                                ></StackDateforDisplay>
                                                            </Grid>
                                                            <Grid item xs={8}>
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        fontSize:
                                                                            '1.5em',
                                                                        marginLeft:
                                                                            '8px',
                                                                        lineHeight:
                                                                            '1.5',
                                                                    }}
                                                                >
                                                                    {thisEvent
                                                                        .bookingWhere
                                                                        .city +
                                                                        ', ' +
                                                                        thisEvent
                                                                            .bookingWhere
                                                                            .state}
                                                                </Grid>
                                                                {thisEvent.status ===
                                                                    'PENDING' && (
                                                                    // user &&
                                                                    // user.role &&
                                                                    // user.role.indexOf(
                                                                    //    'HOST'
                                                                    //) > -1 &&
                                                                    //(user.role.indexOf(
                                                                    //    'ADMIN'
                                                                    //) > -1 ||
                                                                    //    user.role.indexOf(
                                                                    //        'BOOKING'
                                                                    //    ) >
                                                                    //        -1 ||
                                                                    //    )
                                                                    <Grid
                                                                        item
                                                                        sx={{
                                                                            marginLeft:
                                                                                '8px',
                                                                        }}
                                                                    >
                                                                        <Button
                                                                            onClick={() => {
                                                                                handleBookingDetailsBtnClick(
                                                                                    thisEvent
                                                                                );
                                                                            }}
                                                                        >
                                                                            Hosting
                                                                            Details
                                                                        </Button>
                                                                    </Grid>
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </Tooltip>
                                                </Grid>
                                            ) : (
                                                ''
                                            )
                                    )}
                            </Grid>
                        </Grid>
                        {/* <Grid
                            container
                            direction="row"
                            xs={12}
                            md={8}
                            spacing={2}
                            sx={{
                                paddingLeft: {
                                    md: '16px',
                                    xs: '0px',
                                },
                                paddingTop: {
                                    md: '0px',
                                    xs: '16px',
                                },
                            }}
                            className="bookingSpecifics"
                        >
                            {artist.costStructure && artist.namedPrice ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="costStructure"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=costStructure">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        {artist.costStructure === 'donation' ? (
                                            <VolunteerActivismTwoToneIcon></VolunteerActivismTwoToneIcon>
                                        ) : (
                                            <ConfirmationNumberTwoToneIcon></ConfirmationNumberTwoToneIcon>
                                        )}
                                    </Tooltip>{' '}
                                    {'Concerts will be '}
                                    <strong>
                                        {artist.costStructure == 'ticket'
                                            ? 'ticketed'
                                            : 'donation-based'}
                                    </strong>
                                    {', at '}
                                    <strong>
                                        {' $'}
                                        {artist.namedPrice}
                                    </strong>
                                    {' per '}
                                    {artist.costStructure}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.tourVibe.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="tourVibe"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=tourVibe">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <GroupsTwoToneIcon></GroupsTwoToneIcon>
                                    </Tooltip>
                                    {
                                        ' Feels most comfortable performing for an audience who is: '
                                    }
                                    <strong>
                                        {artist.tourVibe.join(', ')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.showSchedule ? (
                                <>
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="showSchedule"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=showSchedule">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <AccessTimeTwoToneIcon></AccessTimeTwoToneIcon>
                                        </Tooltip>
                                        {' Setup at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.setupTime
                                            )}
                                        </strong>
                                        {', doors open at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.doorsOpen
                                            )}
                                        </strong>
                                        {', show starts at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.startTime
                                            )}
                                        </strong>
                                        {', with a hard wrap at '}
                                        <strong>
                                            {convert24HourTime(
                                                artist.showSchedule.hardWrap
                                            )}
                                        </strong>

                                        <Divider />
                                    </Grid>
                                </>
                            ) : (
                                ''
                            )}
                            {artist.overnight && artist.overnight > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="overnight"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=overnight">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <HotelTwoToneIcon></HotelTwoToneIcon>
                                    </Tooltip>
                                    {
                                        ' If possible, overnight accommodation appreciated for '
                                    }
                                    <strong>
                                        {artist.overnight +
                                            (artist.overnight > 1
                                                ? ' people'
                                                : ' person')}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.merchTable ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="merchTable"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=merchTable">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <TableRestaurantTwoToneIcon></TableRestaurantTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would like a <strong>merch table</strong>{' '}
                                    (for CDs, t-shirts, etc.){' '}
                                    {artist.merchTable}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.allergies.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="allergies"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=allergies">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SvgIcon
                                            style={{
                                                width: '26px',
                                                verticalAlign: 'baseline',
                                            }}
                                        >
                                            <FontAwesomeIcon icon="allergies"></FontAwesomeIcon>
                                        </SvgIcon>
                                    </Tooltip>
                                    {' Has these allergies: '}
                                    <strong>
                                        {artist.allergies.constructor.name ===
                                            'Array' &&
                                            artist.allergies.map(
                                                (allergy, ind) => {
                                                    if (
                                                        ind !==
                                                        artist.allergies
                                                            .length -
                                                            1
                                                    ) {
                                                        return allergy + ', ';
                                                    } else {
                                                        return allergy;
                                                    }
                                                }
                                            )}{' '}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.familyFriendly ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <FamilyRestroomTwoToneIcon></FamilyRestroomTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>{'Family-friendly'}</strong>
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {!artist.familyFriendly ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="familyFriendly"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=familyFriendly">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <WcTwoToneIcon></WcTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would prefer to have an{' '}
                                    <strong>adults-only</strong> show
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.alcohol ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="alcohol"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=alcohol">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <LiquorTwoToneIcon></LiquorTwoToneIcon>
                                    </Tooltip>
                                    Comfortable with having
                                    <strong>{' alcohol '}</strong>at the show
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {!artist.alcohol ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="alcohol"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=alcohol">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <NoDrinksTwoToneIcon></NoDrinksTwoToneIcon>
                                    </Tooltip>{' '}
                                    Would prefer having{' '}
                                    <strong> no alcohol </strong> at the show
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.soundSystem == 'yes' ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>
                                        {'Able to bring their own sound system'}
                                    </strong>{' '}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.soundSystem == 'noButNeed' ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>{'Needs a sound system'}</strong>{' '}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.soundSystem == 'no' ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="soundSystem"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=soundSystem">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SpeakerTwoToneIcon></SpeakerTwoToneIcon>
                                    </Tooltip>{' '}
                                    <strong>
                                        Able to play an acoustic show
                                    </strong>{' '}
                                    if it makes sense for the size of the space.{' '}
                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.covidPrefs.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="covidPrefs"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=covidPrefs">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <CoronavirusTwoToneIcon></CoronavirusTwoToneIcon>
                                    </Tooltip>
                                    {' Considering Covid, would prefer: '}
                                    <strong>
                                        {artist.covidPrefs.constructor.name ===
                                            'Array' &&
                                            artist.covidPrefs.map(
                                                (covidPref, ind) => {
                                                    if (
                                                        ind !==
                                                        artist.covidPrefs
                                                            .length -
                                                            1
                                                    ) {
                                                        return covidPref + ', ';
                                                    } else {
                                                        return covidPref;
                                                    }
                                                }
                                            )}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.financialHopes ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="financialHopes"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=financialHopes">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <SavingsTwoToneIcon></SavingsTwoToneIcon>
                                    </Tooltip>
                                    {' It would be hard to make less than '}
                                    <strong>${artist.financialHopes}</strong>
                                    {' per show'}

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {artist.fanActions &&
                            artist.fanActions.length > 0 ? (
                                <Grid
                                    item
                                    sx={{ marginTop: '0' }}
                                    xs={12}
                                    md={6}
                                    className="fanActions"
                                >
                                    <Tooltip
                                        arrow={true}
                                        disableHoverListener={!isMe}
                                        disableFocusListener={!isMe}
                                        disableTouchListener={!isMe}
                                        title={
                                            <Link to="/edit-artist-booking?field=fanActions">
                                                Edit
                                            </Link>
                                        }
                                    >
                                        <ThumbUpTwoToneIcon></ThumbUpTwoToneIcon>
                                    </Tooltip>
                                    {' How new fans can show support: '}
                                    <strong>
                                        {artist.fanActions.map(
                                            (fanAction, ind) => {
                                                if (
                                                    ind !==
                                                    artist.fanActions.length - 1
                                                ) {
                                                    return fanAction + ', ';
                                                } else {
                                                    return fanAction;
                                                }
                                            }
                                        )}{' '}
                                    </strong>

                                    <Divider />
                                </Grid>
                            ) : (
                                ''
                            )}
                            {user &&
                            user.role &&
                            user.role.indexOf('ADMIN') > -1 ? (
                                artist.agreeToPayAdminFee ? (
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="agreeToPayAdminFee"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=agreeToPayAdminFee">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <AttachMoneyTwoToneIcon></AttachMoneyTwoToneIcon>
                                        </Tooltip>
                                        <strong> Agreed </strong>{' '}
                                        {
                                            ' to pay 20% of gross ticket sales, tips, and merch sales '
                                        }
                                        <Divider />
                                    </Grid>
                                ) : (
                                    <Grid
                                        item
                                        sx={{ marginTop: '0' }}
                                        xs={12}
                                        md={6}
                                        className="agreeToPayAdminFee"
                                    >
                                        <Tooltip
                                            arrow={true}
                                            disableHoverListener={!isMe}
                                            disableFocusListener={!isMe}
                                            disableTouchListener={!isMe}
                                            title={
                                                <Link to="/edit-artist-booking?field=agreeToPayAdminFee">
                                                    Edit
                                                </Link>
                                            }
                                        >
                                            <MoneyOffTwoToneIcon></MoneyOffTwoToneIcon>
                                        </Tooltip>
                                        <strong> Did NOT agree </strong>
                                        {
                                            ' to pay 20% of gross ticket sales, tips, and merch sales.'
                                        }{' '}
                                        <strong>
                                            Would like to discuss this further.
                                        </strong>
                                        <Divider />
                                    </Grid>
                                )
                            ) : (
                                ''
                            )}
                        </Grid>*/}
                    </Grid>
                ) : (
                    ''
                )}
            </Grid>
        </>
    );
};

ArtistProfile.propTypes = {
    artist: PropTypes.object.isRequired,
    me: PropTypes.object,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    host: PropTypes.object,
    events: PropTypes.array,
    hostRaiseHand: PropTypes.func.isRequired,
    getArtistBookingEvents: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    me: state.artist.me,
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated,
    host: state.host,
    events: state.event.events,
});

export default connect(mapStateToProps, {
    hostRaiseHand,
    getArtistBookingEvents,
})(withRouter(ArtistProfile)); //withRouter allows us to pass history objects
