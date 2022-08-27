import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../layout/SvgButton';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ArtistEventForm from './ArtistEventForm';
import { Grid, Box } from '@mui/material';

import { StackDateforDisplay } from '../../actions/app';

const EditArtistEvent = ({ theEvent }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const iOS =
        typeof navigator !== 'undefined' &&
        /iPad|iPhone|iPod/.test(navigator.userAgent);
    return (
        <>
            <SwipeableDrawer
                anchor={'bottom'}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onOpen={() => setDrawerOpen(true)}
                disableBackdropTransition={!iOS}
                disableDiscovery={iOS}
            >
                <Box sx={{ top: 0, left: 0, position: 'absolute' }}>
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
                </Box>

                <Grid item sx={{ minHeight: '85vh' }}>
                    <ArtistEventForm theEvent={theEvent}></ArtistEventForm>
                </Grid>
            </SwipeableDrawer>

            <Button btnwidth="250" onClick={() => setDrawerOpen(true)}>
                Edit Concert Details
            </Button>
        </>
    );
};

EditArtistEvent.propTypes = {
    theEvent: PropTypes.object,
};

export default EditArtistEvent;
