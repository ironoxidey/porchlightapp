import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from '../layout/SvgButton';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ArtistEventForm from './ArtistEventForm';
import { Grid } from '@mui/material';

import {
    StackDateforDisplay,
    jumpTo,
    closeEventEditDrawer,
} from '../../actions/app';

const AddArtistEvent = ({
    jumpTo,
    myArtistEvents, //for determining the most recently updated event and passing it to the closeEventEditDrawer()
    closeEventEditDrawer,
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
            console.log('mostRecentlyUpdatedEvent', mostRecentlyUpdatedEvent);
        }
    }, [myArtistEvents]);
    return (
        <>
            <SwipeableDrawer
                anchor={'bottom'}
                open={drawerOpen}
                onClose={() => {
                    jumpTo('');
                    closeEventEditDrawer(mostRecentlyUpdatedEvent);
                    setDrawerOpen(false);
                }}
                onOpen={() => setDrawerOpen(true)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
            >
                <Grid item sx={{ minHeight: '85vh' }}>
                    <ArtistEventForm></ArtistEventForm>
                </Grid>
            </SwipeableDrawer>

            <Button btnwidth="250" onClick={() => setDrawerOpen(true)}>
                Propose a New Concert
            </Button>
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
    withRouter(AddArtistEvent)
); //withRouter allows us to pass history objects
