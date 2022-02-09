import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentArtist } from '../../actions/artist';
import Spinner from '../layout/Spinner';
import EditArtistBookingForm from './EditArtistBookingForm';

const EditMyArtistBooking = ({
	auth,
	getCurrentArtist,
	artist: { me, loading },
}) => {
	useEffect(() => {
		// if (auth.user.email) {
		getCurrentArtist();
		// }
	}, [getCurrentArtist]);
	//}, [getCurrentArtist, auth]);

	return (
		<Fragment>
			{loading ? (
				<Spinner></Spinner>
			) : me ? (
				<Fragment>
					{/* <h1 className='large text-primary'>Edit Your Artist Profile</h1> */}
					<EditArtistBookingForm theArtist={me} />
					{/* <Link to='/dashboard' className='btn btn-light my-1'>
          Go Back
        </Link> */}
				</Fragment>
			) : (
				''
			)}
		</Fragment>
	);
};

EditMyArtistBooking.propTypes = {
	getCurrentArtist: PropTypes.func.isRequired,
	artist: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	artist: state.artist,
	auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentArtist })(
	withRouter(EditMyArtistBooking)
); //withRouter allows us to pass history objects
