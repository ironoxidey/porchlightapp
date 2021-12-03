import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import porchlightLogo from '../../img/Porchlight_logo05-17.svg';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    //return <Redirect to='/dashboard' />;
  }
  return (
    <section className='landing'>
        <div className='landing-inner'>
          {/* <h1 className='x-large'>Porchlight: Art + Hospitality</h1> */}
          <img src={porchlightLogo} alt="" className="porchlightLogo" />
          <p className='lead'>
            appreciating beauty together
          </p>
          <div className='buttons'>
            <Link to='/artists' className='btn btn-primary'>
              Browse Artists
            </Link>
            <Link to='/login' className='btn btn-light'>
              Login
            </Link>
          </div>
        </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
