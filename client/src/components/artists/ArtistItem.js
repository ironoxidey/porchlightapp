import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useSpring, a } from '@react-spring/web';

import { Grid, Box, Autocomplete, Chip, Typography } from '@mui/material';
import Button from '../layout/SvgButton';

import ArtistTop from './ArtistTop';
import useWindowDimensions from '../../utils/useWindowDimensions';

const ArtistItem = ({ artist }) => {
	const { viewHeight, viewWidth } = useWindowDimensions();
	const [flipped, toggleFlip] = useState(false);
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
			key={artist._id}
			item
			container
			xs={12}
			sm={6}
			md={4}
			lg={3}
			onClick={() => toggleFlip((state) => !state)}
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
					width,
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
					opacity: opacity.to((o) => 1 - o),
					transform,
					//scale: scale.to((s) => s),
					zIndex,
					cursor: 'pointer',
					willChange: 'transform, opacity, width',
					padding: 'inherit',
				}}
			>
				<Grid
					item
					container
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
							transform: 'scale(1.05)',
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
						<Link to={`/artists/${artist.slug}`}>
							<Typography
								sx={{
									textShadow: '0 0 15px rgb( 0 0 0 )',
								}}
							>
								{artist.stageName}
							</Typography>
						</Link>
					</Grid>
				</Grid>
			</a.div>
			<a.div
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
			</a.div>
		</Grid>
	);
};

ArtistItem.propTypes = {
	//artists: PropTypes.object.isRequired,
};

export default ArtistItem;
