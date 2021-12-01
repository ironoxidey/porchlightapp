import React, { Fragment, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addCalendlyAuthCode, getCalendlyUserInfo, refreshCalendlyAuth } from '../../actions/calendly';
//const CalendlyService = require('../../actions/calendlyService');

const DashboardActions = ({ calendly: {calendly}, auth: { isAuthenticated, loading, user }, addCalendlyAuthCode, getCalendlyUserInfo, refreshCalendlyAuth, history }) => {
  useEffect(() => {
    if (user.calendly) {
      refreshCalendlyAuth(); //just go ahead and refresh the token all the time... why not? ... is that bad practice?
      getCalendlyUserInfo(user.calendly.accessToken);
    }
  }, [getCalendlyUserInfo, refreshCalendlyAuth]);
  const [formData, setFormData] = useState({
    calendlyAuthCode: '',
  });

  const { calendlyAuthCode } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  

  return (
    <Fragment>
    {(calendly) ? (
      <p>It looks like you're connected to {calendly.data.resource.name}'s Calendly account</p>
    ): ''}
    {(!calendly && user.calendly && user.calendly.refreshToken) ? (
      <button onClick={refreshCalendlyAuth}>
        <i className='fas fa-calendar-alt text-primary'></i> Refresh your Calendly authentication
      </button>
    ): ''}
    {(isAuthenticated && !user.calendly && user.role === "ADMIN") ? (
    <div className='dash-buttons'>
      <a href='https://auth.calendly.com/oauth/authorize?client_id=By5JoX6LQeuUpNqAxfSTQG_C3SAjcLTamu_euRTkheo&response_type=code&redirect_uri=http://localhost:3000' className='btn btn-light'>
        <i className='fas fa-calendar-alt text-primary'></i> Connect your Calendly account
      </a><br/>
      <small>When you get redirected back, copy into this text box everything after "http://localhost:3000/?code=" in the address bar.</small>
      <form
          className='form'
          onSubmit={(e) => {
            e.preventDefault();
            addCalendlyAuthCode(formData, history);
          }}
        >
          <div className='form-group'>
            <input
              type='text'
              placeholder='Something like f04281d639d8248435378b0365de7bd1f53bf452eda187d5f1e07ae7f04546d6'
              name='calendlyAuthCode'
              value={calendlyAuthCode}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input type='submit' className='btn btn-primary my-1' />
      </form>
      {/* <Link to='/edit-profile' className='btn btn-light'>
        <i className='fas fa-user-circle text-primary'></i> Edit Profile
      </Link>
      <Link to='/add-experience' className='btn btn-light'>
        <i className='fab fa-black-tie text-primary'></i> Add Experience
      </Link>
      <Link to='/add-education' className='btn btn-light'>
        <i className='fas fa-graduation-cap text-primary'></i> Add Education
      </Link> */}
    </div>
    ) : ''}
    </Fragment>
  );
};

DashboardActions.propTypes = {
  addCalendlyAuthCode: PropTypes.func.isRequired,
  getCalendlyUserInfo: PropTypes.func.isRequired,
  refreshCalendlyAuth: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  calendly: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  calendly: state.calendly,
});

export default connect(mapStateToProps, { addCalendlyAuthCode, getCalendlyUserInfo, refreshCalendlyAuth })(withRouter(DashboardActions));
