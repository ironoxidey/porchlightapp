import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Grid, Typography, Box, Avatar, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { StackDateforDisplay } from '../../actions/app';
import { artistViewedHostOffer } from '../../actions/event';

import EventDetails from '../events/EventDetails';

import Button from '../layout/SvgButton';
import HostProfile from '../hosts/HostProfile';

const ArtistDashboardEventCard = ({ thisEvent, artistViewedHostOffer }) => {
    //console.log('ArtistDashboardEventCard thisEvent:', thisEvent);

    //Booking Details Dialog Functions
    const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);

    const [wantsToBook, setWantsToBook] = useState(false);

    const eventDetailsDialogHandleClose = () => {
        setDialogDetailsState({});
        setEventDetailsDialogOpen(false);
        setWantsToBook(false);
    };

    const [eventDialogDetails, setDialogDetailsState] = useState({});

    useEffect(() => {
        //console.log('eventDialogDetails', eventDialogDetails);
        setEventDetailsDialogOpen(true);
    }, [eventDialogDetails]);

    const handleEventBtnClick = (theOffer) => {
        setDialogDetailsState(theOffer);
    };
    //End of Dialog Functions

    return (
        <>
            {eventDialogDetails && eventDialogDetails.host && (
                <Dialog
                    open={eventDetailsDialogOpen}
                    onClose={eventDetailsDialogHandleClose}
                    // aria-labelledby="alert-dialog-title"
                    // aria-describedby="alert-dialog-description"
                    scroll="body"
                    fullWidth
                    maxWidth="md"
                >
                    {/* <DialogTitle id="alert-dialog-title"></DialogTitle> */}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
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
                                    date={thisEvent.bookingWhen}
                                ></StackDateforDisplay>
                            </Box>
                            <HostProfile
                                theHost={eventDialogDetails.host}
                                theEvent={thisEvent}
                                theOffer={eventDialogDetails}
                                eventDetailsDialogHandleClose={
                                    eventDetailsDialogHandleClose
                                }
                            ></HostProfile>

                            {/* <EventDetails
                                theEvent={eventDialogDetails.theEvent}
                            /> */}
                        </DialogContentText>
                    </DialogContent>
                    {/*<DialogActions>
                         <Typography>
                            {'Would you like to accept ' +
                                eventDialogDetails.host.firstName +
                                ' ' +
                                eventDialogDetails.host.lastName +
                                `’s offer to host your show on ` +
                                new Date(
                                    thisEvent.bookingWhen
                                ).toLocaleDateString(undefined, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }) +
                                ` near ` +
                                thisEvent.bookingWhere.city +
                                ', ' +
                                thisEvent.bookingWhere.state +
                                '?'}
                        </Typography>
                        <Button onClick={eventDetailsDialogHandleClose}>
                            No
                        </Button>
                        <Button
                            onClick={(e) => {
                                eventDetailsDialogHandleClose();
                            }}
                        >
                            Yes
                        </Button> 
                    </DialogActions>*/}
                </Dialog>
            )}
            <Grid
                container
                item
                className="bookingWhen"
                key={thisEvent._id}
                direction="row"
                sm={5.5}
                xs={12}
                sx={{
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    '&:hover': {},
                    padding: '16px',
                    margin: '4px',
                    color: 'var(--light-color)',
                }}
            >
                <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    className="dateLocationForBooking"
                    xs={8}
                >
                    <Grid item container>
                        <Link to={'/artists/' + thisEvent.artist.slug}>
                            <Typography component="h2">
                                {thisEvent.artist.stageName}
                            </Typography>
                        </Link>
                    </Grid>
                    <Grid
                        item
                        sx={{
                            width: '55px',
                        }}
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
                        {thisEvent.offersFromHosts &&
                            thisEvent.offersFromHosts.length > 0 && (
                                <Grid item container>
                                    {thisEvent.offersFromHosts
                                        .filter((e) => e) //.filter(e => e) to remove any null values
                                        .map(
                                            (thisOffer, idx) =>
                                                thisOffer.host.firstName &&
                                                thisOffer.host.lastName && (
                                                    <Grid
                                                        item
                                                        sx={{
                                                            marginLeft: '8px',
                                                        }}
                                                    >
                                                        <Tooltip
                                                            arrow={true}
                                                            placement="bottom"
                                                            title={
                                                                <>
                                                                    <div>{`${thisOffer.host.firstName} ${thisOffer.host.lastName}`}</div>
                                                                    {thisOffer.status ===
                                                                        'ACCEPTED' && (
                                                                        <div
                                                                            style={{
                                                                                fontFamily:
                                                                                    'var(--secondary-font)',
                                                                                color: 'var(--link-color)',
                                                                            }}
                                                                        >
                                                                            ACCEPTED
                                                                        </div>
                                                                    )}
                                                                </>
                                                            }
                                                        >
                                                            <Box
                                                                className="squareImgInACircle"
                                                                sx={{
                                                                    height: '50px',
                                                                    width: '50px',
                                                                    maxHeight:
                                                                        '200px',
                                                                    maxWidth:
                                                                        '200px',
                                                                    borderRadius:
                                                                        '50%',
                                                                    overflow:
                                                                        'hidden',
                                                                    backgroundImage: `url("${thisOffer.host.profileImg}")`,
                                                                    backgroundPosition:
                                                                        '50% 25%',
                                                                    backgroundSize:
                                                                        'cover',
                                                                    padding:
                                                                        '2px',
                                                                    backgroundClip:
                                                                        'content-box',
                                                                    border: `${
                                                                        !thisOffer.artistViewedOn
                                                                            ? '1px solid var(--primary-color)'
                                                                            : thisOffer.status ===
                                                                              'ACCEPTED'
                                                                            ? '1px solid var(--link-color)'
                                                                            : '1px solid transparent'
                                                                    }`,
                                                                    margin: '0',
                                                                    cursor: 'pointer',
                                                                    opacity: `${
                                                                        thisOffer.status ===
                                                                        'ACCEPTED'
                                                                            ? 1
                                                                            : 0.8
                                                                    }`,
                                                                    transform: `${
                                                                        thisOffer.status ===
                                                                        'ACCEPTED'
                                                                            ? 'scale(1.1)'
                                                                            : 'scale(1)'
                                                                    }`,
                                                                    filter: `${
                                                                        thisOffer.status ===
                                                                        'ACCEPTED'
                                                                            ? 'grayscale(0%)'
                                                                            : 'grayscale(50%)'
                                                                    }`,
                                                                    '&:hover': {
                                                                        filter: 'grayscale(0%)',
                                                                        opacity: 1,
                                                                        transform:
                                                                            'scale(1.1)',
                                                                    },
                                                                    transition:
                                                                        'all 450ms cubic-bezier(0.23, 1, 0.32, 1)',
                                                                }}
                                                                onClick={() => {
                                                                    //thisEvent.offeringHost = thisOffer.host;
                                                                    let eventDetails =
                                                                        {
                                                                            ...thisEvent,

                                                                            offeringHost:
                                                                                thisOffer.host,
                                                                        };
                                                                    // thisOffer.theEvent =
                                                                    //     thisEvent;
                                                                    !thisOffer.artistViewedOn &&
                                                                        artistViewedHostOffer(
                                                                            thisOffer
                                                                                .host
                                                                                ._id,
                                                                            thisEvent.bookingWhen
                                                                        );
                                                                    handleEventBtnClick(
                                                                        thisOffer
                                                                    );
                                                                }}
                                                            ></Box>
                                                        </Tooltip>
                                                    </Grid>
                                                )
                                        )}
                                </Grid>
                            )}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

ArtistDashboardEventCard.propTypes = {
    thisEvent: PropTypes.object.isRequired,
    artistViewedHostOffer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

//export default ArtistDashboardEventCard;
export default connect(mapStateToProps, {
    artistViewedHostOffer,
})(withRouter(ArtistDashboardEventCard)); //withRouter allows us to pass history objects