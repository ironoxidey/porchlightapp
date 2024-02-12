import React, { Fragment, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

// import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    Grid,
    Typography,
    Box,
    Avatar,
    Tooltip,
    IconButton,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';

import { StackDateforDisplay } from '../../actions/app';
import { artistViewedHostOffer, deleteArtistEvent } from '../../actions/event';

import EventDetails from '../events/EventDetails';

import Button from '../layout/SvgButton';
// import HostProfile from '../hosts/HostProfile';
// import { relativeTimeRounding } from 'moment';
import ArtistDashboardBookingOffers from './ArtistDashboardBookingOffers';

import DeleteIcon from '@mui/icons-material/Delete';
import EditArtistEvent from './EditArtistEvent';
import ArtistReviewsHost from '../artists/ArtistReviewsHost';

const ArtistDashboardEventCard = ({
    thisEvent,
    artistViewedHostOffer,
    deleteArtistEvent,
    eventEditDrawer,
    artistMe,
}) => {
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

    const [iDeclined, setiDeclined] = useState(false);

    useEffect(() => {
        if (
            thisEvent.declinedArtists &&
            thisEvent.declinedArtists.length > -1
        ) {
            setiDeclined(
                thisEvent.declinedArtists.filter((declinedArtist) => {
                    // console.log(
                    //     'declinedArtist.artist | prefArtist._id',
                    //     declinedArtist.artist +
                    //         ' | ' +
                    //         prefArtist._id
                    // );
                    return declinedArtist.artist === artistMe._id;
                }).length > 0
            );
            // console.log('declined', declined);
        }
    }, [thisEvent.declinedArtists]);

    const [hostsDeclined, setHostsDeclined] = useState(0);

    useEffect(() => {
        if (thisEvent.hostsInReach && thisEvent.hostsInReach.length > 0) {
            setHostsDeclined(
                thisEvent.hostsInReach.filter((hostInReach) => {
                    if (hostInReach.declined) {
                        return 1;
                    } else return 0;
                }).length
            );
        }
    }, [thisEvent.hostsInReach]);

    return (
        <>
            <Tooltip
                arrow={true}
                followCursor={true}
                title={
                    iDeclined ? (
                        <div
                            style={{
                                fontFamily: 'var(--secondary-font)',
                                color: '#fff',
                                textAlign: 'center',
                            }}
                        >
                            You declined this offer.
                        </div>
                    ) : (
                        ''
                    )
                }
            >
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
                        // justifyContent: 'space-between',
                        justifyContent: 'flex-start',
                        flexWrap: 'nowrap',
                        opacity: iDeclined ? '0.6' : '1',
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
                        filter: iDeclined ? 'grayscale(100%)' : '',
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
                        className="dateLocationForBookingWrapper"
                        // sx={{ flexWrap: 'nowrap' }}
                        xs={12}
                    >
                        {thisEvent.createdBy === 'HOST' &&
                            thisEvent.offersFromHosts &&
                            thisEvent.offersFromHosts.length > 0 &&
                            thisEvent.offersFromHosts[0] &&
                            thisEvent.offersFromHosts[0].host &&
                            thisEvent.offersFromHosts[0].host.profileImg && (
                                <Grid
                                    className="feoyAvatarGridItem"
                                    item
                                    sx={{
                                        // width: '100%',
                                        flexBasis: { xs: '80px', sm: '130px' },
                                        flexShrink: '3',
                                        flexGrow: '2',
                                    }}
                                >
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
                                            backgroundImage: `url("${thisEvent.offersFromHosts[0].host.profileImg}")`,
                                            backgroundPosition: '50% 25%',
                                            backgroundSize: 'cover',
                                            padding: '4px',
                                            backgroundClip: 'content-box',
                                            border: '1px solid var(--primary-color)',
                                            margin: '0 8px 0 0',
                                            aspectRatio: '1 / 1',
                                        }}
                                    ></Box>
                                </Grid>
                            )}

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
                            // xs={8}
                            // sm={8}
                        >
                            {thisEvent.createdBy === 'HOST' &&
                                thisEvent.offersFromHosts &&
                                thisEvent.offersFromHosts.length > 0 &&
                                thisEvent.offersFromHosts[0] &&
                                thisEvent.offersFromHosts[0].host &&
                                thisEvent.offersFromHosts[0].host
                                    .profileImg && (
                                    <Grid item container className="hostName">
                                        <Typography component="h2">
                                            {
                                                thisEvent.offersFromHosts[0]
                                                    .host.firstName
                                            }{' '}
                                            {
                                                thisEvent.offersFromHosts[0]
                                                    .host.lastName
                                            }{' '}
                                        </Typography>
                                    </Grid>
                                )}
                            <Grid
                                container
                                item
                                direction="row"
                                alignItems="center"
                                className="feoyDateLocation"
                                sx={{
                                    flexWrap: 'nowrap',
                                }}
                                // xs={8}
                                // sm={8}
                            >
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
                                <Grid
                                    item
                                    xs={9}
                                    sx={{
                                        marginLeft: '8px',
                                    }}
                                >
                                    <Grid
                                        container
                                        sx={{ flexDirection: 'row' }}
                                    >
                                        <Grid
                                            item
                                            className="cityST"
                                            sx={{
                                                fontSize: {
                                                    xs: '1.2em',
                                                    sm: '1.5em',
                                                },
                                                // marginLeft: '8px',
                                                lineHeight: '1.5',
                                            }}
                                        >
                                            {thisEvent.bookingWhere.city +
                                                ', ' +
                                                thisEvent.bookingWhere.state}
                                        </Grid>
                                        {thisEvent.status === 'PENDING' &&
                                            thisEvent.createdBy === 'ARTIST' &&
                                            thisEvent.hostsInReach &&
                                            thisEvent.hostsInReach.length >
                                                0 && (
                                                <>
                                                    {thisEvent.hostsInReach
                                                        .length === 1 ? (
                                                        <Grid
                                                            item
                                                            className="hostsDeclined"
                                                            sx={{
                                                                fontSize: {
                                                                    xs: '.8em',
                                                                },
                                                                margin: '6px 8px 0 8px',
                                                                color: 'var(--primary-color)',
                                                            }}
                                                        >
                                                            (
                                                            {hostsDeclined === 1
                                                                ? 'The only host in the area declined'
                                                                : 'The host in the area hasn’t declined, yet'}
                                                            )
                                                        </Grid>
                                                    ) : thisEvent.hostsInReach
                                                          .length ===
                                                      hostsDeclined ? (
                                                        <Grid
                                                            item
                                                            className="hostsDeclined"
                                                            sx={{
                                                                fontSize: {
                                                                    xs: '.8em',
                                                                },
                                                                margin: '6px 8px 0 8px',
                                                                color: 'var(--primary-color)',
                                                            }}
                                                        >
                                                            (Each of the{' '}
                                                            {
                                                                thisEvent
                                                                    .hostsInReach
                                                                    .length
                                                            }{' '}
                                                            hosts in the area
                                                            declined)
                                                        </Grid>
                                                    ) : (
                                                        <Grid
                                                            item
                                                            className="hostsDeclined"
                                                            sx={{
                                                                fontSize: {
                                                                    xs: '.8em',
                                                                },
                                                                margin: '6px 8px 0 8px',
                                                                color: 'var(--primary-color)',
                                                            }}
                                                        >
                                                            ({hostsDeclined} of{' '}
                                                            {
                                                                thisEvent
                                                                    .hostsInReach
                                                                    .length
                                                            }{' '}
                                                            hosts in the area
                                                            declined, so far)
                                                        </Grid>
                                                    )}
                                                </>
                                            )}
                                    </Grid>

                                    {thisEvent.createdBy === 'ARTIST' &&
                                    thisEvent.offersFromHosts &&
                                    thisEvent.offersFromHosts.length > 0 ? (
                                        <Grid
                                            item
                                            container
                                            className="artistOffersFromHosts"
                                        >
                                            {thisEvent.offersFromHosts
                                                .filter((e) => e) //.filter(e => e) to remove any null values
                                                .map((thisOffer, idx) => (
                                                    <ArtistDashboardBookingOffers
                                                        thisOffer={thisOffer}
                                                        thisEvent={thisEvent}
                                                    ></ArtistDashboardBookingOffers>
                                                ))}
                                        </Grid>
                                    ) : thisEvent.createdBy === 'ARTIST' ? (
                                        <Grid
                                            item
                                            container
                                            className="artistOffersFromHosts"
                                        >
                                            <EditArtistEvent
                                                theEvent={thisEvent}
                                            ></EditArtistEvent>
                                        </Grid>
                                    ) : thisEvent.createdBy === 'HOST' &&
                                      thisEvent.confirmedHost ? (
                                        <Grid
                                            item
                                            container
                                            className="artistOffersFromHosts"
                                        >
                                            {thisEvent.offersFromHosts
                                                .filter((e) => e) //.filter(e => e) to remove any null values
                                                .map((thisOffer, idx) => (
                                                    <ArtistDashboardBookingOffers
                                                        thisOffer={thisOffer}
                                                        thisEvent={thisEvent}
                                                    ></ArtistDashboardBookingOffers>
                                                ))}
                                        </Grid>
                                    ) : (
                                        <></>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {thisEvent.createdBy === 'ARTIST' &&
                        thisEvent.status !== 'CONFIRMED' && (
                            <Grid item className="deleteBtn" xs={1}>
                                <IconButton
                                    onClick={(e) =>
                                        deleteArtistEvent(thisEvent._id)
                                    }
                                    size="large"
                                >
                                    <DeleteIcon></DeleteIcon>
                                </IconButton>
                            </Grid>
                        )}
                    {thisEvent.status === 'CONFIRMED' &&
                        new Date(thisEvent.bookingWhen) < new Date() && ( //bookingWhen is older than today
                            <ArtistReviewsHost
                                theEvent={thisEvent}
                            ></ArtistReviewsHost>
                        )}
                </Grid>
            </Tooltip>
        </>
    );
};

ArtistDashboardEventCard.propTypes = {
    thisEvent: PropTypes.object.isRequired,
    artistViewedHostOffer: PropTypes.func.isRequired,
    deleteArtistEvent: PropTypes.func.isRequired,
    eventEditDrawer: PropTypes.string,
    artistMe: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    eventEditDrawer: state.app.eventEditDrawer,
    artistMe: state.artist.me, //currently just for the sake of checking the id against the declinedArtists' ids
});

//export default ArtistDashboardEventCard;
export default connect(mapStateToProps, {
    artistViewedHostOffer,
    deleteArtistEvent,
    // })(withRouter(ArtistDashboardEventCard)); //withRouter allows us to pass history objects
})(ArtistDashboardEventCard); //withRouter allows us to pass history objects
