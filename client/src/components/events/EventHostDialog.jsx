import React, { useState, useEffect } from 'react';
import { Avatar, Box, Tooltip } from '@mui/material';

import { StackDateforDisplay } from '../../actions/app';

import HostProfile from '../hosts/HostProfile';

import PlaceTwoToneIcon from '@mui/icons-material/PlaceTwoTone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
            {props.theHost && eventDialogDetails && eventDialogDetails.host && (
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
                                    date={props.theEvent.bookingWhen}
                                ></StackDateforDisplay>
                            </Box>
                            <HostProfile
                                theHost={props.theHost}
                                theEvent={props.theEvent}
                                theOffer={props.theOffer}
                                eventDetailsDialogHandleClose={
                                    eventDetailsDialogHandleClose
                                }
                            ></HostProfile>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            )}
            <Box
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                    handleEventBtnClick(props.theOffer);
                }}
            >
                {props.children}
            </Box>
        </>
    );
};

export default EventHostDialog;