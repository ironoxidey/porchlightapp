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
            // console.log('Map Success!');
            return <></>;
        default:
            return null; // Add a default case
    }
};

const MyMapComponent = ({
    center,
    zoom,
    markers,
    markerClick,
    radius,
    circleCenter,
    bookingWhereZip,
}) => {
    const mapRef = useRef(null); // Initialize mapRef with null

    const [theMap, setTheMap] = useState(null); // Initialize theMap with null
    const [circleSet, setCircle] = useState(false); // Initialize theMap with null
    const [markersSet, setMarkers] = useState(false); // Initialize theMap with null

    // console.log('theMap', theMap);

    const initializeMap = async () => {
        const { AdvancedMarkerElement, PinElement } =
            await window.google.maps.importLibrary('marker');
    };

    initializeMap();

    useEffect(() => {
        if (mapRef.current) {
            // Check if mapRef is not null before using it
            setTheMap(
                new window.google.maps.Map(mapRef.current, {
                    center,
                    zoom,
                    mapId: 'dec1188be6451632',
                    mapTypeControl: false,
                    streetViewControl: false,
                    // scrollwheel: false,
                    gestureHandling: 'cooperative',
                })
            );
            // console.log('init theMap', theMap);
            // console.log('circleCenter', circleCenter);
        }
    }, [markers]);

    useEffect(() => {
        if (
            markers &&
            markers.length > 0 &&
            theMap &&
            !markersSet &&
            window.google &&
            window.google.maps &&
            window.google.maps.marker
        ) {
            const markersCoords = markers.map((marker, i) => {
                if (marker.anonLatLong.coordinates.length === 2) {
                    const icon = document.createElement('div');
                    icon.className = 'markerGlyph';
                    icon.innerHTML = '<i class="fa fa-home"></i>';
                    const lgIcon = document.createElement('div');
                    lgIcon.className = 'markerGlyph';
                    lgIcon.innerHTML = '<i class="fa fa-home fa-lg"></i>';

                    if (
                        window.google &&
                        window.google.maps &&
                        window.google.maps.marker &&
                        window.google.maps.marker.PinElement
                    ) {
                        const pinGlyph =
                            new window.google.maps.marker.PinElement({
                                glyph: icon,
                                glyphColor: '#1C1E1C',
                                background: '#ffa14e',
                                borderColor: '#1C1E1C',
                                scale: 0.8,
                            });

                        const thisMarker =
                            new window.google.maps.marker.AdvancedMarkerElement(
                                {
                                    map: theMap,
                                    position: {
                                        lat: marker.anonLatLong.coordinates[1],
                                        lng: marker.anonLatLong.coordinates[0],
                                    },
                                    content: pinGlyph && pinGlyph.element,
                                    title: marker.city + ', ' + marker.state,
                                    // icon: 'pin.png',
                                }
                            );
                        thisMarker.content.classList.add('marker' + marker.zip);
                        // console.log(marker.city + ' marker created.');
                        // // Add a hover listener for each marker
                        // window.google.maps.event.addListener(
                        //     thisMarker,
                        //     'mouseover',
                        //     () => {
                        //         thisMarker.content.classList.add('hover');
                        //         console.log(marker.city + ' marker hovered');
                        //         // setHoveredMarker(marker.zip);
                        //     }
                        // );
                        // // Add a unhover listener for each marker
                        // window.google.maps.event.addListener(
                        //     thisMarker,
                        //     'mouseout',
                        //     () => {
                        //         thisMarker.content.classList.remove('hover');
                        //         console.log(marker.city + ' marker hovered');
                        //         // setHoveredMarker(null);
                        //     }
                        // );
                        // Add a click listener for each marker
                        window.google.maps.event.addListener(
                            thisMarker,
                            'click',
                            ({ domEvent, latLng }) => {
                                //send the clicked marker back up to the parent component to use for an Autocomplete probably
                                // console.log(marker.city + ' marker clicked');
                                var elems =
                                    document.querySelectorAll('.selected');
                                [].forEach.call(elems, function (el) {
                                    el.parentElement.parentElement.classList.remove(
                                        'markerSelected'
                                    );
                                    el.classList.remove('selected');
                                });
                                thisMarker.content.classList.add('selected');
                                thisMarker.content.parentElement.parentElement.classList.add(
                                    'markerSelected'
                                );
                                markerClick(domEvent, 'bookingWhere', marker);
                                // setSelectedMarker(marker.zip);
                                // setHoveredMarker(null);
                            }
                        );
                        if (
                            circleCenter &&
                            circleCenter.coordinates &&
                            circleCenter.coordinates.length === 2 &&
                            circleCenter.coordinates[0] ===
                                marker.anonLatLong.coordinates[0] &&
                            circleCenter.coordinates[1] ===
                                marker.anonLatLong.coordinates[1]
                        ) {
                            thisMarker.content.classList.add('selected');
                            thisMarker.content.parentElement.parentElement.classList.add(
                                'markerSelected'
                            );
                        }
                        return thisMarker;
                    }
                }
            });
            // console.log('markersCoords', markersCoords.length);
            // console.log('markers', markers.length);
            if (markersCoords.length === markers.length) {
                // console.log('* setMarkers', markersSet);
                setMarkers(true);
            }
        }
    }, [markers, theMap, window.google, window.google.maps.marker]);

    const [radiusCircle, setRadiusCircle] = useState(null);

    useEffect(() => {
        if (mapRef.current && radius && theMap && theMap.mapId) {
            if (!circleSet) {
                if (!radiusCircle) {
                    if (circleCenter && circleCenter.coordinates.length === 2) {
                        const newRadiusCircle = new window.google.maps.Circle({
                            center: {
                                lat: circleCenter.coordinates[1],
                                lng: circleCenter.coordinates[0],
                            },
                            radius: radius,
                            map: theMap,
                        });

                        setRadiusCircle(newRadiusCircle);
                        // console.log('radiusCircle created', newRadiusCircle);
                    }
                }
            }
        }
    }, [radius, theMap, circleCenter]);

    useEffect(() => {
        if (radiusCircle && theMap && theMap.mapId && !circleSet) {
            radiusCircle.setMap(theMap);
            setCircle(true);
            // console.log('radiusCircle setMap', radiusCircle);
        }
    }, [radiusCircle, theMap]);

    useEffect(() => {
        //change location, move circle, maybe change radius, pan map, and zoom
        if (
            theMap &&
            radiusCircle &&
            radiusCircle.map &&
            radiusCircle.map.mapId &&
            circleCenter &&
            circleCenter.coordinates.length === 2 &&
            circleSet &&
            markersSet
        ) {
            theMap.panTo({
                lat: circleCenter.coordinates[1],
                lng: circleCenter.coordinates[0],
            });
            if (theMap.getZoom() < 7) {
                theMap.setZoom(7);
            }

            radiusCircle.setRadius(radius * 1609.34); // Convert miles to meters (1 mile = 1609.34 meters)
            radiusCircle.setCenter({
                lat: circleCenter.coordinates[1],
                lng: circleCenter.coordinates[0],
            });

            if (bookingWhereZip) {
                var elems = document.querySelectorAll('.selected');
                [].forEach.call(elems, function (el) {
                    el.parentElement.parentElement.classList.remove(
                        'markerSelected'
                    );
                    el.classList.remove('selected');
                });
                var selectThisMarker = document.querySelector(
                    '.marker' + bookingWhereZip
                );
                // console.log('selectThisMarker', selectThisMarker);
                if (selectThisMarker) {
                    selectThisMarker.classList.add('selected');
                    selectThisMarker.parentElement.parentElement.classList.add(
                        'markerSelected'
                    );
                }
            }
        }
    }, [
        radiusCircle,
        theMap,
        circleSet,
        circleCenter,
        radius,
        bookingWhereZip,
        markersSet,
    ]);

    return (
        <div
            ref={mapRef}
            id="map"
            style={{ marginTop: '20px', height: '500px', width: '100%' }}
        />
    );
};

const GoogleMap = ({
    markers,
    markerClick,
    radius,
    circleCenter,
    bookingWhereZip,
}) => {
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
                    zoom={4.25}
                    markers={markers}
                    markerClick={markerClick}
                    radius={radius}
                    circleCenter={circleCenter}
                    bookingWhereZip={bookingWhereZip}
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
    bookingWhereZip: PropTypes.number,
};

export default GoogleMap;
