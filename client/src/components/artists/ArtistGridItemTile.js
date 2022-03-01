import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useSpring, a } from '@react-spring/web';

import { Grid, Box, Autocomplete, Chip, Typography } from '@mui/material';
import Button from '../layout/SvgButton';

import { flipArtistCard } from '../../actions/app';
import useWindowDimensions from '../../utils/useWindowDimensions';

const ArtistGridItemTile = ({
    artist,
    app: { artistCardFlip },
    flipArtistCard,
}) => {
    const { viewHeight, viewWidth } = useWindowDimensions();
    const [flipped, toggleFlip] = useState(false);

    useEffect(() => {
        if (!artistCardFlip) {
            toggleFlip(false);
        }
    }, [artistCardFlip]);

    const { transform, opacity, zIndex, width } = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(600px) rotateY(${flipped ? -180 : 0}deg)`,
        //scale: flipped ? 2 : 1,
        zIndex: flipped ? 100 : 1,
        //width: flipped ? `calc(1% + ${viewWidth}px)` : 'calc(100% - 8px)',
        width: '100%',
        config: { mass: 5, tension: 500, friction: 80 },
    });

    return (
        <Grid
            item
            container
            className="theSquareTile"
            sx={{
                borderRadius: '4px',
                //backgroundImage: `radial-gradient(rgb(0 0 0 / 0.3) 50%, rgb(0 0 0 / 0.5) 100%), url("${artist.squareImg}")`,
                backgroundImage: `url("${artist.squareImg}")`,
                backgroundPosition: '50% 50%',
                backgroundSize: 'cover',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'end',
                overflow: 'hidden',
                //height: '100%',
                boxShadow: '0 0 10px rgb( 0 0 0 / .8)',
                transition: 'all .2s ease-out',
                position: 'relative',
                '&::after': {
                    display: 'block',
                    content: "''",
                    width: '100%', //makes it square
                    height: '100%',
                    backgroundImage: `radial-gradient(rgb(0 0 0 / 0.3) 50%, rgb(0 0 0 / 0.5) 100%)`,
                    position: 'absolute',
                    transition: 'all .2s ease-out',
                    opacity: 1,
                    zIndex: 0,
                },
                '&:hover': {
                    //backgroundImage: `radial-gradient(rgb(0 0 0 / 0) 50%, rgb(0 0 0 / 0.3) 100%), url("${artist.squareImg}")`,
                    transform: 'scale(1.02)',
                    boxShadow: '0 0 20px rgb( 0 0 0 / .4)',
                    '&::after': {
                        opacity: 0,
                    },
                },
            }}
        >
            <Grid
                item
                sx={{
                    width: '100%',
                    backgroundColor: 'rgb(0 0 0 / .5)',
                    padding: '4px 8px',
                    textAlign: 'center',
                    outlineOffset: '2px',
                    outline: '1px solid rgb(0 0 0 / .5)',
                    zIndex: 5,
                }}
            >
                {/* <Link to={`/artists/${artist.slug}`}> */}
                <Typography
                    sx={{
                        fontFamily: 'var(--secondary-font)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontSize: '.9em',
                        textShadow: '0 0 15px rgb( 0 0 0 )',
                        padding: '5px',
                    }}
                >
                    {artist.stageName}
                </Typography>
                {/* </Link> */}
            </Grid>
        </Grid>
    );
};

ArtistGridItemTile.propTypes = {
    app: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
    app: state.app,
});

export default connect(mapStateToProps, { flipArtistCard })(ArtistGridItemTile);

//export default ArtistItem;
