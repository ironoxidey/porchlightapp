import React, {
	Fragment,
	useEffect,
	useState,
	useCallback,
	useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ArtistGridItem from './ArtistGridItem';
import { getArtists } from '../../actions/artist';
import { Grid, Box, Autocomplete, Chip, Typography } from '@mui/material';

import { animated, useTransition, useSpring, a } from 'react-spring';

import { flipArtistCard } from '../../actions/app';
import ArtistTileBack from './ArtistTileBack';
import ArtistGridItemTile from './ArtistGridItemTile';
import { flexbox } from '@mui/system';

import useWindowDimensions from '../../utils/useWindowDimensions';
import { useWindowSize, useMeasure } from 'react-use';

let flipped = false;
let artistTileOffset = {};

function useClientRect() {
	const [tileMeasurement, setTileMeasurements] = useState({
		top: 1,
		left: 1,
		bottom: 500,
		right: 500,
		width: 500,
	});
	const artistTileDiv = useCallback((node) => {
		if (node !== null) {
			setTileMeasurements(node.getBoundingClientRect());

			// console.log('tileMeasurement');
			// console.log(tileMeasurement);
		}
	}, []);
	return [tileMeasurement, artistTileDiv];
}

const Artists = ({
	app,
	app: { artistCardFlip },
	getArtists,
	auth: { user },
	artist: { artist, artists, loading },
	flipArtistCard,
}) => {
	useEffect(() => {
		getArtists();
	}, []);

	const [springReset, toggleReset] = useState(false);

	const { viewHeight, viewWidth } = useWindowDimensions();
	// const [artistTileDiv, { x, y, width, height, top, right, bottom, left }] =
	// 	useMeasure();

	//const [tileMeasurement, artistTileDiv] = useClientRect();

	useLayoutEffect(() => {
		if (artist) {
			const artistTileDiv = document
				.querySelectorAll('[data-artist-slug=' + artist.slug + ']')[0]
				.getElementsByClassName('theSquareTile')[0];

			const topOffset = document
				.getElementsByClassName('animatedRoute')[0]
				.getBoundingClientRect().top;

			// console.log('artistTileDiv');
			// console.log(artistTileDiv);

			if (artistTileDiv) {
				// artistTileOffset.top = tileMeasurement.top;
				// artistTileOffset.left = tileMeasurement.left;
				// artistTileOffset.bottom = tileMeasurement.bottom;
				// artistTileOffset.right = tileMeasurement.right;
				// artistTileOffset.width = tileMeasurement.width;
				// artistTileOffset.windowWidth = viewWidth;
				// artistTileOffset.windowHeight = viewHeight;
				artistTileOffset.top =
					artistTileDiv.getBoundingClientRect().top - topOffset;
				artistTileOffset.left = artistTileDiv.getBoundingClientRect().left;
				artistTileOffset.bottom = artistTileDiv.getBoundingClientRect().bottom;
				artistTileOffset.right = artistTileDiv.getBoundingClientRect().right;
				artistTileOffset.width = artistTileOffset.right - artistTileOffset.left;
				artistTileOffset.windowWidth = viewWidth;
				artistTileOffset.windowHeight = viewHeight;

				// console.log('artistTileOffset');
				// console.log(artistTileOffset);

				if (artistCardFlip === true) {
					setSpring.start({
						from: {
							opacity: 0,
							zIndex: -1,
							transform: `translate3d(${artistTileOffset.left}px, ${artistTileOffset.top}px, 0px) perspective(600px) rotateY(-180deg)`,
							width: artistTileOffset.width,
							height: artistTileOffset.width,
						},
						to: {
							opacity: 1,
							zIndex: 100,
							transform: `translate3d(0px, 0px, 0px) perspective(600px) rotateY(0deg)`,
							width: window.innerWidth,
							height: window.innerHeight,
						},
						config: { mass: 5, tension: 500, friction: 80 },
						immediate: (key) => key === 'zIndex',
					});
				} else {
					setSpring.start({
						to: {
							opacity: 0,
							zIndex: -1,
							transform: `translate3d(${artistTileOffset.left}px, ${artistTileOffset.top}px, 0px) perspective(600px) rotateY(-180deg)`,
							width: artistTileOffset.width,
							height: artistTileOffset.width,
						},
						config: { mass: 5, tension: 500, friction: 80 },
					});
				}

				flipped = artistCardFlip;
			}
		}
	}, [artistCardFlip]);

	const [{ transform, opacity, zIndex, width, height }, setSpring] = useSpring(
		() => ({
			to: {
				opacity: !flipped ? 1 : 0,
				transform: `translateX(${
					!flipped ? '0px' : artistTileOffset.left + 'px'
				}) translateY(${
					!flipped ? '0px' : artistTileOffset.top + 'px'
				}) perspective(600px) rotateY(${!flipped ? 0 : -180}deg)`,
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
				opacity: 0,
				transform: `translateX(${
					flipped ? '0px' : artistTileOffset.left + 'px'
				}) translateY(${
					flipped ? '0px' : artistTileOffset.top + 'px'
				})perspective(600px) rotateY(-180deg)`,
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
		})
	);

	return (
		<Fragment>
			{loading ? (
				<Spinner></Spinner>
			) : (
				<Fragment>
					<Grid
						className='artists'
						container
						justifyContent='center'
						sx={{ maxWidth: '960px', margin: '0 auto' }}
					>
						{artists.length > 0 ? (
							artists.map((artist) => (
								<ArtistGridItem key={artist._id} artist={artist} />
							))
						) : (
							<h4>No artists found...</h4>
						)}
					</Grid>

					{artist && artist._id ? (
						<Box>
							<a.div
								className='flipFront'
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
								}}
							>
								<a.div
									style={{
										opacity: opacity.to((o) => 1 - o),
										transform,
										zIndex,
										width,
										height,
										rotateY: '180deg',
									}}
								>
									<ArtistGridItemTile artist={artist}></ArtistGridItemTile>
								</a.div>
							</a.div>
							<a.div
								className='overlayDarkBG'
								onClick={() => {
									flipArtistCard(artist);
								}}
								style={{
									zIndex,
									opacity,
									// transition: 'all 500ms ease-in',
									backgroundColor: 'rgb(0 0 0 / .5)',
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
									cursor: 'pointer',
								}}
							>
								<a.div
									key={artist._id}
									className='artistBackOverlay'
									onClick={() => {
										//console.log(styles);
									}}
									// style={props}
									style={{
										opacity,
										transform,
										zIndex,
										width,
										height,
									}}
								>
									<Box
										style={{
											position: 'absolute',
											top: 0,
											left: 0,
											bottom: 0,
											right: 0,
											overflow: 'hidden',
											width: '100%',
											height: '100%',
										}}
									>
										<Box sx={{ maxWidth: '960px', margin: '0 auto' }}>
											<ArtistTileBack artist={artist} />
										</Box>
									</Box>
								</a.div>
							</a.div>
						</Box>
					) : (
						''
					)}
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
