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
    });
};

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const NearMeToHostEventCard = ({
    thisEvent,
    idx,
    user,
    host,
    isAuthenticated,
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
        console.log('queryEventID', queryEventID + ' vs. ' + thisEvent._id);
        elementToScrollTo = document.getElementById(queryEventID);
    }, [queryEventID]);

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
            dashboardEventCardRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
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
                item
                className="bookingWhen"
                key={`bookingWhen${idx}`}
                id={thisEvent._id}
                direction="row"
                sm={5.5}
                xs={12}
                ref={dashboardEventCardRef}
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
                <Grid item>
                    <Link to={'/artists/' + thisEvent.artist.slug}>
                        <Box
                            className="squareImgInACircle"
                            sx={{
                                height: '130px',
                                width: '130px',
                                maxHeight: '130px',
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
                    md={8}
                    xs={12}
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
                                fontSize: '1.5em',
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
    user: PropTypes.object,
    host: PropTypes.object,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    host: state.host,
    isAuthenticated: state.auth.isAuthenticated,
});

//export default NearMeToHostEventCard;
export default connect(mapStateToProps, {})(withRouter(NearMeToHostEventCard)); //withRouter allows us to pass history objects
