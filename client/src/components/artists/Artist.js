import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { PAGE_LOAD } from '../../actions/types';
import Spinner from '../layout/Spinner';
import ArtistTop from './ArtistTop';
import ArtistAbout from './ArtistAbout';
// import ProfileExperience from './ProfileExperience';
// import ProfileEducation from './ProfileEducation';
import { getArtistBySlug } from '../../actions/artist';

const Artist = ({
	getArtistBySlug,
	artist: { artist, loading },
	auth,
	match,
	app,
}) => {
	const dispatch = useDispatch();
	useEffect(() => {
		if (artist && artist.stageName) {
			dispatch({
				type: PAGE_LOAD,
				payload: { pageTitle: artist.stageName },
			});
		}
	}, [artist, dispatch]);

	useEffect(() => {
		getArtistBySlug(match.params.slug);
	}, [getArtistBySlug, match.params.slug]);

	return (
		<Fragment>
			{artist === null || loading ? (
				<Spinner />
			) : (
				<Fragment>
					<Link to='/artists' className='btn btn-Light'>
						Back to Artists
					</Link>
					{auth.isAuthenticated &&
						auth.loading === false &&
						auth.user.id === artist.user && (
							<Link to='/edit-artist-profile' className='btn btn-dark'>
								Edit
							</Link>
						)}
					<div className=''>
						<ArtistTop artist={artist} />
						<ArtistAbout artist={artist} />
					</div>
				</Fragment>
			)}
		</Fragment>
	);
};

Artist.propTypes = {
	getArtistBySlug: PropTypes.func.isRequired,
	artist: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	app: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
	artist: state.artist,
	auth: state.auth,
	app: state.app,
});

export default connect(mapStateToProps, { getArtistBySlug })(Artist);
