import React, {
    Fragment,
    useEffect,
    useState,
    useCallback,
    useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { CLEAR_ARTIST } from '../../actions/types';
import Spinner from '../layout/Spinner';
import ArtistGridItem from './ArtistGridItem';
import { getArtists } from '../../actions/artist';
import { Grid, Box, Autocomplete, Chip, Typography } from '@mui/material';

import { animated, useTransition, useSpring, a } from 'react-spring';

import { flipArtistCard } from '../../actions/app';
import ArtistProfile from './ArtistProfile';
import ArtistGridItemTile from './ArtistGridItemTile';
import { flexbox } from '@mui/system';

let flipped = false;
let artistTileOffset = {};

const Artists = ({
    app,
    app: { artistCardFlip },
    getArtists,
    auth: { user },
    artist: { artist, artists, loading },
    flipArtistCard,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (artistCardFlip) {
            //make sure a card isn't still flipped up for some reason
            flipArtistCard(artist);
        }
        getArtists();
    }, []);

    useEffect(() => {
        dispatch({ type: CLEAR_ARTIST });
    }, [getArtists]);

    // useLayoutEffect(() => {
    //     if (artists.length > 0 && artist) {
    //         //trips up if there's an artist in the state from a different route
    //         const artistTileDiv = document
    //             .querySelectorAll('[data-artist-slug=' + artist.slug + ']')[0]
    //             .getElementsByClassName('theSquareTile')[0];

    //         const squareImgInACircle =
    //             document.getElementsByClassName('squareImgInACircle')[0];

    //         const rootScrollTop = document.getElementById('root').scrollTop;

    //         const topOffset = document
    //             .getElementsByClassName('animatedRoute')[0]
    //             .getBoundingClientRect().top;

    //         if (artistTileDiv) {
    //             artistTileOffset.top =
    //                 artistTileDiv.getBoundingClientRect().top - topOffset;
    //             artistTileOffset.left =
    //                 artistTileDiv.getBoundingClientRect().left;
    //             artistTileOffset.bottom =
    //                 artistTileDiv.getBoundingClientRect().bottom;
    //             artistTileOffset.right =
    //                 artistTileDiv.getBoundingClientRect().right;
    //             artistTileOffset.width =
    //                 artistTileOffset.right - artistTileOffset.left;
    //             artistTileOffset.windowWidth = window.innerWidth * 0.9;
    //             artistTileOffset.windowHeight =
    //                 window.innerHeight + topOffset + topOffset;
    //             artistTileOffset.rootScrollTop = rootScrollTop;

    //             if (artistCardFlip === true) {
    //                 setSpring.start({
    //                     from: {
    //                         opacity: 0,
    //                         zIndex: -1,
    //                         paddingTop: `${0}px`,
    //                         transform: `translate3d(${artistTileOffset.left}px, ${artistTileOffset.top}px, 0px) perspective(600px)`,
    //                         width: artistTileOffset.width,
    //                         height: artistTileOffset.width,
    //                     },
    //                     to: {
    //                         opacity: 1,
    //                         zIndex: 100,
    //                         paddingTop: `${rootScrollTop + 20}px`,
    //                         transform: `translate3d(0px, 0px, 1000px) perspective(600px)`, //the z translation is necessary for Safari, because the y rotation would swing the div through the darkened background
    //                         width: artistTileOffset.windowWidth,
    //                         height: artistTileOffset.windowHeight,
    //                     },
    //                     onRest: () => {
    //                         //document.getElementsByClassName('overlayDarkBG')[0].style.height = document.getElementsByClassName('ArtistProfile')[0].clientheight + 'px';
    //                     },
    //                     config: { mass: 5, tension: 500, friction: 80 },
    //                     immediate: (key) =>
    //                         key === 'zIndex' || key === 'paddingTop',
    //                 });
    //             } else {
    //                 setSpring.start({
    //                     to: {
    //                         opacity: 0,
    //                         zIndex: -1,
    //                         paddingTop: `${0}px`,
    //                         transform: `translate3d(${artistTileOffset.left}px, ${artistTileOffset.top}px, 0px) perspective(600px)`,
    //                         width: artistTileOffset.width,
    //                         height: artistTileOffset.width,
    //                     },
    //                     onRest: () => {
    //                         dispatch({ type: CLEAR_ARTIST });
    //                     },
    //                     config: { mass: 5, tension: 500, friction: 80 },
    //                 });
    //             }

    //             flipped = artistCardFlip;
    //         }
    //     }
    // }, [artistCardFlip]);

    const [
        { transform, opacity, zIndex, width, height, paddingTop },
        setSpring,
    ] = useSpring(() => ({
        to: {
            paddingTop: `${20}px`,
            opacity: !flipped ? 1 : 0,
            transform: `translateX(${
                !flipped ? '0px' : artistTileOffset.left + 'px'
            }) translateY(${
                !flipped ? '0px' : artistTileOffset.top + 'px'
            }) perspective(600px)`,
            zIndex: !flipped ? 100 : -1,
            // width: !flipped ? `calc(1% + ${viewWidth}px)` : 'calc(100% - 8px)',
            width: !flipped
                ? window.innerWidth
                : artistTileOffset.right - artistTileOffset.left,
            height: !flipped
                ? window.innerHeight
                : artistTileOffset.right - artistTileOffset.left,
        },
        from: {
            paddingTop: `0px`,
            opacity: 0,
            transform: `translateX(${
                flipped ? '0px' : artistTileOffset.left + 'px'
            }) translateY(${
                flipped ? '0px' : artistTileOffset.top + 'px'
            })perspective(600px)`,
            zIndex: -1,
            width: flipped
                ? window.innerWidth
                : artistTileOffset.right - artistTileOffset.left,
            height: flipped
                ? window.innerHeight
                : artistTileOffset.right - artistTileOffset.left,
        },
        config: { mass: 5, tension: 500, friction: 80 },
        immediate: (key) => flipped && key === 'zIndex',
    }));

    return (
        <Fragment>
            {loading ? (
                <Spinner></Spinner>
            ) : (
                <Fragment>
                    <Grid
                        className="artists"
                        container
                        justifyContent="center"
                        sx={{ maxWidth: '960px', margin: '0 auto' }}
                    >
                        {artists.length > 0 ? (
                            artists.map((artist) => (
                                <ArtistGridItem
                                    key={artist._id}
                                    artist={artist}
                                />
                            ))
                        ) : (
                            <h4>No artists found...</h4>
                        )}
                    </Grid>

                    {/* {artists && artist && artist._id ? (
                        <Box>
                            <a.div
                                className="flipFront"
                                style={{
                                    zIndex,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    position: 'absolute',
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'start',
                                    width: '100%',
                                    height: '100%',
                                    paddingTop,
                                }}
                            >
                                <a.div
                                    style={{
                                        opacity: opacity.to((o) => 1 - o),
                                        transform,
                                        zIndex,
                                        width,
                                        height,
                                    }}
                                >
                                    <ArtistGridItemTile
                                        artist={artist}
                                    ></ArtistGridItemTile>
                                </a.div>
                            </a.div>
                            <a.div
                                className="overlayDarkBG"
                                style={{
                                    zIndex,
                                    opacity,
                                    // transition: 'all 500ms ease-in',
                                    backgroundColor: 'rgb(0 0 0 / .6)',
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    left: 0,
                                    paddingTop,
                                    position: 'absolute',
                                    display: 'flex',
                                    justifyContent: 'start',
                                    alignItems: 'start',
                                    width: width.to((w) => '100%'),
                                    height: 'fit-content',
                                    backdropFilter: 'blur(8px)',
                                }}
                            >
                                <a.div
                                    key={artist._id}
                                    className="artistBackOverlay"
                                    onClick={() => {
                                        //console.log(styles);
                                    }}
                                    // style={props}
                                    style={{
                                        opacity,
                                        zIndex,
                                        minHeight: height,
                                        //height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <a.div
                                        className="ArtistProfile"
                                        style={{
                                            maxWidth: '1280px',
                                            width,
                                            margin: '0 auto',
                                            padding: '20px',
                                            zIndex: 5,
                                            position: 'relative',
                                        }}
                                    >
                                        <ArtistProfile artist={artist} />
                                    </a.div>
                                    <Box
                                        onClick={() => {
                                            flipArtistCard(artist);
                                        }}
                                        className="clickToClose"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            zIndex: 0,
                                            cursor: 'pointer',
                                        }}
                                    ></Box>
                                </a.div>
                            </a.div>
                        </Box>
                    ) : (
                        ''
                    )} */}
                </Fragment>
            )}
        </Fragment>
    );
};

Artists.propTypes = {
    getArtists: PropTypes.func.isRequired,
    artist: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    artist: state.artist,
    auth: state.auth,
    app: state.app,
});

export default connect(mapStateToProps, { getArtists, flipArtistCard })(
    Artists
);
