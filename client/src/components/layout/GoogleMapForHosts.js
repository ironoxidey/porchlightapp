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
    // radius,
    circleCenter,
    preferredArtists,
}) => {
    const mapRef = useRef(null); // Initialize mapRef with null

    const [theMap, setTheMap] = useState(null); // Initialize theMap with null
    // const [circleSet, setCircle] = useState(false); // Initialize theMap with null
    const [markersSet, setMarkers] = useState(false); // Initialize theMap with null
    const [clickedMarker, setClickedMarker] = useState();

    useEffect(() => {
        if (clickedMarker) {
            // onMarkerClick(domEvent, clickedMarker);
            // console.log('preferredArtists used to be', preferredArtists);
            const newMarkersSelected = [...preferredArtists, clickedMarker];
            // console.log('newMarkersSelected', newMarkersSelected);
            markerClick('domEvent', 'preferredArtists', newMarkersSelected);
        }
        // console.log('preferredArtists updated', preferredArtists);
    }, [clickedMarker]);

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
                // console.log('markersCoords marker', marker);
                if (marker.latLong.coordinates.length === 2) {
                    const icon = document.createElement('div');
                    icon.className = 'markerGlyph';
                    {
                        marker.squareImg || marker.profileImg
                            ? (icon.innerHTML =
                                  '<img src=' +
                                  (marker.squareImg || marker.profileImg) +
                                  ' class="artistImg" style="border-radius:100%; width: 18px; height: 18px; margin-top: 4px;"></img>')
                            : (icon.innerHTML = '<i class="fa fa-home"></i>');
                    }

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
                                        lat: marker.latLong.coordinates[1],
                                        lng: marker.latLong.coordinates[0],
                                    },
                                    content: pinGlyph && pinGlyph.element,
                                    title:
                                        marker.stageName ||
                                        marker.firstName +
                                            ' ' +
                                            marker.lastName,
                                    // icon: 'pin.png',
                                }
                            );
                        thisMarker.content.classList.add(
                            'marker' + marker.slug
                        );
                        // thisMarker.content.onclick = (e) => {
                        //     console.log(
                        //         marker.slug + ' marker content clicked'
                        //     );
                        //     onMarkerClick(e, marker);
                        // };

                        // console.log('thisMarker.content', thisMarker.content);
                        // console.log(marker.city + ' marker created.');

                        // Add a click listener for each marker
                        window.google.maps.event.addListener(
                            thisMarker,
                            'click',
                            ({ domEvent, latLng }) => {
                                //send the clicked marker back up to the parent component to use for an Autocomplete probably
                                if (
                                    !thisMarker.content.classList.contains(
                                        'selected'
                                    )
                                ) {
                                    // console.log('marker clicked', marker);
                                    // console.log('domEvent', domEvent);
                                    var elems =
                                        document.querySelectorAll('.selected');
                                    [].forEach.call(elems, function (el) {
                                        el.parentElement.parentElement.classList.remove(
                                            'markerSelected'
                                        );
                                        el.classList.remove('selected');
                                    });
                                    thisMarker.content.classList.add(
                                        'selected'
                                    );
                                    thisMarker.content.parentElement.parentElement.classList.add(
                                        'markerSelected'
                                    );
                                    setClickedMarker(marker);
                                }

                                // onMarkerClick(domEvent, marker);
                            }
                        );
                        if (
                            circleCenter &&
                            circleCenter.coordinates &&
                            circleCenter.coordinates.length === 2 &&
                            circleCenter.coordinates[0] ===
                                marker.latLong.coordinates[0] &&
                            circleCenter.coordinates[1] ===
                                marker.latLong.coordinates[1]
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
        if (preferredArtists && preferredArtists.length > 0) {
            preferredArtists.forEach((preferredArtist) => {
                var selectThisMarker = document.querySelector(
                    '.marker' + preferredArtist.slug
                );
                // console.log('selectThisMarker', selectThisMarker);
                if (selectThisMarker) {
                    selectThisMarker.classList.add('selected');
                    selectThisMarker.parentElement.parentElement.classList.add(
                        'markerSelected'
                    );
                }
            });
        }
    }, [markers, theMap, window.google, window.google.maps.marker]);

    // const [radiusCircle, setRadiusCircle] = useState(null);

    // useEffect(() => {
    //     if (mapRef.current && radius && theMap && theMap.mapId) {
    //         if (!circleSet) {
    //             if (!radiusCircle) {
    //                 if (circleCenter && circleCenter.coordinates.length === 2) {
    //                     const newRadiusCircle = new window.google.maps.Circle({
    //                         center: {
    //                             lat: circleCenter.coordinates[1],
    //                             lng: circleCenter.coordinates[0],
    //                         },
    //                         radius: radius,
    //                         map: theMap,
    //                     });

    //                     setRadiusCircle(newRadiusCircle);
    //                     // console.log('radiusCircle created', newRadiusCircle);
    //                 }
    //             }
    //         }
    //     }
    // }, [radius, theMap, circleCenter]);

    // useEffect(() => {
    //     if (radiusCircle && theMap && theMap.mapId && !circleSet) {
    //         radiusCircle.setMap(theMap);
    //         setCircle(true);
    //         // console.log('radiusCircle setMap', radiusCircle);
    //     }
    // }, [radiusCircle, theMap]);

    useEffect(() => {
        //change location, move circle, maybe change radius, pan map, and zoom
        if (
            theMap &&
            // radiusCircle &&
            // radiusCircle.map &&
            // radiusCircle.map.mapId &&
            circleCenter &&
            circleCenter.coordinates.length === 2 &&
            // circleSet &&
            markersSet
        ) {
            theMap.panTo({
                lat: circleCenter.coordinates[1],
                lng: circleCenter.coordinates[0],
            });
            // if (theMap.getZoom() < 7) {
            //     theMap.setZoom(7);
            // }

            // radiusCircle.setRadius(radius * 1609.34); // Convert miles to meters (1 mile = 1609.34 meters)
            // radiusCircle.setCenter({
            //     lat: circleCenter.coordinates[1],
            //     lng: circleCenter.coordinates[0],
            // });
        }
        if (preferredArtists && preferredArtists.length > 0) {
            var elems = document.querySelectorAll('.selected');
            [].forEach.call(elems, function (el) {
                el.parentElement.parentElement.classList.remove(
                    'markerSelected'
                );
                el.classList.remove('selected');
            });
            preferredArtists.forEach((preferredArtist) => {
                var selectThisMarker = document.querySelector(
                    '.marker' + preferredArtist.slug
                );
                // console.log('selectThisMarker', selectThisMarker);
                if (selectThisMarker) {
                    selectThisMarker.classList.add('selected');
                    selectThisMarker.parentElement.parentElement.classList.add(
                        'markerSelected'
                    );
                }
            });
        }
    }, [
        // radiusCircle,
        theMap,
        // circleSet,
        circleCenter,
        // radius,
        preferredArtists,
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

MyMapComponent.propTypes = {
    center: PropTypes.object,
    zoom: PropTypes.number,
    markers: PropTypes.array,
    markerClick: PropTypes.func,
    // radius: PropTypes.number,
    circleCenter: PropTypes.object,
    preferredArtists: PropTypes.array,
};

const GoogleMapForHosts = ({
    markers,
    markerClick,
    // radius,
    circleCenter,
    preferredArtists,
    zoom,
}) => {
    // useEffect(() => {
    //     console.log('markers', markers);
    // }, [markers]);

    return (
        <>
            <Wrapper
                apiKey={'AIzaSyBb4pAeXW0ouFyFYWVb6dz24PQw2C0GE1A'}
                render={render}
            >
                <MyMapComponent
                    center={{
                        lat: 36.974,
                        lng: -97.03,
                    }}
                    zoom={zoom || 6}
                    markers={markers}
                    markerClick={markerClick}
                    // radius={radius}
                    circleCenter={circleCenter}
                    preferredArtists={preferredArtists}
                />
            </Wrapper>
        </>
    );
};

GoogleMapForHosts.propTypes = {
    markers: PropTypes.array,
    markerClick: PropTypes.func,
    // radius: PropTypes.number,
    circleCenter: PropTypes.object,
    preferredArtists: PropTypes.array,
    zoom: PropTypes.number,
};

export default GoogleMapForHosts;
