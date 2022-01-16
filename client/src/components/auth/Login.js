import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { 
  TextField, 
  Button ,
  Grid,
  Box,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';
import porchlightLogo from '../../img/Porchlight_logo05-17.svg';

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
    
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <Box component="form" noValidate onSubmit={(e) => onSubmit(e)} sx={{ mt: 3, maxWidth: '500px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{textAlign:'center'}}>
                  <FormLabel component="legend">Let's get you logged in! What's your email address and password?</FormLabel>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  id="email"
                  label="My email address is"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => onChange(e)} //call seperate onChange function above
                  value={email}
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  name="password"
                  label="And my password is"
                  type="password"
                  id="password"
                  value={password}
                  autoComplete="password"
                  onChange={(e) => onChange(e)} //call seperate onChange function above
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Don't have an account? <Link to='/register'>Sign Up</Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                Forgot your password? <Link to='/forgot-password'>Request a reset link</Link>
              </Grid>
            </Grid>
          </Box>
          </Box>
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
