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
                                }}
                            >
                                <StackDateforDisplay
                                    date={props.theEvent.bookingWhen}
                                ></StackDateforDisplay>
                            </Box>

                            {props.theEvent.preferredArtists &&
                                props.theEvent.preferredArtists.length > 0 && (
                                    <Box sx={{ marginTop: '16px' }}>
                                        <Typography variant="h2">
                                            Your proposal to host this show is
                                            now visible on the private profile
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
                                                alignItems: 'center',
                                                margin: '8px 4px',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            {props.theEvent.preferredArtists.map(
                                                (prefArtist) => {
                                                    return (
                                                        <>
                                                            <Grid
                                                                item
                                                                sx={{
                                                                    textAlign:
                                                                        'center',
                                                                    margin: '8px 8px',
                                                                    padding:
                                                                        '8px',
                                                                    background:
                                                                        'rgba(0 0 0 / .2)',
                                                                }}
                                                            >
                                                                <Avatar
                                                                    src={
                                                                        prefArtist.squareImg
                                                                    }
                                                                    sx={{
                                                                        margin: '0 auto 4px',
                                                                        width: '50px',
                                                                        height: '50px',
                                                                    }}
                                                                />
                                                                <Typography variant="span">
                                                                    {
                                                                        prefArtist.stageName
                                                                    }
                                                                </Typography>
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
