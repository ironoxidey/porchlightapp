import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../layout/SvgButton';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import HostEventForm from './HostEventForm';
import { Grid } from '@mui/material';

import {
    StackDateforDisplay,
    jumpTo,
    closeEventEditDrawer,
} from '../../actions/app';

const AddHostEvent = ({
    jumpTo,
    myHostEvents, //for determining the most recently updated event and passing it to the closeEventEditDrawer() -- carryover from AddArtistEvent
    closeEventEditDrawer,
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
            // console.log('mostRecentlyUpdatedEvent', mostRecentlyUpdatedEvent);
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
            >
                <Grid item sx={{ minHeight: '85vh' }}>
                    {drawerOpen && ( //so that the ArtistEventForm doesn't setSelectedDates a bajillion times until it's necessary
                        <HostEventForm></HostEventForm>
                    )}
                </Grid>
            </SwipeableDrawer>

            <Button
                btnwidth="250"
                onClick={() => setDrawerOpen(true)}
                style={{ margin: '8px auto' }}
            >
                Propose a New Concert
            </Button>
        </>
    );
};

AddHostEvent.propTypes = {
    jumpTo: PropTypes.func,
    closeEventEditDrawer: PropTypes.func,
    myHostEvents: PropTypes.array,
};

const mapStateToProps = (state) => ({
    myHostEvents: state.event.myHostEvents,
});

//export default AddHostEvent;
export default connect(mapStateToProps, { jumpTo, closeEventEditDrawer })(
    withRouter(AddHostEvent)
); //withRouter allows us to pass history objects
