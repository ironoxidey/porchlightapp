import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../layout/SvgButton';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import HostEventForm from './HostEventForm';
import { Grid, Box } from '@mui/material';

import {
    StackDateforDisplay,
    jumpTo,
    closeEventEditDrawer,
} from '../../actions/app';

const EditHostEvent = ({
    theEvent,
    jumpTo,
    closeEventEditDrawer,
    myHostEvents, //for determining the most recently updated event and passing it to the closeEventEditDrawer()
}) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const iOS =
        typeof navigator !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);

    let mostRecentlyUpdatedEvent = '';

    useEffect(() => {
        if (Array.isArray(myHostEvents) && myHostEvents.length > 0) {
            mostRecentlyUpdatedEvent = myHostEvents.reduce((a, b) =>
                a.updatedAt > b.updatedAt ? a : b
            )._id;
            //console.log('mostRecentlyUpdatedEvent', mostRecentlyUpdatedEvent);
        }
    }, [myHostEvents]);
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
                {/* <Box sx={{ top: 0, left: 0, position: 'absolute' }}>
                    <Grid container>
                        <StackDateforDisplay
                            date={theEvent.bookingWhen}
                        ></StackDateforDisplay>
                        <Grid
                            item
                            sx={{
                                fontSize: '1.5em',
                                marginLeft: '8px',
                                lineHeight: '1.5',
                                marginTop: '8px',
                            }}
                        >
                            {theEvent.bookingWhere.city +
                                ', ' +
                                theEvent.bookingWhere.state}
                        </Grid>
                    </Grid>
                </Box> */}

                <Grid
                    item
                    sx={{
                        minHeight: '85vh',
                    }}
                >
                    {drawerOpen && ( //so that the ArtistEventForm doesn't setSelectedDates a bajillion times until it's necessary
                        <HostEventForm
                            theEvent={theEvent}
                            setDrawerOpen={setDrawerOpen}
                        ></HostEventForm>
                    )}
                </Grid>
            </SwipeableDrawer>

            <Button
                btnwidth="250"
                onClick={() => {
                    jumpTo('endSlide');
                    setDrawerOpen(true);
                }}
            >
                Edit Concert Details
            </Button>
        </>
    );
};

EditHostEvent.propTypes = {
    theEvent: PropTypes.object,
    jumpTo: PropTypes.func,
    closeEventEditDrawer: PropTypes.func,
    myHostEvents: PropTypes.array,
};

const mapStateToProps = (state) => ({
    myHostEvents: state.event.myHostEvents,
});

//export default EditHostEvent;
export default connect(mapStateToProps, { jumpTo, closeEventEditDrawer })(
    // withRouter(EditHostEvent)
    EditHostEvent
); //withRouter allows us to pass history objects
