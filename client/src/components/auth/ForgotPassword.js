import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { forgotPassword } from '../../actions/auth';
//import axios from 'axios';

const ForgotPassword = ({ forgotPassword, isAuthenticated, forgotSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const { email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

  const onSubmit = async (e) => {
    e.preventDefault();
    forgotPassword({email});
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Forgot your password?</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Enter the email address associated with your account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)} //call seperate onChange function above
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Submit' />
      </form>
      <p className='my-1'>
        Back to <Link to='/login'>Login</Link>
      </p>
    </Fragment>
  );
};
ForgotPassword.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  forgotSuccess: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  forgotSuccess: state.auth.forgotSuccess
});
export default connect(mapStateToProps, { forgotPassword })(ForgotPassword);
