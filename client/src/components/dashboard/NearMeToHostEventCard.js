import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Avatar,
    Tooltip,
    Chip,
    SvgIcon,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { StackDateforDisplay } from '../../actions/app';
import { getEventByID } from '../../actions/event';

import Login from '../auth/Login';
import EditMyHostProfile from '../hosts/EditMyHostProfile';
import EventDetails from '../events/EventDetails';

import Button from '../layout/SvgButton';

import EventSpecificHostForm from '../events/EventSpecificHostForm';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FlareTwoToneIcon from '@mui/icons-material/FlareTwoTone';

//import ArtistTop from './ArtistTop';

const prettifyDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
    });
};

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const NearMeToHostEventCard = ({
    nearMeToHost,
    thisEvent,
    idx,
    user,
    host,
    isAuthenticated,
    getEventByID,
}) => {
    //console.log('NearMeToHostEventCard thisEvent:', thisEvent);

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

    let query = useQuery();
    const queryEventID = query.get('eventID');
    let elementToScrollTo = document.getElementById(queryEventID);
    useEffect(() => {
        //check if queryEventID is in nearMeToHost——sometimes the event changes location and no longer displays
        if (nearMeToHost && queryEventID) {
            // console.log(
            //     'nearMeToHost.some(obj => Object.values(obj).includes(queryEventID))',
            //     nearMeToHost.some((obj) =>
            //         Object.values(obj).includes(queryEventID)
            //     )
            // );
            if (
                !nearMeToHost.some((obj) =>
                    Object.values(obj).includes(queryEventID)
                ) //if queryEventID is NOT in nearMeToHost)
            ) {
                getEventByID(queryEventID);
                // console.log('queryEventID NOT in nearMeToHost');
            }
            //
        }

        if (queryEventID) {
            // console.log('queryEventID', queryEventID + ' vs. ' + thisEvent._id);
            elementToScrollTo = document.getElementById(queryEventID);
        }
    }, [queryEventID, nearMeToHost]);

    //for animated border
    const dashboardEventCardRef = useRef(null);
    // const [eventCardHeight, setHeight] = useState(0);
    // const [eventCardWidth, setWidth] = useState(0);
    // useEffect(() => {
    //     setHeight(dashboardEventCardRef.current.offsetHeight);
    //     setWidth(dashboardEventCardRef.current.offsetWidth);
    // }, []);

    useEffect(() => {
        if (thisEvent._id === queryEventID) {
            if (dashboardEventCardRef.current) {
                dashboardEventCardRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
            setTimeout(() => {
                handleBookingDetailsBtnClick(thisEvent);
            }, 800);

            //console.log('eventEditDrawer', eventEditDrawer);
        }
    }, [elementToScrollTo]);

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

    //End of Dialog Functions

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
                    className="porchlightBG"
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
                                date={bookingDialogDetails.bookingWhen}
                            ></StackDateforDisplay>
                        </Box>
                        {/* <DialogContentText id="alert-dialog-description"> */}
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
                                        theEvent={bookingDialogDetails}
                                        artist={thisEvent.artist}
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
                        {/* </DialogContentText> */}
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
                            {host.me.adminActive != true ? (
                                <p
                                    style={{
                                        textAlign: 'center',
                                        width: '100%',
                                    }}
                                >
                                    Your hosting account is pending activation.
                                    A Porchlight representative should reach out
                                    to you soon.
                                </p>
                            ) : (
                                <Button
                                    btnwidth="280"
                                    onClick={(e) => {
                                        setWantsToBook(true);
                                    }}
                                >
                                    I want to host this show
                                </Button>
                            )}
                        </DialogActions>
                    )}
                </Dialog>
            )}

            <Grid
                container
                item
                className="bookingWhen dateLocationForBookingWrapper"
                key={`bookingWhen${idx}`}
                id={thisEvent._id}
                direction="row"
                sm={5.5}
                xs={12}
                ref={dashboardEventCardRef}
                alignItems="center"
                sx={{
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    '&:hover': {},
                    padding: '16px',
                    margin: '4px',
                    color: 'var(--light-color)',
                    position: 'relative',
                }}
            >
                {user.lastLastLogin < thisEvent.createdAt && (
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
                                color:
                                    user.lastLastLogin < thisEvent.createdAt
                                        ? 'var(--link-color)'
                                        : 'var(--dark-color)',
                            }}
                        >
                            <FlareTwoToneIcon
                                style={{ fontSize: '1.5em' }}
                            ></FlareTwoToneIcon>{' '}
                            NEW
                            {/* Created On: {prettifyDate(thisEvent.createdAt) */}
                        </Typography>
                    </Box>
                )}
                <Grid
                    item
                    className="feoyAvatarGridItem"
                    sx={{
                        // width: '100%',
                        flexBasis: { xs: '80px', sm: '130px' },
                        flexShrink: '3',
                        flexGrow: '2',
                    }}
                >
                    <Link to={'/artists/' + thisEvent.artist.slug}>
                        <Box
                            className="squareImgInACircle"
                            sx={{
                                height: 'auto',
                                width: 'auto',
                                // maxHeight: { xs: '100px', sm: '130px' },
                                maxHeight: '130px',
                                // maxWidth: { xs: '100px', sm: '130px' },
                                maxWidth: '130px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                backgroundImage: `url("${thisEvent.artist.squareImg}")`,
                                backgroundPosition: '50% 25%',
                                backgroundSize: 'cover',
                                padding: '4px',
                                backgroundClip: 'content-box',
                                border: '1px solid var(--primary-color)',
                                margin: '0 8px 0 0',
                                aspectRatio: '1 / 1',
                            }}
                        ></Box>
                    </Link>
                </Grid>

                <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    className="dateLocationForBooking"
                    sx={{
                        flexBasis: {
                            xs: 'calc(100% - 80px)',
                            sm: 'calc(100% - 130px)',
                        },
                        flexGrow: '1',
                    }}
                    // md={8}
                    // xs={12}
                >
                    <Grid
                        item
                        container
                        alignItems="start"
                        direction={'column'}
                    >
                        <Grid item>
                            <Link to={'/artists/' + thisEvent.artist.slug}>
                                <Typography component="h2">
                                    {thisEvent.artist.stageName}
                                </Typography>
                            </Link>
                        </Grid>
                        {thisEvent.artist.genres &&
                            thisEvent.artist.genres.constructor.name ===
                                'Array' && (
                                <Grid item>
                                    {thisEvent.artist.genres.map(
                                        (genre, key) => (
                                            <Chip
                                                key={key}
                                                label={genre}
                                                size="small"
                                                sx={{ margin: '0 4px 4px' }}
                                            ></Chip>
                                        )
                                    )}
                                </Grid>
                            )}
                    </Grid>
                    <Grid
                        item
                        sx={
                            {
                                // width: '55px',
                            }
                        }
                    >
                        <StackDateforDisplay
                            date={thisEvent.bookingWhen}
                        ></StackDateforDisplay>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid
                            item
                            sx={{
                                fontSize: { xs: '1.2em', sm: '1.5em' },
                                marginLeft: '8px',
                                lineHeight: '1.5',
                            }}
                        >
                            {thisEvent.bookingWhere.city +
                                ', ' +
                                thisEvent.bookingWhere.state}
                        </Grid>

                        <Grid
                            item
                            sx={{
                                marginLeft: '8px',
                            }}
                        >
                            <Button
                                btnwidth="200"
                                onClick={() => {
                                    handleBookingDetailsBtnClick(thisEvent);
                                }}
                            >
                                Hosting Details
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

NearMeToHostEventCard.propTypes = {
    thisEvent: PropTypes.object.isRequired,
    nearMeToHost: PropTypes.object.isRequired,
    user: PropTypes.object,
    host: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    getEventByID: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    nearMeToHost: state.event.nearMeToHost,
    user: state.auth.user,
    host: state.host,
    isAuthenticated: state.auth.isAuthenticated,
});

//export default NearMeToHostEventCard;
export default connect(mapStateToProps, { getEventByID })(
    withRouter(NearMeToHostEventCard)
); //withRouter allows us to pass history objects
