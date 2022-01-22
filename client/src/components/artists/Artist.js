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
	}, [artist]);

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
						auth.user._id === artist._id && (
							<Link to='/edit-artist' className='btn btn-dark'>
								Edit Artist
							</Link>
						)}
					<div className=''>
						<ArtistTop artist={artist} />
						<ArtistAbout artist={artist} />
						{/* <div className="profile-exp bg-white p-2">
                             <h2 className="text-primary">Experience</h2>
                             {profile.experience.length > 0 ? (<Fragment>
                                {profile.experience.map(experience => (
                                    <ProfileExperience key={experience._id} experience={experience} />
                                ))}
                             </Fragment>) : (<h4>No experience credentials</h4>)}
                         </div>
                         <div className="profile-edu bg-white p-2">
                             <h2 className="text-primary">Education</h2>
                             {profile.education.length > 0 ? (<Fragment>
                                {profile.education.map(education => (
                                    <ProfileEducation key={education._id} education={education} />
                                ))}
                             </Fragment>) : (<h4>No education credentials</h4>)}
                         </div> */}
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
