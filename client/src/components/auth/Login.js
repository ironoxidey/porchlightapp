import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { TextField, Button } from '@mui/material';
//import axios from 'axios';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
        <TextField 
              name="email"
              id="email" 
              label="Email" 
              type="email"
              //variant="filled" 
              value={email}
              onChange={(e) => onChange(e)} //call seperate onChange function above
            />
          {/* <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)} //call seperate onChange function above
          /> */}
        </div>
        <div className='form-group'>
        <TextField 
              name="password"
              id="password" 
              label="Password" 
              type="password"
              //variant="filled" 
              value={password}
              onChange={(e) => onChange(e)} //call seperate onChange function above
            />

          {/* <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)} //call seperate onChange function above
          /> */}
        </div>

        <label htmlFor="submit">
            <input type='submit' id='submit' value='Login' hidden />
           <Button variant="contained" component="span">
              Login
            </Button>
        </label>

      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
      <p className='my-1'>
        Forgot your password? <Link to='/forgot-password'>Request a reset link</Link>
      </p>
    </Fragment>
  );
};
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { login })(Login);
