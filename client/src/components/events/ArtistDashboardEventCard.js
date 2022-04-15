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
    //console.log(thisEvent);

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
        console.log('bookingDialogDetails', bookingDialogDetails);
        setBookingDetailsDialogOpen(true);
    }, [bookingDialogDetails]);

    const handleBookingDetailsBtnClick = (theEvent) => {
        setBookingDialogDetailsState(theEvent);
    };

    return (
        <>
            {bookingDialogDetails && bookingDialogDetails.host && (
                <Dialog
                    open={bookingDetailsDialogOpen}
                    onClose={bookingDetailsDialogHandleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    scroll="paper"
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle id="alert-dialog-title"></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <HostProfile
                                theHost={bookingDialogDetails.host}
                            ></HostProfile>

                            <EventDetails
                                theEvent={bookingDialogDetails.theEvent}
                            />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Typography>
                            {'Would you like to accept ' +
                                bookingDialogDetails.host.firstName +
                                ' ' +
                                bookingDialogDetails.host.lastName +
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
                        <Button onClick={bookingDetailsDialogHandleClose}>
                            No
                        </Button>
                        <Button
                            onClick={(e) => {
                                bookingDetailsDialogHandleClose();
                            }}
                        >
                            Yes
                        </Button>
                    </DialogActions>
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
                                                                thisOffer.host
                                                                    .firstName +
                                                                ' ' +
                                                                thisOffer.host
                                                                    .lastName
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
                                                                            : '1px solid transparent'
                                                                    }`,
                                                                    margin: '0 8px 0 0',
                                                                    cursor: 'pointer',
                                                                }}
                                                                onClick={() => {
                                                                    thisEvent.offeringHost =
                                                                        thisOffer.host;
                                                                    thisOffer.theEvent =
                                                                        thisEvent;
                                                                    artistViewedHostOffer(
                                                                        thisEvent
                                                                    );
                                                                    handleBookingDetailsBtnClick(
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
