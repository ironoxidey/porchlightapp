import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentArtist } from '../../actions/artist';
import Spinner from '../layout/Spinner';
import EditArtistForm from './EditArtistForm';

const EditMyArtistProfile = ({
  getCurrentArtist,
  artist: { artist, loading },
}) => {
  useEffect(() => {
    getCurrentArtist();
  }, [getCurrentArtist]);

  return (
    <Fragment>
    { loading ? <Spinner></Spinner> : <Fragment>
      <h1 className='large text-primary'>Edit Your Artist Profile</h1>
          <EditArtistForm theArtist={artist}/>
        <Link to='/dashboard' className='btn btn-light my-1'>
          Go Back
        </Link>
    </Fragment>
    }
    </Fragment>
  )
}

EditMyArtistProfile.propTypes = {
  getCurrentArtist: PropTypes.func.isRequired,
  artist: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  artist: state.artist,
});

export default connect(mapStateToProps, { getCurrentArtist })(
  withRouter(EditMyArtistProfile)
); //withRouter allows us to pass history objects
