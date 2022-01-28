import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import ArtistItem from './ArtistItem';
import { getArtists } from '../../actions/artist';
import { Grid, Box, Autocomplete, Chip, Typography } from '@mui/material';

const Artists = ({
	getArtists,
	auth: { user },
	artist: { artists, loading },
}) => {
	useEffect(() => {
		getArtists();
	}, [getArtists]);
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
								<ArtistItem key={artist._id} artist={artist} />
							))
						) : (
							<h4>No artists found...</h4>
						)}
					</Grid>
				</Fragment>
			)}
		</Fragment>
	);
};

Artists.propTypes = {
	getArtists: PropTypes.func.isRequired,
	artist: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	artist: state.artist,
	auth: state.auth,
});

export default connect(mapStateToProps, { getArtists })(Artists);
