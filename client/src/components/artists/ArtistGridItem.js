import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useSpring, a } from '@react-spring/web';

import { Grid, Box, Autocomplete, Chip, Typography } from '@mui/material';
import Button from '../layout/SvgButton';

import { flipArtistCard } from '../../actions/app';
import ArtistGridItemTile from './ArtistGridItemTile';
import useWindowDimensions from '../../utils/useWindowDimensions';

const ArtistGridItem = ({
	artist,
	app: { artistCardFlip, doneFlipped },
	flipArtistCard,
}) => {
	const { viewHeight, viewWidth } = useWindowDimensions();
	const [flipped, toggleFlip] = useState(false);

	// useEffect(() => {
	// 	if (!artistCardFlip) {
	// 		toggleFlip(false);
	// 	}
	// }, [artistCardFlip]);

	useEffect(() => {
		if (doneFlipped) {
			toggleFlip(false);
		}
	}, [doneFlipped]);

	const { opacity } = useSpring({
		opacity: flipped ? 1 : 0,

		config: { mass: 5, tension: 500, friction: 80 },

		immediate: (key) => key === 'opacity',
	});

	return (
		<Grid
			key={artist._id}
			className={'tile-' + artist.slug}
			data-artist-slug={artist.slug}
			item
			container
			xs={6}
			sm={4}
			md={3}
			lg={3}
			onClick={() => {
				toggleFlip(true);
				flipArtistCard(artist);
			}}
			sx={{
				padding: '4px',
				position: 'relative',
				'&::before': {
					display: 'block',
					content: "''",
					paddingBottom: '100%', //makes it square
				},
			}}
		>
			<a.div
				className='artistFront'
				style={{
					position: 'absolute',
					display: 'flex',
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					opacity: opacity.to((o) => 1 - o),
					cursor: 'pointer',
					willChange: 'transform, opacity, width',
					padding: 'inherit',
				}}
			>
				<ArtistGridItemTile artist={artist}></ArtistGridItemTile>
			</a.div>
			{/* <a.div
				className='artistBack'
				style={{
					position: 'absolute',
					opacity,
					transform,
					rotateY: '180deg',
					backgroundColor: 'rgb(0 0 0 / .2)',
					//width,
				}}
			>
				<ArtistTop artist={artist} />
			</a.div> */}
		</Grid>
	);
};

ArtistGridItem.propTypes = {
	//artists: PropTypes.object.isRequired,
	app: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	app: state.app,
});

export default connect(mapStateToProps, { flipArtistCard })(ArtistGridItem);

//export default ArtistItem;
