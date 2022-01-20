import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import { getCurrentArtist } from '../../actions/artist';

const Dashboard = ({
	getCurrentProfile,
	deleteAccount,
	auth: { user },
	profile: { profile, loading },
	getCurrentArtist,
	artist: { artist },
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);
	useEffect(() => {
		getCurrentArtist();
	}, [getCurrentArtist]);
	return loading && profile === null ? (
		<Spinner />
	) : (
		<Fragment>
			<h1 className='large text-primary'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user' /> Welcome {user && user.name}
			</p>
			{/* CALENDLY STUFF
      <Fragment>
          <DashboardActions></DashboardActions>
      </Fragment> */}
			{profile !== null ? (
				<Fragment>
					{/* <Experience experience={profile.experience}></Experience>
          <Education education={profile.education}></Education> */}

					{/* <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus">Delete my account</i>
            </button>
          </div> */}
				</Fragment>
			) : (
				<Fragment>
					<p> You have not yet setup a profile, please add some info</p>
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create Profile
					</Link>
				</Fragment>
			)}

			{artist !== null ? (
				<Fragment>
					<Link to='/edit-artist-profile' className='btn btn-light'>
						<i className='fas fa-user-circle text-primary'></i> Edit your Artist
						Profile
					</Link>
				</Fragment>
			) : (
				<Fragment>
					<p>
						{' '}
						You have not yet setup your artist profile, please add some info
					</p>
					<Link to='/edit-artist-profile' className='btn btn-primary my-1'>
						Create Profile
					</Link>
				</Fragment>
			)}
		</Fragment>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	//getCurrentArist: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	artist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	profile: state.profile,
	artist: state.artist,
});

export default connect(mapStateToProps, {
	getCurrentProfile,
	getCurrentArtist,
	deleteAccount,
})(Dashboard);
