import React, { Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addCalendlyAuthCode } from '../../actions/profile';

const DashboardActions = ({ auth: { isAuthenticated, loading, user}, addCalendlyAuthCode, history }) => {
  const [formData, setFormData] = useState({
    calendlyAuthCode: '',
  });

  const { calendlyAuthCode } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
    {(isAuthenticated && user.role === "ADMIN") ? (
    <div className='dash-buttons'>
      <a href='https://auth.calendly.com/oauth/authorize?client_id=By5JoX6LQeuUpNqAxfSTQG_C3SAjcLTamu_euRTkheo&response_type=code&redirect_uri=http://localhost:3000' className='btn btn-light'>
        <i className='fas fa-calendar-alt text-primary'></i> Connect your Calendly account
      </a><br/>
      <small>When you get redirected back, copy into this text box everything after "http://localhost:3000/?code=" in the address bar.</small>
      <form
          class='form'
          onSubmit={(e) => {
            e.preventDefault();
            addCalendlyAuthCode(formData, history);
          }}
        >
          <div class='form-group'>
            <input
              type='text'
              placeholder='Something like f04281d639d8248435378b0365de7bd1f53bf452eda187d5f1e07ae7f04546d6'
              name='calendlyAuthCode'
              value={calendlyAuthCode}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input type='submit' class='btn btn-primary my-1' />
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
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addCalendlyAuthCode })(withRouter(DashboardActions));
