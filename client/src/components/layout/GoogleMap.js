import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Map, Wrapper, Status } from '@googlemaps/react-wrapper';
import Spinner from './Spinner';
import { Grid } from '@mui/material';

function MyMapComponent({ center, zoom }) {
    const ref = useRef(null); // Initialize ref with null

    useEffect(() => {
        if (ref.current) {
            // Check if ref is not null before using it
            console.log('display map!');
            new window.google.maps.Map(ref.current, {
                center,
                zoom,
            });
        }
    }, []); // Make sure to include center and zoom as dependencies if needed

    return (
        <div
            ref={ref}
            id="map"
            style={{ marginTop: '20px', height: '600px', width: '980px' }}
        />
    );
}

const render = (status) => {
    switch (status) {
        case Status.LOADING:
            return <Spinner />;
        case Status.FAILURE:
            return (
                <>
                    <Grid className="mapFail">
                        <p>Map Failed!</p>
                    </Grid>
                </>
            );
        case Status.SUCCESS:
            console.log('Map Success!');
            return (
                <MyMapComponent
                    center={{
                        lat: 36.974,
                        lng: -122.03,
                    }}
                    zoom={8}
                />
            );
        default:
            return null; // Add a default case
    }
};

const GoogleMap = () => {
    return (
        <>
            <Wrapper
                apiKey={'AIzaSyBB0g4gW-3CLIIxud4I3j-BewNSO1c3rHM'}
                render={render}
            />
        </>
    );
};

GoogleMap.propTypes = {
    // locations: PropTypes.array, // Remove this line as you are not using the 'locations' prop
};

export default GoogleMap;
