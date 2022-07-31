import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../layout/SvgButton';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ArtistEventForm from './ArtistEventForm';
import { Grid } from '@mui/material';

const AddArtistEvent = (props) => {
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

AddArtistEvent.propTypes = {};

export default AddArtistEvent;
