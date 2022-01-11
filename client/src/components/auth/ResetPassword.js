import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { resetPassword } from '../../actions/auth';
import PropTypes from 'prop-types';
import { 
  TextField, 
  Button,
} from '@mui/material';

// A custom hook that builds on useLocation to parse the query string for you.
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = ({ setAlert, resetPassword, isAuthenticated, resetSuccess }) => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });

  const { password, password2 } = formData;

  let query = useQuery();
  const resetLink = query.get("token");

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); //separate onChange function // calls setFormData() // copies and spreads formData then changes the state of [e.target.name] referring to the name attr of each input, and setting the value to e.target.value

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
        let newPass = password;
        resetPassword({ newPass, resetLink });
    }
  };

  //Redirect if logged in
  if (resetSuccess) {
    return <Redirect to='/login' />;
  }

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Locked out?</h1>
      <p className='lead'>
        <i className='fas fa-lock'></i> Reset your password
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
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
        </div>
        <div className='form-group'>
          <TextField 
              name="password2"
              id="password" 
              label="Confirm Password" 
              type="password"
              //variant="filled" 
              value={password2}
              onChange={(e) => onChange(e)} //call seperate onChange function above
            />
        </div>
        <input type='submit' className='btn btn-primary' value='Reset Password' />
      </form>
    </Fragment>
  );
};
ResetPassword.propTypes = {
  setAlert: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  resetSuccess: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  resetSuccess: state.auth.resetSuccess
});
export default connect(mapStateToProps, { setAlert, resetPassword })(ResetPassword);
