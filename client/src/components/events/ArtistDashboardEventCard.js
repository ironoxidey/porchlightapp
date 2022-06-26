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

import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

import { StackDateforDisplay } from '../../actions/app';
import { artistViewedHostOffer } from '../../actions/event';

import EventDetails from '../events/EventDetails';

import Button from '../layout/SvgButton';
import HostProfile from '../hosts/HostProfile';
import { relativeTimeRounding } from 'moment';
import ArtistDashboardBookingOffers from './ArtistDashboardBookingOffers';

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
                    md={8}
                    xs={12}
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
                                        .map((thisOffer, idx) => (
                                            <ArtistDashboardBookingOffers
                                                thisOffer={thisOffer}
                                                thisEvent={thisEvent}
                                            ></ArtistDashboardBookingOffers>
                                        ))}
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
