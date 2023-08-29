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

import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
                    backgroundImage:
                        thisEvent.status === 'DRAFT'
                            ? 'repeating-linear-gradient(45deg,     rgba(255,255,255,0.03) 5px,    rgba(255,255,255,.03) 15px,    transparent 15px,    transparent 30px)'
                            : 'none',
                    border:
                        thisEvent.status === 'DRAFT'
                            ? '4px dashed var(--primary-color)'
                            : '1px solid transparent',
                    opacity: thisEvent.status === 'DRAFT' ? '0.7' : '1',
                }}
            >
                <svg
                    width={eventCardWidth}
                    height={eventCardHeight}
                    className={
                        thisEvent.status === 'DRAFT'
                            ? 'eventCardSvgBorder eventDraft'
                            : 'eventCardSvgBorder'
                    }
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
                    xs={12}
                >
                    {thisEvent.artist &&
                        thisEvent.artist.squareImg &&
                        thisEvent.artist.slug && (
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
                                <Link
                                    to={'/artists/' + thisEvent.artist.slug}
                                    className={
                                        `feoyartist` +
                                        thisEvent.artist._id +
                                        thisEvent._id
                                    }
                                >
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
                                                height: 'auto',
                                                width: 'auto',
                                                // maxHeight: { xs: '100px', sm: '130px' },
                                                maxHeight: '130px',
                                                // maxWidth: { xs: '100px', sm: '130px' },
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
                                                aspectRatio: '1 / 1',
                                            }}
                                        ></Box>
                                    </Tooltip>
                                </Link>
                            </Grid>
                        )}

                    {thisEvent.preferredArtists &&
                        thisEvent.preferredArtists.length > 0 && (
                            <Grid
                                item
                                sx={{
                                    width: '130px',
                                    height: '130px',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    flexDirection: 'row',
                                    margin: '0 8px 0 0',
                                    justifyContent: 'space-around',
                                    // alignItems: 'space-between',
                                    alignContent: 'space-evenly',
                                }}
                                className="preferredArtistsWrapper"
                            >
                                {thisEvent.preferredArtists.map(
                                    (prefArtist) => {
                                        let avatarSize =
                                            130 /
                                                thisEvent.preferredArtists
                                                    .length -
                                            4 *
                                                (thisEvent.preferredArtists
                                                    .length -
                                                    1);

                                        let confirmed = false;

                                        if (
                                            thisEvent.confirmedArtist &&
                                            thisEvent.confirmedArtist ===
                                                prefArtist._id
                                        ) {
                                            confirmed = true;
                                        }

                                        if (
                                            thisEvent.preferredArtists.length >
                                            2
                                        ) {
                                            // Find the square root of the input number
                                            const squareRoot = Math.sqrt(
                                                thisEvent.preferredArtists
                                                    .length
                                            );

                                            // Round up the square root to the nearest integer
                                            const roundedSquareRoot =
                                                Math.ceil(squareRoot);

                                            // Calculate the square of the rounded square root
                                            const roundedSquare =
                                                roundedSquareRoot *
                                                roundedSquareRoot;

                                            avatarSize =
                                                130 / roundedSquareRoot -
                                                4 * (roundedSquareRoot - 1);
                                        }

                                        return (
                                            <Fragment
                                                key={
                                                    `preffedArtistFragment` +
                                                    prefArtist._id +
                                                    thisEvent._id
                                                }
                                            >
                                                <Grid
                                                    item
                                                    sx={{
                                                        // width: '100%',
                                                        flexBasis: {
                                                            xs: '80px',
                                                            sm: '130px',
                                                        },
                                                        flexShrink: '3',
                                                        flexGrow: '2',
                                                    }}
                                                >
                                                    <Box
                                                        className="squareImgInACircle"
                                                        sx={{
                                                            display: 'flex',

                                                            width:
                                                                avatarSize +
                                                                'px',
                                                            height:
                                                                avatarSize +
                                                                'px',
                                                            maxHeight:
                                                                avatarSize +
                                                                'px',
                                                            maxWidth:
                                                                avatarSize +
                                                                'px',
                                                            borderRadius: '50%',
                                                            overflow: 'hidden',
                                                            backgroundImage: `url("${prefArtist.squareImg}")`,
                                                            backgroundBlendMode:
                                                                confirmed
                                                                    ? 'normal'
                                                                    : 'soft-light',
                                                            backgroundColor:
                                                                'rgba(0,0,0,0.5)',
                                                            backgroundPosition:
                                                                '50% 25%',
                                                            backgroundSize:
                                                                'cover',
                                                            padding: '4px',
                                                            backgroundClip:
                                                                'content-box',
                                                            border: confirmed
                                                                ? '1px solid var(--link-color)'
                                                                : '1px dashed var(--primary-color)',
                                                            // margin: '0 8px 0 0',
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center',
                                                            aspectRatio:
                                                                '1 / 1',
                                                        }}
                                                    >
                                                        {!confirmed && (
                                                            <Typography
                                                                sx={{
                                                                    fontFamily:
                                                                        'Tahoma',
                                                                    margin: 'auto',
                                                                    fontSize:
                                                                        avatarSize *
                                                                            0.8 +
                                                                        'px',
                                                                    opacity:
                                                                        '.2',
                                                                    lineHeight:
                                                                        '1',
                                                                    textShadow:
                                                                        '0 0 5px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1), 0 0 5px rgba(0,0,0,1);',
                                                                }}
                                                            >
                                                                ?
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Fragment>
                                        );
                                    }
                                )}
                            </Grid>
                        )}

                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        className="dateLocationForBooking"
                        sx={{
                            flexBasis: thisEvent.confirmedHost
                                ? `calc(100% - 150px - 25px)`
                                : `calc(100% - 150px)`,
                            flexGrow: '1',
                        }}
                        // xs={
                        //     thisEvent.artist && thisEvent.artist.squareImg
                        //         ? 8
                        //         : 12
                        // }
                        // sm={
                        //     thisEvent.artist && thisEvent.artist.squareImg
                        //         ? 8
                        //         : 8
                        // }
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
                            container
                            item
                            className="feoyDateLocation"
                            sx={{
                                flexWrap: 'nowrap',
                            }}
                        >
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
                                    thisEvent.artist &&
                                    thisEvent.artist.squareImg
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
                                        fontSize: { xs: '1.2em', sm: '1.5em' },
                                        // marginLeft: '8px',
                                        lineHeight: '1.5',
                                    }}
                                    xs={12}
                                >
                                    {thisEvent.bookingWhere.city +
                                        ', ' +
                                        thisEvent.bookingWhere.state}
                                </Grid>
                                {thisEvent.createdBy === 'HOST' &&
                                    thisEvent.status === 'DRAFT' && (
                                        <Grid item container>
                                            <EditHostEvent
                                                theEvent={thisEvent}
                                            ></EditHostEvent>
                                        </Grid>
                                    )}
                                {thisEvent.createdBy === 'HOST' &&
                                    thisEvent.status != 'DRAFT' && (
                                        <Grid item container>
                                            <EventHostDialog
                                                theHost={host.me}
                                                theEvent={thisEvent}
                                                theOffer={
                                                    thisEvent.offersFromHosts[0]
                                                }
                                            >
                                                <Button btnwidth="200">
                                                    CONCERT DETAILS
                                                </Button>
                                            </EventHostDialog>
                                        </Grid>
                                    )}
                                {thisEvent.createdBy === 'ARTIST' && (
                                    <Grid item container>
                                        <EventHostDialog
                                            theHost={host.me}
                                            theEvent={thisEvent}
                                            //theOffer={hostOffer}
                                        >
                                            <Button btnwidth="200">
                                                CONCERT DETAILS
                                            </Button>
                                        </EventHostDialog>
                                    </Grid>
                                )}
                            </Grid>
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
                            <Grid
                                item
                                alignContent="center"
                                container
                                sx={{
                                    flexBasis: '25px',
                                    flexGrow: '0',
                                    marginLeft: '8px',
                                }}
                                style={{ zIndex: '5' }}
                            >
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
                {thisEvent.status === 'DRAFT' && !thisEvent.artist && (
                    <Grid
                        container
                        item
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                        xs={1}
                    >
                        <Grid
                            item
                            className="deleteBtn"
                            // xs={1}
                            style={{
                                // alignSelf: 'flex-start',
                                justifyContent: 'center',
                            }}
                        >
                            <IconButton
                                onClick={(e) => deleteHostEvent(thisEvent._id)}
                            >
                                <DeleteIcon></DeleteIcon>
                            </IconButton>
                        </Grid>
                        <Grid
                            item
                            className="warningIcon"
                            // xs={1}
                            style={{
                                color: 'var(--primary-color)',
                                // alignSelf: 'flex-end',
                                justifyContent: 'center',
                                zIndex: '5',
                            }}
                        >
                            <Tooltip
                                arrow={true}
                                placement="bottom"
                                title={
                                    <>
                                        <div
                                            style={{
                                                textAlign: 'center',
                                            }}
                                        >{`This offer is still a DRAFT and has not been sent to ${
                                            thisEvent.preferredArtists.length >
                                            1
                                                ? 'the artists'
                                                : thisEvent
                                                      .preferredArtists[0] &&
                                                  thisEvent.preferredArtists[0]
                                                      .stageName
                                                ? thisEvent.preferredArtists[0]
                                                      .stageName
                                                : 'the artist'
                                        }, yet.`}</div>
                                    </>
                                }
                            >
                                <WarningAmberIcon></WarningAmberIcon>
                            </Tooltip>
                        </Grid>
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
