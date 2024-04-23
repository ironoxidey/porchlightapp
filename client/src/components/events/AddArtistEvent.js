import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../layout/SvgButton';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ArtistEventForm from './ArtistEventForm';
import { Grid, Tooltip } from '@mui/material';

import {
    StackDateforDisplay,
    jumpTo,
    closeEventEditDrawer,
} from '../../actions/app';
// import GoogleMap from '../layout/GoogleMap';

const AddArtistEvent = ({
    jumpTo,
    myArtistEvents, //for determining the most recently updated event and passing it to the closeEventEditDrawer()
    closeEventEditDrawer,
    iConfirmed,
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const iOS =
        typeof navigator !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);

    let mostRecentlyUpdatedEvent = '';

    useEffect(() => {
        if (Array.isArray(myArtistEvents) && myArtistEvents.length > 0) {
            mostRecentlyUpdatedEvent = myArtistEvents.reduce((a, b) =>
                a.updatedAt > b.updatedAt ? a : b
            )._id;
            // console.log('mostRecentlyUpdatedEvent', mostRecentlyUpdatedEvent);
        }
    }, [myArtistEvents]);

    //Disable Propose Button until Artist reviews all past shows — same logic as setShowPastEvents from PastArtistEvents.js

    const [showPastEvents, setShowPastEvents] = useState(false);
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

    useEffect(() => {
        console.log('myArtistEvents updated');
        if (myArtistEvents && myArtistEvents.length > 0) {
            // const unReviewedEvents = myArtistEvents.forEach((myArtistEvent) => {
            if (
                myArtistEvents.filter(
                    (myEvent) =>
                        myEvent.confirmedHost &&
                        myEvent.status === 'CONFIRMED' &&
                        iConfirmed(myEvent) &&
                        new Date(myEvent.bookingWhen) < dayBeforeYesterday &&
                        (!myEvent.artistReviewOfHost ||
                            !myEvent.artistReviewOfHost._id)
                ).length > 0
            ) {
                setShowPastEvents(true);
            } else {
                setShowPastEvents(false);
            }
            // });
        }
    }, [myArtistEvents]);

    return (
        <>
            <SwipeableDrawer
                anchor={'bottom'}
                open={drawerOpen}
                onClose={() => {
                    closeEventEditDrawer(mostRecentlyUpdatedEvent);
                    jumpTo('');
                    setDrawerOpen(false);
                }}
                onOpen={() => setDrawerOpen(true)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
                className="porchlightBG"
            >
                <Grid item sx={{ minHeight: '85vh' }}>
                    {drawerOpen && ( //so that the ArtistEventForm doesn't setSelectedDates a bajillion times until it's necessary
                        <ArtistEventForm></ArtistEventForm>
                    )}
                </Grid>
            </SwipeableDrawer>

            <Tooltip
                arrow={true}
                disableHoverListener={!showPastEvents}
                disableFocusListener={!showPastEvents}
                disableTouchListener={!showPastEvents}
                title="Please review all your past experiences first."
            >
                <span>
                    <Button
                        disabled={showPastEvents} //same condition that defaults Hide Past Events
                        btnwidth="250"
                        onClick={() => setDrawerOpen(true)}
                    >
                        Propose a New Concert
                    </Button>
                </span>
            </Tooltip>
        </>
    );
};

AddArtistEvent.propTypes = {
    jumpTo: PropTypes.func,
    closeEventEditDrawer: PropTypes.func,
    myArtistEvents: PropTypes.array,
};

const mapStateToProps = (state) => ({
    myArtistEvents: state.event.myArtistEvents,
});

//export default AddArtistEvent;
export default connect(mapStateToProps, { jumpTo, closeEventEditDrawer })(
    // withRouter(AddArtistEvent)
    AddArtistEvent
); //withRouter allows us to pass history objects
