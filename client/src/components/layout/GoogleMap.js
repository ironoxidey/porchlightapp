import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import Spinner from './Spinner';
import { Grid } from '@mui/material';

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
            return <></>;
        default:
            return null; // Add a default case
    }
};

let radiusCircle;

const MyMapComponent = ({
    center,
    zoom,
    markers,
    markerClick,
    radius,
    circleCenter,
}) => {
    const mapRef = useRef(null); // Initialize mapRef with null

    const [theMap, setTheMap] = useState(null); // Initialize theMap with null

    console.log('theMap', theMap);

    useEffect(async () => {
        const { AdvancedMarkerElement, PinElement } =
            await window.google.maps.importLibrary('marker');
        if (mapRef.current) {
            // Check if mapRef is not null before using it
            setTheMap(
                new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    mapId: 'dec1188be6451632',
                    mapTypeControl: false,
                    streetViewControl: false,
                })
            );
            console.log('init theMap', theMap);
        }
    }, [markers]);

    useEffect(() => {
        if (markers && markers.length > 0 && theMap) {
            const markersCoords = markers.map((marker, i) => {
                if (marker.anonLatLong.coordinates.length === 2) {
                    const icon = document.createElement('div');
                    icon.innerHTML = '<i class="fa fa-home"></i>';

                    const pinGlyph = new window.google.maps.marker.PinElement({
                        glyph: icon,
                        glyphColor: '#1C1E1C',
                        background: '#ffa14e',
                        borderColor: '#1C1E1C',
                        scale: 0.8,
                    });

                    const thisMarker =
                        // new window.google.maps.Marker({
                        new window.google.maps.marker.AdvancedMarkerElement({
                            map: theMap,
                            position: {
                                lat: marker.anonLatLong.coordinates[1],
                                lng: marker.anonLatLong.coordinates[0],
                            },
                            content: pinGlyph && pinGlyph.element,
                            title: marker.city,
                            // icon: 'pin.png',
                        });
                    // Add a click listener for each marker
                    thisMarker.addListener('click', ({ domEvent, latLng }) => {
                        //send the clicked marker back up to the parent component to use for an Autocomplete probably
                        markerClick(domEvent, 'bookingWhere', marker);
                    });
                    return thisMarker;
                }
            });
        }
    }, [markers, theMap]);

    // const [radiusCircle, setRadiusCircle] = useState(null);

    useEffect(() => {
        if (mapRef.current && radius && theMap && theMap.mapId) {
            radiusCircle = new window.google.maps.Circle({
                center: {
                    lat: 36.974,
                    lng: -97.03,
                },
            });

            radiusCircle.setMap(theMap);
            radiusCircle.setRadius(radius * 1609.34); // Convert miles to meters (1 mile = 1609.34 meters)

            console.log('circleCenter', circleCenter);
            if (circleCenter && circleCenter.coordinates.length === 2) {
                radiusCircle.setCenter({
                    lat: circleCenter.coordinates[1],
                    lng: circleCenter.coordinates[0],
                });
            }
        }
    }, [radius, theMap, circleCenter]);

    return (
        <div
            ref={mapRef}
            id="map"
            style={{ marginTop: '20px', height: '600px', width: '980px' }}
        />
    );
};

const GoogleMap = ({ markers, markerClick, radius, circleCenter }) => {
    // useEffect(() => {
    //     console.log('markers', markers);
    // }, [markers]);

    return (
        <>
            <Wrapper
                apiKey={'AIzaSyBB0g4gW-3CLIIxud4I3j-BewNSO1c3rHM'}
                render={render}
            >
                <MyMapComponent
                    center={{
                        lat: 36.974,
                        lng: -97.03,
                    }}
                    zoom={4.5}
                    markers={markers}
                    markerClick={markerClick}
                    radius={radius}
                    circleCenter={circleCenter}
                />
            </Wrapper>
        </>
    );
};

GoogleMap.propTypes = {
    markers: PropTypes.array,
    markerClick: PropTypes.func,
    radius: PropTypes.number,
    circleCenter: PropTypes.object,
};

export default GoogleMap;
