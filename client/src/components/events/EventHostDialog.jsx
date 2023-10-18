import React, { useState, useEffect } from 'react';
import { Avatar, Box, Tooltip, Grid, Typography } from '@mui/material';

import { StackDateforDisplay } from '../../actions/app';

import HostProfile from '../hosts/HostProfile';
import { ProfileAvatar } from '../../common/components';

import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import EventDetails from './EventDetails';
import ArtistTop from '../artists/ArtistTop';

const EventHostDialog = (props) => {
    //console.log('EventHostDialog props', props);
    //Booking Details Dialog Functions
    const [eventDetailsDialogOpen, setEventDetailsDialogOpen] = useState(false);

    const eventDetailsDialogHandleClose = () => {
        setDialogDetailsState({});
        setEventDetailsDialogOpen(false);
    };

    const [eventDialogDetails, setDialogDetailsState] = useState({});

    useEffect(() => {
        //console.log('eventDialogDetails', eventDialogDetails);
        //console.log('EventHostDialog should open');
        // console.log('props', props);
        setEventDetailsDialogOpen(true);
    }, [eventDialogDetails]);

    const handleEventBtnClick = (theOffer) => {
        //console.log('theOffer', theOffer);
        setDialogDetailsState(theOffer);
    };

    return (
        <>
            {props.theHost &&
                eventDialogDetails &&
                (eventDialogDetails.host || eventDialogDetails.artist) && (
                    <Dialog
                        open={eventDetailsDialogOpen}
                        onClose={eventDetailsDialogHandleClose}
                        // aria-labelledby="alert-dialog-title"
                        // aria-describedby="alert-dialog-description"
                        scroll="body"
                        fullWidth
                        maxWidth="md"
                        className="porchlightBG"
                    >
                        <DialogContent>
                            {/* <DialogContentText id="alert-dialog-description"> */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(0 0 0 /.6)',
                                    padding: '0',
                                    zIndex: 100,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            >
                                <StackDateforDisplay
                                    date={props.theEvent.bookingWhen}
                                ></StackDateforDisplay>
                            </Box>

                            {props.theEvent.preferredArtists &&
                                props.theEvent.preferredArtists.length > 0 && (
                                    <Box sx={{ marginTop: '16px' }}>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                margin: {
                                                    xs: '0 8px 0 ',
                                                    sm: '0 50px',
                                                },
                                            }}
                                        >
                                            Your proposal to host this show on{' '}
                                            {new Date(
                                                props.theEvent.bookingWhen
                                            ).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                timeZone: 'UTC', //fixes timezone issues where users see the date a day off sometimes
                                            })}{' '}
                                            is now visible on the private
                                            dashboard
                                            {props.theEvent.preferredArtists
                                                .length > 1
                                                ? 's'
                                                : ''}{' '}
                                            of:
                                        </Typography>
                                        <Grid
                                            container
                                            sx={{
                                                justifyContent: 'center',
                                                alignItems: 'start',
                                                margin: '8px 4px',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {props.theEvent.preferredArtists.map(
                                                (prefArtist) => {
                                                    let confirmed = false;

                                                    if (
                                                        props.theEvent
                                                            .confirmedArtist &&
                                                        props.theEvent
                                                            .confirmedArtist ===
                                                            prefArtist._id
                                                    ) {
                                                        confirmed = true;
                                                    }
                                                    let declined = false;

                                                    if (
                                                        props.theEvent
                                                            .declinedArtists &&
                                                        props.theEvent
                                                            .declinedArtists
                                                            .length > -1
                                                    ) {
                                                        declined =
                                                            props.theEvent.declinedArtists.filter(
                                                                (
                                                                    declinedArtist
                                                                ) => {
                                                                    // console.log(
                                                                    //     'declinedArtist.artist | prefArtist._id',
                                                                    //     declinedArtist.artist +
                                                                    //         ' | ' +
                                                                    //         prefArtist._id
                                                                    // );
                                                                    return (
                                                                        declinedArtist.artist ===
                                                                        prefArtist._id
                                                                    );
                                                                }
                                                            ).length > 0;
                                                        // console.log('declined', declined);
                                                    }
                                                    return (
                                                        <>
                                                            <Grid
                                                                item
                                                                container
                                                                sx={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '8px 8px',
                                                                    padding:
                                                                        '8px',
                                                                    background:
                                                                        'rgba(0 0 0 / .2)',
                                                                    flexDirection:
                                                                        'column',
                                                                    maxWidth: {
                                                                        xs: '100px',
                                                                        sm: '120px',
                                                                        md: '180px',
                                                                    },
                                                                    filter: declined
                                                                        ? 'grayscale(100%)blur(.5px)'
                                                                        : '',
                                                                }}
                                                            >
                                                                <Grid
                                                                    item
                                                                    className="prefArtistAvatar"
                                                                >
                                                                    {/* <Avatar
                                                                        src={
                                                                            prefArtist.squareImg
                                                                        }
                                                                        sx={{
                                                                            margin: '0 auto 4px',
                                                                            width: '50px',
                                                                            height: '50px',
                                                                            border: confirmed
                                                                                ? '1px solid var(--link-color)'
                                                                                : declined
                                                                                ? '1px solid #777'
                                                                                : '1px dashed var(--primary-color)',
                                                                            padding:
                                                                                '4px',
                                                                        }}
                                                                    /> */}
                                                                    <Box
                                                                        className="squareImgInACircle"
                                                                        sx={{
                                                                            display:
                                                                                'flex',

                                                                            width: {
                                                                                xs: '70px',
                                                                                sm: '80px',
                                                                            },
                                                                            height: {
                                                                                xs: '70px',
                                                                                sm: '80px',
                                                                            },
                                                                            maxHeight:
                                                                                '80px',
                                                                            maxWidth:
                                                                                '80px',
                                                                            borderRadius:
                                                                                '50%',
                                                                            overflow:
                                                                                'hidden',
                                                                            backgroundImage: `url("${prefArtist.squareImg}")`,
                                                                            backgroundBlendMode:
                                                                                'normal',
                                                                            backgroundColor:
                                                                                'rgba(0,0,0,0.5)',
                                                                            backgroundPosition:
                                                                                '50% 25%',
                                                                            backgroundSize:
                                                                                'cover',
                                                                            padding:
                                                                                '4px',
                                                                            backgroundClip:
                                                                                'content-box',
                                                                            border: confirmed
                                                                                ? '1px solid var(--link-color)'
                                                                                : declined
                                                                                ? '1px solid #bbb'
                                                                                : '1px dashed var(--primary-color)',
                                                                            // margin: '0 8px 0 0',
                                                                            justifyContent:
                                                                                'center',
                                                                            alignItems:
                                                                                'center',
                                                                            aspectRatio:
                                                                                '1 / 1',
                                                                            margin: '0 auto 4px',
                                                                        }}
                                                                    ></Box>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    className="prefArtistStageName"
                                                                    sx={{
                                                                        margin: '0',
                                                                        lineHeight:
                                                                            '1.3',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="span"
                                                                        sx={{
                                                                            margin: '0',
                                                                            lineHeight:
                                                                                '.6',
                                                                        }}
                                                                    >
                                                                        {
                                                                            prefArtist.stageName
                                                                        }
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    className="prefArtistStatus"
                                                                    sx={{
                                                                        lineHeight:
                                                                            '1.2',
                                                                    }}
                                                                >
                                                                    <Typography
                                                                        variant="span"
                                                                        sx={{
                                                                            color: `${
                                                                                confirmed
                                                                                    ? 'var(--link-color)'
                                                                                    : declined
                                                                                    ? '#bbb'
                                                                                    : 'var(--primary-color)'
                                                                            }`,
                                                                            fontSize:
                                                                                '.7em',
                                                                            margin: '0',
                                                                            lineHeight:
                                                                                '1',
                                                                        }}
                                                                    >
                                                                        {confirmed
                                                                            ? '(Accepted)'
                                                                            : declined
                                                                            ? '(Declined)'
                                                                            : '(Hasn’t responded)'}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    );
                                                }
                                            )}
                                        </Grid>
                                        <Typography
                                            variant="h2"
                                            sx={{ marginBottom: '8px' }}
                                        >
                                            This is what it looks like:
                                        </Typography>
                                    </Box>
                                )}

                            {props.theOffer &&
                                props.theHost &&
                                props.theEvent && (
                                    <HostProfile
                                        theHost={props.theHost}
                                        theEvent={props.theEvent}
                                        theOffer={props.theOffer}
                                        eventDetailsDialogHandleClose={
                                            eventDetailsDialogHandleClose
                                        }
                                    ></HostProfile>
                                )}
                            {props.theEvent && props.theEvent.artist && (
                                <>
                                    <Box sx={{ marginTop: '16px' }}>
                                        <ArtistTop
                                            artist={props.theEvent.artist}
                                        ></ArtistTop>
                                    </Box>
                                    <Box sx={{ marginTop: '16px' }}>
                                        <EventDetails
                                            theEvent={props.theEvent}
                                        />
                                    </Box>
                                </>
                            )}
                            {/* </DialogContentText> */}
                        </DialogContent>
                    </Dialog>
                )}
            <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                    handleEventBtnClick(props.theOffer || props.theEvent);
                }}
            >
                {props.children}
            </Box>
        </>
    );
};

export default EventHostDialog;
