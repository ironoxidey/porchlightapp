import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Avatar,
    Tooltip,
    IconButton,
} from '@mui/material';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ThumbDownAltTwoToneIcon from '@mui/icons-material/ThumbDownAltTwoTone';

import { StackDateforDisplay } from '../../actions/app';
import { artistViewedHostOffer, deleteHostEvent } from '../../actions/event';

// import EventDetails from '../events/EventDetails';

import Button from '../layout/SvgButton';
// import HostProfile from '../hosts/HostProfile';
// import { relativeTimeRounding } from 'moment';
// import ArtistDashboardBookingOffers from './ArtistDashboardBookingOffers';

import DeleteIcon from '@mui/icons-material/Delete';
import EditHostEvent from './EditHostEvent';

import EventHostDialog from './EventHostDialog';
import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';

const HostDashboardEventCard = ({
    thisEvent,
    artistViewedHostOffer,
    deleteHostEvent,
    eventEditDrawer,
    host,
}) => {
    const confirmedMy = (thisEvent) =>
        thisEvent.createdBy !== 'HOST' &&
        thisEvent.confirmedHost &&
        host.me &&
        host.me._id &&
        thisEvent.confirmedHost === host.me._id
            ? true
            : false;
    //console.log('HostDashboardEventCard thisEvent:', thisEvent);

    //Booking Details Dialog Functions
    // const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);

    // const [wantsToBook, setWantsToBook] = useState(false);

    // const eventDetailsDialogHandleClose = () => {
    //     setDialogDetailsState({});
    //     setEventDetailsDialogOpen(false);
    //     setWantsToBook(false);
    // };

    // const [eventDialogDetails, setDialogDetailsState] = useState({});

    // useEffect(() => {
    //     //console.log('eventDialogDetails', eventDialogDetails);
    //     setEventDetailsDialogOpen(true);
    // }, [eventDialogDetails]);

    // const handleEventBtnClick = (theOffer) => {
    //     setDialogDetailsState(theOffer);
    // };
    //End of Dialog Functions

    //for animated border
    const dashboardEventCardRef = useRef(null);
    const [eventCardHeight, setHeight] = useState(0);
    const [eventCardWidth, setWidth] = useState(0);
    useEffect(() => {
        setHeight(dashboardEventCardRef.current.offsetHeight);
        setWidth(dashboardEventCardRef.current.offsetWidth);
    }, []);

    useEffect(() => {
        if (thisEvent._id === eventEditDrawer) {
            if (dashboardEventCardRef.current) {
                dashboardEventCardRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
            //console.log('eventEditDrawer', eventEditDrawer);
        }
    }, [eventEditDrawer]);

    return (
        <>
            <Grid
                container
                item
                className={
                    thisEvent._id === eventEditDrawer
                        ? 'bookingWhen mostRecent'
                        : 'bookingWhen'
                }
                key={thisEvent._id}
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
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                    // border:
                    //     thisEvent._id === eventEditDrawer
                    //         ? '1px solid var(--dark-color)'
                    //         : '1px solid transparent',
                    // transition: 'all .8s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                    // transitionDelay: '.8s',
                    // boxShadow:
                    //     thisEvent._id === eventEditDrawer
                    //         ? '0 0 5px 0px var(--dark-color)'
                    //         : ' 0 0 0 0 transparent',
                    position: 'relative',
                }}
            >
                <svg
                    width={eventCardWidth}
                    height={eventCardHeight}
                    className="eventCardSvgBorder"
                >
                    <polygon
                        points={
                            '0,' +
                            eventCardHeight +
                            ' 0,0 ' +
                            eventCardWidth +
                            ',0 ' +
                            eventCardWidth +
                            ',' +
                            eventCardHeight +
                            ''
                        }
                        className={
                            thisEvent._id === eventEditDrawer
                                ? 'borderEffect'
                                : ''
                        }
                        style={{
                            strokeDasharray: `${eventCardHeight * 2} ${
                                eventCardHeight * 2 + eventCardWidth * 2
                            }`,
                            strokeDashoffset:
                                thisEvent._id === eventEditDrawer
                                    ? `${eventCardHeight * 2}`
                                    : `${
                                          eventCardHeight * 2 +
                                          eventCardWidth * 3
                                      }`,
                        }}
                    />
                </svg>
                <Grid
                    container
                    item
                    direction="row"
                    alignItems="center"
                    className="dateLocationForBooking"
                    xs={11}
                >
                    {thisEvent.artist &&
                        thisEvent.artist.squareImg &&
                        thisEvent.artist.slug && (
                            <Link to={'/artists/' + thisEvent.artist.slug}>
                                <Grid item>
                                    <Tooltip
                                        title={
                                            thisEvent.artist &&
                                            thisEvent.artist.stageName +
                                                ' accepted your offer.'
                                        }
                                        arrow={true}
                                        placement="bottom"
                                        disableHoverListener={
                                            !confirmedMy(thisEvent)
                                        }
                                        disableFocusListener={
                                            !confirmedMy(thisEvent)
                                        }
                                        disableTouchListener={
                                            !confirmedMy(thisEvent)
                                        }
                                    >
                                        <Box
                                            className="squareImgInACircle"
                                            sx={{
                                                height: '130px',
                                                width: '130px',
                                                maxHeight: '130px',
                                                maxWidth: '130px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                backgroundImage: `url("${
                                                    thisEvent.artist &&
                                                    thisEvent.artist.squareImg
                                                }")`,
                                                backgroundPosition: '50% 25%',
                                                backgroundSize: 'cover',
                                                padding: '4px',
                                                backgroundClip: 'content-box',
                                                border: confirmedMy(thisEvent)
                                                    ? '1px solid var(--link-color)'
                                                    : '1px solid var(--primary-color)',
                                                margin: '0 8px 0 0',
                                            }}
                                        ></Box>
                                    </Tooltip>
                                </Grid>
                            </Link>
                        )}

                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        className="dateLocationForBooking"
                        xs={
                            thisEvent.artist && thisEvent.artist.squareImg
                                ? 8
                                : 11
                        }
                    >
                        <Grid item container>
                            <Link
                                to={
                                    '/artists/' +
                                    (thisEvent.artist && thisEvent.artist.slug)
                                }
                            >
                                <Typography component="h2">
                                    {thisEvent.artist &&
                                        thisEvent.artist.stageName}
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid
                            item
                            sx={
                                {
                                    // width:
                                    //     thisEvent.artist &&
                                    //     thisEvent.artist.squareImg
                                    //         ? 'auto'
                                    //         : '55px',
                                }
                            }
                        >
                            <StackDateforDisplay
                                date={thisEvent.bookingWhen}
                            ></StackDateforDisplay>
                        </Grid>
                        <Grid
                            item
                            xs={
                                thisEvent.artist && thisEvent.artist.squareImg
                                    ? 8
                                    : 9
                            }
                            sx={{
                                marginLeft: '8px',
                            }}
                        >
                            <Grid
                                item
                                sx={{
                                    fontSize: '1.5em',
                                    // marginLeft: '8px',
                                    lineHeight: '1.5',
                                }}
                            >
                                {thisEvent.bookingWhere.city +
                                    ', ' +
                                    thisEvent.bookingWhere.state}
                            </Grid>
                            {thisEvent.createdBy === 'HOST' && (
                                <Grid item container>
                                    <EditHostEvent
                                        theEvent={thisEvent}
                                    ></EditHostEvent>
                                </Grid>
                            )}
                            {thisEvent.createdBy === 'ARTIST' && (
                                <Grid item container>
                                    <EventHostDialog
                                        theHost={host.me}
                                        theEvent={thisEvent}
                                        //theOffer={hostOffer}
                                    >
                                        <Button>CONCERT DETAILS</Button>
                                    </EventHostDialog>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                    {confirmedMy(thisEvent) ? (
                        <Grid item alignContent="center" container xs={0.5}>
                            <Tooltip
                                title={
                                    thisEvent.artist.stageName +
                                    ' accepted your offer.'
                                }
                                placement="bottom"
                                arrow
                            >
                                <ThumbUpAltTwoToneIcon
                                    sx={{
                                        color: 'var(--link-color)',
                                    }}
                                ></ThumbUpAltTwoToneIcon>
                            </Tooltip>
                        </Grid>
                    ) : (
                        thisEvent.createdBy !== 'HOST' && //if this event is not created by a host
                        thisEvent.confirmedHost && //and if the event has a confirmedHost
                        !confirmedMy(thisEvent) && ( //and it's not me
                            <Grid item alignContent="center" container xs={0.5}>
                                <Tooltip
                                    title={
                                        (thisEvent.artist &&
                                            thisEvent.artist.stageName) +
                                        ' accepted a different host’s offer.'
                                    }
                                    placement="bottom"
                                    arrow
                                >
                                    <ThumbDownAltTwoToneIcon
                                        sx={{
                                            color: 'var(--primary-color)',
                                        }}
                                    ></ThumbDownAltTwoToneIcon>
                                </Tooltip>
                            </Grid>
                        )
                    )}
                    {/* <Grid item xs={9} sx={{ margin: '8px 0 0' }}>
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
                        {
                            
                        }
                    </Grid>*/}
                </Grid>
                {thisEvent.status !== 'CONFIRMED' && !thisEvent.artist && (
                    <Grid item className="deleteBtn" xs={1}>
                        <IconButton
                            onClick={(e) => deleteHostEvent(thisEvent._id)}
                        >
                            <DeleteIcon></DeleteIcon>
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

HostDashboardEventCard.propTypes = {
    thisEvent: PropTypes.object.isRequired,
    artistViewedHostOffer: PropTypes.func.isRequired,
    deleteHostEvent: PropTypes.func.isRequired,
    eventEditDrawer: PropTypes.string,
    host: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    eventEditDrawer: state.app.eventEditDrawer,
    host: state.host,
});

//export default HostDashboardEventCard;
export default connect(mapStateToProps, {
    artistViewedHostOffer,
    deleteHostEvent,
})(withRouter(HostDashboardEventCard)); //withRouter allows us to pass history objects
